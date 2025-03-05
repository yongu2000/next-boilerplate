import axios, { AxiosError } from 'axios';
import { useAuth } from '@/hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// `useAuth`를 직접 사용할 수 없으므로, `logoutAndRedirect()` 함수 생성
export const logoutAndRedirect = () => {
  localStorage.removeItem('accessToken'); // ✅ localStorage에서 토큰 삭제
  const authStore = useAuth.getState(); // ✅ Zustand의 useAuth 상태 가져오기
  authStore.clearAuth(); // ✅ 상태 초기화
  window.location.href = '/login'; // ✅ 로그인 페이지로 이동
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
      `${API_URL}/token/header`,
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
    logoutAndRedirect(); // 🔥 토큰 재발급 실패 시 로그아웃 처리
    throw error;
  }
};

// 401 또는 403 에러 발생 시 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config!;

    if (!(originalRequest as any)._retry) {
      (originalRequest as any)._retry = false;
    }
    
    // 🔥 401 에러 & 토큰 재발급 신호 존재 시 재발급 요청
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
        logoutAndRedirect();
        return Promise.reject(reissueError);
      }
    }

    // 🔥 403 에러 발생 시 → 강제 로그아웃 및 로그인 페이지로 이동
    if (error.response?.status === 403) {
      logoutAndRedirect();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;