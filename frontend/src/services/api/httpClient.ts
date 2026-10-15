import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const errorData = error.response?.data;
    const message =
      errorData?.error?.message ||
      error.message ||
      'An unexpected network or server error occurred.';
    
    return Promise.reject(new Error(message));
  }
);
