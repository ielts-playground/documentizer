import { createContext } from 'react';

export const Global = createContext<{
    [key: string]: any;
}>({});
