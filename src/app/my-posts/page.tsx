'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { postService } from '@/services/post';
import { Post } from '@/types/post';
import { toast } from 'react-hot-toast';

export default function MyPostsPage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  const handleDelete = async (postId: number) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('글이 삭제되었습니다.');
    } catch (error) {
      console.error('글 삭제 실패:', error);
      toast.error('글 삭제에 실패했습니다.');
    }
  };
  
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await postService.getMyPosts();
        setPosts(response);
      } catch (error) {
        console.error('내 글 목록 로드 실패:', error);
        toast.error('글 목록을 불러오는데 실패했습니다.');
      }
    };

    if (isAuthenticated) {
      fetchMyPosts();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">내 글 목록</h1>
          <Link
            href="/posts/new"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            새 글 쓰기
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                  <p className="mt-2 text-gray-600 line-clamp-2">{post.content}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <span>좋아요 {post.likes}</span>
                <span>댓글 {post.comments?.length || 0}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}