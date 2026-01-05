import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import { RegisterForm } from '@/components/features/auth/RegisterForm';

export const metadata = {
  title: '회원가입 - SafeHi',
  description: 'SafeHi 돌봄 관리 시스템에 가입하세요.',
};

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
