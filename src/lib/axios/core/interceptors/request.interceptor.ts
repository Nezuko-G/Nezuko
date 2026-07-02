import type { InternalAxiosRequestConfig } from "axios";

export async function onRequest(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    config.headers.set("Cookie", cookieStore.toString());
  }

  return config;
}

export function onRequestError(error: unknown): Promise<unknown> {
  return Promise.reject(error);
}