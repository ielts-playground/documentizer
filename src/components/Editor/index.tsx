import React, { useEffect, useState } from 'react';

import { AnyComponent } from '@types';
import { allComponentTypes } from '@utils/components';
import { RichTextInput } from '@components';
import { markdownToKeyValue, keyValueToMarkdown } from '@utils/converters';

import styles from './styles.module.scss';

type EditorProps = {
    component: AnyComponent;
    onFinish?: (component: AnyComponent) => void;
    onCancel?: () => void;
};

type AnyComponentWithMarkdownOptions = AnyComponent & {
    optionsInMarkdown?: string;
};

export default function (props: EditorProps) {
    const [component, setComponent] =
        useState<AnyComponentWithMarkdownOptions>(undefined);

    useEffect(() => {
        const optionsInMarkdown = keyValueToMarkdown(props.component.options);
        const component = {
            ...props.component,
            optionsInMarkdown,
        } as AnyComponentWithMarkdownOptions;
        if (['options'].includes(component.type)) {
            component.value = optionsInMarkdown;
        }
        setComponent(component);
    }, [props]);

    const updateComponentKey = (key: string) => {
        setComponent({
            ...component,
            kei: key,
        });
    };

    const updateComponentType = (type: string) => {
        setComponent({
            ...component,
            type,
        });
    };

    const updateComponentValue = (value: string) => {
        setComponent({
            ...component,
            value,
        });
    };

    const updateComponentOptions = (optionsInMarkdown: string) => {
        setComponent({
            ...component,
            optionsInMarkdown,
        });
    };

    const processComponent = () => {
        const type = component.type || 'break';
        const options = markdownToKeyValue(component.optionsInMarkdown);
        const value = component.value
            ?.replaceAll(/\n*(<br>)*\n*$/g, '')
            ?.trim();
        const processed = {
            ...component,
            type,
            value: type === 'options' ? options : value,
            options,
        };
        delete processed.optionsInMarkdown;
        return processed;
    };

    return (
        <div
            className={styles.container}
            onKeyDownCapture={(e) => {
                if (e.key === 'Escape' && props.onCancel) {
                    props.onCancel();
                }
            }}
        >
            {component && (
                <>
                    <div className={styles.type}>
                        <select defaultValue={component.type} autoFocus>
                            {allComponentTypes().map((type, index) => (
                                <option
                                    key={index}
                                    onClick={() => updateComponentType(type)}
                                >
                                    {type}
                                </option>
                            ))}
                        </select>
                        {['question', 'box'].includes(component.type) && (
                            <input
                                placeholder={'number'}
                                type={'number'}
                                className={styles.number}
                                defaultValue={component.kei}
                                onChange={(e) =>
                                    updateComponentKey(e.target.value)
                                }
                            />
                        )}
                    </div>
                    {['text'].includes(component.type) && (
                        <RichTextInput
                            original={component.value}
                            onChange={updateComponentValue}
                        />
                    )}
                    {['title', 'question', 'list', 'title', 'image'].includes(
                        component.type
                    ) && (
                        <textarea
                            aria-multiline
                            className={styles.rawText}
                            defaultValue={component.value}
                            onChange={(e) =>
                                updateComponentValue(e.target.value)
                            }
                        />
                    )}
                    {['question', 'list', 'options'].includes(
                        component.type
                    ) && (
                        <RichTextInput
                            original={component.optionsInMarkdown}
                            onChange={updateComponentOptions}
                        />
                    )}
                </>
            )}
            <div className={styles.action}>
                <button
                    onClick={() => {
                        if (props.onCancel) {
                            props.onCancel();
                        }
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        if (props.onFinish) {
                            props.onFinish(processComponent());
                        }
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    );
}
