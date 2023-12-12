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
import {
    UNSAVED_VALIDITY_IN_MILLISECONDS,
    automaticallySavedKey,
    unsavedKey,
} from '@utils/constants';
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

    const restorePreviousSession = (restoreSkill: string) => {
        try {
            const key = unsavedKey(restoreSkill);
            const { content, createdAt } = JSON.parse(
                localStorage.getItem(key)
            ) as {
                audio?: File;
                content: State;
                createdAt: number;
            };
            if (Date.now() < createdAt + UNSAVED_VALIDITY_IN_MILLISECONDS) {
                return { content };
            } else {
                localStorage.removeItem(key);
            }
        } catch {}
        return {};
    };

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
        const { content: unsaved } = restorePreviousSession(skill);
        if (unsaved) {
            setState(unsaved);
        } else {
            setState(initial);
        }
        setPart(1);

        const automaticallySaved = localStorage.getItem(
            automaticallySavedKey()
        );
        if (automaticallySaved) {
            setInterval(saveCurrentSession, 20000);
        }
    }, [skill]);

    const saveCurrentSession = (clear?: boolean) => {
        const key = unsavedKey(skill);
        if (clear || submitted) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(
                key,
                JSON.stringify({
                    audio,
                    content: state,
                    createdAt: Date.now(),
                })
            );
        }
    };

    useBeforeunload(() => {
        saveCurrentSession();
    }, [skill]);

    const parts = (exclude: number = 0, targetSkill: string = skill) => {
        const allParts = [];
        if (targetSkill === 'reading') {
            allParts.push(1, 2, 3);
        } else if (targetSkill === 'listening') {
            allParts.push(1, 2, 3, 4);
        } else if (targetSkill === 'writing') {
            allParts.push(1, 2);
        }
        return allParts.filter((num) => num !== exclude);
    };

    const skills = (exclude: string = '') => {
        return ['listening', 'reading', 'writing'].filter((s) => s !== exclude);
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

    const submitAll = async (audio: File) => {
        const free = confirm('Do you want this test to be FREE?');
        const skillRequest = (sk: string) => {
            const { content } = restorePreviousSession(sk);
            return retrieveSubmitContent(sk, content);
        };
        const { id: testId } = await createTestWithAudio(
            free ? 'FREE' : 'PREMIUM',
            audio,
            skills().map(skillRequest)
        );
        return testId;
    };

    const retrieveSubmitContent = (
        submitSkill: string = skill,
        submitState = state
    ) => {
        const content = {
            skill: submitSkill,
            components: [],
            answers: [],
        } as TestCreationRequest;
        parts(0, submitSkill).forEach((num) => {
            (submitState[num]?.questions || []).forEach((c) => {
                content.components.push({
                    ...c,
                    part: num,
                });
            });
            Object.keys(submitState[num]?.answers || {}).forEach((key) => {
                content.answers.push({
                    kei: key,
                    value: (submitState[num]?.answers || {})[key],
                    part: num,
                });
            });
        });
        return content;
    };

    const submit = () => {
        alert('Please select an audio for your Listening test.');
        startUpdatingAudio(async (audio) => {
            setModal(<>Submitting...</>);
            try {
                const testId = await submitAll(audio);
                setSubmitted(true);
                alert(`Successfully, test #${testId} has been created.`);
                saveCurrentSession(true);
                router.push('/home');
            } catch (err) {
                const message =
                    err.response?.data?.message ||
                    err?.message ||
                    'Something went wrong!';
                alert(`Whoops! It said "${message}".`);
            }
            setModal(undefined);
        });
    };

    const startUpdatingAudio = (onFinish: (audio: File) => void) => {
        setModal(
            <UploadAudio
                audio={audio}
                onCancel={() => {
                    setModal(undefined);
                }}
                onFinish={(file) => {
                    setAudio(file);
                    setModal(undefined);
                    onFinish(file);
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
        router.push('/home');
    };

    return (
        <>
            <Auth />
            <h1 className={styles.header}>
                <span className={styles.submit} onClick={() => returnHome()}>
                    HOME
                </span>
                <span>|</span>
                {skills(skill).map((sk, index) => (
                    <span key={index}>
                        <span
                            className={styles.part}
                            onClick={() => {
                                saveCurrentSession();
                                setSkill(sk);
                            }}
                        >
                            {`${String(sk).toUpperCase()}`}
                        </span>
                        <span>|</span>
                    </span>
                ))}
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
                    {skill === 'reading' && (
                        <>
                            <span
                                className={styles.edit}
                                onClick={() => startEditing()}
                            >
                                PASSAGE
                            </span>
                            <span>|</span>
                        </>
                    )}
                    <span
                        className={styles.edit}
                        onClick={() => startEditing(1)}
                    >
                        {skill === 'reading' ? 'QUESTIONS' : 'EDIT'}
                    </span>
                    <span>|</span>
                    {skill === 'listening' && (
                        <>
                            <span
                                className={audio ? styles.saved : styles.edit}
                                onClick={() => {
                                    alert(
                                        'You can choose an audio file when submitting.'
                                    );
                                }}
                            >
                                AUDIO
                            </span>
                            <span>|</span>
                        </>
                    )}
                    <span className={styles.submit} onClick={submit}>
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
