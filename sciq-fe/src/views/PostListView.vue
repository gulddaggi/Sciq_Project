<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { postService, type Post } from '@/api/postService'

const router = useRouter()
const posts = ref<Post[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchPosts = async () => {
  loading.value = true
  error.value = null
  try {
    posts.value = await postService.getPosts()
  } catch (e) {
    error.value = '게시글을 불러오는데 실패했습니다.'
    console.error('Error fetching posts:', e)
  } finally {
    loading.value = false
  }
}

const goToCreatePost = () => {
  router.push('/posts/create')
}

const goToPostDetail = (postId: number) => {
  router.push(`/posts/${postId}`)
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="post-list-view">
    <div class="header">
      <h1>게시판</h1>
      <button @click="goToCreatePost" class="create-button">
        글쓰기
      </button>
    </div>

    <div v-if="loading" class="loading">
      로딩 중...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="post-list">
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-item"
        @click="goToPostDetail(post.id)"
      >
        <div class="post-category">{{ post.category }}</div>
        <div class="post-title">{{ post.title }}</div>
        <div class="post-meta">
          <span>{{ post.author }}</span>
          <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-list-view {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-button {
  padding: 0.5rem 2rem;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #1557b0;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.post-item:hover {
  background-color: #f8f9fa;
}

.post-category {
  padding: 0.25rem 0.5rem;
  background-color: #e9ecef;
  border-radius: 4px;
  text-align: center;
}

.post-title {
  font-weight: 500;
}

.post-meta {
  display: flex;
  gap: 1rem;
  color: #6c757d;
  font-size: 0.9rem;
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