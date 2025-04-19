<template>
  <div class="mypage-container">
    <h1>마이페이지</h1>
    
    <div class="card user-info-card">
      <h2>내 정보</h2>
      <div v-if="user" class="user-details">
        <div class="user-profile">
          <div class="profile-icon">
            <span class="material-icons">account_circle</span>
          </div>
          <div class="user-basic-info">
            <h3>{{ user.nickName }}</h3>
            <p class="email">{{ user.email }}</p>
          </div>
        </div>
        
        <div class="user-stats">
          <div class="stat-item">
            <h4>레벨</h4>
            <p class="stat-value">{{ user.level || 1 }}</p>
          </div>
          <div class="stat-item">
            <h4>포인트</h4>
            <p class="stat-value">{{ user.points || 0 }}</p>
          </div>
        </div>

        <button @click="goToProfile" class="primary-button">프로필 수정</button>
      </div>
      <div v-else class="loading">
        사용자 정보를 불러오는 중...
      </div>
    </div>

    <div class="card recommended-posts-card">
      <h2>내가 좋아요 누른 글</h2>
      <div v-if="isLoading" class="loading">
        데이터를 불러오는 중...
      </div>
      <div v-else-if="recommendedQuestions.length === 0" class="empty-state">
        좋아요 누른 글이 없습니다.
      </div>
      <ul v-else class="post-list">
        <li v-for="question in recommendedQuestions" :key="question.id" class="post-item">
          <router-link :to="`/board/${question.id}`" class="post-link">
            <div class="post-title">{{ question.title }}</div>
            <div class="post-info">
              <span class="post-date">{{ formatDate(question.createdAt) }}</span>
              <span class="post-likes">
                <span class="material-icons">thumb_up</span>
                {{ question.recommendCnt }}
              </span>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from '@/api/axios'
import type { User } from '@/stores/auth'

interface Question {
  id: number
  title: string
  recommendCnt: number
  createdAt: string
}

const router = useRouter()
const authStore = useAuthStore()

const user = ref<User | null>(null)
const recommendedQuestions = ref<Question[]>([])
const isLoading = ref(true)

// 사용자 정보와 좋아요 누른 글 목록 가져오기
onMounted(async () => {
  try {
    // 사용자 정보 가져오기
    const userInfo = await authStore.getCurrentUser()
    user.value = userInfo
    
    // 좋아요 누른 글 목록 가져오기
    const response = await axios.get('/v1/mypage/recommended-questions')
    if (response.data.success) {
      recommendedQuestions.value = response.data.data
    }
  } catch (error) {
    console.error('마이페이지 데이터 로드 실패:', error)
  } finally {
    isLoading.value = false
  }
})

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}

// 프로필 수정 페이지로 이동
const goToProfile = () => {
  router.push('/profile')
}
</script>

<style scoped>
.mypage-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

h2 {
  color: #1976d2;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-icon {
  font-size: 2.5rem;
  margin-right: 15px;
}

.profile-icon .material-icons {
  font-size: 3.5rem;
  color: #1976d2;
}

.user-basic-info h3 {
  font-size: 1.3rem;
  margin: 0 0 5px 0;
}

.email {
  color: #666;
  font-size: 0.9rem;
}

.user-stats {
  display: flex;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 15px;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.stat-item:first-child {
  border-right: 1px solid #ddd;
}

.stat-item h4 {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 5px 0;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1976d2;
  margin: 0;
}

.primary-button {
  width: 100%;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #1565c0;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-item {
  border-bottom: 1px solid #eee;
}

.post-item:last-child {
  border-bottom: none;
}

.post-link {
  display: block;
  padding: 15px 0;
  text-decoration: none;
  color: inherit;
}

.post-title {
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

.post-info {
  display: flex;
  font-size: 0.8rem;
  color: #666;
}

.post-date {
  margin-right: 15px;
}

.post-likes {
  display: flex;
  align-items: center;
}

.post-likes .material-icons {
  font-size: 0.9rem;
  margin-right: 3px;
  color: #1976d2;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}
</style> 