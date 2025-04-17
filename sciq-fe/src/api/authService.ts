import axios from './axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export enum PreferSubject {
  PHYSICS = 'PHYSICS',
  CHEMISTRY = 'CHEMISTRY',
  BIOLOGY = 'BIOLOGY',
  EARTH_SCIENCE = 'EARTH_SCIENCE',
  DEFAULT = 'DEFAULT'
}

export enum UserRole {
  ROLE_STUDENT = 'ROLE_STUDENT',
  ROLE_ADVISOR = 'ROLE_ADVISOR'
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
  nickName: string;
  schoolName: string;
  prefer: PreferSubject;
  userRole: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  response: T;
  error: null | {
    message: string;
    status: number;
  };
}

export interface TokenDto {
  accessToken: string;
  refreshToken: string;
  grantType: string;
  accessTokenExpiresIn: number;
}

export type TokenResponse = ApiResponse<TokenDto>;

export interface UserInfo {
  email: string;
  userName: string;
  nickName: string;
  schoolName: string;
  prefer: PreferSubject;
  userRole: UserRole;
  createdAt: string;
}

export type UserInfoResponse = ApiResponse<UserInfo>;

export const authService = {
  async login(credentials: LoginRequest) {
    try {
      const response = await axios.post<TokenResponse>('/auth/login', credentials);
      console.log('로그인 응답:', response.data);
      
      const token = response.data.response.accessToken;
      console.log('추출된 토큰:', token);
      
      if (token) {
        localStorage.setItem('token', token);
      }
      
      return response.data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  },

  async register(data: RegisterRequest) {
    try {
      const response = await axios.post<TokenResponse>('/auth/signup', data);
      console.log('회원가입 응답:', response.data);

      if (response.data && response.data.response) {
        const { accessToken } = response.data.response;
        console.log('저장할 토큰:', accessToken);
        if (accessToken) {
          localStorage.setItem('token', accessToken);
        }
      } else {
        console.error('응답 데이터에 accessToken이 없습니다.');
      }

      return response.data;
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post('/auth/logout', {
          accessToken: token
        });
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    }
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    console.log('사용할 토큰:', token);
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get<UserInfoResponse>('/users/info');
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  }
}; 