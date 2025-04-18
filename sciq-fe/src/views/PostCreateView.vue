<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PostForm from '@/components/post/PostForm.vue'
import { postService } from '@/api/postService'

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async (postData: any) => {
  loading.value = true
  error.value = null
  try {
    await postService.createPost(postData)
    router.push('/posts')
  } catch (e) {
    error.value = '게시글 작성에 실패했습니다.'
    console.error('Error creating post:', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="post-create-view">
    <div class="header">
      <h1>글쓰기</h1>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <PostForm 
      @submit="handleSubmit" 
      :disabled="loading"
    />
  </div>
</template>

<style scoped>
.post-create-view {
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.error {
  color: #dc3545;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f8d7da;
  border-radius: 4px;
}
</style> 