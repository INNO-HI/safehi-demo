'use client';

import dynamic from 'next/dynamic';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';

const LoginForm = dynamic(
  () => import('@/components/features/auth/LoginForm').then(mod => ({ default: mod.LoginForm })),
  { ssr: false }
);

/**
 * 로그인 페이지
 */
export default function LoginPage() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>
          SafeHi에 오신 것을 환영합니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
