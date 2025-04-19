<template>
  <div class="detail-container">
    <div v-if="loading" class="loading">
      <span class="material-icons spinning">refresh</span>
      로딩 중...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchQuestion" class="retry-button">
        <span class="material-icons">refresh</span>
        다시 시도
      </button>
    </div>

    <template v-else-if="question">
      <div class="detail-header">
        <div class="header-top">
          <h1 class="title" v-if="!isEditing">{{ question.title }}</h1>
          <input v-else v-model="editTitle" class="edit-title" placeholder="제목을 입력하세요" maxlength="100" />
          <div class="button-group" v-if="isAuthor">
            <button v-if="!isEditing" class="edit-button" @click="startEdit">
              <span class="material-icons">edit</span>
              수정
            </button>
            <button v-else class="save-button" @click="saveEdit">
              <span class="material-icons">save</span>
              저장
            </button>
            <button v-else class="cancel-button" @click="cancelEdit">
              <span class="material-icons">cancel</span>
              취소
            </button>
          </div>
        </div>
        
        <div class="post-info">
          <div class="author-info">
            <img :src="question.user?.profileImage || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgZmlsbD0iI2RkZGRkZCI+PC9jaXJjbGU+PC9zdmc+'" alt="프로필" class="author-avatar" />
            <span class="author-name">{{ question.user?.nickName || '익명' }}</span>
            <span v-if="question.user?.userRole === 'ROLE_ADVISOR' || question.user?.role === 'ROLE_ADVISOR' || question.user?.role === 'ADVISOR'" class="advisor-badge">어드바이저</span>
          </div>
          <div class="meta-info">
            <span>{{ formatDate(question.createdAt) }}</span>
            <span class="discipline-tag">{{ formatDiscipline(question.scienceDiscipline) }}</span>
          </div>
        </div>

        <div class="tag-list">
          <span v-for="tag in question.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="content" v-if="!isEditing" v-html="question.content"></div>
      <div v-else class="edit-form">
        <textarea
          v-model="editContent"
          class="edit-content"
          placeholder="내용을 입력하세요"
        ></textarea>
        <div class="char-count">{{ editContent.length }}/1000</div>
      </div>

      <div class="action-bar">
        <button 
          class="like-button" 
          style="background-color: white; border: 1px solid #ff4444; border-radius: 20px; padding: 8px 16px; display: flex; align-items: center; gap: 6px;"
          @click="handleLike"
          :disabled="isLikeLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" :fill="question.recommended ? '#ff4444' : 'none'" stroke="#ff4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon" style="transition: transform 0.3s ease;">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span v-if="isLikeLoading" class="material-icons spinning small">refresh</span>
          <span v-else class="count" style="font-weight: 600; color: #ff4444;">{{ question.recommendCnt }}</span>
        </button>
      </div>

      <div class="comments-section">
        <h3>댓글</h3>
        
        <div class="comment-input" v-if="isAuthenticated">
          <textarea
            v-model="commentText"
            placeholder="댓글을 입력하세요"
            rows="3"
          ></textarea>
          <button 
            class="submit-button"
            :disabled="!commentText.trim()"
            @click="submitComment"
          >
            등록
          </button>
        </div>

        <div v-else class="login-prompt">
          <router-link to="/login" class="login-link">로그인</router-link>하고 댓글을 작성해보세요.
        </div>

        <div class="comment-list">
          <div v-for="comment in question.comments" :key="comment.id" class="comment">
            <div class="comment-header">
              <div class="comment-author">
                <img :src="comment.user?.profileImage || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgZmlsbD0iI2RkZGRkZCI+PC9jaXJjbGU+PC9zdmc+'" alt="프로필" class="author-avatar" />
                <span class="author-name">{{ comment.userNickName || '익명' }}</span>
                <span v-if="comment.commentType === 'ADVISE'" class="advisor-badge">어드바이저</span>
              </div>
              <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
            </div>
            
            <template v-if="editingCommentId === comment.id">
              <div class="comment-edit">
                <textarea
                  v-model="editCommentText"
                  rows="3"
                  class="edit-textarea"
                ></textarea>
                <div class="edit-actions">
                  <button class="cancel-button" @click="cancelEditComment">취소</button>
                  <button 
                    class="save-button"
                    :disabled="!editCommentText.trim()"
                    @click="updateComment(comment.id)"
                  >
                    저장
                  </button>
                </div>
              </div>
            </template>
            
            <template v-else>
              <p class="comment-content">{{ comment.content }}</p>
              <div class="comment-actions" v-if="comment.isAuthor">
                <button class="action-button" @click="startEditComment(comment)">수정</button>
                <button class="action-button" @click="deleteComment(comment.id)">삭제</button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { questionService } from '@/api/questionService'
