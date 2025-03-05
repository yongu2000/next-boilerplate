import axios from 'axios';
import { LoginRequest, UserUpdateRequest, UserInfo } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authService = {
  async login(data: LoginRequest): Promise<string> {
    const response = await axiosInstance.post('/login', data);
    
    const authHeader = response.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Access Token이 없습니다.');
    }
    
    const accessToken = authHeader.split('Bearer ')[1];
    localStorage.setItem('accessToken', accessToken);
    
    return accessToken;
  },

  async getUserInfo(): Promise<UserInfo> {
    const response = await axiosInstance.get('/user');
    return response.data;
  },

  async updateUser(data: UserUpdateRequest): Promise<void> {
    await axiosInstance.put('/user', data);
  },

  async getCurrentUser(): Promise<{ username: string; name: string }> {
    const response = await axiosInstance.get('/user');
    return response.data;
  },

  async logout(): Promise<void> {
    // 서버에 로그아웃 요청을 보내거나, 로컬에서 처리
    return Promise.resolve();
  },

  async register(data: { email: string; password: string }): Promise<void> {
    await axiosInstance.post('/register', data);
  }
};

// API 요청 시 인터셉터를 통해 Access Token 자동 첨부 (Bearer 포함)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authService;