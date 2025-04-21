<template>
  <div class="profile-edit">
    <h1>내 정보 수정</h1>
    
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>사용자 정보를 불러오는 중...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <form v-else @submit.prevent="handleSubmit" class="edit-form">
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

      <div class="action-buttons">
        <button type="submit" class="primary-button" :disabled="isSubmitting">
          <span class="material-icons">save</span>
          {{ isSubmitting ? '저장 중...' : '저장' }}
        </button>
        <button type="button" class="secondary-button" @click="goBack">
          <span class="material-icons">cancel</span>
          취소
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore, type User } from '@/stores/auth';
import axios from '@/api/axios';
import { isAxiosError } from 'axios';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref('');
const user = ref<User | null>(null);

const form = ref({
  email: '',
  userName: '',
  nickName: '',
  schoolName: ''
});

const goBack = () => {
  router.push('/profile');
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  error.value = '';

  try {
    const updateData = {
      userName: form.value.userName,
      nickName: form.value.nickName,
      schoolName: form.value.schoolName
    };

    const userId = user.value?.id;
    if (!userId) {
      throw new Error('사용자 ID를 찾을 수 없습니다.');
    }

    const response = await axios.put(`/v1/users/${userId}`, updateData);
    if (response.data.success) {
      await authStore.getCurrentUser(); // 업데이트된 사용자 정보 다시 불러오기
      router.push('/profile/view');
    }
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response?.status === 400) {
        error.value = '입력한 정보가 올바르지 않습니다.';
      } else {
        error.value = '프로필 수정에 실패했습니다. 다시 시도해주세요.';
      }
    } else {
      error.value = '프로필 수정에 실패했습니다. 다시 시도해주세요.';
    }
    console.error('프로필 수정 실패:', e);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const userInfo = await authStore.getCurrentUser();
    user.value = userInfo;
    if (userInfo) {
      form.value = {
        email: userInfo.email || '',
        userName: userInfo.userName || '',
        nickName: userInfo.nickName || '',
        schoolName: userInfo.schoolName || ''
      };
    }
  } catch (e) {
    console.error('사용자 정보 로드 실패:', e);
    error.value = '사용자 정보를 불러오는데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.profile-edit {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.edit-form {
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  border-color: #007bff;
  outline: none;
}

input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.hint {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.primary-button, .secondary-button {
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-button {
  background-color: #007bff;
  color: white;
}

.primary-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.primary-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.secondary-button {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.secondary-button:hover {
  background-color: #e9ecef;
}
</style> 