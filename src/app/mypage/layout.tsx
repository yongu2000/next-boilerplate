// src/app/mypage/layout.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MyPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    if (!isAuthenticated) {
        router.push('/login');
        return null;
    }

    const navigation = [
        { name: '내 정보', href: '/mypage', current: pathname === '/mypage' },
        { name: '내가 쓴 글', href: '/mypage/posts', current: pathname === '/mypage/posts' },
        { name: '좋아요한 글', href: '/mypage/likes', current: pathname === '/mypage/likes' },
        { name: '설정', href: '/mypage/settings', current: pathname === '/mypage/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-8" aria-label="Tabs">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                        ${item.current
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

