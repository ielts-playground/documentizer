import React, { CSSProperties, useEffect, useState } from 'react';
import { Component } from '@types';

type BoxProps = Component<string> & {
    inQuestion?: boolean;
};

export default function (props: BoxProps) {
    const [value, setValue] = useState<string>(undefined);

    const style = {
        margin: '10px',
        paddingBlock: '10px',
        textAlign: 'center',
        border: 'solid 3px',
    } as CSSProperties;

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    return (
        <>
            <input
                style={{
                    ...style,
                    borderColor: !!value ? 'red' : 'black',
                }}
                id={props.kei}
                onChange={(e) => {
                    setValue(e.target.value);
                    if (props.onChange) {
                        props.onChange(e.target.value);
                    }
                }}
                defaultValue={value}
                placeholder={props.kei}
            />
            {props.inQuestion && <br />}
        </>
    );
}
