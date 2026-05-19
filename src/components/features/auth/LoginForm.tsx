'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button, Input, Checkbox, Alert } from '@/components/ui';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { login as loginApi } from '@/lib/api/auth';
import { useAuth } from '@/hooks/useAuth';

/**
 * 로그인 폼 컴포넌트
 * - 이메일/비밀번호 입력
 * - 로그인 유지 옵션
 * - 실시간 유효성 검증
 * - 에러 처리 (잘못된 로그인, 계정 잠금)
 */
export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await loginApi(data);

      if (response.success && response.data) {
        // 로그인 성공 - 상태 업데이트 후 대시보드로 이동
        login(response.data.user, response.data.token, data.rememberMe);
        router.push('/dashboard');
      } else {
        // 로그인 실패
        setServerError(response.error || '로그인에 실패했습니다.');
      }
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 서버 에러 메시지 */}
      {serverError && (
        <Alert variant="danger" dismissible onDismiss={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      {/* 이메일 입력 */}
      <Input
        type="email"
        label="이메일"
        placeholder="example@email.com"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register('email')}
      />

      {/* 비밀번호 입력 */}
      <Input
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        autoComplete="current-password"
        required
        error={errors.password?.message}
        {...register('password')}
      />

      {/* 로그인 유지 & 비밀번호 찾기 */}
      <div className="flex items-center justify-between flex-nowrap">
        <Checkbox label="로그인 유지" {...register('rememberMe')} />
        <Link href="/forgot-password" className="link text-body-sm shrink-0 whitespace-nowrap">
          비밀번호 찾기
        </Link>
      </div>

      {/* 로그인 버튼 */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        로그인
      </Button>

      {/* 회원가입 링크 */}
      <p className="text-center text-sm text-neutral-text-sub mt-6">
        계정이 없으신가요?{' '}
        <Link
          href="/register"
          className="link font-medium inline-block ml-1 border border-primary text-primary rounded-full px-3 py-0.5 text-sm hover:bg-primary-bg transition-colors"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}
