import {
    retrieveWritingAnswers,
    retrieveWritingTest,
    evaluateWritingExam,
} from '@apis';
import Part from '@components/Part';
import { AnyComponent, KeyValue } from '@types';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './styles.module.scss';
import Text from '@components/Text';
import Box from '@components/Box';
import List from '@components/List';

export default function () {
    const router = useRouter();
    const [examId, setExamId] = useState<number>(undefined);
    const [components, setComponents] = useState<AnyComponent[]>([]);
    const [point, setPoint] = useState<number>(0);
    const [answers, setAnswers] = useState<KeyValue>(undefined);
    const [visibilities, setVisibilities] = useState<{
        [key: number]: boolean;
    }>({});

    useEffect(() => {
        const { id } = router.query || {};
        const /* local */ examId = Number(id as string);
        if (!!examId) {
            setExamId(examId);
            retrieveWritingTest(examId)
                .then(({ components }) => {
                    if (!!components?.length) {
                        setComponents(
                            components.map((c) => {
                                return {
                                    ...c,
                                    type: c.type.toLowerCase(),
                                    value: c.value?.value,
                                };
                            })
                        );
                    }
                })
                .catch((err) => {
                    alert(err.message);
                    router.back();
                });
            retrieveWritingAnswers(examId)
                .then(({ answers }) => {
                    setAnswers(answers);
                })
                .catch((err) => {
                    alert(err.message);
                    router.back();
                });
        }
    }, [router]);

    const submit = () => {
        evaluateWritingExam(examId, point)
            .then(() => {
                router.push(`/exam/${examId}`);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const hide = (index: number) => {
        setVisibilities({
            ...visibilities,
            [index]: !visibilities[index],
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>
                <span
                    className={styles.part}
                    onClick={() => {
                        router.push('/');
                    }}
                >
                    HOME
                </span>
                {!!examId && (
                    <span className={styles.right}>
                        {!!point && point > 0 && (
                            <>
                                <span
                                    className={styles.submit}
                                    onClick={() => submit()}
                                >
                                    {`SUBMIT POINT (${point})`}
                                </span>
                                <span>|</span>
                            </>
                        )}
                        <span
                            className={styles.part}
                            onClick={() => {
                                router.back();
                            }}
                        >
                            BACK
                        </span>
                    </span>
                )}
            </h1>
            {!!examId && (
                <h2 className={styles.header}>
                    <hr />
                    <h1>{`EXAM #${examId}`}</h1>
                    {!!components?.length && (
                        <span className={styles.right}>
                            <span
                                className={styles.part}
                                onClick={() => {
                                    setVisibilities({
                                        ...visibilities,
                                        [-1]: !visibilities[-1],
                                    });
                                }}
                            >
                                {!visibilities[-1] ? 'SHOW' : 'HIDE'}
                            </span>
                            <span>CONTENT</span>
                        </span>
                    )}
                </h2>
            )}
            {!!visibilities[-1] && (
                <>
                    <Part
                        number={undefined}
                        components={components}
                        skill={'writing'}
                        onClick={(_) => {}}
                        onAnswer={(_) => {}}
                    />
                </>
            )}
            {!visibilities[-1] && (
                <h4 className={styles.header}>
                    <List value={'The content is now hidden.'} />
                </h4>
            )}
            {!!answers &&
                Object.keys(answers).map((key, index) => (
                    <div key={index}>
                        <h2 className={styles.header}>
                            <hr />
                            <h1>{`ANSWER #${key}`}</h1>
                            <span className={styles.right}>
                                <span
                                    className={styles.part}
                                    onClick={() => hide(index)}
                                >
                                    {visibilities[index] ? 'HIDE' : 'SHOW'}
                                </span>
                                <span>ANSWER</span>
                            </span>
                        </h2>
                        {visibilities[index] && (
                            <h4 className={styles.header}>
                                <MarkdownView markdown={answers[key]} />
                            </h4>
                        )}
                        {!visibilities[index] && (
                            <h4 className={styles.header}>
                                <List value={'The answer is now hidden.'} />
                            </h4>
                        )}
                    </div>
                ))}
            {(!answers || !Object.keys(answers).length) && (
                <>
                    <h2 className={styles.header}>
                        <span>
                            <hr />
                            <h1>{`NO ANSWER`}</h1>
                        </span>
                    </h2>
                    <h4 className={styles.header}>
                        <List value={"Yes, there's no answer here."} />
                    </h4>
                </>
            )}
            <h2 className={styles.header}>
                <span>
                    <hr />
                    <h1>{'POINT'}</h1>
                    <Box onChange={(value) => setPoint(Number(value))} />
                    <hr />
                    {!!point && point > 0 && (
                        <div>
                            <span
                                className={styles.part}
                                onClick={() => {
                                    scrollTo({
                                        top: 0,
                                        behavior: 'smooth',
                                    });
                                }}
                            >
                                BACK TO TOP
                            </span>
                            <span>TO SUBMIT</span>
                        </div>
                    )}
                </span>
            </h2>
        </div>
    );
}
