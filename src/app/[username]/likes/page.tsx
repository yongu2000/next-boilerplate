'use client';

import { useEffect, useState } from 'react';
import { postService } from '@/services/post';
import { Post } from '@/types/post';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function UserLikes({ params }: { params: { username: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserLikes = async () => {
      try {
        const data = await postService.getUserLikes(params.username);
        setPosts(data);
      } catch (error) {
        console.error('좋아요한 글 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLikes();
  }, [params.username]);

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
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {user?.username === params.username ? '좋아요한 글' : `${params.username}님이 좋아요한 글`}
            </h2>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                  <Link href={`/posts/${post.id}`} className="block">
                    <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 