import { axiosInstance } from './axios';
import { LoginRequest, UserUpdateRequest, UserInfo, PublicUserInfo } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';

interface JoinRequest {
  email: string;
  password: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<string> {
    const response = await axiosInstance.post('/login', {
      username: data.username,
      password: data.password,
      rememberMe: data.rememberMe || false
    });
    
    const authHeader = response.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Access Token이 없습니다.');
    }
    
    const accessToken = authHeader.split('Bearer ')[1];
    localStorage.setItem('accessToken', accessToken);
    
    return accessToken;
  },

  async getUserInfo(): Promise<UserInfo> {
    const response = await axiosInstance.get('/user/my');
    return response.data;
  },

  async updateUser(username: string, data: UserUpdateRequest): Promise<void> {
    const response = await axiosInstance.put(`/user/${username}`, {
      name: data.name,
      bio: data.bio,
      email: data.email,
      username: data.username,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    // username이 변경된 경우 새로운 토큰이 헤더에 포함됨
    const authHeader = response.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const newAccessToken = authHeader.split('Bearer ')[1];
      localStorage.setItem('accessToken', newAccessToken);
    }
    
    // 응답으로 받은 유저 정보로 auth store 업데이트
    const authStore = useAuth.getState();
    if (authStore.user) {
      authStore.setAuth({
        ...authStore.user,
        ...response.data  // 서버에서 받은 최신 유저 정보로 업데이트
      });
    }
  },

  async updateProfileImage(username: string, profileImage: File): Promise<void> {
    const formData = new FormData();
    formData.append('image', profileImage);
    
    await axiosInstance.post(`/user/${username}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getCurrentUser(): Promise<UserInfo> {
    const response = await axiosInstance.get('/user/my');
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
    await axiosInstance.post('/join', data);
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
  },

  async getUserByUsername(username: string): Promise<PublicUserInfo> {
    const response = await axiosInstance.get(`/user/${username}`);
    return response.data;
  },

  async checkUsernameDuplicate(username: string): Promise<boolean> {
    const response = await axiosInstance.get(`/user/check/username/${username}`);
    return response.data.isDuplicate;
  },

  async checkEmailDuplicate(email: string): Promise<boolean> {
    const response = await axiosInstance.get(`/user/check/email/${email}`);
    return response.data.isDuplicate;
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