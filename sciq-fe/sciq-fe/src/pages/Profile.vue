<template>
  <div class="profile-main">
    <h1>마이페이지</h1>
    
    <div class="profile-cards">
      <div class="profile-card" @click="goToViewProfile">
        <div class="card-icon">
          <span class="material-icons">visibility</span>
        </div>
        <div class="card-content">
          <h2>내 정보 보기</h2>
          <p>내 프로필, 포인트 및 활동 정보를 확인합니다.</p>
        </div>
      </div>
      
      <div class="profile-card" @click="goToEditProfile">
        <div class="card-icon">
          <span class="material-icons">edit</span>
        </div>
        <div class="card-content">
          <h2>내 정보 수정</h2>
          <p>프로필 정보를 수정합니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToViewProfile = () => {
  router.push('/profile/view');
};

const goToEditProfile = () => {
  router.push('/profile/edit');
};
</script>

<style scoped>
.profile-main {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.profile-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.profile-card {
  flex: 1;
  min-width: 300px;
  padding: 25px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.card-icon {
  margin-right: 20px;
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #e6f2ff;
  border-radius: 50%;
}

.material-icons {
  font-size: 2rem;
}

.card-content h2 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
}

.card-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
</style> 