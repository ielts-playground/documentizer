import React, { ReactElement, useEffect, useState } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import { AnyComponent, KeyValue } from '@types';

import { Unknown } from '@components';
import { createEditableComponent } from '@utils/components';

import styles from './styles.module.scss';

type PartProps = {
    skill: string;
    number: number;
    useTwoPanes?: boolean;
    components: AnyComponent[];
    mode?: string;
    onEdit: (component: AnyComponent) => void;
    onChange: (key: string, value: string) => void;
    onCreate: (component: AnyComponent, index: number) => void;
};

export default function (props: PartProps) {
    const [components, setComponents] = useState<ReactElement[][]>([]);
    const [mode, setMode] = useState<string>(undefined);

    useEffect(() => {
        const map: {
            [key: string]: KeyValue;
        } = {};
        let latest = {};
        const options = {
            get: (key: string) => map[key],
            set: (key: string, value: KeyValue) => {
                map[key] = value;
                latest = value;
            },
            latest: () => latest,
        };
        const createPane = (
            condition: (component: AnyComponent) => boolean
        ) => {
            return props.components
                .filter(condition)
                .map((component, index) => (
                    <span key={index}>
                        {createEditableComponent(
                            {
                                component: () => component,
                                options: () => options,
                            },
                            (selected: AnyComponent) => {
                                props.onEdit(selected);
                            },
                            (value: string) => {
                                props.onChange(component.kei, value);
                            },
                            (created: AnyComponent) => {
                                props.onCreate(
                                    created,
                                    props.components.indexOf(component)
                                );
                            }
                        )}
                    </span>
                ));
        };
        const left = createPane((c) => !c.position);
        const right = createPane((c) => c.position === 1);
        setComponents([left, right]);
        setMode(props.mode);
    }, [JSON.stringify(props.components), props.mode]);

    return (
        <>
            <h1 className={styles.header}>{`${String(
                props.skill
            ).toUpperCase()} PART ${Number(props.number)}`}</h1>
            <SplitPane
                className={styles.container}
                split={'vertical'}
                sizes={
                    props.useTwoPanes
                        ? ['50%', '50%', 'auto']
                        : ['100%', 'auto']
                }
                sashRender={undefined}
                onChange={undefined}
            >
                <Pane className={styles.pane}>
                    <div className={styles.container}>
                        {components[0]}
                        {mode === 'edit' && (
                            <Unknown
                                type={''}
                                value={'More'}
                                onClick={() =>
                                    props.onEdit({
                                        type: '',
                                        position: 0,
                                    })
                                }
                            />
                        )}
                    </div>
                </Pane>
                {props.useTwoPanes && (
                    <Pane className={styles.pane}>
                        <div className={styles.container}>
                            {components[1]}
                            {mode === 'edit' && (
                                <Unknown
                                    type={''}
                                    value={'More'}
                                    onClick={() =>
                                        props.onEdit({
                                            type: '',
                                            position: 1,
                                        })
                                    }
                                />
                            )}
                        </div>
                    </Pane>
                )}
                <></>
            </SplitPane>
        </>
    );
}
