import React, { CSSProperties } from 'react';
import { Options, Title } from '@components';
import { Component, KeyValue, WithOptions } from '@types';

type ListProps = Component<string> &
    WithOptions<KeyValue> & {
        width?: string;
        center?: boolean;
    };

export default function (props: ListProps) {
    const style = {
        display: 'block',
        border: 'solid',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: props.width ?? 'max-content',
        backgroundColor: 'white',
    } as CSSProperties;

    return (
        <div style={style}>
            {props.value && <Title value={props.value} />}
            <Options key={props.kei} value={props.options} />
        </div>
    );
}
