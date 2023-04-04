import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const usingApiKey = axios.create({
    baseURL: process.env.SERVER_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.SERVER_API_KEY,
    },
});

const usingToken = axios.create({
    baseURL: process.env.SERVER_BASE_URL,
});

usingToken.interceptors.request.use((config) => {
    config.headers['Content-Type'] = 'application/json';
    const token = cookies.get('token') as string;
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
});

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
        (await usingToken.post<{ token: string }>('/authenticate', body))
            .data || {};
    if (token) {
        cookies.set('token', token);
    }
    return !!token;
}

export default {
    private: usingApiKey,
    default: usingToken,
};
