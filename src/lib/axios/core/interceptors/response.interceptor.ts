import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosFormattedResponse } from "../../types/axios.types";
import api from '../instance';
import { apis } from '../../../api/config';

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;
let failedQueue: Array<{ resolve: () => void; reject: (reason?: unknown) => void }> = [];

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
): Promise<AxiosFormattedResponse> {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
  const status = error.response?.status;
  const responseData = error.response?.data as Record<string, unknown> | undefined;
  const errorMessage = typeof responseData?.message === 'string' 
    ? responseData.message 
    : error.message;

  const isServer = typeof window === "undefined";

  if (status === 401 && originalRequest && !originalRequest._retry) {
    
    if (isServer) {
        return Promise.reject({ data: null, error: errorMessage, status: 401, all: error });
    }

    if (isRefreshing && refreshPromise) {
      try {
        await refreshPromise;
        return api(originalRequest);
      } catch {
        return Promise.reject({ data: null, error: errorMessage, status: 401, all: error });
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    refreshPromise = api.post(apis.auth.refresh).then(() => {
      isRefreshing = false;
      refreshPromise = null;
      failedQueue.forEach(p => p.resolve());
      failedQueue = [];
      return true;
    }).catch((err) => {
      isRefreshing = false;
      refreshPromise = null;
      failedQueue.forEach(p => p.reject(err));
      failedQueue = [];
      return false;
    });

    const success = await refreshPromise;
    if (success) {
      return api(originalRequest);
    }

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    return Promise.reject({ data: null, error: errorMessage, status: 401, all: error });
  }

  return Promise.reject({
    data: null,
    error: errorMessage,
    status: status ?? (error.code as unknown as number),
    all: error,
    __authErrorHandled: status === 403,
  });
}