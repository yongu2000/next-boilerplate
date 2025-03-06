'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["passwordConfirm"],
});

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await authService.join({
        email: data.email,
        password: data.password,
      });
      
      toast.success('회원가입이 성공적으로 완료되었습니다!');
      router.push('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">회원가입</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              {...register('passwordConfirm')}
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm.message as string}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            회원가입
          </button>

          <div className="text-center">
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
              이미 계정이 있으신가요? 로그인하기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}