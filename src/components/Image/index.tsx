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
        border: 'solid 1px black',
    } as CSSProperties;

    return (
        <img
            style={style}
            src={props.value}
            alt={props.kei}
            width={props.size?.width || '200px'}
            height={props.size?.height || '150px'}
            onClick={() => {
                if (props.onChange) {
                    props.onChange(props.value);
                }
            }}
        />
    );
}
