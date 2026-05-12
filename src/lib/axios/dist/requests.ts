import api from '../core/instance';
import { apiWrapper } from './wrapper';
import { RequestConfig } from '../types/axios.types';

export const getRequest = async <T = any>({ api: url, config = {} }: RequestConfig) =>
  apiWrapper<T>(() => api.get(url, { ...config }));

export const postRequest = async <T = any>({ api: url, body, config = {} }: RequestConfig) =>
  apiWrapper<T>(() => api.post(url, body, { ...config }));

export const putRequest = async <T = any>({ api: url, body, config = {} }: RequestConfig) =>
  apiWrapper<T>(() => api.put(url, body, { ...config }));

export const patchRequest = async <T = any>({ api: url, body, config = {} }: RequestConfig) =>
  apiWrapper<T>(() => api.patch(url, body, { ...config }));

export const deleteRequest = async <T = any>({ api: url, config = {} }: RequestConfig) =>
  apiWrapper<T>(() => api.delete(url, { ...config }));

export const uploadRequest = async <T = any>({ api: url, body, config = {}, onProgress }: RequestConfig) => {
  const formData = new FormData();
  for (const key in body) {
    if (body[key] instanceof FileList) {
      Array.from(body[key]).forEach(file => formData.append(key, file));
    } else if (Array.isArray(body[key])) {
      body[key].forEach(item => formData.append(key, item));
    } else {
      formData.append(key, body[key]);
    }
  }

  return apiWrapper<T>(() => api.post(url, formData, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        onProgress(percent);
      }
    }
  }));
};