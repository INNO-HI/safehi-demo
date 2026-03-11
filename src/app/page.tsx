'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // 로딩 중이면 아무것도 하지 않음
    if (isLoading) return;

    // 인증되어 있으면 대시보드로 이동
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      // 인증 안 되어 있으면 로그인 페이지로 이동
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중일 때 표시
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}
