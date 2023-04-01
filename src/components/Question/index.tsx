import React, { useEffect, useState } from 'react';
import MarkdownView from 'react-showdown';

import { Box, Options } from '@components';
import { Component, KeyValue, WithOptions } from '@types';

type QuestionProps = Component<string> &
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
        <span id={hasOptions ? props.kei : undefined}>
            <div style={{ display: 'block' }}></div>
            <strong>{props.kei}</strong>
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
                />
            )}
            {!hasOptions && (
                <Box kei={props.kei} value={answer} onChange={props.onChange} />
            )}
        </span>
    );
}
