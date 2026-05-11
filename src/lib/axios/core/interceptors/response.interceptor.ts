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
): Promise<AxiosFormattedResponse | any> {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
  const status = error.response?.status;
  const errorMessage = typeof error.response?.data?.message === 'string' 
    ? error.response.data.message 
    : error.message;

  // Handle 401 with token refresh
  if (status === 401 && originalRequest && !originalRequest._retry) {
    if (isRefreshing && refreshPromise) {
      // Wait for existing refresh to complete
      try {
        await refreshPromise;
        return api(originalRequest);
      } catch {
        // Refresh failed - return error
        return Promise.resolve({
          data: null,
          error: errorMessage,
          status: 401,
          all: error,
        });
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
    // Refresh failed - return error as resolved response
    return Promise.resolve({
      data: null,
      error: errorMessage,
      status: 401,
      all: error,
    });
  }

  // Non-401 errors (403, 404, 500, etc.)
  return Promise.resolve({
    data: null,
    error: errorMessage,
    status: status ?? (error.code as unknown as number),
    all: error,
    __authErrorHandled: status === 403,
  });
}