import { authService } from '@/api/authService'
import type { Question, Comment, CommentCreateRequest, CommentUpdateRequest } from '@/types/board'
import { ScienceDisciplineType } from '@/types/board'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const question = ref<Question | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const commentText = ref('')
const editingCommentId = ref<number | null>(null)
const editCommentText = ref('')
const isLikeLoading = ref(false)
const isEditing = ref(false)
const editTitle = ref('')
const editContent = ref('')

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAuthor = computed(() => {
  if (!question.value || !authStore.user) return false;
  return question.value.user.id === authStore.user.id;
})

const fetchQuestion = async () => {
  try {
    loading.value = true;
    const response = await questionService.getQuestion(Number(route.params.id));
    question.value = response.data;
    
    // 추천 상태 초기화 (로그인 상태일 때만 추천 상태 확인)
    if (isAuthenticated.value) {
      await checkRecommendStatus(Number(route.params.id));
    } else {
      question.value.recommended = false;
    }
    
    // 댓글 목록 조회
    const commentsResponse = await questionService.getComments(Number(route.params.id));
    question.value.comments = commentsResponse.data || [];
  } catch (error: any) {
    console.error('게시글 조회 실패:', error);
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      // API 에러 메시지 한국어 변환
      if (errorMessage.includes('Invalid credentials')) {
        error.value = '로그인 정보가 올바르지 않습니다.';
      } else if (errorMessage.includes('Unauthorized')) {
        error.value = '로그인이 필요한 기능입니다.';
      } else if (errorMessage.includes('Forbidden')) {
        error.value = '접근 권한이 없습니다.';
      } else if (errorMessage.includes('Not Found')) {
        error.value = '요청한 게시글이 존재하지 않습니다.';
      } else {
        error.value = errorMessage;
      }
    } else if (error.response?.status === 404) {
      error.value = '요청한 게시글이 존재하지 않습니다.';
    } else if (error.response?.status === 403) {
      error.value = '게시글에 접근할 권한이 없습니다.';
    } else {
      error.value = '게시글을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.';
    }
  } finally {
    loading.value = false;
  }
};

const checkRecommendStatus = async (questionId: number) => {
  try {
    if (!isAuthenticated.value || !question.value) return;
    
    console.log('추천 상태 확인 시작:', questionId);
    const response = await questionService.checkRecommendStatus(questionId);
    
    if (response.success) {
      // 응답 구조에 따라 추천 상태 설정
      // response.data가 { recommended: boolean } 형태인 경우
      if (typeof response.data === 'object' && response.data !== null && 'recommended' in response.data) {
        question.value.recommended = response.data.recommended;
      } 
      // response.data가 직접 boolean인 경우
      else if (typeof response.data === 'boolean') {
        question.value.recommended = response.data;
      }
      console.log('추천 상태 확인 결과:', question.value.recommended);
    } else {
      console.warn('추천 상태 확인 실패:', response.message);
    }
  } catch (error) {
    console.error('추천 상태 확인 실패:', error);
    // 오류가 발생해도 UI에는 영향을 주지 않기 위해 기본값으로 설정
    if (question.value) {
      question.value.recommended = false;
    }
  }
};

const toggleLikeStatus = () => {
  if (!question.value) return;
  
  // 좋아요 상태 토글
  question.value.recommended = !question.value.recommended;
  
  // 좋아요 카운트 업데이트 (1씩 증가/감소)
  if (question.value.recommended) {
    question.value.recommendCnt = (question.value.recommendCnt || 0) + 1;
  } else {
    question.value.recommendCnt = Math.max(0, (question.value.recommendCnt || 0) - 1);
  }
};

const handleLike = async () => {
  if (!isAuthenticated.value) {
    alert('로그인이 필요한 기능입니다. 로그인 후 다시 시도해주세요.');
    router.push('/login');
    return;
  }

  if (!question.value) return;
  const questionId = Number(route.params.id);

  try {
    isLikeLoading.value = true;
    
    // UI 즉시 반응을 위해 먼저 토글
    toggleLikeStatus();
    
    // 추천 API 호출 (결과 무시)
    await questionService.recommendQuestion(questionId);
    
  } catch (error: any) {
    console.error('추천 처리 중 오류 발생:', error);
    
    // 오류 발생 시 다시 토글하여 원래 상태로 되돌림
    toggleLikeStatus();
    
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      if (errorMessage.includes('Invalid credentials')) {
        alert('로그인 정보가 올바르지 않습니다.');
      } else if (errorMessage.includes('Unauthorized')) {
        alert('로그인이 필요한 기능입니다.');
      } else if (errorMessage.includes('Forbidden')) {
        alert('추천 권한이 없습니다.');
      } else if (errorMessage.includes('Not Found')) {
        alert('게시글이 존재하지 않습니다.');
      } else {
        alert(errorMessage);
      }
    } else if (error.response?.status === 400) {
      alert('이미 추천한 게시글입니다.');
    } else if (error.response?.status === 404) {
      alert('게시글이 존재하지 않습니다.');
    } else {
      alert('추천 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  } finally {
    isLikeLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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
  return disciplineMap[discipline]
}

const getTokenData = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.log('No token found in localStorage');
    return null;
  }
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    
    const decoded = JSON.parse(jsonPayload);
    console.log('Decoded JWT token:', decoded); // 디코딩된 전체 토큰 데이터 출력
    return decoded;
  } catch (err) {
    console.error('토큰 디코딩 실패:', err);
    return null;
  }
};

