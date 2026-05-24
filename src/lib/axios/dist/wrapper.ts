import { AxiosFormattedResponse } from "../types/axios.types";

export async function apiWrapper<T = any>(
  axiosCall: () => Promise<any>
): Promise<AxiosFormattedResponse<T>> {
  try {
    const response = await axiosCall();

    if (response.__authErrorHandled) {
      return {
        data: null,
        error: "Unauthorized access",
        status: 403,
        all: response.all,
        __authErrorHandled: true,
      };
    }

    if (response.error) {
      throw { error: response.error, status: response.status };
    }

    return {
      data: response.data ?? null,
      error: null,
      status: response.status,
      all: response,
    };
  } catch (error: any) {
    if (error?.code === "ERR_CANCELED") {
      return {
        data: null,
        error: "Request canceled",
        status: "canceled",
        all: error,
      };
    }

    if (error?.code === "ECONNABORTED" || error?.code === "ERR_NETWORK") {
      return {
        data: null,
        error: "Connection timeout. Please try again.",
        status: "timeout",
        all: error,
      };
    }

    if (error?.__authErrorHandled || error?.response?.status === 403) {
      const authMessage = error?.response?.data?.message;
      return {
        data: null,
        error: authMessage || "Unauthorized",
        status: 403,
        all: error,
        __authErrorHandled: true,
      };
    }

    const errorObj = error;

    if (errorObj?.error) {
      return {
        data: null,
        error: String(errorObj.error),
        status: errorObj.status || "error",
        all: errorObj,
      };
    }

    const responseData = error?.response?.data;
    const errorMessage = typeof responseData?.message === "string"
      ? responseData.message
      : (typeof error?.message === "string" ? error.message : "An error occurred");

    return {
      data: null,
      error: errorMessage,
      status: error?.status ?? "error",
      all: error,
    };
  }
}
