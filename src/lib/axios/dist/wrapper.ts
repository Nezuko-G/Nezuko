import { AxiosFormattedResponse } from "../types/axios.types";

export async function apiWrapper<T = any>(
  axiosCall: () => Promise<any>
): Promise<AxiosFormattedResponse<T>> {
  try {
    const response = await axiosCall();

    if (response.__authErrorHandled) {
      return {
        data: null,
        error: null,
        status: 403,
        all: response.all,
        __authErrorHandled: true,
      };
    }

    if (response.error) {
      throw response.error;
    }

    return {
      data: response.data ?? null,
      error: null,
      status: response.status,
      all: response,
    };
  } catch (error: any) {
    if (error.code === 'ERR_CANCELED') {
      return {
        data: null,
        error: 'Request canceled',
        status: 'canceled',
        all: error,
      };
    }

    if (error?.__authErrorHandled || error?.response?.status === 403) {
      return {
        data: null,
        error: null,
        status: 403,
        all: error,
        __authErrorHandled: true,
      };
    }

    return {
      data: null,
      error: error?.response?.data ?? error.message ?? error,
      status: error?.status ?? 'error',
      all: error,
    };
  }
}