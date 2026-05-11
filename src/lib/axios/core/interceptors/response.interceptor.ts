import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosFormattedResponse } from "../../types/axios.types";
import api from '../instance';
import { apis } from '../../../api/config'; 

let isRefreshing = false;
let isRedirectingToLogin = false;
let failedQueue: Array<{ resolve: () => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(); 
    }
  });
  failedQueue = [];
};

export function onResponse(response: AxiosResponse): AxiosFormattedResponse {
  return {
    data: response.data ?? null,
    error: null,
    status: response.status,
    all: response,
  };
}

export async function onResponseError(
  error: AxiosError
): Promise<AxiosFormattedResponse | any> {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
  const status = error.response?.status;

  if (status === 401 && originalRequest && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post(apis.auth.refresh); 
      
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError);
      
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const isLoginPage = pathname === "/login" || pathname.endsWith("/login");

        if (!isLoginPage && !isRedirectingToLogin) {
          isRedirectingToLogin = true;
          window.location.href = "/login";
        }
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.resolve({
    data: null,
    error: error.response?.data ?? error.message,
    status: status ?? (error.code as unknown as number),
    all: error,
  });
}