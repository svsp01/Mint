
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '', 
  timeout: 10000, 
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle responses
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful responses
    return response;
  },
  (error: AxiosError) => {
    // Handle error responses
    return Promise.reject(error);
  }
);

export default axiosInstance;
