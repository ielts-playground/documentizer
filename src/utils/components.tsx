import React, { ReactElement } from 'react';
import {
    Box,
    Footnote,
    Image,
    List,
    Options,
    Question,
    Text,
    Title,
} from '@components';
import { AnyComponent, ComponentType } from '@types';

export function allComponentTypes(): ComponentType[] {
    return [
        'break',
        'title',
        'image',
        'text',
        'options',
        'question',
        'box',
        'list',
        'footnote',
        'smart',
    ];
}

export function createComponent(
    props: AnyComponent,
    onChange: (value: string) => void
) {
    const elements = [] as ReactElement[];
    const component = { ...props, onChange } as AnyComponent;
    switch (props.type) {
        case 'title':
            elements.push(<Title {...component} />);
            break;
        case 'text':
            elements.push(<Text {...component} />);
            break;
        case 'box':
            elements.push(<Box {...component} />);
            break;
        case 'image':
            elements.push(<Image {...component} />);
            break;
        case 'options':
            elements.push(<Options {...component} />);
            break;
        case 'footnote':
            elements.push(<Footnote {...component} />);
        case 'question':
            elements.push(<Question {...component} />);
            break;
        case 'range':
            const { from, to } = component.value || {};
            const value = `<hr>\n\n## Questions ${from}-${to}`;
            elements.push(
                <Text
                    {...{
                        ...component,
                        value,
                    }}
                />
            );
            break;
        case 'list':
            elements.push(<List {...component} />);
            break;
        case 'break':
            elements.push(<div />);
            break;
        default:
            elements.push(<>{component.value}</>);
    }
    return {
        component,
        elements,
    };
}

export function createEditableComponent(
    props: AnyComponent,
    /**
     * Emits when the component is clicked on.
     */
    onClick: (selected: AnyComponent) => void,
    /**
     * Emits when the component is selected or typed into.
     */
    onAnswer: (value: string) => void
) {
    const { component, elements } = createComponent(props, onAnswer);
    return (
        <span onClick={() => onClick(component)}>
            {elements.map((element, index) => (
                <span key={index}>{element}</span>
            ))}
        </span>
    );
}
