'use client';

import { useEffect, useState } from 'react';
import { postService } from '@/services/post';
import { Post } from '@/types/post';
import Link from 'next/link';

export default function MyPosts() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchMyPosts = async () => {
            const data = await postService.getMyPosts();
            setPosts(data);
        };

        fetchMyPosts();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">내가 쓴 글</h1>
            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="border rounded-lg p-4">
                        <Link href={`/posts/${post.id}`} className="text-lg font-medium hover:text-indigo-600">
                            {post.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-2">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}