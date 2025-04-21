import axios from './axios';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  userName: string;
  questionId: number;
}

export interface CreateCommentRequest {
  content: string;
}

export interface CommentResponse {
  data: Comment;
  message: string;
  status: number;
}

export interface CommentsResponse {
  data: Comment[];
  message: string;
  status: number;
}

// 댓글 목록 조회
export const getComments = async (questionId: number): Promise<Comment[]> => {
  const response = await axios.get<CommentsResponse>(`/v1/questions/${questionId}/comments`);
  return response.data.data;
};

// 댓글 작성
export const createComment = async (questionId: number, data: CreateCommentRequest): Promise<Comment> => {
  const response = await axios.post<CommentResponse>(`/v1/questions/${questionId}/comments`, data);
  return response.data.data;
};

// 댓글 수정
export const updateComment = async (questionId: number, commentId: number, data: CreateCommentRequest): Promise<Comment> => {
  const response = await axios.put<CommentResponse>(`/v1/questions/${questionId}/comments/${commentId}`, data);
  return response.data.data;
};

// 댓글 삭제
export const deleteComment = async (questionId: number, commentId: number): Promise<void> => {
  await axios.delete(`/v1/questions/${questionId}/comments/${commentId}`);
}; 