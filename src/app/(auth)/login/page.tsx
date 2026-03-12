'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui';
import { LoginForm } from '@/components/features/auth/LoginForm';

/**
 * 로그인 페이지
 */
export default function LoginPage() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
