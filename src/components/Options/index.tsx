import React, { useEffect, useState } from 'react';
import { Component, KeyValue } from '@types';

import styles from './styles.module.scss';

type OptionsProps = Component<KeyValue> & {
    inQuestion?: boolean;
    selected?: string;
};

export default function (props: OptionsProps) {
    const [selected, setSelected] = useState<string>(undefined);

    useEffect(() => {
        setSelected(props.selected);
    }, [props.selected]);

    return (
        <span className={props.inQuestion ? styles.selectable : styles.normal}>
            {Object.keys(props.value || {}).map((key, index) => (
                <div
                    className={
                        selected === key ? styles.selected : styles.unselected
                    }
                    key={index}
                    onClick={() => {
                        setSelected(key);
                        if (props.onClick) {
                            props.onClick(key);
                        }
                    }}
                >
                    <strong>{key}</strong>
                    <span style={{ marginLeft: '10px' }}></span>
                    <span>{props.value[key]}</span>
                </div>
            ))}
        </span>
    );
}
