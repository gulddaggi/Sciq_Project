<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-group">
        <label for="email">이메일</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          placeholder="이메일을 입력하세요"
        />
      </div>
      
      <div class="form-group">
        <label for="password">비밀번호</label>
        <div class="password-input">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            required
            placeholder="비밀번호를 입력하세요"
          />
          <button 
            type="button" 
            class="toggle-password"
            @click="showPassword = !showPassword"
          >
            <span class="material-icons">
              {{ showPassword ? 'visibility_off' : 'visibility' }}
            </span>
          </button>
        </div>
      </div>

      <div class="form-options">
        <label class="auto-login">
          <input type="checkbox" v-model="autoLogin">
          <span>자동 로그인</span>
        </label>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" class="login-button" :disabled="isLoading">
        {{ isLoading ? '로그인 중...' : '로그인' }}
      </button>

      <div class="signup-link">
        계정이 없으신가요? <router-link to="/signup">회원가입</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const autoLogin = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    await authStore.login({
      email: email.value,
      password: password.value
    })
    
    router.push('/')
  } catch (err: any) {
    error.value = err.message || '로그인에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.login-form {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #1976d2;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0;
}

.toggle-password:hover {
  color: #333;
}

.form-options {
  margin-bottom: 20px;
}

.auto-login {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.auto-login input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #1565c0;
}

.login-button:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.signup-link a {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style> 