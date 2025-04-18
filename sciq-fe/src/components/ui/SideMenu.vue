<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps<{
  onClose: () => void
}>()

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.logout()
  props.onClose()
}
</script>

<template>
  <div class="side-menu">
    <div class="menu-header">
      <h2>메뉴</h2>
      <button class="close-button" @click="onClose">
        <span class="material-icons">close</span>
      </button>
    </div>

    <div class="auth-section">
      <template v-if="isAuthenticated">
        <div class="user-info">
          <span class="material-icons">account_circle</span>
          <span class="user-name">{{ authStore.user?.nickName }}님</span>
        </div>
        <button @click="handleLogout" class="auth-button logout">
          <span class="material-icons">logout</span>
          로그아웃
        </button>
      </template>
      <template v-else>
        <router-link to="/login" class="auth-button login" @click="onClose">
          <span class="material-icons">login</span>
          로그인
        </router-link>
      </template>
    </div>
    
    <div class="menu-items">
      <router-link to="/" class="menu-item" @click="onClose">
        <span class="material-icons">home</span>
        <span>홈</span>
      </router-link>
      
      <router-link to="/board" class="menu-item" @click="onClose">
        <span class="material-icons">article</span>
        <span>게시판</span>
      </router-link>
      
      <router-link to="/debate" class="menu-item" @click="onClose">
        <span class="material-icons">forum</span>
        <span>토론대회</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.side-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.side-menu.open {
  transform: translateX(0);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e4e6eb;
}

.menu-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button .material-icons {
  font-size: 24px;
  color: #666;
}

.auth-section {
  padding: 1rem;
  border-bottom: 1px solid #e4e6eb;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.user-info .material-icons {
  font-size: 32px;
  color: #666;
}

.user-name {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.auth-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
}

.auth-button.login {
  background-color: #1a73e8;
  color: white;
}

.auth-button.logout {
  background-color: #f5f5f5;
  color: #666;
}

.auth-button .material-icons {
  font-size: 20px;
}

.menu-items {
  padding: 1rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f0f2f5;
}

.menu-item .material-icons {
  margin-right: 0.75rem;
  font-size: 20px;
  color: #666;
}

.menu-item span:not(.material-icons) {
  font-size: 0.9rem;
}
</style> 