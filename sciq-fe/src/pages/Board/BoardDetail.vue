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

    <template v-else>
      <div class="detail-header">
        <div class="header-top">
          <h1 class="title">{{ question.title }}</h1>
          <div class="button-group" v-if="isAuthor">
            <button class="edit-button" @click="handleEdit">
              <span class="material-icons">edit</span>
              수정
            </button>
            <button class="delete-button" @click="handleDelete">
              <span class="material-icons">delete</span>
              삭제
            </button>
          </div>
        </div>
        
        <div class="post-info">
          <div class="author-info">
            <img :src="question.user.profileImage || '/default-avatar.png'" alt="author" class="author-avatar" />
            <span class="author-name">{{ question.user.nickName }}</span>
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

      <div class="content" v-html="question.content"></div>

      <div class="action-bar">
        <button 
          class="like-button" 
          :class="{ active: question.recommended }"
          @click="toggleLike"
        >
          <span class="material-icons">{{ question.recommended ? 'favorite' : 'favorite_border' }}</span>
          좋아요
          <span class="count">{{ question.recommendCnt }}</span>
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
                <img :src="comment.user.profileImage || '/default-avatar.png'" alt="author" class="author-avatar" />
                <span class="author-name">{{ comment.user.nickName }}</span>
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
                  <button class="cancel-button" @click="cancelEdit">취소</button>
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
                <button class="action-button" @click="startEdit(comment)">수정</button>
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
import axios from 'axios'
import type { Question, Comment, ApiResponse, CommentCreateRequest, CommentUpdateRequest } from '@/types/board'
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

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAuthor = computed(() => question.value?.isAuthor || false)

const fetchQuestion = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get<ApiResponse<Question>>(`/api/questions/${route.params.id}`)
    const { success, response: data } = response.data
    if (success) {
      question.value = data
    } else {
      error.value = '질문을 불러오는데 실패했습니다.'
    }
  } catch (err: any) {
    console.error('질문 조회 실패:', err)
    error.value = '질문을 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

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

const toggleLike = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  try {
    const response = await axios.post(`/api/questions/${question.value?.id}/recommend`)
    if (question.value) {
      question.value.recommended = !question.value.recommended
      question.value.recommendCnt += question.value.recommended ? 1 : -1
    }
  } catch (err) {
    console.error('좋아요 처리 실패:', err)
  }
}

const submitComment = async () => {
  if (!commentText.value.trim()) return

  const request: CommentCreateRequest = {
    content: commentText.value
  }

  try {
    const response = await axios.post<ApiResponse<Comment>>(
      `/api/questions/${question.value?.id}/comments`,
      request
    )
    
    const { success, response: data } = response.data
    if (success && question.value) {
      question.value.comments.unshift(data)
      commentText.value = ''
    }
  } catch (err) {
    console.error('댓글 작성 실패:', err)
    alert('댓글 작성에 실패했습니다.')
  }
}

const startEdit = (comment: Comment) => {
  editingCommentId.value = comment.id
  editCommentText.value = comment.content
}

const cancelEdit = () => {
  editingCommentId.value = null
  editCommentText.value = ''
}

const updateComment = async (commentId: number) => {
  if (!editCommentText.value.trim()) return

  const request: CommentUpdateRequest = {
    content: editCommentText.value
  }

  try {
    const response = await axios.put<ApiResponse<Comment>>(
      `/api/questions/${question.value?.id}/comments/${commentId}`,
      request
    )

    const { success, response: data } = response.data
    if (success && question.value) {
      const index = question.value.comments.findIndex(c => c.id === commentId)
      if (index !== -1) {
        question.value.comments[index] = data
      }
    }
    cancelEdit()
  } catch (err) {
    console.error('댓글 수정 실패:', err)
    alert('댓글 수정에 실패했습니다.')
  }
}

const deleteComment = async (commentId: number) => {
  if (!confirm('댓글을 삭제하시겠습니까?')) return

  try {
    const response = await axios.delete(`/api/questions/${question.value?.id}/comments/${commentId}`)
    const { success } = response.data
    if (success && question.value) {
      question.value.comments = question.value.comments.filter(c => c.id !== commentId)
    }
  } catch (err) {
    console.error('댓글 삭제 실패:', err)
    alert('댓글 삭제에 실패했습니다.')
  }
}

const handleEdit = () => {
  router.push(`/board/edit/${question.value?.id}`)
}

const handleDelete = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    const response = await axios.delete(`/api/questions/${question.value?.id}`)
    const { success } = response.data
    if (success) {
      router.push('/board')
    }
  } catch (err) {
    console.error('질문 삭제 실패:', err)
    alert('질문 삭제에 실패했습니다.')
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
  padding: 20px;
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

.detail-header {
  margin-bottom: 40px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 8px;
}

.button-group button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button {
  background-color: #f0f0f0;
  color: #666;
}

.edit-button:hover {
  background-color: #e0e0e0;
}

.delete-button {
  background-color: #ff4444;
  color: white;
}

.delete-button:hover {
  background-color: #cc0000;
}

.post-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
}

.meta-info {
  color: #666;
  font-size: 14px;
}

.discipline-tag {
  padding: 4px 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  font-size: 14px;
  color: #495057;
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
  padding: 12px 24px;
  border: 1px solid #ddd;
  border-radius: 24px;
  background-color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.like-button.active {
  background-color: #ff4444;
  border-color: #ff4444;
  color: white;
}

.like-button .count {
  font-weight: 600;
}

.comments-section {
  border-top: 1px solid #eee;
  padding-top: 40px;
}

.comments-section h3 {
  margin-bottom: 20px;
}

.login-prompt {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.login-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

.comment-input {
  margin-bottom: 40px;
}

.comment-input textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 12px;
  font-size: 14px;
}

.submit-button {
  float: right;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.comment {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-date {
  font-size: 14px;
  color: #666;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.comment-edit {
  margin-bottom: 12px;
}

.edit-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 8px;
  font-size: 14px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cancel-button,
.save-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #666;
}

.save-button {
  background-color: #007bff;
  color: white;
}

.save-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.comment-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 4px 8px;
  background: none;
  border: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.action-button:hover {
  color: #007bff;
}
</style> 