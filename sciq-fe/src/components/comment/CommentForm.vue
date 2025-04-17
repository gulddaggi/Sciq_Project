<script setup lang="ts">
import { ref } from 'vue'

const content = ref('')
const emit = defineEmits(['submit'])

const handleSubmit = () => {
  if (!content.value.trim()) {
    alert('댓글 내용을 입력해주세요.')
    return
  }

  emit('submit', {
    content: content.value,
    createdAt: new Date().toISOString()
  })

  // 폼 초기화
  content.value = ''
}
</script>

<template>
  <div class="comment-form">
    <textarea
      v-model="content"
      placeholder="댓글을 입력하세요"
      class="comment-input"
    ></textarea>
    <div class="form-footer">
      <button @click="handleSubmit" class="submit-button">
        댓글 작성
      </button>
    </div>
  </div>
</template>

<style scoped>
.comment-form {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.comment-input {
  width: 100%;
  min-height: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  padding: 0.5rem 1.5rem;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #1557b0;
}
</style> 