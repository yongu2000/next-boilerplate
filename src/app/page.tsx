'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth';
import Link from 'next/link';
import { getCookie } from 'cookies-next';

export default function HomePage() {
  const { user, setAuth } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 이미 인증 정보가 있다면 스킵
        if (user) return;

        // refreshToken 쿠키가 있는지 확인
        const refreshToken = getCookie('REFRESH_TOKEN');
        if (!refreshToken) return;

        // 1. 토큰 재발급 요청
        const accessToken = await authService.reissueToken();
        
        // 2. 사용자 정보 요청
        const userInfo = await authService.getUserInfo();
        
        // 3. 전역 상태에 사용자 정보 저장
        setAuth(userInfo);
      } catch (error) {
        console.error('인증 초기화 실패:', error);
        // 에러 발생 시 조용히 실패 (이미 로그인 페이지로의 리다이렉트는 인터셉터에서 처리)
      }
    };

    initializeAuth();
  }, [user, setAuth]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col space-y-4">
        <Link 
          href="/posts/grid" 
          className="text-xl font-semibold text-indigo-600 hover:text-indigo-500"
        >
          카드형 게시판 보기
        </Link>
        <Link 
          href="/posts/list" 
          className="text-xl font-semibold text-indigo-600 hover:text-indigo-500"
        >
          테이블형 게시판 보기
        </Link>
      </div>
      {user && (
        <div className="mt-4">
          <p>안녕하세요, {user.name}님!</p>
        </div>
      )}
    </main>
  );
}