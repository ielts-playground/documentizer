import { Part, RichTextInput } from '@components';
import UploadImage from '@components/UploadImage';
import UploadAudio from '@components/UploadAudio';
import { AnyComponent, KeyValue } from '@types';
import { extract } from '@utils/extractors';
import { useRouter } from 'next/router';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';

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
        setState(initial);
        setPart(1);
    }, [skill]);

    useEffect(() => {
        if (!state[part]?.markdown) {
            startEditing();
        }
    }, [part]);

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

    const update = async () => {
        const markdown = state[part].markdown;
        updatePart(part, {
            questions: await extract(markdown),
            answers: {},
            markdown: markdown,
        });
        setModal(undefined);
    };

    const click = (component: AnyComponent) => {
        if (component.type === 'image') {
            startUpdatingImage(component.kei, component.value);
        }
    };

    const answer = (key: string, value: string) => {
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

    const submit = () => {
        // TODO: submit the questions and answers to our server.
        alert('Not implemented yet!');
    };

    const startUpdatingAudio = () => {
        // TODO: provide a view for updating audio.
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

    const startEditing = () => {
        setModal(
            <>
                <RichTextInput
                    markdown={state[part]?.markdown}
                    onChange={(markdown) => {
                        updatePart(part, {
                            markdown,
                        });
                    }}
                />
                <div className={styles.action}>
                    <button onClick={() => setModal(undefined)}>cancel</button>
                    <button className={styles.submit} onClick={() => update()}>
                        save
                    </button>
                </div>
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
