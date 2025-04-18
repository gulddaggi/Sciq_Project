import { defineStore } from 'pinia'
import { ref } from 'vue'
import { register as apiRegister, login as apiLogin, type RegisterRequest, type TokenDto, type LoginRequest } from '../api/auth'
import router from '../router'
import axios from '../api/axios'

export interface User {
  id: number
  email: string
  userName: string
  nickName: string
  schoolName: string
  prefer: string
  points: number
  level: number
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('accessToken'))
  const isAuthenticated = ref(!!localStorage.getItem('accessToken'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 앱 시작 시 인증 상태 초기화
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
      getCurrentUser()
    }
  }

  const setToken = (tokenData: TokenDto) => {
    console.log('setToken 호출, 토큰 데이터:', tokenData);
    token.value = tokenData.accessToken
    isAuthenticated.value = true
    localStorage.setItem('accessToken', tokenData.accessToken)
    localStorage.setItem('refreshToken', tokenData.refreshToken)
    localStorage.setItem('tokenExpiresIn', tokenData.accessTokenExpiresIn.toString())
    console.log('로컬 스토리지에 저장된 토큰:', {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      expiresIn: localStorage.getItem('tokenExpiresIn')
    });
  }

  const setError = (message: string) => {
    error.value = message
    setTimeout(() => {
      error.value = null
    }, 3000)
  }

  const getCurrentUser = async () => {
    try {
      // 로그인한 사용자의 ID를 가져오기 위해 JWT 토큰을 디코드
      const token = localStorage.getItem('accessToken')
      if (!token) throw new Error('No token found')
      
      // JWT 토큰에서 user id 추출 (payload의 두 번째 부분)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload.id
      
      const response = await axios.get(`/v1/users/${userId}`)
      if (response.data.success) {
        user.value = response.data.data
        return user.value
      } else {
        throw new Error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
      throw error
    }
  }

  const login = async (credentials: LoginRequest) => {
    console.log('store login 시작, 로그인 데이터:', credentials);
    isLoading.value = true
    error.value = null
    try {
      const tokenData = await apiLogin(credentials)
      console.log('API에서 받은 토큰 데이터:', tokenData);
      setToken(tokenData)
      await getCurrentUser()
      return tokenData
    } catch (error) {
      console.error('로그인 에러:', error);
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterRequest) => {
    console.log('store register 시작, 사용자 데이터:', userData);
    isLoading.value = true
    error.value = null
    try {
      const tokenData = await apiRegister(userData)
      console.log('API에서 받은 토큰 데이터:', tokenData);
      setToken(tokenData)
      await getCurrentUser()
      return tokenData
    } catch (error) {
      console.error('회원가입 에러:', error);
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiresIn')
    router.push('/login')
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    initializeAuth,
    getCurrentUser
  }
}) 