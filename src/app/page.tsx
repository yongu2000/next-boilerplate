'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const { user, isAuthenticated, clearAuth } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearAuth();
      toast.success('로그아웃되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      toast.error('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          <div className="h-full flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Boilerplate
              </span>
            </Link>
            <div>
              {isAuthenticated ? (
                  <div className="flex items-center gap-6">
                  <span className="text-gray-700 font-medium">
                    환영합니다, <span className="text-indigo-600">{user?.name}</span>님
                  </span>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium"
                  >
                    프로필 수정
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    로그아웃
                  </button>
                </div>
                ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/login"
                    className="text-gray-700 font-medium hover:text-indigo-600 transition-colors duration-200"
                  >
                    로그인
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {isAuthenticated ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                시작하기
              </h2>
              <p className="text-lg text-gray-600">
                이제 게시글을 작성하고 다른 사용자들과 소통할 수 있습니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    게시글 작성
                  </h3>
                  <p className="text-gray-600">
                    자유롭게 게시글을 작성하고 공유해보세요.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    댓글 참여
                  </h3>
                  <p className="text-gray-600">
                    다른 사용자의 게시글에 댓글을 달아보세요.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                환영합니다!
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                로그인하여 다양한 기능을 사용해보세요.
              </p>
              <div className="flex justify-center gap-4">
                <Link 
                  href="/login"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                >
                  로그인하기
                </Link>
                <Link 
                  href="/register"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-medium"
                >
                  회원가입하기
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}