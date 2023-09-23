import React, { ReactElement, useEffect, useState } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import { AnyComponent } from '@types';
import { createEditableComponent } from '@utils/components';

import styles from './styles.module.scss';

type PartProps = {
    skill: string;
    number: number;
    components: AnyComponent[];
    onClick: (component: AnyComponent) => void;
    onAnswer: (key: string, value: string) => void;
    rightPane?: ReactElement;
};

export default function (props: PartProps) {
    const [components, setComponents] = useState<ReactElement[][]>([]);
    const [sizes, setSizes] = useState<string[]>(['100%', 'auto', '0%']);

    useEffect(() => {
        const createPane = (
            condition: (component: AnyComponent) => boolean
        ) => {
            return props.components
                .filter(condition)
                .map((component, index) => (
                    <span key={index}>
                        {createEditableComponent(
                            component,
                            (selected: AnyComponent) => {
                                props.onClick(selected);
                            },
                            (value: string) => {
                                props.onAnswer(component.kei, value);
                            }
                        )}
                    </span>
                ));
        };
        setComponents([
            createPane((c) => !c.position),
            createPane((c) => !!c.position),
        ]);
    }, [JSON.stringify(props.components)]);

    useEffect(() => {
        const hasLeft = !!components[0]?.length;
        const hasRight = !!components[1]?.length;
        if (hasLeft && hasRight) {
            setSizes(
                props.rightPane ? ['45%', '45%', '10%'] : ['50%', '50%', 'auto']
            );
        } else if (hasLeft && !hasRight) {
            setSizes(
                props.rightPane
                    ? ['90%', 'auto', '10%']
                    : ['100%', 'auto', '0%']
            );
        } else if (hasRight && !hasLeft) {
            setSizes(
                props.rightPane
                    ? ['auto', '90%', '10%']
                    : ['auto', '100%', '0%']
            );
        } else {
            setSizes(
                props.rightPane
                    ? ['90%%', 'auto', '10%']
                    : ['100%', 'auto', '0%']
            );
        }
    }, [components[0]?.length, components[1]?.length, props.rightPane]);

    return (
        <>
            <SplitPane
                className={styles.container}
                split={'vertical'}
                sizes={sizes}
                sashRender={undefined}
                onChange={undefined}
            >
                {!!components[0]?.length && (
                    <Pane key={0} className={styles.pane}>
                        <div className={styles.container}>{components[0]}</div>
                    </Pane>
                )}
                {!!components[1]?.length && (
                    <Pane key={1} className={styles.pane}>
                        <div className={styles.container}>{components[1]}</div>
                    </Pane>
                )}
                <Pane key={2} className={styles.pane}>
                    <div className={styles.container}>{props.rightPane}</div>
                </Pane>
            </SplitPane>
        </>
    );
}
