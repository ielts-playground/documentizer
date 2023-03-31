export type ComponentType =
    | 'break'
    | 'title'
    | 'image'
    | 'text'
    | 'options'
    | 'question'
    | 'box'
    | 'list'
    | 'footnote'
    | 'smart'
    | '';

export type HeadingSize = 'h1' | 'h2' | 'h3' | 'h4';

export type BoxSize = {
    width: string | number;
    height: string | number;
};

export type Size = HeadingSize | BoxSize;

export type KeyValue = {
    [key: string]: string;
};

export type OptionsState = {
    get: (key: string) => KeyValue;
    set: (key: string, value: KeyValue) => void;
    latest: () => KeyValue;
};

export type WithType = {
    type: ComponentType | string;
};

export type WithSize<T> = {
    size?: T;
};

export type WithOptions<T> = {
    options?: T;
};

export type WithIndex = {
    index?: number;
};

export type WithPosition = {
    position?: number;
};

export interface Editable {
    onEdit: (props: AnyComponent) => void;
}

export interface Changeable<V> {
    onChange?: (value: V) => void;
}

export interface Clickable {
    onClick?: (key: string) => void;
}

export type Component<V> = {
    /**
     * Component's key.
     */
    kei?: string;
    /**
     * Component's value.
     */
    value?: V;
} & Changeable<V> &
    Clickable;

export type AnyComponent = Component<any> &
    WithType &
    WithSize<any> &
    WithOptions<any> &
    WithIndex &
    WithPosition;
