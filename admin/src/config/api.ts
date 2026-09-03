// /src/config/api.ts
import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL_CLIENT } from './apiRoutes';

export const API_URL = API_URL_CLIENT;

/**
 * Headers chuẩn cho API requests
 */
export const API_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

/**
 * Hàm tạo headers với JWT token nếu có
 */
export const getAuthHeaders = (token?: string | null) => {
    const headers: Record<string, string> = { ...API_HEADERS };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * Default API timeout (10 seconds)
 */
export const API_TIMEOUT = 10000;

const api = axios.create({
    baseURL: API_URL,
    headers: API_HEADERS,
    withCredentials: true, // Enable cookies for authentication
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

type RefreshResponse = {
    data?: {
        token?: string;
        refreshToken?: string;
    };
};

let refreshPromise: Promise<string> | null = null;

const PUBLIC_AUTH_ENDPOINTS = [
    '/auth/login',
    '/auth/register',
    '/auth/check-email',
    '/auth/forgot-password',
    '/auth/confirm-email',
    '/auth/reset-password',
];

// Automatically attach JWT token from localStorage to outgoing requests if present
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');
        const isPublicAuthRequest = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
            originalRequest?.url?.includes(endpoint),
        );

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            isRefreshRequest ||
            isPublicAuthRequest ||
            typeof window === 'undefined'
        ) {
            return Promise.reject(error);
        }

        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = api
                    .post<RefreshResponse>(
                        '/auth/refresh',
                        { refreshToken: storedRefreshToken },
                        {
                            withCredentials: true,
                            headers: API_HEADERS,
                        },
                    )
                    .then((response) => {
                        const newToken = response.data?.data?.token;
                        const newRefreshToken = response.data?.data?.refreshToken;

                        if (!newToken) {
                            throw new Error('Refresh response does not contain an access token.');
                        }

                        localStorage.setItem('token', newToken);
                        if (newRefreshToken) {
                            localStorage.setItem('refreshToken', newRefreshToken);
                        }

                        return newToken;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newToken = await refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            return Promise.reject(refreshError);
        }
    },
);

export default api;
