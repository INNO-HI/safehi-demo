'use client';

import dynamic from 'next/dynamic';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';

const RegisterForm = dynamic(
  () => import('@/components/features/auth/RegisterForm').then(mod => ({ default: mod.RegisterForm })),
  { ssr: false }
);

/**
 * 회원가입 페이지
 */
export default function RegisterPage() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          SafeHi 서비스 이용을 위해 계정을 생성해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
