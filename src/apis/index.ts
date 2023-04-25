import { AnyComponent, KeyValue } from '@types';
import api, { cookies } from './base';
import { TestCreationRequest, TestCreationResponse } from './types';

/**
 * Authenticates a user then set the authorized token to Cookies.
 * @param username the username.
 * @param password the password.
 */
export async function authenticate(username: string, password: string) {
    const body = {
        username,
        password,
    };
    const { token } =
        (await api.default.post<{ token: string }>('/authenticate', body))
            .data || {};
    if (token) {
        cookies.set('token', token);
    }
    return !!token;
}

/**
 * Uploads a test.
 * @param content the test.
 */
export async function createTestWithAudio(
    content: TestCreationRequest,
    audio?: File
) {
    const formData = new FormData();
    formData.append(
        'content',
        new Blob([JSON.stringify(content)], {
            type: 'application/json',
        })
    );
    if (audio) {
        formData.append('audio', audio);
    }

    return (
        await api.default.put<TestCreationResponse>('/test', formData, {
            headers: {
                Authorization: api.default.defaults.headers['Authorization'],
                'Content-Type': 'multipart/form-data',
            },
        })
    ).data;
}

export async function ping() {
    await api.default.get('/users');
}

/**
 * Registers a user.
 * @param userRegister the user's info.
 */
export async function createUser(userRegister: any) {
    const body = {
        email: userRegister.email,
        firstName: userRegister.firstName,
        lastName: userRegister.lastName,
        password: userRegister.password,
        username: userRegister.username,
    };
    await api.default.post('/register', body);
}

/**
 * Retrieves a writing test for a specific examination.
 * @param examId the examination's id.
 */
export async function retrieveWritingTest(examId: number) {
    return (await api.default.get(`/exam/${examId}/test/writing`)).data as {
        examId: number;
        components: AnyComponent[];
    };
}

/**
 * Retrieves a writing examination's answers.
 * @param examId the examination's id.
 */
export async function retrieveWritingAnswers(examId: number) {
    return (await api.default.get(`/exam/${examId}/answer/writing`)).data as {
        examId: number;
        answers: KeyValue;
    };
}
