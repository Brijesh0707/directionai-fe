import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store';
import { clearSession, setSession } from '@/store/authSlice';
import { AuthResponse } from '@/types/auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let queuedRequests: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  queuedRequests.forEach((callback) => callback(token));
  queuedRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = store.getState().auth.refreshToken;
    if (!refreshToken) {
      store.dispatch(clearSession());
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queuedRequests.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const refreshResponse = await axios.post<AuthResponse>(`${baseURL}/auth/refresh`, {
        refreshToken,
      });

      const { user, accessToken, refreshToken: nextRefreshToken } = refreshResponse.data;
      store.dispatch(setSession({ user, accessToken, refreshToken: nextRefreshToken }));

      processQueue(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(null);
      store.dispatch(clearSession());
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
