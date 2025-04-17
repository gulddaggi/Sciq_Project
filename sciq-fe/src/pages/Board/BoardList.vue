<template>
  <div class="board-container">
    <div class="board-header">
      <h2>질문 목록</h2>
      <button class="write-button" @click="goToWrite">
        <span class="material-icons">edit</span>
        질문하기
      </button>
    </div>

    <div class="sort-options">
      <button 
        class="sort-button"
        :class="{ active: sortBy === 'latest' }"
        @click="changeSortBy('latest')"
      >
        최신순
      </button>
      <button 
        class="sort-button"
        :class="{ active: sortBy === 'recommend' }"
        @click="changeSortBy('recommend')"
      >
        좋아요순
      </button>
    </div>

    <div v-if="loading" class="loading">
      <span class="material-icons spinning">refresh</span>
      로딩 중...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchQuestions" class="retry-button">
        <span class="material-icons">refresh</span>
        다시 시도
      </button>
    </div>

    <div v-else class="post-list">
      <div v-for="question in questions" :key="question.id" class="post-item">
        <div class="post-main" @click="goToDetail(question.id)">
          <h3 class="post-title">{{ question.title }}</h3>
          <p class="post-content">{{ question.content }}</p>
          <div class="post-info">
            <div class="author-info">
              <img :src="question.user.profileImage || '/default-avatar.png'" alt="author" class="author-avatar" />
              <span class="author-name">{{ question.user.nickName }}</span>
            </div>
            <div class="meta-info">
              <span>{{ formatDate(question.createdAt) }}</span>
              <div class="stats">
                <span class="stat">
                  <span class="material-icons">favorite</span>
                  {{ question.recommendCnt }}
                </span>
                <span class="discipline-tag">{{ formatDiscipline(question.scienceDiscipline) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="questions.length === 0 && !loading && !error" class="empty-state">
      아직 작성된 질문이 없습니다.
    </div>

    <div class="board-footer">
      <div class="pagination">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
          class="page-button"
        >
          <span class="material-icons">chevron_left</span>
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)"
          class="page-button"
        >
          <span class="material-icons">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import type { Question, QuestionListResponse, ApiResponse } from '@/types/board'
import { ScienceDisciplineType } from '@/types/board'

const router = useRouter()
const questions = ref<Question[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const sortBy = ref('latest')
const loading = ref(false)
const error = ref<string | null>(null)

const fetchQuestions = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get<ApiResponse<QuestionListResponse>>('/api/questions', {
      params: {
        page: currentPage.value - 1,
        size: 10,
        sort: getSortParameter(sortBy.value)
      }
    })

    const { response: data } = response.data
    questions.value = data.content
    totalPages.value = data.totalPages
  } catch (err: any) {
    console.error('질문 목록 조회 실패:', err)
    error.value = '질문 목록을 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

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

const getSortParameter = (sort: string) => {
  switch (sort) {
    case 'latest':
      return 'createdAt,desc'
    case 'recommend':
      return 'recommendCnt,desc'
    default:
      return 'createdAt,desc'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goToWrite = () => {
  router.push('/board/write')
}

const goToDetail = (id: number) => {
  router.push(`/board/${id}`)
}

const changePage = (page: number) => {
  currentPage.value = page
}

const changeSortBy = (sort: string) => {
  sortBy.value = sort
  currentPage.value = 1
  fetchQuestions()
}

watch([currentPage, sortBy], () => {
  fetchQuestions()
})

onMounted(() => {
  fetchQuestions()
})
</script>

<style scoped>
.board-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.board-header h2 {
  font-size: 24px;
  font-weight: 600;
}

.write-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.write-button:hover {
  background-color: #0056b3;
}

.sort-options {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.sort-button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: white;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-button.active {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.sort-button:hover {
  background-color: #e9ecef;
}

.sort-button.active:hover {
  background-color: #0056b3;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  color: #666;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 40px;
  color: #dc3545;
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 16px auto 0;
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-item {
  padding: 16px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.post-item:hover {
  transform: translateY(-2px);
}

.post-main {
  margin-bottom: 12px;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.post-content {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.author-name {
  font-weight: 500;
}

.meta-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.discipline-tag {
  padding: 4px 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  font-size: 12px;
  color: #495057;
}

.stats {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat .material-icons {
  font-size: 16px;
}

.board-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}
</style> 