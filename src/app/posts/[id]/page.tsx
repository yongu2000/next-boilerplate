'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { postService } from '@/services/post';
import { Post } from '@/types/post';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import CommentComponent from '@/components/Comment';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = Number(params.id);
        const response = await postService.getPost(postId);
        console.log('게시글 응답:', response);
        setPost(response);
      } catch (error) {
        console.error('글 로드 실패:', error);
        toast.error('글을 불러오는데 실패했습니다.');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!post || !window.confirm('정말로 이 글을 삭제하시겠습니까?')) return;

    try {
      await postService.deletePost(post.id);
      toast.success('글이 삭제되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('글 삭제 실패:', error);
      toast.error('글 삭제에 실패했습니다.');
    }
  };

  // 댓글 작성 핸들러
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      toast.error('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await postService.createComment(post!.id, {
        content: commentContent.trim(),
        parentCommentId: null
      });
      
      // 댓글 작성 후 게시글 새로 불러오기
      const response = await postService.getPost(post!.id);
      setPost(response);
      setCommentContent(''); // 입력창 초기화
      toast.success('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      toast.error('댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId: number) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      await postService.deleteComment(post!.id, commentId);
      
      // 댓글 삭제 후 게시글 새로 불러오기
      const response = await postService.getPost(post!.id);
      setPost(response);
      toast.success('댓글이 삭제되었습니다.');
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      toast.error('댓글 삭제에 실패했습니다.');
    }
  };

  // 대댓글 작성 핸들러 추가
  const handleReplySubmit = async (parentCommentId: number, content: string) => {
    try {
      await postService.createComment(post!.id, {
        content: content.trim(),
        parentCommentId: parentCommentId
      });
      
      // 댓글 작성 후 게시글 새로 불러오기
      const response = await postService.getPost(post!.id);
      setPost(response);
      toast.success('답글이 작성되었습니다.');
    } catch (error) {
      console.error('답글 작성 실패:', error);
      toast.error('답글 작성에 실패했습니다.');
    }
  };

  // 댓글 수정 후 게시글 새로 불러오기를 위한 핸들러
  const handleCommentUpdate = async (commentId: number) => {
    try {
      const response = await postService.getPost(post!.id);
      setPost(response);
    } catch (error) {
      console.error('게시글 새로고침 실패:', error);
      toast.error('최신 댓글을 불러오는데 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">글을 찾을 수 없습니다</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            이전으로
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* 글 헤더 */}
            <div className="border-b pb-4 mb-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900">
                  {post.title}
                </h1>
                {user?.id === post.user.id && (
                  <div className="flex space-x-4">
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      수정
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>작성자: {post.user.name}</span>
                  <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
                  {post.modifiedAt !== post.createdAt && (
                    <span>수정일: {new Date(post.modifiedAt).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {post.likes}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    {post.comments?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* 글 내용 */}
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>
            </div>

            {/* 댓글 섹션 */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">댓글</h2>
              {post.comments?.length > 0 ? (
                <div className="space-y-6">
                  {post.comments
                    .filter(comment => comment.parentCommentId === null) // 최상위 댓글만 필터링
                    .map((comment) => (
                      <CommentComponent
                        key={comment.id}
                        comment={comment}
                        postId={post.id}
                        onDelete={handleCommentDelete}
                        onReply={handleReplySubmit}
                        onUpdate={handleCommentUpdate}
                      />
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">아직 댓글이 없습니다.</p>
              )}

              {/* 최상위 댓글 작성 폼 */}
              <form onSubmit={handleCommentSubmit} className="mt-6">
                <textarea
                  rows={3}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder={isAuthenticated ? "댓글을 작성해주세요" : "댓글을 작성하려면 로그인이 필요합니다"}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={!isAuthenticated}
                />
                <div className="mt-2 flex justify-end">
                  {isAuthenticated ? (
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      댓글 작성
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      로그인하고 댓글 작성
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
 