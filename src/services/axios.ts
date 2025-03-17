import axios, { AxiosError } from 'axios';
import { useAuth } from '@/hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인증 관련 처리를 위한 함수
export const handleAuthError = () => {
  localStorage.removeItem('accessToken');
  const authStore = useAuth.getState();
  authStore.clearAuth();
  window.location.href = '/login';
};

// API 요청 시 인터셉터를 통해 Access Token 자동 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 토큰 재발급을 위한 함수
const reissueAccessToken = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/token/reissue`,
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.headers["authorization"]?.replace("Bearer ", ""); 
    if (newAccessToken) {
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } else {
      throw new Error("새로운 Access Token이 응답에 포함되지 않았습니다.");
    }
  } catch (error) {
    handleAuthError();
    throw error;
  }
};

// 에러 처리 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config!;

    // 1. 토큰 재발급이 필요한 경우 (401 + 재발급 헤더)
    if (
      error.response?.status === 401 && 
      error.response.headers['x-reissue-token'] === 'true' &&
      !(originalRequest as any)._retry
    ) {
      (originalRequest as any)._retry = true;
      try {
        const newAccessToken = await reissueAccessToken();
        if (originalRequest.headers instanceof axios.AxiosHeaders) {
          originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        } else {
          originalRequest.headers = new axios.AxiosHeaders({
            Authorization: `Bearer ${newAccessToken}`
          });
        }
        return axiosInstance(originalRequest);
      } catch (reissueError) {
        return Promise.reject(reissueError);
      }
    }

    // 2. 인증 관련 에러 처리 (401, 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 로그인 페이지가 아닐 때만 현재 URL 저장
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
      }
      handleAuthError();
      return Promise.reject(error);
    }

    // 3. 그 외 모든 에러는 컴포넌트에서 처리
    return Promise.reject(error);
  }
);

export default axiosInstance;