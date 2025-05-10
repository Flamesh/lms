import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { REACT_APP_API_URL } from '../app-constants';

export const axiosClient = axios.create({
  baseURL: REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config = {
      ...config,
      headers: {
        ...config.headers,
      },
    } as InternalAxiosRequestConfig;

    return config;
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: any) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.href.indexOf('/auth/sign-in') === -1) {
        window.location.href = '/auth/sign-in';
        return;
      }

    }
    return Promise.reject(error);
  }
);

export default axiosClient;
