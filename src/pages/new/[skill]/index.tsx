import { Part, RichTextInput } from '@components';
import { AnyComponent, KeyValue } from '@types';
import { extract } from '@utils/extractors';
import { useRouter } from 'next/router';
import React, { CSSProperties, useEffect, useState } from 'react';

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
    const [mode, setMode] = useState<string>('edit');
    const [skill, setSkill] = useState<string>('reading');
    const [part, setPart] = useState<number>(1);

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

    const update = async () => {
        const markdown = state[part].markdown;
        updatePart(part, {
            questions: await extract(markdown),
            answers: {},
            markdown,
        });
        setMode('answer');
    };

    const click = (component: AnyComponent) => {};

    const answer = (key: string, value: string) => {
        if (mode === 'answer') {
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
        }
    };

    const submit = () => {
        // TODO: submit the questions and answers to our server.
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
                            onClick={() => {
                                setPart(num);
                                if (!state[num]?.markdown) {
                                    setMode('edit');
                                }
                            }}
                        >
                            {num}
                        </span>
                    </span>
                ))}
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
            {mode === 'edit' && (
                <div className={styles.container}>
                    <RichTextInput
                        markdown={state[part]?.markdown}
                        onChange={(markdown) => {
                            updatePart(part, {
                                markdown,
                            });
                        }}
                    />
                    <div className={styles.action}>
                        <button onClick={() => setMode('answer')}>
                            Cancel
                        </button>
                        <button
                            className={styles.submit}
                            onClick={() => update()}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
