'use client';

import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { UserInfo } from '@/types/auth';
import { toast } from 'react-hot-toast';

export default function MyPage() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await authService.getCurrentUser();
                setUser(userInfo);
            } catch (error) {
                console.error('사용자 정보 로드 실패:', error);
                toast.error('사용자 정보를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">내 정보</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">이메일</label>
                        <p className="mt-1 text-lg">{user?.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">아이디</label>
                        <p className="mt-1 text-lg">{user?.username}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">이름</label>
                        <p className="mt-1 text-lg">{user?.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">가입일</label>
                        <p className="mt-1 text-lg">
                            {user?.createdAt && format(new Date(user.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}
                        </p>
                    </div>
                    <div className="pt-4 border-t">
                        <Link 
                            href="/mypage/settings" 
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            프로필 수정하기 
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}