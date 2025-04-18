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
  baseURL: 'http://api.sciq.co.kr/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
});

// Request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Adding auth header:', config.headers['Authorization']);
    }
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      baseURL: config.baseURL
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
instance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('Response error:', error.response || error);
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          console.log('Attempting token refresh');
          const newToken = await reissue(refreshToken);
          localStorage.setItem('accessToken', newToken.accessToken);
          localStorage.setItem('refreshToken', newToken.refreshToken);
          
          originalRequest.headers['Authorization'] = `Bearer ${newToken.accessToken}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
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
