import instance from './auth'

export interface Post {
  id: number
  title: string
  content: string
  category: string
  createdAt: string
  author: string
}

export interface Comment {
  id: number
  content: string
  author: string
  createdAt: string
  postId: number
}

export interface CreatePostData {
  title: string
  content: string
  category: string
}

export interface CreateCommentData {
  content: string
  postId: number
}

export interface ApiResponse<T> {
  data: T
}

export interface PostListResponse {
  posts: Post[]
}

export interface PostResponse {
  post: Post
}

export interface PostRequest {
  title: string
  content: string
  category: string
}

export const postService = {
  // 게시글 목록 조회
  async getPosts(sort: 'latest' | 'recommend' = 'latest') {
    try {
      const res = await instance.get<ApiResponse<PostListResponse>>('/v1/questions', {
        params: { 
          sort,
          page: 0,
          size: 10
        }
      })
      console.log('API 응답:', res.data)
      
      if (res.data && Array.isArray(res.data.data)) {
        // 배열을 역순으로 정렬
        return res.data.data.reverse()
      } else {
        console.error('게시글 목록 데이터 구조가 올바르지 않습니다:', res.data)
        return []
      }
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error)
      return []
    }
  },

  // 게시글 상세 조회
  async getPost(id: number) {
    const res = await instance.get<ApiResponse<PostResponse>>(`/v1/questions/${id}`)
    return res.data.data.post
  },

  // 게시글 작성
  async createPost(data: PostRequest) {
    const res = await instance.post<ApiResponse<PostResponse>>('/v1/questions', data)
    return res.data.data.post
  },

  // 게시글의 댓글 목록 조회
  async getComments(postId: number) {
    const response = await instance.get<Comment[]>(`/v1/questions/${postId}/comments`)
    return response
  },

  // 댓글 작성
  async createComment(data: CreateCommentData) {
    const response = await instance.post<Comment>(`/v1/questions/${data.postId}/comments`, data)
    return response
  },

  // 게시글 수정
  async updatePost(id: number, data: PostRequest) {
    const res = await instance.put<ApiResponse<PostResponse>>(`/v1/questions/${id}`, data)
    return res.data.data.post
  },

  // 게시글 삭제
  async deletePost(id: number) {
    await instance.delete(`/v1/questions/${id}`)
  },

  // 게시글 추천
  async recommendPost(id: number) {
    const res = await instance.post<ApiResponse<void>>(`/v1/questions/${id}/recommend`)
    return res.data
  },

  // 인기 게시글 조회
  async getPopularPosts(page: number = 0, size: number = 10) {
    const res = await instance.get<ApiResponse<PostListResponse>>('/v1/questions/popular', {
      params: { page, size }
    });
    console.log('Popular posts response:', res);
    return res.data.data.posts;
  }
} 