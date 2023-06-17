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
export async function createUser(userRegister: any): Promise<Boolean> {
    const body = {
        email: userRegister.email,
        phoneNumber: userRegister.phoneNumber,
        firstName: userRegister.firstName,
        lastName: userRegister.lastName,
        password: userRegister.password,
        username: userRegister.username,
    };

    try {
        await api.default.post('/register', body);
        return true;
    } catch (error) {
        console.error('API request failed:', error);
        return false;
    }
}

/**
 * Retrieves a writing test for a specific examination.
 * @param examId the examination's id.
 */
export async function retrieveWritingTest(examId: number) {
    return (await api.default.get(`/exam/${examId}/test/writing`)).data as {
        examId: number;
        components: (AnyComponent & {
            partNumber: number;
        })[];
    };
}

export async function evaluateWritingExam(examId: number, point: number) {
    await api.default.post(`/exam/${examId}/evaluate/writing`, {
        point,
    });
}

export async function retrieveExamFinalResult(examId: number) {
    return (await api.default.get(`/exam/${examId}/result`)).data as {
        reading: number;
        listening: number;
        writing: number;
        examiner: string;
        examinee: {
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
        };
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

/**
 * XXX.
 * @param pageNumber retrieveUnevaluatedExams.
 * @param pageSize retrieveUnevaluatedExams.
 */
export async function retrieveUnevaluatedExams(
    pageNumber: number,
    pageSize: number = 20
) {
    return (
        await api.default.get(
            `/exam/not-graded?page=${pageNumber}&size=${pageSize}`
        )
    ).data as {
        page: number;
        size: number;
        total: number;
        examIds: {
            examId: number;
        }[];
    };
}
