<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { postService } from '@/api/postService'

interface Post {
  id: number
  title: string
  content: string
  user: {
    id: number
    nickName: string
  }
  scienceDiscipline: string
  recommendCnt: number
  createdAt: string
  updatedAt: string
}

const router = useRouter()
const route = useRoute()
const posts = ref<Post[]>([])
const isLoading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const sortBy = ref<'latest' | 'recommend'>('latest')
const searchQuery = ref('')

const formatDiscipline = (discipline: string) => {
  const disciplineMap: { [key: string]: string } = {
    'PHYSICS': '물리학',
    'CHEMISTRY': '화학',
    'BIOLOGY': '생명과학',
    'EARTH_SCIENCE': '지구과학',
    'ASTRONOMY': '천문학'
  }
  return disciplineMap[discipline] || discipline
}

const fetchPosts = async () => {
  isLoading.value = true
  try {
    const response = await postService.getPosts()
    console.log('게시글 목록:', response)
    if (response && Array.isArray(response)) {
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        posts.value = response.filter(post => 
          post.title.toLowerCase().includes(query) || 
          post.content.toLowerCase().includes(query) ||
          post.user.nickName.toLowerCase().includes(query)
        )
      } else {
        posts.value = response
      }

      if (sortBy.value === 'recommend') {
        posts.value.sort((a, b) => b.recommendCnt - a.recommendCnt)
      } else {
        posts.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }
    } else {
      console.error('게시글 목록 데이터 형식이 올바르지 않습니다:', response)
      posts.value = []
    }
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error)
    posts.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSortChange = (event: Event) => {
  const select = event.target as HTMLSelectElement
  sortBy.value = select.value as 'latest' | 'recommend'
  currentPage.value = 1
  router.replace({
    query: { ...route.query, sort: sortBy.value }
  })
  fetchPosts()
}

const handleSearch = () => {
  currentPage.value = 1
  fetchPosts()
}

const goToCreate = () => {
  router.push('/board/create')
}

const goToDetail = (id: number) => {
  router.push(`/board/${id}`)
}

onMounted(() => {
  const urlSort = route.query.sort as string
  if (urlSort === 'recommend' || urlSort === 'latest') {
    sortBy.value = urlSort
  }
  fetchPosts()
})
</script>

<template>
  <div class="board-list">
    <div class="board-header">
      <h1>게시판</h1>
      <div class="board-actions">
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="제목, 내용, 작성자로 검색"
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <span class="material-icons search-icon" @click="handleSearch">search</span>
        </div>
        <div class="action-buttons">
          <div class="sort-select">
            <select :value="sortBy" @change="handleSortChange">
              <option value="latest">최신순</option>
              <option value="recommend">좋아요순</option>
            </select>
            <span class="material-icons">expand_more</span>
          </div>
          <button class="create-button" @click="goToCreate">
            <span class="material-icons">edit</span>
            글쓰기
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <span class="material-icons">refresh</span>
      <span>로딩중...</span>
    </div>

    <div v-else-if="!posts || posts.length === 0" class="empty-state">
      <span class="material-icons">info</span>
      <span v-if="searchQuery.trim()">검색 결과가 없습니다.</span>
      <span v-else>게시글이 없습니다.</span>
    </div>

    <div v-else class="post-list">
      <div v-for="post in posts" :key="post.id" class="post-item" @click="goToDetail(post.id)">
        <div class="post-title">{{ post.title }}</div>
        <div class="post-meta">
          <span class="author">{{ post.user.nickName }}</span>
          <span class="date">{{ new Date(post.createdAt).toLocaleDateString() }}</span>
          <span class="discipline">{{ formatDiscipline(post.scienceDiscipline) }}</span>
          <span class="recommend">
            <span class="material-icons">favorite</span>
            {{ post.recommendCnt }}
          </span>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button 
        v-for="page in totalPages" 
        :key="page"
        :class="{ active: page === currentPage }"
        @click="currentPage = page; fetchPosts()"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.board-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.board-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.board-header h1 {
  font-size: 1.25rem;
  color: #333;
  text-align: center;
}

.board-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: #f5f5f5;
  font-size: 0.9rem;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 20px;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.sort-select {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.sort-select select {
  appearance: none;
  padding: 0.35rem 2rem 0.35rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  color: #333;
  width: 100%;
}

.sort-select .material-icons {
  position: absolute;
  right: 0.5rem;
  color: #666;
  pointer-events: none;
  font-size: 18px;
}

.create-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .board-list {
    padding: 1.5rem;
  }

  .board-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .board-header h1 {
    text-align: left;
  }

  .board-actions {
    flex-direction: row;
    align-items: center;
  }

  .search-container {
    width: 300px;
  }

  .action-buttons {
    gap: 1rem;
  }
}

.loading, .empty-state {
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

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.post-item:hover {
  transform: translateY(-2px);
}

.post-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
  color: #333;
}

.post-meta {
  display: flex;
  gap: 0.75rem;
  color: #666;
  font-size: 0.85rem;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.post-meta .material-icons {
  font-size: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 1.5rem;
}

.pagination button {
  padding: 0.35rem 0.75rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

.pagination button.active {
  background: #1a73e8;
  color: white;
  border-color: #1a73e8;
}
</style> 