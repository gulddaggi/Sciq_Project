<template>
  <div class="home-container">
    <section class="popular-questions">
      <div class="section-header">
        <h2>인기 게시글</h2>
        <router-link to="/questions" class="view-all">
          더보기
          <span class="material-icons">chevron_right</span>
        </router-link>
      </div>
      
      <div class="questions-grid" v-if="popularQuestions.length > 0">
        <QuestionCard
          v-for="question in popularQuestions"
          :key="question.id"
          :question="question"
        />
      </div>
      <div v-else class="empty-state">
        <span class="material-icons">article</span>
        <p>아직 게시글이 없습니다</p>
      </div>
    </section>

    <section class="recent-questions">
      <div class="section-header">
        <h2>최신 게시글</h2>
        <router-link to="/questions" class="view-all">
          더보기
          <span class="material-icons">chevron_right</span>
        </router-link>
      </div>
      
      <div class="questions-grid" v-if="recentQuestions.length > 0">
        <QuestionCard
          v-for="question in recentQuestions"
          :key="question.id"
          :question="question"
        />
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
import QuestionCard from '@/components/QuestionCard.vue'
import { questionService } from '@/api/questionService'
import type { Question } from '@/api/questionService'

const popularQuestions = ref<Question[]>([])
const recentQuestions = ref<Question[]>([])

const fetchQuestions = async () => {
  try {
    // 인기 게시글 (추천수 기준)
    const popularResponse = await questionService.getPopularQuestions()
    popularQuestions.value = popularResponse.questions

    // 최신 게시글
    const recentResponse = await questionService.getRecentQuestions()
    recentQuestions.value = recentResponse.questions
  } catch (error) {
    console.error('게시글 로딩 실패:', error)
  }
}

onMounted(() => {
  fetchQuestions()
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

section {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.view-all {
  display: flex;
  align-items: center;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.view-all:hover {
  color: #333;
}

.view-all .material-icons {
  font-size: 18px;
  margin-left: 4px;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  background: #f8f9fa;
  border-radius: 16px;
  color: #666;
}

.empty-state .material-icons {
  font-size: 48px;
  margin-bottom: 16px;
  color: #999;
}

.empty-state p {
  font-size: 16px;
}

@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }

  .questions-grid {
    grid-template-columns: 1fr;
  }

  .section-header h2 {
    font-size: 20px;
  }
}
</style> 