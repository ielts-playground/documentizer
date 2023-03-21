import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Editor, Part } from '@components';
import { AnyComponent, KeyValue } from '@types';

import mock from '@mock';
import { Global } from '@utils/contexts';

export default function () {
    const router = useRouter();
    const [test, setTest] = useState<{
        action?: 'new' | 'test' | string;
        skill?: 'reading' | 'listening' | 'writing' | string;
        part?: '1' | '2' | '3' | '4' | string;
    }>({});
    const [mode, setMode] = useState<'edit' | 'answer' | string>('edit');
    const [components, setComponents] = useState<AnyComponent[]>([]);
    const [answers, setAnswers] = useState<KeyValue>({});
    const [modifying, setModifying] = useState<AnyComponent>(undefined);

    useEffect(() => {
        setTest(() => {
            const { action, skill, part } = router.query;
            if (action && skill && part && mode === 'answer') {
                // TODO: fetch the test from a datasource.
                setComponents(() => {
                    return mock(`${skill}-${part}`, []).map(
                        (component, index) => {
                            return {
                                ...component,
                                index,
                            };
                        }
                    );
                });
            }
            return {
                ...test,
                action: action as string,
                skill: skill as string,
                part: part as string,
            };
        });
    }, [router, mode]);

    const click = (component: AnyComponent) => {
        if (mode === 'edit') {
            setModifying(component);
        }
    };

    const answer = (key: string, value: string) => {
        if (mode === 'answer') {
            answers[key] = value;
            setAnswers(() => answers);
            console.log(mode, answers);
        }
    };

    const alter = (component: AnyComponent, index: number) => {
        if (mode === 'edit') {
            delete component.onChange;
            delete component.onClick;
            components[index] = {
                ...component,
                index,
            };
            setComponents(components);
        }
    };

    const edit = (component: AnyComponent) => {
        if (mode === 'edit') {
            delete component.onChange;
            delete component.onClick;
            if (components[modifying.index]) {
                components[modifying.index] = {
                    ...component,
                    index: modifying.index,
                };
            } else {
                components.push({
                    ...component,
                    index: components.length,
                });
            }
            setComponents(components);
        }
        setModifying(undefined);
    };

    // TODO: support changing mode "edit" <-> "answer".
    // TODO: support sending request to save the test.

    return (
        <Global.Provider value={{ mode }}>
            <Part
                skill={String(test.skill)}
                number={Number(test.part)}
                mode={mode}
                components={components}
                useTwoPanes={true}
                onEdit={click}
                onChange={answer}
                onCreate={alter}
            />
            {mode === 'edit' && modifying && (
                <Editor
                    component={modifying}
                    onFinish={edit}
                    onCancel={() => setModifying(undefined)}
                />
            )}
        </Global.Provider>
    );
}
