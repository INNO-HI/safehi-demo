'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button, Input, Alert } from '@/components/ui';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/lib/validations/auth';
import { resetPassword } from '@/lib/api/auth';

interface ResetPasswordFormProps {
  token: string;
}

/**
 * 비밀번호 재설정 폼 컴포넌트
 * - 새 비밀번호 입력 (강도 표시)
 * - 비밀번호 확인
 * - 토큰 검증
 */
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await resetPassword({
        ...data,
        token,
      });

      if (response.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setServerError(
          response.error || '비밀번호 재설정에 실패했습니다.'
        );
      }
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <Alert variant="success" title="비밀번호 변경 완료">
          <p>비밀번호가 성공적으로 변경되었습니다.</p>
          <p className="mt-2 text-body-sm">
            잠시 후 로그인 페이지로 이동합니다.
          </p>
        </Alert>

        <div className="text-center">
          <Link href="/login" className="link font-semibold">
            지금 로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 안내 문구 */}
      <p className="text-body text-neutral-text-sub">
        새로운 비밀번호를 입력해주세요.
      </p>

      {/* 서버 에러 메시지 */}
      {serverError && (
        <Alert variant="danger" dismissible onDismiss={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      {/* 새 비밀번호 */}
      <div>
        <Input
          type="password"
          label="새 비밀번호"
          placeholder="8자 이상, 특수문자 및 숫자 포함"
          autoComplete="new-password"
          required
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrengthIndicator password={password || ''} />
      </div>

      {/* 비밀번호 확인 */}
      <Input
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력하세요"
        autoComplete="new-password"
        required
        error={errors.passwordConfirm?.message}
        {...register('passwordConfirm')}
      />

      {/* 비밀번호 변경 버튼 */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        비밀번호 변경
      </Button>

      {/* 로그인 링크 */}
      <p className="text-center text-body text-neutral-text-sub">
        <Link href="/login" className="link">
          로그인으로 돌아가기
        </Link>
      </p>
    </form>
  );
}
