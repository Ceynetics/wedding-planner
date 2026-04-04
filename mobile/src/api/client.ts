import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from './tokenStorage';
import type { AuthResponse } from '@/types/api';

function resolveBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  // On Android emulator, localhost refers to the emulator itself.
  // Replace with 10.0.2.2 to reach the host machine.
  if (Platform.OS === 'android' && envUrl.includes('localhost')) {
    return envUrl.replace('localhost', '10.0.2.2');
  }
  return envUrl;
}

const BASE_URL = resolveBaseUrl();

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach Bearer token
client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 with token refresh
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  failedQueue = [];
}

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Skip refresh for auth endpoints
    const url = originalRequest.url || '';
    if (url.includes('/api/auth/login') || url.includes('/api/auth/register') || url.includes('/api/auth/refresh')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return client(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        await clearTokens();
        processQueue(new Error('No refresh token'), null);
        return Promise.reject(error);
      }

      const { data } = await axios.post<AuthResponse>(`${BASE_URL}/api/auth/refresh`, { refreshToken });
      await setAccessToken(data.accessToken);
      await setRefreshToken(data.refreshToken);

      processQueue(null, data.accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      }
      return client(originalRequest);
    } catch (refreshError) {
      await clearTokens();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default client;
