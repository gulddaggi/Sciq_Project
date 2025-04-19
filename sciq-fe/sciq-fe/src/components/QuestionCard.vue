<template>
  <div class="question-card" @click="navigateToDetail">
    <div class="card-header">
      <div class="header-left">
        <span class="discipline-tag" :class="question.scienceDiscipline.toLowerCase()">
          {{ getDisciplineLabel(question.scienceDiscipline) }}
        </span>
        <span class="status-tag" :class="getStatusClass()">
          {{ getStatusLabel() }}
        </span>
      </div>
      <div class="header-right">
        <span class="recommend-count">
          <span class="material-icons">thumb_up</span>
          {{ question.recommendCnt }}
        </span>
      </div>
    </div>
    
    <h3 class="title">{{ question.title }}</h3>
    <p class="content">{{ truncateContent(question.content) }}</p>
    
    <div class="card-footer">
      <div class="footer-left">
        <div class="user-info">
          <div class="user-avatar">
            <span class="material-icons">person</span>
          </div>
          <div class="user-details">
            <span class="user-name">{{ question.userNickName }}</span>
            <span class="post-date">{{ formatDate(question.createdAt) }}</span>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <div class="stats">
          <span class="stat-item">
            <span class="material-icons">comment</span>
            {{ question.commentCount || 0 }}
          </span>
          <span class="stat-item">
            <span class="material-icons">visibility</span>
            {{ question.viewCount || 0 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Question } from '@/api/questionService'

const props = defineProps<{
  question: Question
}>()

const router = useRouter()

const getDisciplineLabel = (discipline: string) => {
  const labels = {
    'PHYSICS': '물리',
    'CHEMISTRY': '화학',
    'BIOLOGY': '생명과학',
    'EARTH_SCIENCE': '지구과학'
  }
  return labels[discipline as keyof typeof labels] || discipline
}

const getStatusClass = () => {
  // 여기에 질문 상태에 따른 클래스 로직 추가
  return 'status-open'
}

const getStatusLabel = () => {
  // 여기에 질문 상태에 따른 라벨 로직 추가
  return '답변 대기중'
}

const truncateContent = (content: string) => {
  return content.length > 100 ? content.slice(0, 100) + '...' : content
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      if (minutes === 0) {
        return '방금 전'
      }
      return `${minutes}분 전`
    }
    return `${hours}시간 전`
  }
  if (days < 7) {
    return `${days}일 전`
  }
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const navigateToDetail = () => {
  router.push(`/questions/${props.question.id}`)
}
</script>

<style scoped>
.question-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eee;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.discipline-tag, .status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.physics { 
  background-color: #FFE1E1; 
  color: #FF4444;
  border: 1px solid #ffcdd2;
}

.chemistry { 
  background-color: #E1F5FE; 
  color: #0288D1;
  border: 1px solid #b3e5fc;
}

.biology { 
  background-color: #E8F5E9; 
  color: #2E7D32;
  border: 1px solid #c8e6c9;
}

.earth_science { 
  background-color: #FFF3E0; 
  color: #EF6C00;
  border: 1px solid #ffe0b2;
}

.status-open {
  background-color: #E3F2FD;
  color: #1976D2;
  border: 1px solid #BBDEFB;
}

.recommend-count {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 12px;
}

.recommend-count .material-icons {
  font-size: 16px;
  margin-right: 4px;
  color: #FF4081;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  line-height: 1.4;
}

.content {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar .material-icons {
  font-size: 20px;
  color: #666;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.post-date {
  font-size: 12px;
  color: #999;
}

.stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 13px;
}

.stat-item .material-icons {
  font-size: 16px;
}
</style> 