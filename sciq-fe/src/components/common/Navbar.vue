<template>
  <div>
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          <button class="menu-button" @click="toggleDrawer">
            <span class="material-icons">menu</span>
          </button>
          <router-link to="/" class="logo">
            SciQ
          </router-link>
        </div>

        <div class="search-container">
          <span class="material-icons search-icon">search</span>
          <input
              type="text"
              class="search-input"
              placeholder="검색"
          >
        </div>

        <div class="navbar-right">
          <button class="profile-button">
            <span class="material-icons">person</span>
          </button>
        </div>
      </div>

      <div class="nav-links">
        <router-link to="/home" class="nav-link">홈</router-link>
        <router-link to="/board" class="nav-link">게시판</router-link>
        <router-link to="/debate" class="nav-link">토론대회</router-link>
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
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  height: 60px;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #000;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 600px;
  margin: 0 20px;
}

.search-input {
  width: 100%;
  padding: 8px 16px;
  padding-left: 40px;
  border-radius: 20px;
  border: none;
  background-color: #f5f5f5;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 20px !important;
}

.nav-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #eee;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-size: 16px;
  padding: 12px;
  text-align: center;
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
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.material-icons {
  font-size: 24px;
}
</style>
