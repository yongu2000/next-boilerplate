'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

// 기존 updateSchema 그대로 사용
const updateSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: z.string().min(6, '새 비밀번호는 6자 이상이어야 합니다').optional(),
  newPasswordConfirm: z.string().optional(),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.newPasswordConfirm) {
    return false;
  }
  return true;
}, {
  message: "새 비밀번호가 일치하지 않습니다",
  path: ["newPasswordConfirm"],
});

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentName, setCurrentName] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await authService.getCurrentUser();
        setCurrentName(userInfo.name);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        toast.error('사용자 정보를 불러오는데 실패했습니다.');
      }
    };

    loadUserInfo();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await authService.updateUser({
        currentPassword: data.currentPassword,
        ...(data.newPassword && {
          newPassword: data.newPassword,
          newPasswordConfirm: data.newPasswordConfirm,
        }),
        ...(data.name && { name: data.name }),
      });
      
      toast.success('프로필이 성공적으로 수정되었습니다.');
      router.push('/mypage'); // 수정 후 마이페이지 메인으로 이동
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      toast.error('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">프로필 설정</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              현재 이름
            </label>
            <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
              {currentName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              새 이름
            </label>
            <input
              {...register('name')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="변경할 이름을 입력하세요"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              현재 비밀번호
            </label>
            <input
              {...register('currentPassword')}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="현재 비밀번호를 입력하세요"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              새 비밀번호
            </label>
            <input
              {...register('newPassword')}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="변경할 비밀번호를 입력하세요"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              새 비밀번호 확인
            </label>
            <input
              {...register('newPasswordConfirm')}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="새 비밀번호를 다시 입력하세요"
            />
            {errors.newPasswordConfirm && (
              <p className="mt-1 text-sm text-red-600">{errors.newPasswordConfirm.message as string}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}