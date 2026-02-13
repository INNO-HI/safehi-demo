import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm';

export const metadata = {
  title: '비밀번호 찾기 - SafeHi',
  description: '비밀번호를 잊으셨나요? 재설정 링크를 발송해 드립니다.',
};

/**
 * 비밀번호 찾기 페이지
 */
export default function ForgotPasswordPage() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>비밀번호 찾기</CardTitle>
        <CardDescription>
          가입한 이메일로 재설정 링크를 보내드립니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
