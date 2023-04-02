import React, { useEffect, useState } from 'react';
import { Component } from '@types';

import styles from './styles.module.scss';

type BoxProps = Component<string> & {
    inQuestion?: boolean;
};

export default function (props: BoxProps) {
    const [value, setValue] = useState<string>(undefined);

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    return (
        <>
            <input
                className={!!value ? styles.notEmpty : styles.empty}
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
