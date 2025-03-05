import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo } from '@/types/auth';

interface AuthStore {
  user: UserInfo | null;
  isAuthenticated: boolean;
  setAuth: (user: UserInfo) => void;
  clearAuth: () => void;
}

export const useAuth = create(
  persist<AuthStore>(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      clearAuth: () => {
        localStorage.removeItem('accessToken'); // localStorage에서 토큰 삭제
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 키 이름
    }
  )
);