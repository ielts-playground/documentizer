import React from 'react';
import MarkdownView from 'react-showdown';

import { Options } from '@components';
import { Component, KeyValue, WithOptions } from '@types';

type QuestionProps = Component<string> & WithOptions<KeyValue>;

export default function (props: QuestionProps) {
    return (
        <span id={props.kei}>
            <div style={{ display: 'block' }}></div>
            <strong>{props.kei}</strong>
            <span style={{ marginLeft: '10px' }}></span>
            <span style={{ display: 'inline-block' }}>
                <MarkdownView markdown={props.value} style={{ height: 0 }} />
            </span>
            {props.options && !!Object.keys(props.options).length && (
                <Options
                    kei={props.kei}
                    value={props.options}
                    onClick={props.onChange}
                    inQuestion={true}
                />
            )}
        </span>
    );
}
