'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { logout as logoutApi } from '@/lib/api/auth';

/**
 * 대시보드 페이지 (임시)
 * 로그인 성공 후 리다이렉트 대상
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    // 로딩 완료 후 인증되지 않은 사용자는 로그인으로 리다이렉트
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logoutApi();
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <p className="text-body text-neutral-text-sub">로딩 중...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-bg p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-card shadow-card p-8">
          <h1 className="text-h1 text-neutral-text mb-4">
            안녕하세요, {user?.name}님!
          </h1>
          <p className="text-body text-neutral-text-sub mb-6">
            SafeHi 돌봄 관리 시스템에 오신 것을 환영합니다.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-neutral-bg rounded-card">
              <h2 className="text-h3 text-neutral-text mb-2">계정 정보</h2>
              <dl className="space-y-2 text-body">
                <div className="flex">
                  <dt className="w-24 text-neutral-text-sub">이름:</dt>
                  <dd className="text-neutral-text">{user?.name}</dd>
                </div>
                <div className="flex">
                  <dt className="w-24 text-neutral-text-sub">이메일:</dt>
                  <dd className="text-neutral-text">{user?.email}</dd>
                </div>
                <div className="flex">
                  <dt className="w-24 text-neutral-text-sub">연락처:</dt>
                  <dd className="text-neutral-text">{user?.phone || '-'}</dd>
                </div>
                <div className="flex">
                  <dt className="w-24 text-neutral-text-sub">권한:</dt>
                  <dd className="text-neutral-text">
                    {user?.role === 'manager' ? '돌봄 매니저' : '일반 사용자'}
                  </dd>
                </div>
              </dl>
            </div>

            <Button variant="secondary" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
