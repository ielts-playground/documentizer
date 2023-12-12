const UNSAVED_READING_KEY = 'new:reading';
const UNSAVED_LISTENING_KEY = 'new:listening';
const UNSAVED_WRITING_KEY = 'new:writing';

export const UNSAVED_VALIDITY_IN_MILLISECONDS = 3 * 24 * 60 * 1000;

export function unsavedKey(skill: string) {
    switch (skill) {
        case 'reading':
            return UNSAVED_READING_KEY;
        case 'listening':
            return UNSAVED_LISTENING_KEY;
        case 'writing':
            return UNSAVED_WRITING_KEY;
        default:
            return undefined;
    }
}

export function automaticallySavedKey() {
    return 'new:auto-save';
}
