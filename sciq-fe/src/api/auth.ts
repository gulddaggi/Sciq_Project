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
export interface RegisterRequest { // export 추가하여 다른 파일에서 사용 가능하게 함
  email: string;
  password: string;
  userName: string;
  nickName: string;
  schoolName: string;
  prefer: ScienceDisciplineType;
  userRole: UserRole;   // 문자열 리터럴 타입 사용
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

// axios 인스턴스 생성
const instance = axios.create({
  baseURL: 'https://api.sciq.co.kr',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 60000 // 60초
});

// 토큰 갱신 관련 상수
const TOKEN_REFRESH_THRESHOLD = 10 * 60 * 1000; // 만료 10분 전
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Request interceptor
instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    const expiresIn = localStorage.getItem('tokenExpiresIn');
    
    if (token && expiresIn) {
      const expiration = parseInt(expiresIn);
      const now = Date.now();
      
      // 토큰이 만료되기 10분 전이고 현재 갱신 중이 아닐 때
      if (expiration - now < TOKEN_REFRESH_THRESHOLD && !isRefreshing) {
        try {
          isRefreshing = true;
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const newTokens = await reissue(refreshToken);
            localStorage.setItem('accessToken', newTokens.accessToken);
            localStorage.setItem('refreshToken', newTokens.refreshToken);
            localStorage.setItem('tokenExpiresIn', newTokens.accessTokenExpiresIn.toString());
            onTokenRefreshed(newTokens.accessToken);
            config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tokenExpiresIn');
          window.location.href = '/login';
        } finally {
          isRefreshing = false;
        }
      } else if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    if (import.meta.env.DEV) {
      console.log('Request config:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        baseURL: config.baseURL
      });
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  async (error) => {
    if (import.meta.env.DEV) {
      console.error('Response error:', error.response || error);
    }
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          return new Promise((resolve) => {
            addRefreshSubscriber((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            });
          });
        } catch (err) {
          return Promise.reject(err);
        }
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const newTokens = await reissue(refreshToken);
          localStorage.setItem('accessToken', newTokens.accessToken);
          localStorage.setItem('refreshToken', newTokens.refreshToken);
          localStorage.setItem('tokenExpiresIn', newTokens.accessTokenExpiresIn.toString());
          onTokenRefreshed(newTokens.accessToken);
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// axios 인스턴스를 기본 export로 설정
export default instance;

// 함수 export 추가
export const login = async (data: { email: string; password: string }) => {
  const res = await instance.post<ApiResponse<TokenDto>>('/auth/login', data);
  // Store tokens after successful login
  localStorage.setItem('accessToken', res.data.data.accessToken);
  localStorage.setItem('refreshToken', res.data.data.refreshToken);
  localStorage.setItem('tokenExpiresIn', res.data.data.accessTokenExpiresIn.toString());
  return res.data.data;
};

export const register = async (data: RegisterRequest) => {
  console.log('API 요청 데이터:', data);
  const response = await instance.post<ApiResponse<TokenDto>>('/auth/signup', data);
  console.log('API 응답:', response.data);
  return response.data.data;
};

export const reissue = async (refreshToken: string) => {
  const res = await instance.post<ApiResponse<TokenDto>>('/auth/reissue', { refreshToken });
  return res.data.data;
};

export const logout = async (refreshToken: string) => {
  await instance.post<ApiResponse<void>>('/auth/logout', { refreshToken });
};
