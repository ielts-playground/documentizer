import { AnyComponent, KeyValue } from '@types';
import api, { cookies } from './base';
import { TestCreationRequest, TestCreationResponse, User } from './types';

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
    subscription: 'FREE' | 'PREMIUM',
    audio: File,
    skillRequests: TestCreationRequest[]
) {
    const formData = new FormData();
    formData.append('audio', audio);
    formData.append('subscription', subscription);
    for (const request of skillRequests) {
        formData.append(
            request.skill,
            new Blob([JSON.stringify(request)], {
                type: 'application/json',
            })
        );
    }

    return (
        await api.default.put<TestCreationResponse>('/test/new', formData, {
            headers: {
                Authorization: api.default.defaults.headers['Authorization'],
                'Content-Type': 'multipart/form-data',
            },
        })
    ).data;
}

export async function ping() {
    return (await api.default.get<User>('/users')).data;
}

export function clearToken() {
    api.default.clearToken();
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
            userName: string;
        }[];
    };
}
