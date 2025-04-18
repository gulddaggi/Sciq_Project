<template>
  <div>
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          <button class="menu-button" @click="toggleDrawer">
            <i class="fas fa-bars"></i>
          </button>
          <router-link to="/" class="logo">
            SciQ
          </router-link>
          <div class="search-container">
            <input
                type="text"
                class="search-input"
                placeholder="검색"
            >
            <i class="fas fa-search search-icon"></i>
          </div>
        </div>

        <div class="navbar-center">
          <router-link to="/home" class="nav-link">홈</router-link>
          <router-link to="/board" class="nav-link">게시판</router-link>
          <router-link to="/debate" class="nav-link">토론대회</router-link>
        </div>

        <div class="navbar-right">
          <button class="profile-button">
            <i class="fas fa-user"></i>
          </button>
        </div>
      </div>
    </nav>
    <MenuDrawer
        :is-open="isDrawerOpen"
        @close="closeDrawer"
    />
  </div>
</template>

<script>
import MenuDrawer from './MenuDrawer.vue'

export default {
  name: 'Navbar',
  components: {
    MenuDrawer
  },
  data() {
    return {
      isDrawerOpen: false
    }
  },
  methods: {
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen
    },
    closeDrawer() {
      this.isDrawerOpen = false
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #000;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 8px 16px;
  padding-right: 40px;
  border-radius: 20px;
  border: none;
  background-color: #f5f5f5;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.navbar-center {
  display: flex;
  gap: 40px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-size: 16px;
  padding: 8px 0;
  position: relative;
}

.nav-link.router-link-active {
  color: #000;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #000;
}

.profile-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
}
</style>
