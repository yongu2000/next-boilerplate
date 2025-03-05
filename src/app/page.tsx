'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { logoutAndRedirect } from '@/services/axios';
import { postService } from '@/services/post';
import { Post } from '@/types/post';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const { user, isAuthenticated, clearAuth } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getAllPosts();
        setPosts(response);
      } catch (error) {
        console.error('글 목록 로드 실패:', error);
        toast.error('글 목록을 불러오는데 실패했습니다.');
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logoutAndRedirect(); // ✅ 전역 로그아웃 함수 호출
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
                    href="/my-posts"
                    className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium"
                  >
                    내 글
                  </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {post.content}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {post.likes}
                    </span>
                    <span className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      {post.comments?.length || 0}
                    </span>
                  </div>
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    자세히 보기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}