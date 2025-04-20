import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const instance = axios.create({
  baseURL: 'https://api.sciq.co.kr',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,  // 60초
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // GET 요청의 경우 Content-Type 헤더 제거
    if (config.method?.toLowerCase() === 'get') {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {    
    // 401 에러 처리 (인증 실패)
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // auth.ts의 reissue 함수를 직접 호출하지 않고 
          // 401 에러는 auth.ts의 인터셉터에서 처리하도록 함
          return Promise.reject(error);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tokenExpiresIn');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance; 