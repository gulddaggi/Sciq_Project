<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { postService } from '@/api/postService'

interface Post {
  id: number
  title: string
  content: string
  scienceDiscipline: string
}

const router = useRouter()
const route = useRoute()
const post = ref<Post | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)

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

const fetchPost = async () => {
  isLoading.value = true
  try {
    const response = await postService.getPost(Number(route.params.id))
    post.value = response.data
  } catch (error) {
    console.error('게시글 조회 실패:', error)
    alert('게시글을 불러오는데 실패했습니다.')
    router.push('/board')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!post.value?.title.trim() || !post.value?.content.trim()) {
    alert('제목과 내용을 모두 입력해주세요.')
    return
  }

  isSaving.value = true
  try {
    await postService.updatePost(Number(route.params.id), {
      title: post.value.title,
      content: post.value.content,
      scienceDiscipline: post.value.scienceDiscipline
    })
    router.push(`/board/${route.params.id}`)
  } catch (error) {
    console.error('게시글 수정 실패:', error)
    alert('게시글 수정에 실패했습니다.')
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  if (confirm('수정을 취소하시겠습니까?')) {
    router.push(`/board/${route.params.id}`)
  }
}

onMounted(() => {
  fetchPost()
})
</script>

<template>
  <div class="board-edit">
    <div v-if="isLoading" class="loading">
      <span class="material-icons">refresh</span>
      <span>로딩중...</span>
    </div>

    <div v-else-if="post" class="edit-form">
      <div class="board-header">
        <h1>글 수정</h1>
        <div class="board-actions">
          <button class="cancel-button" @click="handleCancel">
            <span class="material-icons">close</span>
            취소
          </button>
          <button class="submit-button" @click="handleSubmit" :disabled="isSaving">
            <span class="material-icons">check</span>
            저장
          </button>
        </div>
      </div>

      <div class="form-group">
        <select v-model="post.scienceDiscipline" class="discipline-select">
          <option v-for="discipline in scienceDisciplines" :key="discipline.value" :value="discipline.value">
            {{ discipline.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <input 
          type="text" 
          v-model="post.title" 
          placeholder="제목을 입력하세요"
          class="title-input"
        />
      </div>

      <div class="form-group">
        <textarea 
          v-model="post.content" 
          placeholder="내용을 입력하세요"
          class="content-input"
        ></textarea>
      </div>

      <div v-if="isSaving" class="loading-overlay">
        <span class="material-icons">refresh</span>
        <span>저장중...</span>
      </div>
    </div>

    <div v-else class="error">
      <span class="material-icons">error</span>
      <span>게시글을 찾을 수 없습니다.</span>
    </div>
  </div>
</template>

<style scoped>
.board-edit {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
}

.loading .material-icons {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.edit-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  margin-bottom: 1rem;
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
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.content-input {
  width: 100%;
  height: 400px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
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
</style> 