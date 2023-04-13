import React, { useEffect, useState } from 'react';
import MarkdownView from 'react-showdown';

import { Box, Options } from '@components';
import { Component, KeyValue, WithOptions, WithSize } from '@types';

type QuestionProps = Component<string> &
    WithSize<number> &
    WithOptions<KeyValue> & {
        answer?: string;
    };

export default function (props: QuestionProps) {
    const [hasOptions, setHasOptions] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string>(undefined);

    useEffect(() => {
        setHasOptions(props.options && !!Object.keys(props.options).length);
        setAnswer(props.answer);
    }, [props]);

    return (
        <div
            id={hasOptions ? props.kei : undefined}
            style={{
                display: hasOptions ? 'block' : 'inline',
                marginBlock: '20px',
            }}
        >
            <div style={{ display: 'block' }}></div>
            <h2 style={{ display: 'inline', marginRight: '20px' }}>
                {props.kei}
            </h2>
            <span style={{ marginLeft: '10px' }}></span>
            <span style={{ display: 'inline-block' }}>
                <MarkdownView markdown={props.value} style={{ height: 0 }} />
            </span>
            {hasOptions && (
                <Options
                    kei={props.kei}
                    value={props.options}
                    onClick={props.onChange}
                    inQuestion={true}
                    selected={answer}
                    maxSelections={props.size}
                />
            )}
            {!hasOptions && (
                <Box kei={props.kei} value={answer} onChange={props.onChange} />
            )}
        </div>
    );
}
