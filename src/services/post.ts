import { axiosInstance } from './axios';
import { Post, PostPage, PostSummary, CursorResponse } from '@/types/post';

export const postService = {
  async getMyPosts(): Promise<Post[]> {
    const response = await axiosInstance.get('/posts/my');
    return response.data;
  },

  async getAllPostsByPage(page = 0, size = 10): Promise<PostPage> {
    const response = await axiosInstance.get(`/posts/list?page=${page}&size=${size}`);
    return response.data;
},

async getAllPostsByCursor(cursor?: number, size = 9): Promise<CursorResponse<PostSummary>> {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor.toString());
  params.append('size', size.toString());
  
  const response = await axiosInstance.get(`/posts/grid?${params}`);
  return response.data;
},

  async getPost(id: number): Promise<Post> {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  },

  async createPost(data: { title: string; content: string }): Promise<Post> {
    const response = await axiosInstance.post('/posts', data);
    return response.data;
  },

  async updatePost(id: number, data: { title: string; content: string }): Promise<Post> {
    const response = await axiosInstance.put(`/posts/${id}`, data);
    return response.data;
  },

  async deletePost(id: number): Promise<void> {
    await axiosInstance.delete(`/posts/${id}`);
  },

  async likePost(postId: number): Promise<void> {
    await axiosInstance.post(`/posts/${postId}/like`);
  },

  async dislikePost(postId: number): Promise<void> {
    await axiosInstance.post(`/posts/${postId}/dislike`);
  },

  async getLikeStatus(postId: number): Promise<boolean> {
    try {
        const response = await axiosInstance.get(`/posts/${postId}/like/status`);
        return response.data.liked;
    } catch (error) {
        return false;
    }
  },

  async createComment(postId: number, data: { content: string; parentCommentId: number | null }): Promise<void> {
    await axiosInstance.post(`/posts/${postId}/comments`, data);
  },

  async updateComment(postId: number, commentId: number, content: string): Promise<void> {
    await axiosInstance.put(`/posts/${postId}/comments/${commentId}`, { content });
  },

  async deleteComment(postId: number, commentId: number): Promise<void> {
    await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
  }
};

export default postService;