const submitComment = async () => {
  if (!commentText.value.trim() || !question.value) return

  try {
    if (!authStore.user?.role) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    const commentType = authStore.user.role === 'ROLE_ADVISOR' ? 'ADVISE' : 'OPINION';

    const response = await questionService.createComment(question.value.id, {
      content: commentText.value,
      commentType: commentType
    })
    
    if (question.value) {
      question.value.comments = question.value.comments || []
      question.value.comments.unshift(response.data)
      commentText.value = ''
    }
  } catch (error: any) {
    console.error('댓글 작성 실패:', error)
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      if (errorMessage.includes('Invalid credentials')) {
        alert('로그인 정보가 올바르지 않습니다.');
      } else if (errorMessage.includes('Unauthorized')) {
        alert('로그인이 필요한 기능입니다.');
      } else if (errorMessage.includes('Forbidden')) {
        alert('댓글 작성 권한이 없습니다.');
      } else if (errorMessage.includes('Not Found')) {
        alert('게시글이 존재하지 않습니다.');
      } else {
        alert(errorMessage);
      }
    } else if (error.response?.status === 400) {
      alert('댓글 내용을 입력해주세요.');
    } else if (error.response?.status === 403) {
      alert('댓글 작성 권한이 없습니다.');
    } else {
      alert('댓글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
}

const startEdit = () => {
  if (!question.value) return;
  isEditing.value = true;
  editTitle.value = question.value.title;
  editContent.value = question.value.content;
}

const cancelEdit = () => {
  isEditing.value = false;
  editTitle.value = '';
  editContent.value = '';
}

const saveEdit = async () => {
  if (!question.value) return;

  if (!editTitle.value.trim()) {
    alert('제목을 입력해주세요. 제목은 필수 입력 항목입니다.');
    return;
  }

  if (editTitle.value.length > 100) {
    alert('제목은 100자를 초과할 수 없습니다. 현재 ' + editTitle.value.length + '자 입력되었습니다.');
    return;
  }

  if (!editContent.value.trim()) {
    alert('내용을 입력해주세요. 내용은 필수 입력 항목입니다.');
    return;
  }

  if (editContent.value.length > 1000) {
    alert('내용은 1000자를 초과할 수 없습니다. 현재 ' + editContent.value.length + '자 입력되었습니다.');
    return;
  }

  try {
    const response = await questionService.updateQuestion(question.value.id, {
      title: editTitle.value,
      content: editContent.value,
      scienceDiscipline: question.value.scienceDiscipline
    });

    if (response.success) {
      question.value.title = editTitle.value;
      question.value.content = editContent.value;
      isEditing.value = false;
    }
  } catch (error: any) {
    console.error('게시글 수정 실패:', error);
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      if (errorMessage.includes('Invalid credentials')) {
        alert('로그인 정보가 올바르지 않습니다.');
      } else if (errorMessage.includes('Unauthorized')) {
        alert('로그인이 필요한 기능입니다.');
      } else if (errorMessage.includes('Forbidden')) {
        alert('게시글 수정 권한이 없습니다.');
      } else if (errorMessage.includes('Not Found')) {
        alert('게시글이 존재하지 않습니다.');
      } else {
        alert(errorMessage);
      }
    } else if (error.response?.status === 403) {
      alert('게시글 수정 권한이 없습니다.');
    } else if (error.response?.status === 404) {
      alert('게시글이 존재하지 않습니다.');
    } else {
      alert('게시글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
}

const startEditComment = (comment: Comment) => {
  editingCommentId.value = comment.id
  editCommentText.value = comment.content
}

const cancelEditComment = () => {
  editingCommentId.value = null
  editCommentText.value = ''
}

const updateComment = async (commentId: number) => {
  if (!editCommentText.value.trim() || !question.value) return

  const request: CommentUpdateRequest = {
    content: editCommentText.value
  }

  try {
    const response = await questionService.updateComment(question.value.id, commentId, request)

    if (response.success && question.value) {
      const index = question.value.comments?.findIndex(c => c.id === commentId) ?? -1
      if (index !== -1 && question.value.comments) {
        question.value.comments[index] = response.data
      }
    }
    cancelEditComment()
  } catch (error: any) {
    console.error('댓글 수정 실패:', error)
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      if (errorMessage.includes('Invalid credentials')) {
        alert('로그인 정보가 올바르지 않습니다.');
      } else if (errorMessage.includes('Unauthorized')) {
        alert('로그인이 필요한 기능입니다.');
      } else if (errorMessage.includes('Forbidden')) {
        alert('댓글 수정 권한이 없습니다.');
      } else if (errorMessage.includes('Not Found')) {
        alert('댓글이 존재하지 않습니다.');
      } else {
        alert(errorMessage);
      }
    } else if (error.response?.status === 403) {
      alert('댓글 수정 권한이 없습니다.');
    } else if (error.response?.status === 404) {
      alert('댓글이 존재하지 않습니다.');
    } else {
      alert('댓글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
}

const deleteComment = async (commentId: number) => {
  if (!confirm('댓글을 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.') || !question.value) return

  try {
    const response = await questionService.deleteComment(question.value.id, commentId)
    if (response.success && question.value && question.value.comments) {
      question.value.comments = question.value.comments.filter(c => c.id !== commentId)
    }
  } catch (error: any) {
    console.error('댓글 삭제 실패:', error)
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      if (errorMessage.includes('Invalid credentials')) {
        alert('로그인 정보가 올바르지 않습니다.');
      } else if (errorMessage.includes('Unauthorized')) {
        alert('로그인이 필요한 기능입니다.');
      } else if (errorMessage.includes('Forbidden')) {
        alert('댓글 삭제 권한이 없습니다.');
      } else if (errorMessage.includes('Not Found')) {
        alert('댓글이 존재하지 않습니다.');
      } else {
        alert(errorMessage);
      }
    } else if (error.response?.status === 403) {
      alert('댓글 삭제 권한이 없습니다.');
    } else if (error.response?.status === 404) {
      alert('댓글이 존재하지 않습니다.');
    } else {
      alert('댓글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
}

onMounted(() => {
  fetchQuestion()
})
</script>

<style scoped>
.detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.detail-header {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.header-top {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .header-top {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  word-break: break-word;
}

.edit-title {
  width: 100%;
  padding: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.edit-content {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 200px;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.edit-button, .save-button, .cancel-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
}

.edit-button {
  background: #1a73e8;
  color: white;
}

.save-button {
  background: #28a745;
  color: white;
}

.cancel-button {
  background: #6c757d;
  color: white;
}

.post-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .post-info {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
  color: #333;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: #666;
  font-size: 0.875rem;
}

.discipline-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.tag-list {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background-color: #f0f0f0;
  border-radius: 16px;
  font-size: 14px;
  color: #666;
}

.content {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 40px;
}

.action-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background-color: transparent;
  border-radius: 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.like-button .heart-icon {
  transition: all 0.3s ease;
}

.like-button:hover .heart-icon {
  transform: scale(1.1);
}

.like-button.active .heart-icon {
  animation: pulse 0.4s ease;
}

.like-button .count {
  font-weight: 600;
  font-size: 18px;
  color: #ff4444;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.comments-section {
  background: white;
  margin-top: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.comments-section h3 {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.comment {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.comment:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.comment-date {
  font-size: 12px;
  color: #666;
}

.comment-content {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  padding: 0;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-actions {
  display: flex;
  gap: 12px;
  margin-top: 0.5rem;
}

.action-button {
  padding: 4px 0;
  background: none;
  border: none;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.action-button:hover {
  color: #007bff;
}

.comment-input {
  padding: 1rem;
  border-top: 1px solid #eee;
}

.comment-input textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  min-height: 60px;
  font-size: 14px;
  margin-bottom: 0.75rem;
  background-color: #f8f9fa;
}

.comment-input textarea:focus {
  outline: none;
  border-color: #007bff;
  background-color: white;
}

.comment-input .submit-button {
  display: flex;
  margin-left: auto;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.comment-input .submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-prompt {
  text-align: center;
  padding: 1.5rem 1rem;
  background-color: #f8f9fa;
  font-size: 14px;
}

.login-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

.advisor-badge {
  background-color: #4CAF50;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  margin-left: 4px;
}

.comment-edit {
  margin-top: 0.5rem;
}

.edit-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  min-height: 60px;
  font-size: 14px;
  margin-bottom: 0.5rem;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.edit-actions button {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.edit-actions .cancel-button {
  background-color: #f0f0f0;
  color: #666;
}

.edit-actions .save-button {
  background-color: #007bff;
  color: white;
}

.edit-actions .save-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading, .error {
  text-align: center;
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

.error {
  color: #dc3545;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-form {
  margin-top: 1rem;
}

.char-count {
  text-align: right;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
}
</style> 