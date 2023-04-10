import { createTestWithAudio } from '@apis';
import { TestCreationRequest } from '@apis/types';
import { Part, RichTextInput } from '@components';
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
        markdown: string;
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
                markdown: '',
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
            router.push('/ok'); // TODO: use other redirected path
        } catch (err) {
            console.log(err.message);
        } finally {
            setModal(undefined);
        }
    };

    const startUpdatingAudio = () => {
        // TODO: provide a view for updating audio.
        alert('Not implemented yet!');
    };

    const startUpdatingImage = (key: string, oldValue: string) => {
        // TODO: provide a view for updating image.
        alert('Not implemented yet!');
    };

    const startEditing = () => {
        setModal(
            <>
                <RichTextInput
                    markdown={state[part]?.markdown}
                    onCancel={() => setModal(undefined)}
                    onFinish={async (markdown) => {
                        updatePart(part, {
                            questions: await extract(markdown),
                            answers: {},
                            markdown,
                        });
                        setModal(undefined);
                    }}
                />
            </>
        );
    };

    return (
        <>
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
                        EDIT
                    </span>
                    <span>|</span>
                    {skill === 'listening' && (
                        <>
                            <span
                                className={styles.edit}
                                onClick={() => startUpdatingAudio()}
                            >
                                AUDIO
                            </span>
                            <span>|</span>
                        </>
                    )}
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
