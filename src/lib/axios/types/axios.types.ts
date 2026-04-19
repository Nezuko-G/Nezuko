export interface AxiosFormattedResponse<T = any> {
  data: T | null;
  error: string | unknown | null;
  status: number | string;
  all?: any;
  __authErrorHandled?: boolean;
}

export interface RequestConfig {
  api: string;
  body?: any;
  config?: {
    signal?: AbortSignal;
    headers?: Record<string, any>;
    [key: string]: any;
  };
  onProgress?: (percent: number) => void;
}