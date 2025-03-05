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
  }
};

export default postService;