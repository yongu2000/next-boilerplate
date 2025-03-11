'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postService } from '@/services/post';
import { PostSummary } from '@/types/post';
import { toast } from 'react-hot-toast';

export default function GridPostsPage() {
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPosts = async (cursor?: number) => {
        if (isLoading) return;
        
        try {
            setIsLoading(true);
            const response = await postService.getAllPostsByCursor(cursor);
            
            if (cursor) {
                setPosts(prev => [...prev, ...response.items]);
            } else {
                setPosts(response.items);
            }
            
            setNextCursor(response.nextCursor);
            setHasMore(response.hasNext);
        } catch (error) {
            console.error('글 목록 로드 실패:', error);
            toast.error('글 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        if (nextCursor) {
            fetchPosts(nextCursor);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* 글쓰기 버튼 추가 */}
            <div className="mb-6 flex justify-end">
                <Link
                    href="/posts/write"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    글쓰기
                </Link>
            </div>
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
                                        {post.commentCounts}
                                    </span>
                                    <span className="flex items-center text-gray-500">
                                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        {post.viewCounts}
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
            
            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLoading ? '로딩 중...' : '더 보기'}
                    </button>
                </div>
            )}
        </main>
    );
}