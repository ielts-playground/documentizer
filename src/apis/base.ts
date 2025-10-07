import axios from 'axios';
import Cookies from 'universal-cookie';

export const cookies = new Cookies();

const usingApiKey = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    headers: {
        'X-Api-Key': process.env.SERVER_API_KEY,
    },
});

const usingToken = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
});

usingToken.interceptors.request.use((config) => {
    const token = cookies.get('token') as string;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default {
    private: usingApiKey,
    default: usingToken,
    new: axios.create(),
};
