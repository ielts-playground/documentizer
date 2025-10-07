import { AnyComponent } from '@types';

export type TestAudioUploadLinkCreationRequest = {
    fileName: string;
    contentType?: string;
};

export type TestAudioPublishRequest = {
    fileName: string;
};

export type TestCreationRequest = {
    audioUrl?: string;
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
