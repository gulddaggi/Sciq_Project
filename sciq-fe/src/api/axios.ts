import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API 서버 기본 URL 설정 - 컨텍스트 경로(/api) 포함
const baseURL = 'http://api.sciq.co.kr:8080/api';

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 타임아웃 설정 - 서버 응답이 늦을 경우를 대비
  timeout: 15000,
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('=== 요청 상세 정보 ===');
    console.log('전체 URL:', `${baseURL}${config.url}`);
    console.log('요청 메서드:', config.method?.toUpperCase());
    console.log('요청 헤더:', JSON.stringify(config.headers, null, 2));
    console.log('요청 데이터:', JSON.stringify(config.data, null, 2));
    console.log('==================');
    
    return config;
  },
  (error: AxiosError) => {
    console.error('요청 에러:', error.message);
    if (error.request) {
      console.error('요청 객체:', error.request);
    }
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('=== 응답 상세 정보 ===');
    console.log('응답 상태:', response.status);
    console.log('응답 URL:', response.config.url);
    console.log('응답 데이터:', JSON.stringify(response.data, null, 2));
    console.log('==================');
    return response;
  },
  (error: AxiosError) => {
    console.error('=== 응답 에러 상세 정보 ===');
    console.error('에러 메시지:', error.message);
    console.error('에러 코드:', error.code);
    if (error.response) {
      console.error('에러 상태:', error.response.status);
      console.error('에러 데이터:', JSON.stringify(error.response.data, null, 2));
      console.error('에러 헤더:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.error('요청은 성공했으나 응답이 없음:', error.request);
    }
    console.error('==================');
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance; 