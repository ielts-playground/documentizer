import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MarkdownView from 'react-showdown';
import { Component } from '@types';

import styles from './styles.module.scss';

type TextProps = Component<string> & {
    hasTextBefore?: boolean;
};

export default function (props: TextProps) {
    const [value, setValue] = useState<string>();

    useEffect(() => {
        const html = renderToStaticMarkup(
            <MarkdownView markdown={props.value} />
        ) as string;
        setValue(
            html
                ?.replaceAll(/<div>([\S\s]+?)<\/div>/g, '$1')
                ?.replaceAll(
                    /<p><strong>(.+?)<\/strong><\/p>/g,
                    '<br><strong>$1</strong><br>'
                )
                // ?.replaceAll(/^<p>(.+?)<\/p>$/g, '<span>$1</span>')
                ?.replaceAll(/^<p>(.+?)<\/p>\n+/g, '<span>$1</span><br>')
                ?.replaceAll(/\n+<p>(.+?)<\/p>$/g, '<br><span>$1</span>')
                ?.replaceAll(/(<br>)+<p>(.+?)<\/p>$/g, '<br><span>$2</span>')
                ?.replaceAll(/<p>(.+?)<\/p>/g, '<br><span>$1</span><br>')
        );
    }, [props.value]);

    return (
        <span
            className={styles.container}
            dangerouslySetInnerHTML={{
                __html: value,
            }}
        />
    );
}
