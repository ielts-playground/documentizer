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
            createPane((c) => c.position === 1),
        ]);
    }, [JSON.stringify(props.components)]);

    return (
        <>
            <SplitPane
                className={styles.container}
                split={'vertical'}
                sizes={
                    !!components[0]?.length && !!components[1]?.length
                        ? ['45%', '45%', '10%']
                        : ['90%', 'auto', '10%']
                }
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
