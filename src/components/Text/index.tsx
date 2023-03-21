import React from 'react';
import MarkdownView from 'react-showdown';
import { Component } from '@types';

type TextProps = Component<string>;

export default function (props: TextProps) {
    return (
        <span style={{ display: 'inline-block' }}>
            <MarkdownView markdown={props.value} />
        </span>
    );
}
