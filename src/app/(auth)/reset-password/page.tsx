'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Alert,
  Button,
} from '@/components/ui';
import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm';

/**
 * 비밀번호 재설정 내부 컴포넌트
 */
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // 토큰이 없는 경우
  if (!token) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>잘못된 접근</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert variant="danger">
              <p>유효하지 않은 비밀번호 재설정 링크입니다.</p>
              <p className="mt-2 text-body-sm">
                이메일에서 받은 링크를 다시 확인하거나, 비밀번호 찾기를 다시
                요청해주세요.
              </p>
            </Alert>

            <div className="flex flex-col gap-3">
              <Link href="/forgot-password">
                <Button variant="primary" fullWidth>
                  비밀번호 찾기로 이동
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" fullWidth>
                  로그인으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>비밀번호 재설정</CardTitle>
        <CardDescription>
          새로운 비밀번호를 설정해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}

/**
 * 비밀번호 재설정 페이지
 * URL에서 token을 받아 사용
 */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card variant="elevated">
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <p className="text-body text-neutral-text-sub">로딩 중...</p>
            </div>
          </CardContent>
        </Card>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
