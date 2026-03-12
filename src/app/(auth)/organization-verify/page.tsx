'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { OrganizationVerifyForm } from '@/components/features/auth/OrganizationVerifyForm';

/**
 * 기관 소속 인증 페이지
 * 로그인한 사용자만 접근 가능
 */
export default function OrganizationVerifyPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // 로딩 완료 후 인증되지 않은 사용자는 로그인으로 리다이렉트
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/organization-verify');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-body text-neutral-text-sub">로딩 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>기관 소속 인증</CardTitle>
        <CardDescription>
          돌봄 매니저 활동을 위한 소속 기관 인증
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrganizationVerifyForm />
      </CardContent>
    </Card>
  );
}
