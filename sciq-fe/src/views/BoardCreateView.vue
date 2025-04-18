<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postService } from '@/api/postService'

const router = useRouter()
const title = ref('')
const content = ref('')
const scienceDiscipline = ref('PHYSICS')
const isLoading = ref(false)
const titleError = ref('')
const contentError = ref('')

const scienceDisciplines = [
  { value: 'PHYSICS', label: '물리학' },
  { value: 'CHEMISTRY', label: '화학' },
  { value: 'BIOLOGY', label: '생물학' },
  { value: 'MATHEMATICS', label: '수학' },
  { value: 'COMPUTER_SCIENCE', label: '컴퓨터 과학' },
  { value: 'ASTRONOMY', label: '천문학' },
  { value: 'GEOLOGY', label: '지질학' },
  { value: 'ENVIRONMENTAL_SCIENCE', label: '환경 과학' }
]

// 문자열의 바이트 수 계산
const getByteLength = (str: string) => {
  let byteLength = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    if (char <= 0x7F) { // ASCII 문자
      byteLength += 1;
    } else if (char <= 0x7FF) { // 2바이트 문자
      byteLength += 2;
    } else if (char <= 0xFFFF) { // 3바이트 문자 (한글 등)
      byteLength += 3;
    } else { // 4바이트 문자
      byteLength += 4;
    }
  }
  return byteLength;
}

// 제목 입력 시 실시간 검사
const checkTitleLength = () => {
  const titleByteLength = getByteLength(title.value);
  if (titleByteLength > 100) {
    titleError.value = '제목은 100바이트 이하로 입력해주세요.'
  } else if (titleByteLength < 6) {
    titleError.value = '제목은 2자 이상 입력해주세요.'
  } else {
    titleError.value = ''
  }
}

// 본문 내용 입력 시 실시간 검사
const checkContentLength = () => {
  const contentByteLength = getByteLength(content.value);
  if (contentByteLength > 1000) {
    contentError.value = '내용은 1000바이트 이하로 입력해주세요.'
  } else if (contentByteLength < 30) {
    contentError.value = '내용은 10자 이상 입력해주세요.'
  } else {
    contentError.value = ''
  }
}

const validateForm = () => {
  let isValid = true
  
  const titleByteLength = getByteLength(title.value);
  const contentByteLength = getByteLength(content.value);
  
  // 제목 유효성 검사 (100바이트 제한)
  if (titleByteLength < 6) { // 최소 2글자 (한글 기준)
    titleError.value = '제목은 2자 이상 입력해주세요.'
    isValid = false
  } else if (titleByteLength > 100) {
    titleError.value = '제목은 100바이트 이하로 입력해주세요.'
    isValid = false
  } else {
    titleError.value = ''
  }

  // 내용 유효성 검사 (1000바이트 제한)
  if (contentByteLength < 30) { // 최소 10글자 (한글 기준)
    contentError.value = '내용은 10자 이상 입력해주세요.'
    isValid = false
  } else if (contentByteLength > 1000) {
    contentError.value = '내용은 1000바이트 이하로 입력해주세요.'
    isValid = false
  } else {
    contentError.value = ''
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  try {
    await postService.createPost({
      title: title.value,
      content: content.value,
      scienceDiscipline: scienceDiscipline.value
    })
    router.push('/board')
  } catch (error) {
    console.error('게시글 작성 실패:', error)
    alert('게시글 작성에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  if (confirm('작성을 취소하시겠습니까?')) {
    router.push('/board')
  }
}
</script>

<template>
  <div class="board-create">
    <div class="board-header">
      <h1>글쓰기</h1>
      <div class="board-actions">
        <button class="cancel-button" @click="handleCancel">
          <span class="material-icons">close</span>
          취소
        </button>
        <button class="submit-button" @click="handleSubmit" :disabled="isLoading">
          <span class="material-icons">check</span>
          저장
        </button>
      </div>
    </div>

    <div class="form-group">
      <select v-model="scienceDiscipline" class="discipline-select">
        <option v-for="discipline in scienceDisciplines" :key="discipline.value" :value="discipline.value">
          {{ discipline.label }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <input 
        type="text" 
        v-model="title" 
        @input="checkTitleLength"
        placeholder="제목을 입력하세요"
        class="title-input"
        :class="{ 'error': titleError }"
      />
      <div class="char-count">
        <div class="count-info">
          <span>{{ getByteLength(title) }}/100 바이트</span>
          <span v-if="titleError" class="error-message">{{ titleError }}</span>
        </div>
      </div>
    </div>

    <div class="form-group">
      <textarea 
        v-model="content" 
        @input="checkContentLength"
        placeholder="내용을 입력하세요"
        class="content-input"
        :class="{ 'error': contentError }"
      ></textarea>
      <div class="char-count">
        <div class="count-info">
          <span>{{ getByteLength(content) }}/1000 바이트</span>
          <span v-if="contentError" class="error-message">{{ contentError }}</span>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <span class="material-icons">refresh</span>
      <span>저장중...</span>
    </div>
  </div>
</template>

<style scoped>
.board-create {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.board-header h1 {
  font-size: 1.5rem;
  color: #333;
}

.board-actions {
  display: flex;
  gap: 1rem;
}

.cancel-button,
.submit-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background: #f5f5f5;
  color: #666;
}

.submit-button {
  background: #1a73e8;
  color: white;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-group {
  position: relative;
  margin-bottom: 2rem;
}

.discipline-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.title-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.content-input {
  width: 100%;
  min-height: 300px;
  max-height: 600px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  overflow-y: auto;
  line-height: 1.5;
  transition: border-color 0.2s ease;
}

.title-input.error,
.content-input.error {
  border-color: #dc3545;
}

.title-input.error {
  animation: shake 0.5s;
}

.char-count {
  position: sticky;
  bottom: 0;
  right: 0;
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
}

.count-info {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: #dc3545;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #666;
}

.loading-overlay .material-icons {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style> 