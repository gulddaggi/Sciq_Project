<template>
  <div class="menu-drawer" :class="{ 'is-open': isOpen }">
    <div class="drawer-content">
      <div class="menu-items">
        <router-link to="/profile" class="menu-item">
          <i class="fas fa-user"></i>
          내 정보
        </router-link>
        <button @click="handleLogout" class="menu-item">
          <i class="fas fa-sign-out-alt"></i>
          로그아웃
        </button>
      </div>
    </div>
    <div class="drawer-overlay" @click="close"></div>
  </div>
</template>

<script>
export default {
  name: 'MenuDrawer',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleLogout() {
      // TODO: 로그아웃 로직 구현
      console.log('로그아웃');
      this.close();
    }
  }
}
</script>

<style scoped>
.menu-drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  pointer-events: none;
  z-index: 1001;
}

.drawer-content {
  position: absolute;
  top: 60px; /* Navbar 높이와 동일하게 설정 */
  left: 0;
  width: 250px;
  height: calc(100% - 60px);
  background-color: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  pointer-events: auto;
}

.drawer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.is-open .drawer-content {
  transform: translateX(0);
}

.is-open .drawer-overlay {
  opacity: 1;
  pointer-events: auto;
}

.menu-items {
  padding: 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  border: none;
  background: none;
  font-size: 16px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item i {
  width: 20px;
}
</style>
