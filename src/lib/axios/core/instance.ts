import axios from 'axios';
import { onRequest, onRequestError } from './interceptors/request.interceptor';
import { onResponse, onResponseError } from './interceptors/response.interceptor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(onRequest, onRequestError);
// @ts-expect-error - custom response wrapper
api.interceptors.response.use(onResponse, onResponseError);

export default api;