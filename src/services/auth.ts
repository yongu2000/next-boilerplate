import { axiosInstance } from './axios';
import { LoginRequest, UserUpdateRequest, UserInfo } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';

interface JoinRequest {
  email: string;
  username: string;
  password: string;
  name: string;
}

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

  async getCurrentUser(): Promise<UserInfo> {
    const response = await axiosInstance.get('/user');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/logout');
      // 로그아웃 후 인증 상태 초기화 및 리다이렉트
      const authStore = useAuth.getState();
      authStore.clearAuth();
      window.location.href = '/login';
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  },

  async join(data: { email: string; password: string }): Promise<void> {
    const joinData: JoinRequest = {
      email: data.email,
      username: data.email,
      password: data.password,
      name: data.email.split('@')[0]
    };
    
    await axiosInstance.post('/join', joinData);
  },

  async refresh(): Promise<string> {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data;
  },

  async reissueToken(): Promise<string> {
    const response = await axiosInstance.post('/token/reissue');
    
    const authHeader = response.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Access Token이 없습니다.');
    }
    
    const accessToken = authHeader.split('Bearer ')[1];
    localStorage.setItem('accessToken', accessToken);
    
    return accessToken;
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