<template>
  <div class="home-container">
    <section class="popular-questions">
      <div class="section-header">
        <h2>인기 게시글</h2>
        <router-link :to="{ path: '/board', query: { sort: 'recommend' }}" class="view-all">
          더보기
          <span class="material-icons">chevron_right</span>
        </router-link>
      </div>
      
      <div class="post-list" v-if="popularQuestions.length > 0">
        <div v-for="question in popularQuestions" :key="question.id" class="post-item" @click="goToDetail(question.id)">
          <div class="post-title">{{ question.title }}</div>
          <div class="post-meta">
            <span class="author">{{ question.user?.nickName || '익명' }}</span>
            <span class="date">{{ formatDate(question.createdAt) }}</span>
            <span class="discipline">{{ formatDiscipline(question.scienceDiscipline) }}</span>
            <span class="recommend">
              <span class="material-icons">favorite</span>
              {{ question.recommendCnt }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <span class="material-icons">article</span>
        <p>아직 게시글이 없습니다</p>
      </div>
    </section>

    <section class="recent-questions">
      <div class="section-header">
        <h2>최신 게시글</h2>
        <router-link :to="{ path: '/board', query: { sort: 'latest' }}" class="view-all">
          더보기
          <span class="material-icons">chevron_right</span>
        </router-link>
      </div>
      
      <div class="post-list" v-if="recentQuestions.length > 0">
        <div v-for="question in recentQuestions" :key="question.id" class="post-item" @click="goToDetail(question.id)">
          <div class="post-title">{{ question.title }}</div>
          <div class="post-meta">
            <span class="author">{{ question.user?.nickName || '익명' }}</span>
            <span class="date">{{ formatDate(question.createdAt) }}</span>
            <span class="discipline">{{ formatDiscipline(question.scienceDiscipline) }}</span>
            <span class="recommend">
              <span class="material-icons">favorite</span>
              {{ question.recommendCnt }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <span class="material-icons">article</span>
        <p>아직 게시글이 없습니다</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { questionService } from '@/api/questionService'
import type { Question } from '@/api/questionService'
import { ScienceDisciplineType } from '@/types/board'

const router = useRouter()
const popularQuestions = ref<Question[]>([])
const recentQuestions = ref<Question[]>([])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDiscipline = (discipline: ScienceDisciplineType) => {
  const disciplineMap = {
    [ScienceDisciplineType.PHYSICS]: '물리학',
    [ScienceDisciplineType.CHEMISTRY]: '화학',
    [ScienceDisciplineType.BIOLOGY]: '생물학',
    [ScienceDisciplineType.EARTH_SCIENCE]: '지구과학',
    [ScienceDisciplineType.ASTRONOMY]: '천문학'
  }
  return disciplineMap[discipline] || discipline
}

const goToDetail = (id: number) => {
  router.push(`/board/${id}`)
}

const fetchQuestions = async () => {
  try {
    // 전체 게시글을 한 번만 호출
    const response = await questionService.getAllQuestions()
    console.log('전체 게시글 응답:', response)
    const allQuestions = response.data || []

    // 인기 게시글 (추천수 기준으로 정렬)
    popularQuestions.value = [...allQuestions]
      .sort((a, b) => b.recommendCnt - a.recommendCnt)
      .slice(0, 3)

    // 최신 게시글 (작성일 기준으로 정렬)
    recentQuestions.value = [...allQuestions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
  } catch (error) {
    console.error('게시글 로딩 실패:', error)
    popularQuestions.value = []
    recentQuestions.value = []
  }
}

onMounted(() => {
  fetchQuestions()
})
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.view-all {
  display: flex;
  align-items: center;
  color: #666;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.view-all:hover {
  color: #333;
}

.view-all .material-icons {
  font-size: 18px;
  margin-left: 4px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.post-item:hover {
  transform: translateY(-2px);
}

.post-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
  color: #333;
}

.post-meta {
  display: flex;
  gap: 0.75rem;
  color: #666;
  font-size: 0.85rem;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.post-meta .material-icons {
  font-size: 16px;
}

.discipline {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.recommend {
  color: #ff4444;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.empty-state .material-icons {
  font-size: 24px;
  margin-bottom: 0.5rem;
  color: #999;
}

.empty-state p {
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .section-header h2 {
    font-size: 1.125rem;
  }
}
</style> 