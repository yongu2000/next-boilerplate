'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { postService } from '@/services/post';

const postSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
});

type PostFormData = z.infer<typeof postSchema>;

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id) as number;
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<PostFormData>({
    resolver: zodResolver(postSchema)
  });

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await postService.getPost(postId);
        setValue('title', post.title);
        setValue('content', post.content);
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        router.push('/my-posts');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId, router, setValue]);

  const onSubmit = async (data: PostFormData) => {
    try {
      await postService.updatePost(postId, data);
      router.push(`/posts/${postId}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">로딩 중...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            제목
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용
          </label>
          <textarea
            id="content"
            rows={10}
            {...register('content')}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
}