import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

import { htmlToMarkdown, markdownToHtml } from '@utils/converters';

import styles from './styles.module.scss';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type RichTextEditorProps = {
    markdown?: string;
    onChange?: (value: string) => void;
};

export default function (props: RichTextEditorProps) {
    const [value, setValue] = useState<string>(undefined);

    useEffect(() => {
        if (props.markdown) {
            setValue(markdownToHtml(props.markdown));
        }
    }, [props.markdown]);

    const quillModules = {
        toolbar: false,
    };

    const onChange = (html: string) => {
        const markdown = htmlToMarkdown(html);
        const newHtml = markdownToHtml(markdown);
        setValue(newHtml);
        if (props.onChange) {
            props.onChange(htmlToMarkdown(newHtml));
        }
    };

    return (
        <div className={styles.container}>
            <ReactQuill
                theme={'snow'}
                modules={quillModules}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
