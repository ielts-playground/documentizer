import React, { CSSProperties, useContext, useState } from 'react';
import { Component } from '@types';
import { Global } from '@utils/contexts';

type BoxProps = Component<string> & {
    inQuestion?: boolean;
};

export default function (props: BoxProps) {
    const [value, setValue] = useState<string>(undefined);

    const mode = useContext(Global)['mode'] as string;

    const style = {
        margin: '10px',
        paddingBlock: '10px',
        textAlign: 'center',
    } as CSSProperties;

    return (
        <>
            <input
                style={{
                    ...style,
                    border:
                        value && mode === 'answer'
                            ? 'solid red 3px'
                            : 'solid black 3px',
                }}
                id={props.kei}
                onChange={(e) => {
                    if (mode === 'answer') {
                        setValue(e.target.value);
                        if (props.onChange) props.onChange(e.target.value);
                    }
                }}
                placeholder={props.value || props.kei}
            />
            {props.inQuestion && <br />}
        </>
    );
}
