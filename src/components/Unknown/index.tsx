import React from 'react';
import { AnyComponent } from '@types';

import styles from './styles.module.scss';

export default function (props: AnyComponent) {
    return (
        <span
            className={styles.content}
            onClick={() => {
                if (props.onClick) {
                    props.onClick(undefined);
                }
            }}
        >
            <strong>{`[${props.value}]`}</strong>
        </span>
    );
}
