<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SideMenu from './SideMenu.vue'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const searchQuery = ref('')
const isMenuOpen = ref(false)
const activeTab = ref('게시판')

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  authStore.logout()
}

const goToProfile = () => {
  if (isAuthenticated.value) {
    router.push('/profile')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <!-- Top Navigation -->
  <nav class="top-nav">
    <div class="nav-container">
      <div class="nav-left">
        <button class="menu-button" @click="toggleMenu">
          <span class="material-icons">menu</span>
        </button>
        <router-link to="/" class="logo">
          SciQ
        </router-link>
      </div>

      <div class="nav-right">
        <template v-if="isAuthenticated">
          <button class="user-button" @click="goToProfile" title="마이페이지">
            <span class="material-icons">account_circle</span>
          </button>
          <button class="logout-button" @click="handleLogout" title="로그아웃">
            <span class="material-icons">logout</span>
          </button>
        </template>
        <button v-else class="user-button" @click="goToProfile" title="로그인">
          <span class="material-icons">person</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Tab Navigation -->
  <div class="tab-nav">
    <router-link to="/" class="tab-item" active-class="active">홈</router-link>
    <router-link to="/board" class="tab-item" active-class="active">게시판</router-link>
    <router-link to="/debate" class="tab-item" active-class="active">토론대회</router-link>
  </div>

  <!-- Side Menu -->
  <SideMenu :class="{ open: isMenuOpen }" :onClose="toggleMenu" :isAuthenticated="isAuthenticated" />
  <div v-if="isMenuOpen" class="overlay" @click="toggleMenu"></div>
</template>

<style scoped>
.top-nav {
  background-color: white;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 48px;
}

.menu-button, .user-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-button .material-icons, 
.user-button .material-icons {
  font-size: 24px;
  color: #333;
}

.logo {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-left: 0.5rem;
  text-decoration: none;
}

.tab-nav {
  display: flex;
  justify-content: center;
  background-color: white;
  padding: 0;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 56px; /* top-nav의 높이만큼 설정 */
  z-index: 99;
}

.tab-item {
  padding: 0.75rem 2rem;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  position: relative;
}

.tab-item.active {
  color: #1a73e8;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #1a73e8;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.user-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.user-button:hover {
  transform: scale(1.1);
}

.user-button .material-icons {
  font-size: 24px;
  color: #333;
}

.logout-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s;
}

.logout-button:hover {
  color: #ff4444;
}
</style> 