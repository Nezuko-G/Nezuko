import type { InternalAxiosRequestConfig } from "axios";

export async function onRequest(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  return config;
}

export function onRequestError(error: unknown): Promise<unknown> {
  return Promise.reject(error);
}