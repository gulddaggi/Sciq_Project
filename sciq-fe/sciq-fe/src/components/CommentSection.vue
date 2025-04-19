<!-- 댓글 섹션 컴포넌트 -->
<template>
  <div class="comments-section">
    <!-- 댓글 작성 폼 -->
    <div class="comment-form">
      <textarea
        v-model="newComment"
        placeholder="댓글을 작성해주세요"
        rows="3"
        class="comment-input"
      ></textarea>
      <button @click="submitComment" class="submit-button" :disabled="!newComment.trim()">
        댓글 작성
      </button>
    </div>

    <!-- 댓글 목록 -->
    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="username">{{ comment.userName }}</span>
          <span class="date">{{ formatDate(comment.createdAt) }}</span>
          <div v-if="isCommentOwner(comment)" class="comment-actions">
            <button v-if="editingCommentId !== comment.id" @click="startEditing(comment)" class="action-button">
              수정
            </button>
            <button v-if="editingCommentId !== comment.id" @click="deleteCommentItem(comment.id)" class="action-button delete">
              삭제
            </button>
          </div>
        </div>
        
        <div v-if="editingCommentId === comment.id" class="edit-form">
          <textarea
            v-model="editingContent"
            rows="3"
            class="comment-input"
          ></textarea>
          <div class="edit-actions">
            <button @click="saveEdit(comment.id)" class="action-button">저장</button>
            <button @click="cancelEdit" class="action-button">취소</button>
          </div>
        </div>
        <div v-else class="comment-content">
          {{ comment.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getComments, createComment, updateComment, deleteComment } from '../api/comments';
import { useAuthStore } from '../stores/auth';
import type { Comment } from '../api/comments';

const props = defineProps<{
  questionId: number;
}>();

const authStore = useAuthStore();
const comments = ref<Comment[]>([]);
const newComment = ref('');
const editingCommentId = ref<number | null>(null);
const editingContent = ref('');

// 댓글 목록 불러오기
const fetchComments = async () => {
  try {
    comments.value = await getComments(props.questionId);
  } catch (error) {
    console.error('댓글 목록 불러오기 실패:', error);
  }
};

// 댓글 작성
const submitComment = async () => {
  if (!newComment.value.trim()) return;
  
  try {
    await createComment(props.questionId, { content: newComment.value });
    newComment.value = '';
    await fetchComments();
  } catch (error) {
    console.error('댓글 작성 실패:', error);
  }
};

// 댓글 수정 시작
const startEditing = (comment: Comment) => {
  editingCommentId.value = comment.id;
  editingContent.value = comment.content;
};

// 댓글 수정 취소
const cancelEdit = () => {
  editingCommentId.value = null;
  editingContent.value = '';
};

// 댓글 수정 저장
const saveEdit = async (commentId: number) => {
  if (!editingContent.value.trim()) return;
  
  try {
    await updateComment(props.questionId, commentId, { content: editingContent.value });
    editingCommentId.value = null;
    await fetchComments();
  } catch (error) {
    console.error('댓글 수정 실패:', error);
  }
};

// 댓글 삭제
const deleteCommentItem = async (commentId: number) => {
  if (!confirm('댓글을 삭제하시겠습니까?')) return;
  
  try {
    await deleteComment(props.questionId, commentId);
    await fetchComments();
  } catch (error) {
    console.error('댓글 삭제 실패:', error);
  }
};

// 댓글 작성자 확인
const isCommentOwner = (comment: Comment) => {
  return authStore.user?.id === comment.userId;
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
  fetchComments();
});
</script>

<style scoped>
.comments-section {
  margin-top: 2rem;
  padding: 1rem;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 0.5rem;
  font-family: inherit;
}

.submit-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.username {
  font-weight: bold;
  margin-right: 1rem;
}

.date {
  color: #666;
  font-size: 0.9rem;
}

.comment-actions {
  margin-left: auto;
}

.action-button {
  padding: 0.25rem 0.5rem;
  margin-left: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.action-button.delete {
  color: #dc3545;
  border-color: #dc3545;
}

.comment-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.edit-form {
  margin-top: 0.5rem;
}

.edit-actions {
  margin-top: 0.5rem;
}
</style> 