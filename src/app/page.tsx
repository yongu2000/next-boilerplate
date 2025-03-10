'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col space-y-4">
        <Link 
          href="/posts/grid" 
          className="text-xl font-semibold text-indigo-600 hover:text-indigo-500"
        >
          카드형 게시판 보기
        </Link>
        <Link 
          href="/posts/list" 
          className="text-xl font-semibold text-indigo-600 hover:text-indigo-500"
        >
          테이블형 게시판 보기
        </Link>
      </div>
    </main>
  );
}