import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import { LoginForm } from '@/components/features/auth/LoginForm';

export const metadata = {
  title: '로그인 - SafeHi',
  description: 'SafeHi 돌봄 관리 시스템에 로그인하세요.',
};

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
