<script setup lang="ts">
import { RouterView } from 'vue-router';
import { computed } from 'vue'
import Navbar from './components/ui/Navbar.vue'
import Footer from './components/Footer.vue'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.logout()
}

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <div class="app">
    <Navbar />
    <main class="main">
      <div class="container">
        <RouterView />
      </div>
    </main>
    <Footer />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main-content {
  margin-top: 60px; /* Navbar 높이만큼 여백 추가 */
  padding: 20px;
}

.app {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main {
  padding: 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container a {
  margin-right: 15px;
  text-decoration: none;
  color: #333;
  padding: 5px 10px;
  border-radius: 4px;
}

.container a:hover {
  background-color: #f5f5f5;
}

.container button {
  padding: 5px 10px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.container button:hover {
  background-color: #cc0000;
}
</style>
