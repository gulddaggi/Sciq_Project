<template>
  <div class="write-container">
    <div class="write-header">
      <h2>질문 작성</h2>
      <div class="button-group">
        <button class="cancel-button" @click="goBack">
          <span class="material-icons">close</span>
          취소
        </button>
        <button class="submit-button" @click="handleSubmit">
          <span class="material-icons">check</span>
          등록
        </button>
      </div>
    </div>

    <div class="write-form">
      <div class="form-group">
        <input
          v-model="form.title"
          type="text"
          class="title-input"
          placeholder="제목을 입력하세요"
          maxlength="100"
        />
        <span class="char-count">{{ form.title.length }}/100</span>
      </div>

      <div class="form-group">
        <textarea
          v-model="form.content"
          class="content-input"
          placeholder="내용을 입력하세요"
          rows="20"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="discipline-label">분야 선택</label>
        <select v-model="form.scienceDiscipline" class="discipline-select">
          <option value="">분야를 선택하세요</option>
          <option v-for="discipline in disciplines" :key="discipline" :value="discipline">
            {{ formatDiscipline(discipline) }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <div class="tag-input-container">
          <div class="tag-list">
            <span v-for="(tag, index) in form.tags" :key="index" class="tag">
              {{ tag }}
              <span class="material-icons remove-tag" @click="removeTag(index)">close</span>
            </span>
          </div>
          <input
            v-model="tagInput"
            type="text"
            class="tag-input"
            placeholder="태그를 입력하고 Enter를 누르세요"
            @keyup.enter="addTag"
          />
        </div>
        <p class="hint-text">최대 5개의 태그를 추가할 수 있습니다</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import type { QuestionCreateRequest, ApiResponse, Question } from '@/types/board'
import { ScienceDisciplineType } from '@/types/board'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<QuestionCreateRequest>({
  title: '',
  content: '',
  scienceDiscipline: '' as ScienceDisciplineType
})

const tagInput = ref('')

const disciplines = [
  ScienceDisciplineType.PHYSICS,
  ScienceDisciplineType.CHEMISTRY,
  ScienceDisciplineType.BIOLOGY,
  ScienceDisciplineType.EARTH_SCIENCE,
  ScienceDisciplineType.ASTRONOMY
]

const formatDiscipline = (discipline: ScienceDisciplineType) => {
  const disciplineMap = {
    [ScienceDisciplineType.PHYSICS]: '물리학',
    [ScienceDisciplineType.CHEMISTRY]: '화학',
    [ScienceDisciplineType.BIOLOGY]: '생물학',
    [ScienceDisciplineType.EARTH_SCIENCE]: '지구과학',
    [ScienceDisciplineType.ASTRONOMY]: '천문학'
  }
  return disciplineMap[discipline]
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && form.tags.length < 5 && !form.tags.includes(tag)) {
    form.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  form.tags.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.title.trim()) {
    alert('제목을 입력해주세요')
    return
  }

  if (!form.content.trim()) {
    alert('내용을 입력해주세요')
    return
  }

  if (!form.scienceDiscipline) {
    alert('분야를 선택해주세요')
    return
  }

  try {
    const response = await axios.post<ApiResponse<Question>>('/api/questions', form)
    const { success, response: data } = response.data
    if (success) {
      router.push(`/board/${data.id}`)
    }
  } catch (error: any) {
    console.error('질문 작성 실패:', error)
    alert(error.response?.data?.message || '질문 작성에 실패했습니다.')
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.write-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.write-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.write-header h2 {
  font-size: 24px;
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 12px;
}

.button-group button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #666;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.submit-button {
  background-color: #007bff;
  color: white;
}

.submit-button:hover {
  background-color: #0056b3;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.title-input {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 4px;
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 12px;
  color: #666;
}

.content-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  min-height: 400px;
}

.tag-input-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
}

.remove-tag {
  font-size: 16px;
  cursor: pointer;
  color: #666;
}

.remove-tag:hover {
  color: #ff4444;
}

.tag-input {
  width: 100%;
  padding: 8px;
  border: none;
  font-size: 14px;
}

.tag-input:focus {
  outline: none;
}

.hint-text {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #007bff;
}

.discipline-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.discipline-select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.discipline-select:focus {
  outline: none;
  border-color: #007bff;
}
</style> 