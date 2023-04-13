import React, { useEffect, useState } from 'react';
import { Component, KeyValue } from '@types';

import styles from './styles.module.scss';

type OptionsProps = Component<KeyValue> & {
    inQuestion?: boolean;
    selected?: string;
    maxSelections?: number;
};

export default function (props: OptionsProps) {
    const [selected, setSelected] = useState<{
        [key: string]: boolean;
    }>({});

    useEffect(() => {
        try {
            const options = JSON.parse(props.selected) || ([] as string[]);
            const selectedOptions = {};
            options.forEach((key) => {
                selectedOptions[key] = true;
            });
            setSelected(selectedOptions);
        } catch {}
    }, [props.selected]);

    return (
        <span className={props.inQuestion ? styles.selectable : styles.normal}>
            {Object.keys(props.value || {}).map((key, index) => (
                <div
                    className={
                        !!selected[key] ? styles.selected : styles.unselected
                    }
                    key={index}
                    onClick={() => {
                        const maxSelections = props.maxSelections ?? 1;
                        const selectedOptions =
                            maxSelections === 1 ? {} : selected;
                        if (!!selected[key]) {
                            delete selectedOptions[key];
                        } else {
                            const selectable =
                                maxSelections === 1 ||
                                Object.values(selectedOptions).filter((s) => s)
                                    .length < maxSelections;
                            if (selectable) {
                                selectedOptions[key] = true;
                            }
                        }
                        setSelected(selectedOptions);
                        if (props.onClick) {
                            const options = Object.entries(selectedOptions)
                                .filter(([_, s]) => !!s)
                                .map(([key]) => key);
                            const clicked =
                                maxSelections === 1
                                    ? options[0]
                                    : JSON.stringify(options);
                            props.onClick(options.length ? clicked : undefined);
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
