import { AnyComponent } from '@types';

export type User = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    subscription: string;
};

export type TestCreationRequest = {
    id?: number;
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
