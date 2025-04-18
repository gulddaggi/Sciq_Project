import axios from './axios';
import type { ApiResponse } from './authService';

export type ScienceDisciplineType = 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY' | 'EARTH_SCIENCE';

export interface Question {
  id: number;
  userId: number;
  title: string;
  content: string;
  scienceDiscipline: ScienceDisciplineType;
  recommendCnt: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  userName: string;  // 작성자 이름
  userNickName: string;  // 작성자 닉네임
}

export interface QuestionListResponse {
  questions: Question[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const questionService = {
  // 인기 질문 목록 조회
  async getPopularQuestions() {
    try {
      const response = await axios.get<ApiResponse<QuestionListResponse>>('/v1/questions/popular');
      return response.data.response;
    } catch (error) {
      console.error('인기 질문 조회 실패:', error);
      throw error;
    }
  },

  // 최신 질문 목록 조회
  async getRecentQuestions() {
    try {
      const response = await axios.get<ApiResponse<QuestionListResponse>>('/v1/questions/recent');
      return response.data.response;
    } catch (error) {
      console.error('최신 질문 조회 실패:', error);
      throw error;
    }
  }
}; 