<template>
  <div class="profile">
    <h1>프로필 수정</h1>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">이메일</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          disabled
        />
        <p class="hint">이메일은 수정할 수 없습니다.</p>
      </div>
      <div class="form-group">
        <label for="userName">이름</label>
        <input
          id="userName"
          v-model="form.userName"
          type="text"
          required
        />
      </div>
      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input
          id="nickname"
          v-model="form.nickName"
          type="text"
          required
        />
      </div>
      <div class="form-group">
        <label for="schoolName">학교</label>
        <input
          id="schoolName"
          v-model="form.schoolName"
          type="text"
          placeholder="학교 이름을 입력하세요"
        />
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '저장 중...' : '저장' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from '@/api/axios'
import type { User } from '@/types/user'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref('')
const user = ref<User | null>(null)

const form = ref({
  email: '',
  userName: '',
  nickName: '',
  schoolName: ''
})

onMounted(async () => {
  try {
    const userInfo = await authStore.getCurrentUser()
    user.value = userInfo
    if (userInfo) {
      form.value = {
        email: userInfo.email || '',
        userName: userInfo.userName || '',
        nickName: userInfo.nickName || '',
        schoolName: userInfo.schoolName || ''
      }
    }
  } catch (e) {
    console.error('사용자 정보 로드 실패:', e)
    error.value = '사용자 정보를 불러오는데 실패했습니다.'
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const updateData = {
      userName: form.value.userName,
      nickName: form.value.nickName,
      schoolName: form.value.schoolName
    }

    const userId = user.value?.id
    if (!userId) {
      throw new Error('사용자 ID를 찾을 수 없습니다.')
    }

    const response = await axios.put(`/v1/users/${userId}`, updateData)
    if (response.data.success) {
      await authStore.getCurrentUser() // 업데이트된 사용자 정보 다시 불러오기
      router.push('/')
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 400) {
        error.value = '입력한 정보가 올바르지 않습니다.'
      } else {
        error.value = '프로필 수정에 실패했습니다. 다시 시도해주세요.'
      }
    } else {
      error.value = '프로필 수정에 실패했습니다. 다시 시도해주세요.'
    }
    console.error('프로필 수정 실패:', e)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.profile {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
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

input {
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

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.hint {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}

button[type="submit"] {
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

button[type="submit"]:hover {
  background-color: #1565c0;
}

button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 