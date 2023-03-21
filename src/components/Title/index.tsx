import React, { CSSProperties } from 'react';
import { Component, HeadingSize, WithSize } from '@types';

type TitleProps = Component<string> & WithSize<HeadingSize>;

function createTitle(size: HeadingSize, value: string) {
    const style = {
        margin: '10px',
        textAlign: 'center',
    } as CSSProperties;
    switch (size) {
        case 'h1':
            return <h1 style={style}>{value}</h1>;
        case 'h2':
            return <h2 style={style}>{value}</h2>;
        case 'h3':
            return <h3 style={style}>{value}</h3>;
        case 'h4':
            return <h4 style={style}>{value}</h4>;
        default:
            return <h3 style={style}>{value}</h3>;
    }
}

export default function (props: TitleProps) {
    const { size, value } = props;
    return createTitle(size, value);
}
