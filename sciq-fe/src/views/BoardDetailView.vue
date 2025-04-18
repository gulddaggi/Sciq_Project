<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { postService } from '@/api/postService'

interface Post {
  id: number
  title: string
  content: string
  author: {
    id: number
    username: string
  }
  createdAt: string
  updatedAt: string
  recommendCnt: number
  scienceDiscipline: string
}

const router = useRouter()
const route = useRoute()
const post = ref<Post | null>(null)
const isLoading = ref(false)
const isDeleting = ref(false)

const fetchPost = async () => {
  isLoading.value = true
  try {
    const response = await postService.getPost(Number(route.params.id))
    post.value = response.data
  } catch (error) {
    console.error('게시글 조회 실패:', error)
    alert('게시글을 불러오는데 실패했습니다.')
    router.push('/board')
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  isDeleting.value = true
  try {
    await postService.deletePost(Number(route.params.id))
    router.push('/board')
  } catch (error) {
    console.error('게시글 삭제 실패:', error)
    alert('게시글 삭제에 실패했습니다.')
  } finally {
    isDeleting.value = false
  }
}

const handleEdit = () => {
  router.push(`/board/${route.params.id}/edit`)
}

const handleRecommend = async () => {
  try {
    await postService.recommendPost(Number(route.params.id))
    if (post.value) {
      post.value.recommendCnt++
    }
  } catch (error) {
    console.error('추천 실패:', error)
    alert('추천에 실패했습니다.')
  }
}

onMounted(() => {
  fetchPost()
})
</script>

<template>
  <div class="board-detail">
    <div v-if="isLoading" class="loading">
      <span class="material-icons">refresh</span>
      <span>로딩중...</span>
    </div>

    <div v-else-if="post" class="post-content">
      <div class="post-header">
        <h1>{{ post.title }}</h1>
        <div class="post-actions">
          <button class="edit-button" @click="handleEdit">
            <span class="material-icons">edit</span>
            수정
          </button>
          <button class="delete-button" @click="handleDelete" :disabled="isDeleting">
            <span class="material-icons">delete</span>
            삭제
          </button>
        </div>
      </div>

      <div class="post-meta">
        <span class="author">{{ post.author.username }}</span>
        <span class="date">{{ new Date(post.createdAt).toLocaleDateString() }}</span>
        <span class="discipline">{{ post.scienceDiscipline }}</span>
        <button class="recommend-button" @click="handleRecommend">
          <span class="material-icons">favorite</span>
          {{ post.recommendCnt }}
        </button>
      </div>

      <div class="post-body">
        {{ post.content }}
      </div>
    </div>

    <div v-else class="error">
      <span class="material-icons">error</span>
      <span>게시글을 찾을 수 없습니다.</span>
    </div>
  </div>
</template>

<style scoped>
.board-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.post-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.post-header h1 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background: #1a73e8;
  color: white;
}

.delete-button {
  background: #dc3545;
  color: white;
}

.delete-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.post-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.recommend-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0;
}

.recommend-button:hover {
  color: #dc3545;
}

.post-body {
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
}
</style> 