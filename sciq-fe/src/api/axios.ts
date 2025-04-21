import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 환경에 따른 baseURL 설정
const baseURL = import.meta.env.PROD 
  ? '/'  // 프로덕션 환경
  : 'http://api.sciq.co.kr';  // 개발 환경

const instance = axios.create({
  baseURL,
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
    
    // 개발 환경에서만 로깅
    if (import.meta.env.DEV) {
      console.log('=== 요청 상세 정보 ===');
      console.log('전체 URL:', `${config.baseURL}${config.url}`);
      console.log('요청 메서드:', config.method?.toUpperCase());
      console.log('요청 헤더:', config.headers);
      if (config.data) {
        console.log('요청 데이터:', config.data);
      }
      console.log('==================');
    }
    
    return config;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('요청 에러:', error);
    }
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 개발 환경에서만 로깅
    if (import.meta.env.DEV) {
      console.log('=== 응답 상세 정보 ===');
      console.log('응답 상태:', response.status);
      console.log('응답 URL:', response.config.url);
      console.log('응답 데이터:', response.data);
      console.log('==================');
    }
    return response;
  },
  async (error: AxiosError) => {
    // 개발 환경에서만 상세 로깅
    if (import.meta.env.DEV) {
      console.error('=== 응답 에러 상세 정보 ===');
      console.error('에러 메시지:', error.message);
      if (error.response) {
        console.error('에러 상태:', error.response.status);
        console.error('에러 데이터:', error.response.data);
      }
      console.error('==================');
    }
    
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
    
    // 404 에러 처리
    if (error.response?.status === 404) {
      console.error('요청한 리소스를 찾을 수 없습니다:', error.config?.url || '알 수 없는 URL');
    }
    
    // 500 에러 처리
    if (error.response?.status === 500) {
      console.error('서버 에러가 발생했습니다.');
    }
    
    return Promise.reject(error);
  }
);

export default instance; 