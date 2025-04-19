<template>
  <div class="question-detail">
    <div v-if="question" class="question-content">
      <h1>{{ question.title }}</h1>
      <div class="metadata">
        <span class="author">{{ question.userName }}</span>
        <span class="date">{{ formatDate(question.createdAt) }}</span>
      </div>
      <div class="content">{{ question.content }}</div>
      
      <!-- 수정/삭제 버튼 -->
      <div v-if="isQuestionOwner" class="actions">
        <button @click="editQuestion" class="edit-button">수정</button>
        <button @click="deleteQuestion" class="delete-button">삭제</button>
      </div>
    </div>

    <!-- 댓글 섹션 -->
    <CommentSection v-if="question" :questionId="question.id" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import CommentSection from '../components/CommentSection.vue';

interface Question {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  userName: string;
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const question = ref<Question | null>(null);

// 게시글 데이터 불러오기
const fetchQuestion = async () => {
  try {
    const response = await fetch(`http://api.sciq.co.kr/api/v1/questions/${route.params.id}`);
    const data = await response.json();
    question.value = data.data;
  } catch (error) {
    console.error('게시글 불러오기 실패:', error);
  }
};

// 게시글 작성자 확인
const isQuestionOwner = computed(() => {
  return authStore.user?.id === question.value?.userId;
});

// 게시글 수정
const editQuestion = () => {
  router.push(`/questions/${question.value?.id}/edit`);
};

// 게시글 삭제
const deleteQuestion = async () => {
  if (!confirm('게시글을 삭제하시겠습니까?')) return;
  
  try {
    await fetch(`http://api.sciq.co.kr/api/v1/questions/${question.value?.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    router.push('/questions');
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
  }
};

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchQuestion();
});
</script>

<style scoped>
.question-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.question-content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
}

.metadata {
  margin-bottom: 2rem;
  color: #666;
}

.author {
  font-weight: bold;
  margin-right: 1rem;
}

.content {
  white-space: pre-wrap;
  line-height: 1.6;
}

.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.delete-button {
  background-color: white;
  color: #dc3545;
  border: 1px solid #dc3545;
}
</style> 