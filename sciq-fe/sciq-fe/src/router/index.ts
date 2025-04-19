import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PostListView from '@/views/PostListView.vue'
import PostCreateView from '@/views/PostCreateView.vue'
import PostDetailView from '@/views/PostDetailView.vue'

// 동적 라우트 정의
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../pages/Signup.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/view',
    name: 'ProfileView',
    component: () => import('../pages/Profile/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: () => import('../pages/Profile/ProfileEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user-info',
    name: 'user-info',
    component: () => import('../pages/UserInfo.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/board',
    name: 'board',
    component: () => import('../views/BoardListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/board/create',
    name: 'board-create',
    component: () => import('../views/BoardCreateView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/board/:id',
    name: 'board-detail',
    component: () => import('../pages/Board/BoardDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/board/:id/edit',
    name: 'board-edit',
    component: () => import('../views/BoardEditView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/board/write',
    name: 'BoardWrite',
    component: () => import('../pages/Board/BoardWrite.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/debate',
    name: 'Debate',
    component: () => import('../pages/Debate/DebateList.vue')
  },
  {
    path: '/posts/create',
    name: 'post-create',
    component: PostCreateView
  },
  {
    path: '/posts/:id',
    name: 'post-detail',
    component: PostDetailView
  },
  {
    path: '/questions/:id',
    name: 'question-detail',
    component: () => import('../views/QuestionDetailView.vue'),
    meta: { requiresAuth: true }
  }
]
// 라우터 생성
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 네비게이션 가드
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const accessToken = localStorage.getItem('accessToken')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // 토큰이 있으면 인증 상태 초기화
  if (accessToken && !authStore.isAuthenticated) {
    authStore.initializeAuth()
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    // 인증이 필요한 페이지인데 인증되지 않은 경우
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // 이미 인증된 상태에서 로그인 페이지로 가려고 하는 경우
    next('/')
  } else {
    next()
  }
})

// 라우터 에러 핸들링
router.onError((error) => {
  console.error('라우터 에러:', error)
})

export default router