import { AnyComponent } from '@types';

export type TestCreationRequest = {
    skill: string;
    components: (AnyComponent & {
        part: number;
    })[];
    answers: {
        part: number;
        kei: string;
        value: string;
    }[];
};

export type TestCreationResponse = {
    id: number;
};
