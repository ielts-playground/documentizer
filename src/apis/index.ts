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
