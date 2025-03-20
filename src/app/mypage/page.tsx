'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { UserInfo } from '@/types/auth';
import Link from 'next/link';

export default function MyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserInfo>({
    id: 0,
    username: '',
    name: '',
    email: '',
    bio: '',
    createdAt: '',
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await authService.getCurrentUser();
        setCurrentUser(userInfo);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        toast.error('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* 프로필 헤더 */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white bg-white">
                <Image
                  src="/exampleProfile.jpg"
                  alt="프로필 이미지"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* 프로필 정보 */}
          <div className="pt-16 pb-8 px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
            <p className="mt-1 text-gray-500">{currentUser.email}</p>
            {currentUser.bio && (
              <p className="mt-4 text-gray-600 max-w-xl mx-auto">{currentUser.bio}</p>
            )}
          </div>

          {/* 계정 정보 */}
          <div className="border-t border-gray-200 px-6 py-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-6">계정 정보</h3>
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">이메일</dt>
                  <dd className="mt-1 text-lg text-gray-900">{currentUser.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">이름</dt>
                  <dd className="mt-1 text-lg text-gray-900">{currentUser.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">가입일</dt>
                  <dd className="mt-1 text-lg text-gray-900">
                    {new Date(currentUser.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* 자기소개 */}
          <div className="border-t border-gray-200 px-6 py-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-6">자기소개</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {currentUser.bio || '자기소개를 작성해주세요.'}
                </p>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-end">
              <Link
                href="/mypage/edit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                프로필 수정
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}