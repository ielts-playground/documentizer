import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

import { htmlToMarkdown, markdownToHtml } from '@utils/converters';

import styles from './styles.module.scss';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type RichTextEditorProps = {
    markdown?: string;
    onFinish?: (value: string) => void;
    onCancel?: () => void;
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

    const finish = () => {
        if (props.onFinish) {
            const markdown = htmlToMarkdown(value);
            const html = markdownToHtml(markdown);
            props.onFinish(htmlToMarkdown(html));
        }
    };

    const cancel = () => {
        if (props.onCancel) {
            props.onCancel();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.editor}>
                <ReactQuill
                    theme={'snow'}
                    modules={quillModules}
                    value={value}
                    onChange={setValue}
                />
            </div>
            <div className={styles.action}>
                <button onClick={() => cancel()}>cancel</button>
                <button className={styles.submit} onClick={() => finish()}>
                    save
                </button>
            </div>
        </div>
    );
}
