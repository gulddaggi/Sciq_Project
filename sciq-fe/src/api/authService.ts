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

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
  nickName: string;
  schoolName: string;
  gender: Gender;
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
      
      let accessToken = null;
      
      if (response.data?.response?.accessToken) {
        accessToken = response.data.response.accessToken;
      } else if (response.data?.accessToken) {
        accessToken = response.data.accessToken;
      }
      
      console.log('추출된 토큰:', accessToken);
      
      if (accessToken) {
        localStorage.setItem('token', accessToken);
      } else {
        console.error('로그인 응답에서 토큰을 찾을 수 없습니다:', response.data);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('로그인 실패:', error.message);
      
      if (error.response) {
        console.error('에러 상태:', error.response.status);
        console.error('에러 데이터:', error.response.data);
      }
      
      throw error;
    }
  },

  async register(data: RegisterRequest) {
    try {
      console.log('회원가입 요청 데이터:', data);
      
      // 회원가입 요청 전송
      const response = await axios.post<TokenResponse>('/auth/signup', data);
      console.log('회원가입 응답:', response.data);

      // 응답 데이터 구조에 따라 토큰 추출 로직 개선
      // 응답 구조 1: { response: { accessToken: string } }
      // 응답 구조 2: { accessToken: string }
      let accessToken = null;
      
      if (response.data?.response?.accessToken) {
        // 중첩 구조인 경우
        accessToken = response.data.response.accessToken;
      } else if (response.data?.accessToken) {
        // 단일 구조인 경우
        accessToken = response.data.accessToken;
      }
      
      console.log('추출된 토큰:', accessToken);
      
      if (accessToken) {
        localStorage.setItem('token', accessToken);
      } else {
        console.error('응답 데이터에서 accessToken을 찾을 수 없습니다:', response.data);
      }

      return response.data;
    } catch (error: any) {
      console.error('회원가입 실패:', error.message);
      
      // 서버 응답이 있는 경우 자세한 오류 정보 로깅
      if (error.response) {
        console.error('에러 상태:', error.response.status);
        console.error('에러 데이터:', error.response.data);
      } else if (error.request) {
        console.error('서버 응답 없음:', error.request);
      }
      
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