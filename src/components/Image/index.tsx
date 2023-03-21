import React, { CSSProperties } from 'react';
import { BoxSize, Component, WithSize } from '@types';

type ImageProps = Component<string> & WithSize<BoxSize>;

export default function (props: ImageProps) {
    const style = {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBlock: '20px',
        maxWidth: '300px',
    } as CSSProperties;

    return (
        <img
            style={style}
            src={props.value}
            alt={props.kei}
            width={props.size?.width}
            height={props.size?.height}
        />
    );
}
