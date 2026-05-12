import { AxiosFormattedResponse } from "../types/axios.types";

export async function apiWrapper<T = any>(
  axiosCall: () => Promise<any>
): Promise<AxiosFormattedResponse<T>> {
  console.log('[apiWrapper] Starting...');
  
  try {
    console.log('[apiWrapper] Calling axios...');
    const response = await axiosCall();
    console.log('[apiWrapper] Response received:', JSON.stringify(response));

    if (response.__authErrorHandled) {
      console.log('[apiWrapper] Auth error handled, returning 403');
      return {
        data: null,
        error: "Unauthorized access",
        status: 403,
        all: response.all,
        __authErrorHandled: true,
      };
    }

    if (response.error) {
      console.log('[apiWrapper] Response has error:', response.error);
      throw response.error;
    }

    console.log('[apiWrapper] Success, returning data');
    return {
      data: response.data ?? null,
      error: null,
      status: response.status,
      all: response,
    };
  } catch (error: any) {
    console.log('[apiWrapper] Caught error:', error);
    console.log('[apiWrapper] Error structure:', typeof error, Object.keys(error || {}));
    console.log('[apiWrapper] Error code:', error?.code);
    
    if (error?.code === 'ERR_CANCELED') {
      return {
        data: null,
        error: 'Request canceled',
        status: 'canceled',
        all: error,
      };
    }

    if (error?.code === 'ECONNABORTED' || error?.code === 'ERR_NETWORK') {
      return {
        data: null,
        error: 'Connection timeout. Please try again.',
        status: 'timeout',
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

    // Handle the error object from response interceptor
    // The error should have structure: { data, error, status, all }
    const errorObj = error;
    
    // Check if error has error property from interceptor
    if (errorObj?.error) {
      console.log('[apiWrapper] Using error.error:', errorObj.error);
      return {
        data: null,
        error: String(errorObj.error),
        status: errorObj.status || 'error',
        all: errorObj,
      };
    }

    // Fallback to extracting from response
    const responseData = error?.response?.data;
    const errorMessage = typeof responseData?.message === 'string'
      ? responseData.message
      : (typeof error?.message === 'string' ? error.message : 'An error occurred');

    console.log('[apiWrapper] Extracted error message:', errorMessage);
    
    return {
      data: null,
      error: errorMessage,
      status: error?.status ?? 'error',
      all: error,
    };
  }
}