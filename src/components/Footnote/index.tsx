import React from 'react';
import { Component } from '@types';

type FootnoteProps = Component<string>;

export default function (props: FootnoteProps) {
    return (
        <div>
            <strong>{props.kei}</strong>
            <span style={{ marginLeft: '10px' }}></span>
            <span>{props.value}</span>
        </div>
    );
}
