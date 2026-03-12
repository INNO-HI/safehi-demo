'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import { RegisterForm } from '@/components/features/auth/RegisterForm';

/**
 * 회원가입 페이지
 */
export default function RegisterPage() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          안심하이 서비스 이용을 위해 계정을 생성해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
