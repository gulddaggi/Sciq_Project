import axios from './axios';
import type { ApiResponse, Question, Comment, CommentCreateRequest, CommentUpdateRequest, QuestionUpdateRequest } from '@/types/board';
import { ScienceDisciplineType } from '@/types/board';

export interface QuestionListResponse {
  content: Question[];
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
  
  // 인기 게시글 조회 (좋아요순)
  async getPopularQuestions(size: number = 3) {
    try {
      const response = await axios.get<ApiResponse<Question[]>>('/api/v1/questions/popular', {
        params: {
          sort: 'recommendCnt,desc',
          size: size,
          page: 0
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('인기 게시글 조회 실패:', error);
      return [];
    }
  },

  // 최신 게시글 조회
  async getRecentQuestions(size: number = 3) {
    try {
      const response = await axios.get<ApiResponse<Question[]>>('/api/v1/questions/recent', {
        params: {
          sort: 'createdAt,desc',
          size: size,
          page: 0
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('최신 게시글 조회 실패:', error);
      return [];
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
  async recommendQuestion(questionId: number): Promise<ApiResponse<string>> {
    try {
      const response = await axios.post<ApiResponse<string>>(`/v1/questions/${questionId}/recommend`);
      return response.data;
    } catch (error) {
      console.error('게시글 추천 실패:', error);
      throw error;
    }
  },

  // 게시글 추천 취소
  async unrecommendQuestion(questionId: number): Promise<ApiResponse<void>> {
    try {
      const response = await axios.delete<ApiResponse<void>>(`/v1/questions/${questionId}/recommend`);
      return response.data;
    } catch (error) {
      console.error('추천 취소 실패:', error);
      return { success: false, data: undefined, message: '추천 취소에 실패했습니다.' };
    }
  },

  // 게시글 추천 상태 확인
  async checkRecommendStatus(questionId: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.get<ApiResponse<boolean>>(`/v1/questions/${questionId}/recommend/status`);
      return response.data;
    } catch (error) {
      console.error('추천 상태 확인 실패:', error);
      return { success: false, data: false, message: '추천 상태 확인에 실패했습니다.' };
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
  },

  // 게시글 수정
  async updateQuestion(id: number, data: QuestionUpdateRequest) {
    try {
      const response = await axios.put<ApiResponse<Question>>(`/v1/questions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      throw error;
    }
  },

  // 사용자가 좋아요한 게시글 조회
  async getRecommendedQuestionsByUser() {
    try {
      const response = await axios.get<ApiResponse<Question[]>>('/v1/mypage/recommended-questions');
      console.log('좋아요한 게시글 응답:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('좋아요한 게시글 조회 실패:', error);
      return [];
    }
  }
}; 