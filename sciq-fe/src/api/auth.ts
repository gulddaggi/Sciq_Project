import axios from 'axios';

// 백엔드 Enum과 일치하는 문자열 리터럴 타입 정의
export type ScienceDisciplineType = 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY' | 'EARTH_SCIENCE' | 'ASTRONOMY' | 'NONE';
export type UserRole = 'ROLE_STUDENT' | 'ROLE_ADVISOR';

// 필요한 타입 정의
export interface TokenDto {
  grantType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}

// AuthDto.SignUpRequest 에 맞춰 인터페이스 필드 및 타입 정의
export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
  nickName: string;
  schoolName: string;
  prefer: ScienceDisciplineType;
  userRole: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// 환경에 따른 baseURL 설정
const baseURL = '/api';  // 프록시 사용

// axios 인스턴스 생성
const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 60000
});

// Request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 개발 환경에서만 요청 로그 출력
    if (import.meta.env.DEV) {
      console.log('======= 요청 정보 =======');
      console.log('URL:', `${baseURL}${config.url}`);
      console.log('Method:', config.method?.toUpperCase());
      console.log('Headers:', config.headers);
      console.log('Data:', config.data);
      console.log('=========================');
    }
    
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
instance.interceptors.response.use(
  (response) => {
    // 개발 환경에서만 응답 로그 출력
    if (import.meta.env.DEV) {
      console.log('======= 응답 정보 =======');
      console.log('Status:', response.status);
      console.log('URL:', response.config.url);
      console.log('Data:', response.data);
      console.log('=========================');
    }
    return response;
  },
  async (error) => {
    if (import.meta.env.DEV) {
      console.error('Response error:', error.response || error);
    }
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          if (import.meta.env.DEV) {
            console.log('Attempting token refresh');
          }
          const newToken = await reissue(refreshToken);
          localStorage.setItem('accessToken', newToken.accessToken);
          localStorage.setItem('refreshToken', newToken.refreshToken);
          
          originalRequest.headers['Authorization'] = `Bearer ${newToken.accessToken}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        if (import.meta.env.DEV) {
          console.error('Token refresh failed:', refreshError);
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;

// API 함수들
export const login = async (data: { email: string; password: string }) => {
  const res = await instance.post<ApiResponse<TokenDto>>('/auth/login', data);
  localStorage.setItem('accessToken', res.data.data.accessToken);
  localStorage.setItem('refreshToken', res.data.data.refreshToken);
  return res.data.data;
};

export const register = async (data: RegisterRequest) => {
  if (import.meta.env.DEV) {
    console.log('API 요청 데이터:', data);
  }
  const response = await instance.post<ApiResponse<TokenDto>>('/auth/signup', data);
  if (import.meta.env.DEV) {
    console.log('API 응답:', response.data);
  }
  return response.data.data;
};

export const reissue = async (refreshToken: string) => {
  const res = await instance.post<ApiResponse<TokenDto>>('/auth/reissue', { refreshToken });
  return res.data.data;
};

export const logout = async (refreshToken: string) => {
  await instance.post<ApiResponse<void>>('/auth/logout', { refreshToken });
};
