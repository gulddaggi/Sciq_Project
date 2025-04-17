<template>
  <div class="signup-container">
    <h1 class="title">회원가입</h1>

    <form @submit.prevent="handleSubmit" class="signup-form">
      <div class="form-group">
        <label>이메일</label>
        <div class="input-wrapper">
          <span class="material-icons">mail</span>
          <input
              v-model="form.email"
              type="email"
              placeholder="Enter Your Email"
              required
          />
        </div>
        <p class="hint-text">1-50자까지 입력 가능</p>
        <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label>닉네임</label>
        <div class="input-wrapper">
          <span class="material-icons">badge</span>
          <input
              v-model="form.nickName"
              type="text"
              placeholder="Enter Your Nickname"
              required
          />
        </div>
        <p class="hint-text">1-20자까지 입력 가능</p>
        <p v-if="errors.nickName" class="error-text">{{ errors.nickName }}</p>
      </div>

      <div class="form-group">
        <label>비밀번호</label>
        <div class="input-wrapper">
          <span class="material-icons">lock</span>
          <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create Your Password"
              required
          />
          <span
              class="material-icons toggle-password"
              @click="showPassword = !showPassword"
          >
            {{ showPassword ? 'visibility_off' : 'visibility' }}
          </span>
        </div>
        <p class="hint-text">8-20자까지 입력 가능</p>
        <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
      </div>

      <div class="form-group">
        <label>선호 과목</label>
        <div class="input-wrapper">
          <span class="material-icons">science</span>
          <select v-model="form.prefer" class="select-input" required>
            <option v-for="option in scienceDisciplineOptions" 
                    :key="option.value" 
                    :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <p v-if="errors.prefer" class="error-text">{{ errors.prefer }}</p>
      </div>

      <div class="form-group">
        <label>역할</label>
        <div class="input-wrapper">
          <span class="material-icons">person_outline</span>
          <select v-model="form.userRole" class="select-input" required>
            <option v-for="option in roleOptions" 
                    :key="option.value" 
                    :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <p v-if="errors.userRole" class="error-text">{{ errors.userRole }}</p>
      </div>

      <div class="form-group">
        <label>학교명</label>
        <div class="input-wrapper">
          <span class="material-icons">school</span>
          <input
              v-model="form.schoolName"
              type="text"
              placeholder="Enter Your School Name"
              required
          />
        </div>
        <p class="hint-text">1-50자까지 입력 가능</p>
        <p v-if="errors.schoolName" class="error-text">{{ errors.schoolName }}</p>
      </div>

      <div class="form-group">
        <label>이름</label>
        <div class="input-wrapper">
          <span class="material-icons">person</span>
          <input
              v-model="form.userName"
              type="text"
              placeholder="Enter Your Name"
              required
          />
        </div>
        <p class="hint-text">1-20자까지 입력 가능</p>
        <p v-if="errors.userName" class="error-text">{{ errors.userName }}</p>
      </div>

      <button type="submit" class="submit-button">가입하기</button>

      <p class="login-link">
        이미 계정이 있으신가요? <router-link to="/login">로그인</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { ScienceDisciplineType, UserRole, RegisterRequest } from '../api/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<RegisterRequest>({
  email: '',
  password: '',
  userName: '',
  nickName: '',
  schoolName: '',
  prefer: 'NONE',
  userRole: 'ROLE_STUDENT'
})

const errors = reactive({
  email: '',
  password: '',
  userName: '',
  nickName: '',
  schoolName: '',
  prefer: '',
  userRole: ''
})

const showPassword = ref(false)

const scienceDisciplineOptions = [
  { value: 'PHYSICS', label: '물리학' },
  { value: 'CHEMISTRY', label: '화학' },
  { value: 'BIOLOGY', label: '생물학' },
  { value: 'EARTH_SCIENCE', label: '지구과학' },
  { value: 'ASTRONOMY', label: '천문학' },
  { value: 'NONE', label: '선호사항 없음' }
]

const roleOptions = [
  { value: 'ROLE_STUDENT', label: '학생' },
  { value: 'ROLE_ADVISOR', label: '어드바이저' }
]

const validateForm = () => {
  let isValid = true

  if (!form.email || form.email.length > 50) {
    errors.email = '이메일은 1-50자 사이여야 합니다.'
    isValid = false
  }

  if (!form.password || form.password.length < 8 || form.password.length > 20) {
    errors.password = '비밀번호는 8-20자 사이여야 합니다.'
    isValid = false
  }

  if (!form.userName || form.userName.length > 20) {
    errors.userName = '이름은 1-20자 사이여야 합니다.'
    isValid = false
  }

  if (!form.nickName || form.nickName.length > 20) {
    errors.nickName = '닉네임은 1-20자 사이여야 합니다.'
    isValid = false
  }

  if (!form.schoolName || form.schoolName.length > 50) {
    errors.schoolName = '학교명은 1-50자 사이여야 합니다.'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  console.log('회원가입 폼 제출 시작');
  if (!validateForm()) {
    console.log('폼 검증 실패');
    return;
  }

  try {
    console.log('회원가입 요청 데이터:', form);
    const response = await authStore.register(form)
    console.log('회원가입 성공, 응답:', response);
    
    // 토큰 저장
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    localStorage.setItem('tokenExpiresIn', response.accessTokenExpiresIn.toString())
    console.log('로컬 스토리지에 저장된 토큰:', {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      expiresIn: localStorage.getItem('tokenExpiresIn')
    });
    
    alert('회원가입이 완료되었습니다.')
    router.push('/login')
  } catch (error: any) {
    console.error('회원가입 실패:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else if (error.message) {
      alert(error.message)
    } else {
      alert('회원가입 중 오류가 발생했습니다.')
    }
  }
}
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
}

.signup-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.input-wrapper .material-icons {
  padding: 0 12px;
  color: #666;
}

.input-wrapper input {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  font-size: 14px;
}

.input-wrapper input:focus {
  outline: none;
}

.toggle-password {
  cursor: pointer;
  padding-right: 12px;
}

.hint-text {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}

.error-text {
  margin-top: 4px;
  font-size: 12px;
  color: #ff4444;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #0056b3;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.select-input {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.select-input:focus {
  outline: none;
}
</style> 