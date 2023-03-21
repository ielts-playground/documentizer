import React, { useContext, useState } from 'react';
import { Component, KeyValue } from '@types';
import { Global } from '@utils/contexts';

type OptionsProps = Component<KeyValue> & {
    inQuestion?: boolean;
};

export default function (props: OptionsProps) {
    const [selected, setSelected] = useState<number>(undefined);

    const mode = useContext(Global)['mode'] as string;

    const style = {
        marginRight: '5px',
        marginBlock: '10px',
        cursor: props.inQuestion ? 'pointer' : 'default',
        padding: '5px',
    };

    return (
        <>
            {Object.keys(props.value || {}).map((key, index) => (
                <div
                    style={{
                        ...style,
                        border:
                            props.inQuestion &&
                            mode === 'answer' &&
                            selected === index
                                ? 'solid 3px red'
                                : 'none',
                    }}
                    key={index}
                    onClick={() => {
                        if (mode === 'answer') {
                            setSelected(index);
                        } else {
                            setSelected(undefined);
                        }
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
        </>
    );
}
