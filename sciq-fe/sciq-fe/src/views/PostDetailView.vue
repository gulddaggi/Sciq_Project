<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommentForm from '@/components/comment/CommentForm.vue'
import { postService, type Post, type Comment } from '@/api/postService'

const route = useRoute()
const router = useRouter()
const postId = Number(route.params.id)

const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchPost = async () => {
  loading.value = true
  error.value = null
  try {
    post.value = await postService.getPost(postId)
    comments.value = await postService.getComments(postId)
  } catch (e) {
    error.value = '게시글을 불러오는데 실패했습니다.'
    console.error('Error fetching post:', e)
  } finally {
    loading.value = false
  }
}

const handleCommentSubmit = async (commentData: { content: string }) => {
  try {
    const newComment = await postService.createComment({
      ...commentData,
      postId
    })
    comments.value.push(newComment)
  } catch (e) {
    console.error('Error creating comment:', e)
    alert('댓글 작성에 실패했습니다.')
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchPost()
})
</script>

<template>
  <div class="post-detail-view">
    <div class="header">
      <button @click="goBack" class="back-button">
        <span class="material-icons">arrow_back</span>
      </button>
      <h1>게시글</h1>
    </div>

    <div v-if="loading" class="loading">
      로딩 중...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <template v-else-if="post">
      <div class="post-content">
        <div class="post-header">
          <div class="post-category">{{ post.category }}</div>
          <h2 class="post-title">{{ post.title }}</h2>
          <div class="post-meta">
            <span>{{ post.author }}</span>
            <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
          </div>
        </div>

        <div class="post-body">
          {{ post.content }}
        </div>
      </div>

      <div class="comments-section">
        <h3>댓글</h3>
        
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-meta">
              <span>{{ comment.author }}</span>
              <span>{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <CommentForm @submit="handleCommentSubmit" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.post-detail-view {
  padding: 2rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  color: #666;
}

.post-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.post-header {
  margin-bottom: 2rem;
}

.post-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #e9ecef;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.post-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  gap: 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.post-body {
  line-height: 1.6;
  color: #333;
}

.comments-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
}

.comments-section h3 {
  margin-bottom: 1.5rem;
}

.comments-list {
  margin-bottom: 2rem;
}

.comment-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.comment-meta {
  display: flex;
  gap: 1rem;
  color: #6c757d;
  font-size: 0.85rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}
</style> 