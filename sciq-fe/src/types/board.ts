export enum ScienceDisciplineType {
  PHYSICS = 'PHYSICS',
  CHEMISTRY = 'CHEMISTRY',
  BIOLOGY = 'BIOLOGY',
  EARTH_SCIENCE = 'EARTH_SCIENCE',
  ASTRONOMY = 'ASTRONOMY'
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: null | string;
}

export interface Question {
  id: number;
  user: {
    id: number;
    nickName: string;
    profileImage?: string;
  };
  title: string;
  content: string;
  scienceDiscipline: ScienceDisciplineType;
  recommendCnt: number;
  recommended?: boolean;
  comments?: Comment[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  isAuthor?: boolean;
}

export interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    nickName: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
  isAuthor?: boolean;
}

export interface QuestionCreateRequest {
  title: string;
  content: string;
  scienceDiscipline: ScienceDisciplineType;
  tags?: string[];
}

export interface QuestionUpdateRequest {
  title: string;
  content: string;
  scienceDiscipline: ScienceDisciplineType;
  tags?: string[];
}

export interface CommentCreateRequest {
  content: string;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface QuestionListResponse {
  content: Question[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
} 