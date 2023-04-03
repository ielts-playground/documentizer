import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MarkdownView from 'react-showdown';
import { AnyComponent } from '@types';

import styles from './styles.module.scss';

type TextProps = AnyComponent & {
    hasTextBefore?: boolean;
};

export default function (props: TextProps) {
    const [value, setValue] = useState<string>();

    useEffect(() => {
        const html = renderToStaticMarkup(
            <MarkdownView markdown={props.value} />
        ) as string;
        if (props.type === 'range') {
            setValue(html);
        } else {
            const matches = [];
            for (const match of html.matchAll(
                /<p>(.+?)<\/p>(\n|<br>|<br\/>)*/g
            )) {
                matches.push(`${match[1] || ''}${match[2] ? '<br>' : ''}`);
            }
            console.log(matches);
            const paragraphs = [];
            for (const match of matches) {
                if (match) {
                    const paragraph = match.replaceAll(
                        /^<strong>(.+?)<\/strong>(<br>)*$/g,
                        '<br><strong>$1</strong><br>'
                    );
                    paragraphs.push(`<span>${paragraph}</span>`);
                }
            }
            setValue(paragraphs.join('<br>'));
        }
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
