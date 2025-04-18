import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://api.sciq.co.kr:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('=== 요청 상세 정보 ===');
    console.log('요청 URL:', config.baseURL + config.url);
    console.log('요청 메서드:', config.method?.toUpperCase());
    console.log('요청 헤더:', JSON.stringify(config.headers, null, 2));
    console.log('요청 데이터:', JSON.stringify(config.data, null, 2));
    console.log('==================');
    
    return config;
  },
  (error) => {
    console.error('요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    console.log('=== 응답 상세 정보 ===');
    console.log('응답 상태:', response.status);
    console.log('응답 데이터:', JSON.stringify(response.data, null, 2));
    console.log('==================');
    return response;
  },
  (error) => {
    console.error('=== 응답 에러 상세 정보 ===');
    console.error('에러 상태:', error.response?.status);
    console.error('에러 데이터:', JSON.stringify(error.response?.data, null, 2));
    console.error('==================');
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance; 