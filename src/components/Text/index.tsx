import React from 'react';
import MarkdownView from 'react-showdown';
import { Component } from '@types';

import styles from './styles.module.scss';

type TextProps = Component<string>;

export default function (props: TextProps) {
    return (
        <span className={styles.container}>
            <MarkdownView markdown={props.value} />
        </span>
    );
}
