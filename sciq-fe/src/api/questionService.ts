import axios from './axios';
import type { ApiResponse, Question, Comment, CommentCreateRequest, CommentUpdateRequest } from '@/types/board';
import { ScienceDisciplineType } from '@/types/board';

export interface QuestionListResponse {
  questions: Question[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const questionService = {
  // 게시글 상세 조회
  async getQuestion(id: number) {
    try {
      const response = await axios.get<ApiResponse<Question>>(`/v1/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('질문 상세 조회 실패:', error);
      throw error;
    }
  },
  
  // 게시글 목록 조회
  async getAllQuestions() {
    try {
      const response = await axios.get<ApiResponse<Question[]>>('/v1/questions');
      return response.data;
    } catch (error) {
      console.error('질문 목록 조회 실패:', error);
      throw error;
    }
  },
  
  // 인기 질문 목록 조회
  async getPopularQuestions() {
    try {
      const response = await axios.get<ApiResponse<QuestionListResponse>>('/v1/questions/popular');
      return response.data;
    } catch (error) {
      console.error('인기 질문 조회 실패:', error);
      throw error;
    }
  },

  // 최신 질문 목록 조회
  async getRecentQuestions() {
    try {
      const response = await axios.get<ApiResponse<QuestionListResponse>>('/v1/questions/recent');
      return response.data;
    } catch (error) {
      console.error('최신 질문 조회 실패:', error);
      throw error;
    }
  },
  
  // 댓글 조회
  async getComments(questionId: number) {
    try {
      const response = await axios.get<ApiResponse<Comment[]>>(`/v1/questions/${questionId}/comments`);
      return response.data;
    } catch (error) {
      console.error('댓글 조회 실패:', error);
      throw error;
    }
  },
  
  // 댓글 작성
  async createComment(questionId: number, commentData: CommentCreateRequest) {
    try {
      const response = await axios.post<ApiResponse<Comment>>(
        `/v1/questions/${questionId}/comments`, 
        commentData
      );
      return response.data;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw error;
    }
  },
  
  // 댓글 수정
  async updateComment(questionId: number, commentId: number, commentData: CommentUpdateRequest) {
    try {
      const response = await axios.put<ApiResponse<Comment>>(
        `/v1/questions/${questionId}/comments/${commentId}`,
        commentData
      );
      return response.data;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw error;
    }
  },
  
  // 댓글 삭제
  async deleteComment(questionId: number, commentId: number) {
    try {
      const response = await axios.delete<ApiResponse<null>>(`/v1/questions/${questionId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw error;
    }
  },
  
  // 게시글 추천
  async recommendQuestion(questionId: number) {
    try {
      // 토큰이 자동으로 axios 인스턴스를 통해 설정됩니다
      // 토큰 유효성 검사는 인터셉터에서 수행됩니다
      const response = await axios.post<ApiResponse<null>>(
        `/v1/questions/${questionId}/recommend`,
        null // 요청 본문 없음
      );
      
      // 추천 성공 후 최신 게시글 정보를 다시 불러옴
      const updatedQuestion = await this.getQuestion(questionId);
      
      return updatedQuestion;
    } catch (error) {
      console.error('게시글 추천 실패:', error);
      throw error;
    }
  },
  
  // 좋아요 상태 확인
  async checkRecommendStatus(questionId: number) {
    try {
      const response = await axios.get<ApiResponse<{recommended: boolean}>>(`/v1/questions/${questionId}/recommend/status`);
      return response.data;
    } catch (error) {
      console.error('좋아요 상태 확인 실패:', error);
      throw error;
    }
  },
  
  // 게시글 삭제
  async deleteQuestion(questionId: number) {
    try {
      const response = await axios.delete<ApiResponse<null>>(`/v1/questions/${questionId}`);
      return response.data;
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw error;
    }
  }
}; 