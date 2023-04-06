import React, { CSSProperties } from 'react';
import { BoxSize, Component, WithSize } from '@types';

type AudioProps = Component<string> & WithSize<BoxSize>;

export default function (props: AudioProps) {
    const style = {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBlock: '20px',
        padding: '10px',
        cursor: 'pointer',
        border: 'solid 1px black',
    } as CSSProperties;

    return (
        <img
            style={style}
            src={props.value}
            alt={props.value ? props.kei : 'Upload an audio file now!'}
            width={(props.size?.width || 200) + 'px'}
            height={(props.size?.height || 120) + 'px'}
            onClick={() => {
                if (props.onChange) {
                    props.onChange(props.value);
                }
            }}
        />
    );
}
