import { createTestWithAudio } from '@apis';
import { TestCreationRequest } from '@apis/types';
import {
    Auth,
    Part,
    RichTextInput,
    UploadAudio,
    UploadImage,
} from '@components';
import { AnyComponent, KeyValue } from '@types';
import { UNSAVED_VALIDITY_IN_MILLISECONDS, unsavedKey } from '@utils/constants';
import { extract } from '@utils/extractors';
import { useRouter } from 'next/router';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';

import styles from './styles.module.scss';

type State = {
    [key: number]: {
        questions: AnyComponent[];
        answers: KeyValue;
        markdown: {
            left: string;
            right: string;
        };
    };
};

export default function () {
    const router = useRouter();
    const [state, setState] = useState<State>({});
    const [skill, setSkill] = useState<string>('reading');
    const [part, setPart] = useState<number>(0);
    const [audio, setAudio] = useState<File>(undefined);
    const [modal, setModal] = useState<ReactElement>(undefined);
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        const { skill } = router.query;
        setSkill(skill as string);
    }, [router]);

    useEffect(() => {
        const initial = {} as State;
        parts().forEach((num) => {
            initial[num] = {
                questions: [],
                answers: {},
                markdown: {
                    left: '',
                    right: '',
                },
            };
        });
        let unsaved: State;
        try {
            const key = unsavedKey(skill);
            const { content, createdAt } = JSON.parse(
                localStorage.getItem(key)
            ) as {
                content: State;
                createdAt: number;
            };
            if (Date.now() < createdAt + UNSAVED_VALIDITY_IN_MILLISECONDS) {
                unsaved = content;
            } else {
                localStorage.removeItem(key);
            }
        } catch {}
        if (unsaved) {
            setState(unsaved);
        } else {
            setState(initial);
        }
        setPart(1);
    }, [skill]);

    useBeforeunload(() => {
        const key = unsavedKey(skill);
        if (!submitted) {
            localStorage.setItem(
                key,
                JSON.stringify({
                    content: state,
                    createdAt: Date.now(),
                })
            );
        } else {
            localStorage.removeItem(key);
        }
    }, [skill]);

    const parts = (exclude: number = 0) => {
        const allParts = [];
        if (skill === 'reading') {
            allParts.push(1, 2, 3);
        } else if (skill === 'listening') {
            allParts.push(1, 2, 3, 4);
        } else if (skill === 'writing') {
            allParts.push(1, 2);
        }
        return allParts.filter((num) => num !== exclude);
    };

    const answerables = () => {
        const keys = new Set(
            (state[part]?.questions || [])
                .filter((c) => ['question', 'box'].includes(c.type))
                .map((c) => c.kei)
        );
        return [...keys].map((key) => {
            return {
                key,
                answered: !!(state[part]?.answers || {})[key],
            };
        });
    };

    const updatePart = <T,>(
        num: number,
        changes: {
            [key: string]: T;
        }
    ) => {
        const newState = {
            ...state,
        };
        Object.keys(changes).forEach((key) => {
            newState[num][key] = changes[key];
        });
        setState(newState);
    };

    const click = (component: AnyComponent) => {
        if (component.type === 'image') {
            startUpdatingImage(component.kei, component.value);
        }
    };

    const answer = (key: string, value: string) => {
        const component = state[part].questions.find((c) => c.kei === key);
        if (!['question', 'options', 'box'].includes(component.type)) return;
        state[part] &&
            updatePart(part, {
                questions: state[part].questions.map((c) => {
                    if (c.kei === key) {
                        if (c.type === 'question') {
                            return {
                                ...c,
                                answer: value,
                            };
                        }
                        if (c.type === 'options') {
                            return {
                                ...c,
                                selected: value,
                            };
                        }
                        if (c.type === 'box') {
                            return {
                                ...c,
                                value,
                            };
                        }
                    }
                    return c;
                }),
                answers: {
                    ...state[part].answers,
                    [key]: value,
                },
            });
    };

    const submit = async () => {
        const content = {
            skill,
            components: [],
            answers: [],
        } as TestCreationRequest;
        parts().forEach((num) => {
            (state[num]?.questions || []).forEach((c) => {
                content.components.push({
                    ...c,
                    part: num,
                });
            });
            Object.keys(state[num]?.answers || {}).forEach((key) => {
                content.answers.push({
                    kei: key,
                    value: (state[num]?.answers || {})[key],
                    part: num,
                });
            });
        });
        try {
            setModal(<>Submitting...</>);
            await createTestWithAudio(content, audio);
            setSubmitted(true);
            router.push('/redirect'); // TODO: use other redirected path
        } catch (err) {
            console.log(err.message);
        } finally {
            setModal(undefined);
        }
    };

    const startUpdatingAudio = () => {
        setModal(
            <UploadAudio
                audio={audio}
                onCancel={() => {
                    setModal(undefined);
                }}
                onFinish={(file) => {
                    setAudio(file);
                    setModal(undefined);
                }}
            />
        );
    };

    const startUpdatingImage = (key: string, oldValue: string) => {
        setModal(
            <UploadImage
                initialValue={oldValue}
                onCancel={() => {
                    setModal(undefined);
                }}
                onFinish={(newValue, width, height) => {
                    const currentComponentsOfPart = state[part].questions;
                    const newComponentsOfPart = [];
                    for (const component of currentComponentsOfPart) {
                        const newComponent = {
                            ...component,
                        };
                        if (
                            component.type === 'image' &&
                            component.kei === key
                        ) {
                            newComponent.value = newValue;
                            newComponent.size = {
                                width,
                                height,
                            };
                        }
                        newComponentsOfPart.push(newComponent);
                    }
                    updatePart(part, {
                        questions: newComponentsOfPart,
                        answers: state[part].answers,
                        markdown: state[part].markdown,
                    });
                    setModal(undefined);
                }}
            />
        );
    };

    const startEditing = (position: number = 0) => {
        let left = (state[part]?.questions || []).filter((c) => !c.position);
        let right = (state[part]?.questions || []).filter((c) => !!c.position);
        if (!position) {
            setModal(
                <>
                    <RichTextInput
                        markdown={state[part]?.markdown?.left}
                        onCancel={() => setModal(undefined)}
                        onFinish={async (markdown) => {
                            const questions = (await extract(markdown)).map(
                                (c) => {
                                    return {
                                        ...c,
                                        position: 0,
                                    };
                                }
                            );
                            updatePart(part, {
                                questions: [...questions, ...right],
                                answers: {},
                                markdown: {
                                    left: markdown,
                                    right: state[part]?.markdown?.right,
                                },
                            });
                            setModal(undefined);
                        }}
                    />
                </>
            );
        } else {
            setModal(
                <>
                    <RichTextInput
                        markdown={state[part]?.markdown?.right}
                        onCancel={() => setModal(undefined)}
                        onFinish={async (markdown) => {
                            const questions = (await extract(markdown)).map(
                                (c) => {
                                    return {
                                        ...c,
                                        position: 1,
                                    };
                                }
                            );
                            updatePart(part, {
                                questions: [...left, ...questions],
                                answers: {},
                                markdown: {
                                    left: state[part]?.markdown?.left,
                                    right: markdown,
                                },
                            });
                            setModal(undefined);
                        }}
                    />
                </>
            );
        }
    };

    const returnHome = () => {
        router.push('/redirect');
    };

    return (
        <>
            <Auth />
            <h1 className={styles.header}>
                <span>{`${String(skill).toUpperCase()} PART ${Number(
                    part
                )}`}</span>
                {parts(part).map((num, index) => (
                    <span key={index}>
                        <span>|</span>
                        <span
                            className={styles.part}
                            onClick={() => setPart(num)}
                        >
                            {num}
                        </span>
                    </span>
                ))}
                <span className={styles.right}>
                    <span
                        className={styles.edit}
                        onClick={() => startEditing()}
                    >
                        {skill === 'reading' ? 'PASSAGE' : 'EDIT'}
                    </span>
                    <span>|</span>
                    {skill === 'reading' && (
                        <>
                            <span
                                className={styles.edit}
                                onClick={() => startEditing(1)}
                            >
                                QUESTIONS
                            </span>
                            <span>|</span>
                        </>
                    )}
                    {skill === 'listening' && (
                        <>
                            <span
                                className={audio ? styles.saved : styles.edit}
                                onClick={() => {
                                    startUpdatingAudio();
                                }}
                            >
                                AUDIO
                            </span>
                            <span>|</span>
                        </>
                    )}
                    <span
                        className={styles.submit}
                        onClick={() => returnHome()}
                    >
                        RETURN
                    </span>
                    <span>|</span>
                    <span className={styles.submit} onClick={() => submit()}>
                        SUBMIT
                    </span>
                </span>
            </h1>
            <Part
                skill={skill}
                number={part}
                components={state[part]?.questions || []}
                onClick={click}
                onAnswer={answer}
                rightPane={
                    <>
                        {answerables().map((e, index) => {
                            const style = {
                                cursor: 'pointer',
                                color: e.answered ? 'red' : 'black',
                            } as CSSProperties;
                            return (
                                <h1
                                    style={style}
                                    key={index}
                                    onClick={() => {
                                        const element = document.getElementById(
                                            e.key
                                        );
                                        element?.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                        element?.focus();
                                    }}
                                >
                                    {e.key}
                                </h1>
                            );
                        })}
                    </>
                }
            />
            {modal && <div className={styles.container}>{modal}</div>}
        </>
    );
}
