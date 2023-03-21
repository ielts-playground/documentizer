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
import { AnyComponent, ComponentType, OptionsState } from '@types';
import Unknown from '@components/Unknown';

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
    ];
}

export function isMarkdown(type: ComponentType | string) {
    switch (type) {
        case 'text':
            return true;
        default:
            return false;
    }
}

export function createComponent(
    props: AnyComponent,
    onChange: (value: string) => void,
    { set, get, latest }: OptionsState
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
            set(component.kei, component.value);
            elements.push(<Options {...component} />);
            break;
        case 'footnote':
            elements.push(<Footnote {...component} />);
        case 'question':
            if (typeof component.options === 'string') {
                component.options = get(component.options) || latest();
            }
            elements.push(<Question {...component} />);
            if (!component.options || !Object.keys(component.options).length) {
                elements.push(
                    <Box
                        kei={component.kei}
                        onChange={onChange}
                        inQuestion={true}
                    />
                );
            }
            break;
        case 'list':
            set(component.kei, component.options);
            elements.push(<List {...component} />);
            break;
        case 'break':
            elements.push(<div />);
            break;
        default:
            elements.push(<Unknown {...component} />);
    }
    return {
        created: component,
        elements,
    };
}

export function createEditableComponent(
    retriever: {
        component: () => AnyComponent;
        options: () => OptionsState;
    },
    /**
     * Emits when the component is clicked on.
     */
    onEdit: (selected: AnyComponent) => void,
    /**
     * Emits when the component is selected or typed into.
     */
    onChange: (value: string) => void,
    /**
     * Emits when the component is created.
     */
    onCreate: (component: AnyComponent) => void
) {
    const { created, elements } = createComponent(
        retriever.component(),
        onChange,
        retriever.options()
    );
    onCreate(created);
    return (
        <span onClick={() => onEdit(retriever.component())}>
            {elements.map((element, index) => (
                <span key={index}>{element}</span>
            ))}
        </span>
    );
}
