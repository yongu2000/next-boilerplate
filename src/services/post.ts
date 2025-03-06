import { axiosInstance } from './axios';
import { Post } from '@/types/post';

export const postService = {
  async getMyPosts(): Promise<Post[]> {
    const response = await axiosInstance.get('/posts/my');
    return response.data;
  },

  async getAllPosts(): Promise<Post[]> {
    const response = await axiosInstance.get('/posts');
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