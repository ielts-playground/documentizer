import React, { CSSProperties } from 'react';
import { Options, Title } from '@components';
import { Component, KeyValue, WithOptions } from '@types';

type ListProps = Component<string> & WithOptions<KeyValue>;

export default function (props: ListProps) {
    const style = {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        border: 'solid',
        width: 'max-content',
    } as CSSProperties;

    return (
        <div style={style}>
            {props.value && <Title value={props.value} />}
            <Options key={props.kei} value={props.options} />
        </div>
    );
}
