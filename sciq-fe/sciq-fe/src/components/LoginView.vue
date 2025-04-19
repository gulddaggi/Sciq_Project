<template>
    <AuthForm title="로그인" @submit="handleLogin" />
  </template>
  
  <script setup lang="ts">
  import AuthForm from '@/components/AuthForm.vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const handleLogin = async (formData) => {
    try {
      await authStore.login(formData);
      console.log('로그인 성공, 인증 상태:', authStore.isAuthenticated);
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };
  </script>
  