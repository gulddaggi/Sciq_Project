<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const content = ref('')
const selectedCategory = ref('일반')

const emit = defineEmits(['submit'])

const handleSubmit = () => {
  if (!title.value.trim() || !content.value.trim()) {
    alert('제목과 내용을 모두 입력해주세요.')
    return
  }

  emit('submit', {
    title: title.value,
    content: content.value,
    category: selectedCategory.value,
    createdAt: new Date().toISOString()
  })

  // 폼 초기화
  title.value = ''
  content.value = ''
  selectedCategory.value = '일반'
}
</script>

<template>
  <div class="post-form">
    <div class="form-header">
      <select v-model="selectedCategory" class="category-select">
        <option value="일반">일반</option>
        <option value="질문">질문</option>
        <option value="토론">토론</option>
      </select>
      <input
        v-model="title"
        type="text"
        placeholder="제목을 입력하세요"
        class="title-input"
      />
    </div>

    <textarea
      v-model="content"
      placeholder="내용을 입력하세요"
      class="content-input"
    ></textarea>

    <div class="form-footer">
      <button @click="handleSubmit" class="submit-button">
        글쓰기
      </button>
    </div>
  </div>
</template>

<style scoped>
.post-form {
  background: white;
  border-radius: 8px;
  padding: 1rem;
}

.form-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 100px;
}

.title-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.content-input {
  width: 100%;
  min-height: 200px;
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
  padding: 0.5rem 2rem;
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