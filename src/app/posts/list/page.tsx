'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postService } from '@/services/post';
import { PostSummary, PostPage } from '@/types/post';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange 
}: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
}) {
    const groupSize = 9;
    const currentGroup = Math.floor(currentPage / groupSize);
    const startPage = currentGroup * groupSize;
    
    const pageNumbers = Array.from(
        { length: Math.min(groupSize, totalPages - startPage) }, 
        (_, i) => startPage + i
    );

    const hasNextGroup = (currentGroup + 1) * groupSize < totalPages;
    const hasPrevGroup = currentGroup > 0;

    const handlePrevGroup = () => {
        const prevGroupLastPage = (currentGroup * groupSize) - 1;
        onPageChange(prevGroupLastPage);
    };

    const handleNextGroup = () => {
        onPageChange((currentGroup + 1) * groupSize);
    };

    return (
        <div className="mt-4 flex justify-center">
            <nav className="flex items-center gap-2">
                <button 
                    onClick={handlePrevGroup}
                    disabled={!hasPrevGroup}
                    className="px-3 py-1 rounded border disabled:opacity-50 disabled:bg-gray-100"
                >
                    &lt;
                </button>
                
                {pageNumbers.map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        disabled={pageNum === currentPage}
                        className={`px-3 py-1 rounded border ${
                            pageNum === currentPage 
                            ? 'bg-indigo-600 text-white' 
                            : 'hover:bg-gray-50'
                        }`}
                    >
                        {pageNum + 1}
                    </button>
                ))}
                
                <button 
                    onClick={handleNextGroup}
                    disabled={!hasNextGroup}
                    className="px-3 py-1 rounded border disabled:opacity-50 disabled:bg-gray-100"
                >
                    &gt;
                </button>
            </nav>
        </div>
    );
}

export default function ListPostsPage() {
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const size = 10;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await postService.getAllPostsByPage(page, size);
                setPosts(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error('글 목록 로드 실패:', error);
                toast.error('글 목록을 불러오는데 실패했습니다.');
            }
        };

        fetchPosts();
    }, [page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                번호
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                제목
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                작성자
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                작성일
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                조회수
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                좋아요
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link href={`/posts/${post.id}`} className="text-indigo-600 hover:text-indigo-900">
                                        {post.title}
                                        {post.commentCounts > 0 && (
                                            <span className="ml-2 text-gray-500">
                                                [{post.commentCounts}]
                                            </span>
                                        )}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {format(new Date(post.createdAt), 'yyyy.MM.dd', { locale: ko })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.viewCounts}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.likes}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
            />
        </main>
    );
}