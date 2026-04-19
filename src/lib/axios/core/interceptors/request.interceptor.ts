import type { InternalAxiosRequestConfig } from "axios";

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export async function onRequest(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const token = getAccessToken();
  if (token && config.headers) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
}

export function onRequestError(error: unknown): Promise<unknown> {
  return Promise.reject(error);
}