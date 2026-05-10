import type { AxiosError, AxiosResponse } from "axios";
import { AxiosFormattedResponse } from "../../types/axios.types";

let isRedirectingToLogin = false;

export function onResponse(response: AxiosResponse): AxiosFormattedResponse {
  return {
    data: response.data ?? null,
    error: null,
    status: response.status,
    all: response,
  };
}

export function onResponseError(
  error: AxiosError
): Promise<AxiosFormattedResponse> {
  const status = error.response?.status;

  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    const isLoginPage = pathname === "/login" || pathname.endsWith("/login");

    if (status === 401) {
      if (!isLoginPage && !isRedirectingToLogin) {
        isRedirectingToLogin = true;
        window.location.href = "/login";
      }
    }
  }

  return Promise.resolve({
    data: null,
    error: error.response?.data ?? error.message,
    status: status ?? (error.code as unknown as number),
    all: error,
  });
}