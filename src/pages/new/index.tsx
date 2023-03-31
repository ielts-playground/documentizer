import { Part, RichTextInput } from '@components';
import { AnyComponent, KeyValue } from '@types';
import { extract } from '@utils/extractors';
import React, { useState } from 'react';

import styles from './styles.module.scss';

export default function () {
    const [mode, setMode] = useState<string>('edit');
    const [markdown, setMarkdown] = useState<string>('');
    const [components, setComponents] = useState<AnyComponent[]>([]);
    const [answers, setAnswers] = useState<KeyValue>({});

    const process = async () => {
        const data = await extract(
            markdown.replaceAll(/\n*(<br>)*\n*$/g, '').trim()
        );
        console.log(data);
        setComponents(data);
        setMode('answer');
    };

    const init = (component: AnyComponent, index: number) => {};

    const click = (component: AnyComponent) => {};

    const answer = (key: string, value: string) => {
        if (mode === 'answer') {
            setAnswers({
                ...answers,
                [key]: value,
            });
        }
    };

    return (
        <>
            <Part
                skill={String('Reading')}
                number={Number('1')}
                mode={mode}
                components={components}
                useTwoPanes={true}
                onEdit={click}
                onChange={answer}
                onCreate={init}
            />
            {mode === 'edit' && (
                <div className={styles.container}>
                    <RichTextInput markdown={markdown} onChange={setMarkdown} />
                    <div className={styles.action}>
                        <button onClick={() => setMode('answer')}>
                            Cancel
                        </button>
                        <button onClick={() => process()}>Save</button>
                    </div>
                </div>
            )}
        </>
    );
}
