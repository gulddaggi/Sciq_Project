<template>
  <div class="profile-view">
    <h1>내 정보</h1>
    
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>사용자 정보를 불러오는 중...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else class="profile-content">
      <!-- 사용자 기본 정보 섹션 -->
      <div class="profile-section">
        <h2>기본 정보</h2>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">이메일</span>
            <span class="info-value">{{ user?.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">이름</span>
            <span class="info-value">{{ user?.userName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">닉네임</span>
            <span class="info-value">{{ user?.nickName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">학교</span>
            <span class="info-value">{{ user?.schoolName || '등록된 학교 정보가 없습니다.' }}</span>
          </div>
        </div>
      </div>
      
      <!-- 포인트 및 레벨 정보 섹션 -->
      <div class="profile-section">
        <h2>포인트 및 레벨</h2>
        <div class="info-card stats-card">
          <div class="stats-item">
            <div class="stats-value">{{ user?.points }}</div>
            <div class="stats-label">포인트</div>
          </div>
          <div class="stats-item">
            <div class="stats-value">{{ user?.level }}</div>
            <div class="stats-label">레벨</div>
          </div>
        </div>
      </div>
      
      <!-- 좋아요한 게시글 섹션 -->
      <div class="profile-section">
        <h2>좋아요한 게시글</h2>
        <div v-if="recommendedQuestionsLoading" class="loading-inline">
          <div class="spinner-small"></div>
          <p>게시글을 불러오는 중...</p>
        </div>
        <div v-else-if="recommendedQuestions.length === 0" class="empty-state">
          좋아요한 게시글이 없습니다.
        </div>
        <div v-else class="question-list">
          <div
            v-for="question in recommendedQuestions"
            :key="question.id"
            class="question-item"
            @click="goToQuestion(question.id)"
          >
            <div class="question-title">{{ question.title }}</div>
            <div class="question-meta">
              <span class="discipline">{{ formatDiscipline(question.scienceDiscipline) }}</span>
              <span class="date">{{ formatDate(question.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="primary-button" @click="goToEditProfile">
          <span class="material-icons">edit</span>
          정보 수정
        </button>
        <button class="secondary-button" @click="goBack">
          <span class="material-icons">arrow_back</span>
          뒤로 가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore, type User } from '@/stores/auth';
import { questionService } from '@/api/questionService';
import type { Question } from '@/types/board';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(true);
const recommendedQuestionsLoading = ref(true);
const error = ref('');
const user = ref<User | null>(null);
const recommendedQuestions = ref<Question[]>([]);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDiscipline = (discipline: string) => {
  const disciplineMap: Record<string, string> = {
    'PHYSICS': '물리학',
    'CHEMISTRY': '화학',
    'BIOLOGY': '생명과학',
    'EARTH_SCIENCE': '지구과학',
    'ASTRONOMY': '천문학'
  };
  return disciplineMap[discipline] || discipline;
};

const goToQuestion = (questionId: number) => {
  router.push(`/board/${questionId}`);
};

const goToEditProfile = () => {
  router.push('/profile/edit');
};

const goBack = () => {
  router.push('/profile');
};

const fetchRecommendedQuestions = async () => {
  recommendedQuestionsLoading.value = true;
  try {
    const questions = await questionService.getRecommendedQuestionsByUser();
    recommendedQuestions.value = questions;
  } catch (error) {
    console.error('좋아요한 게시글 조회 실패:', error);
  } finally {
    recommendedQuestionsLoading.value = false;
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const userInfo = await authStore.getCurrentUser();
    user.value = userInfo;
    await fetchRecommendedQuestions();
  } catch (e) {
    console.error('사용자 정보 로드 실패:', e);
    error.value = '사용자 정보를 불러오는데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

h2 {
  color: #444;
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.profile-section {
  margin-bottom: 30px;
}

.info-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #555;
  flex: 1;
}

.info-value {
  flex: 2;
  color: #333;
}

.stats-card {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stats-item {
  padding: 15px;
}

.stats-value {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.stats-label {
  color: #666;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-item {
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.question-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.question-title {
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
}

.question-meta {
  display: flex;
  gap: 12px;
  color: #666;
  font-size: 0.9rem;
}

.discipline {
  background-color: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  color: #495057;
}

.date {
  color: #6c757d;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.loading-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
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

.spinner-small {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 15px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
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

.primary-button:hover {
  background-color: #0056b3;
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