'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { UserInfo } from '@/types/auth';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function EditProfile({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profileImage: null as File | null,
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [validation, setValidation] = useState({
    username: {
      isDuplicate: false,
      isChecked: false,
    },
    email: {
      isDuplicate: false,
      isChecked: false,
    },
  });

  useEffect(() => {
    // 자기 자신의 프로필이 아닌 경우 메인 프로필 페이지로 리다이렉트
    if (user?.username !== resolvedParams.username) {
      router.push(`/${resolvedParams.username}`);
      return;
    }

    const loadUserInfo = async () => {
      try {
        const userInfo = await authService.getCurrentUser();
        setUserInfo(userInfo);
        setFormData({
          name: userInfo.name,
          bio: userInfo.bio || '',
          profileImage: null,
          email: userInfo.email,
          username: userInfo.username,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        toast.error('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [resolvedParams.username, user?.username, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameDuplicateCheck = async () => {
    if (!formData.username) {
      toast.error('사용자 이름을 입력해주세요.');
      return;
    }

    setIsChecking(true);
    try {
      const isDuplicate = await authService.checkUsernameDuplicate(formData.username);
      setValidation(prev => ({
        ...prev,
        username: {
          isDuplicate,
          isChecked: true,
        },
      }));
      if (isDuplicate) {
        toast.error('이미 사용 중인 사용자 이름입니다.');
        setFormData(prev => ({ ...prev, username: '' }));
      } else {
        toast.success('사용 가능한 사용자 이름입니다.');
      }
    } catch (error) {
      console.error('사용자 이름 중복 확인 실패:', error);
      toast.error('사용자 이름 중복 확인에 실패했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckEmail = async () => {
    if (!formData.email) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    setIsChecking(true);
    try {
      const isDuplicate = await authService.checkEmailDuplicate(formData.email);
      setValidation(prev => ({
        ...prev,
        email: {
          isDuplicate,
          isChecked: true,
        },
      }));
      if (isDuplicate) {
        toast.error('이미 사용 중인 이메일입니다.');
        setFormData(prev => ({ ...prev, email: '' }));
      } else {
        toast.success('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      toast.error('이메일 중복 확인에 실패했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 비밀번호 일치 여부 검증
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      setIsSubmitting(false);
      return;
    }

    // username이나 email이 변경된 경우 중복 확인이 필요합니다.
    if (formData.username !== userInfo?.username && !validation.username.isChecked) {
      toast.error('사용자 이름 중복 확인을 해주세요.');
      setIsSubmitting(false);
      return;
    }

    if (formData.email !== userInfo?.email && !validation.email.isChecked) {
      toast.error('이메일 중복 확인을 해주세요.');
      setIsSubmitting(false);
      return;
    }

    // 중복된 값이 있는 경우 제출을 막습니다.
    if (validation.username.isDuplicate || validation.email.isDuplicate) {
      toast.error('중복된 값이 있습니다. 다시 확인해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 프로필 이미지가 있는 경우 먼저 업로드
      if (formData.profileImage) {
        await authService.updateProfileImage(resolvedParams.username, formData.profileImage);
        toast.success('프로필 이미지가 업데이트되었습니다.');
      }

      // 나머지 사용자 정보 업데이트
      await authService.updateUser(resolvedParams.username, {
        name: formData.name,
        bio: formData.bio,
        email: formData.email,
        username: formData.username,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success('프로필이 업데이트되었습니다.');
      
      // username이 변경된 경우에만 새로운 username으로 리다이렉트
      if (formData.username !== resolvedParams.username) {
        router.push(`/${formData.username}`);
      } else {
        router.push(`/${resolvedParams.username}`);
      }
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      toast.error('프로필 업데이트에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">프로필 수정</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-gray-200">
                  <Image
                    src={previewUrl || '/exampleProfile.jpg'}
                    alt="프로필 이미지"
                    fill
                    className="object-cover"
                  />
                </div>
                <label className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  이미지 변경
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* 기본 정보 */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">기본 정보</h3>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    사용자 이름
                  </label>
                  <div className="mt-1 flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, username: e.target.value }));
                          setValidation(prev => ({
                            ...prev,
                            username: {
                              ...prev.username,
                              isChecked: false,
                            },
                          }));
                        }}
                        className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleUsernameDuplicateCheck}
                      disabled={isChecking || validation.username.isChecked}
                      className="h-10 inline-flex items-center px-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 whitespace-nowrap"
                    >
                      {isChecking ? '확인 중...' : '중복 확인'}
                    </button>
                  </div>
                  {validation.username.isChecked && (
                    <p className={`mt-2 text-base ${validation.username.isDuplicate ? 'text-red-600' : 'text-green-600'}`}>
                      {validation.username.isDuplicate ? '이미 사용 중인 사용자 이름입니다.' : '사용 가능한 사용자 이름입니다.'}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    자기소개
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3"
                  />
                </div>
              </div>

              {/* 계정 정보 */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">계정 정보</h3>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    이메일
                  </label>
                  <div className="mt-1 flex gap-2">
                    <div className="flex-1">
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, email: e.target.value }));
                          setValidation(prev => ({
                            ...prev,
                            email: {
                              ...prev.email,
                              isChecked: false,
                            },
                          }));
                        }}
                        className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCheckEmail}
                      disabled={isChecking || validation.email.isChecked}
                      className="h-10 inline-flex items-center px-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 whitespace-nowrap"
                    >
                      {isChecking ? '확인 중...' : '중복 확인'}
                    </button>
                  </div>
                  {validation.email.isChecked && (
                    <p className={`mt-2 text-base ${validation.email.isDuplicate ? 'text-red-600' : 'text-green-600'}`}>
                      {validation.email.isDuplicate ? '이미 사용 중인 이메일입니다.' : '사용 가능한 이메일입니다.'}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3"
                  />
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push(`/${resolvedParams.username}`)}
                  className="h-10 px-6 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 