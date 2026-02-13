'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { Button, Input, Alert } from '@/components/ui';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/lib/validations/auth';
import { sendPasswordResetLink } from '@/lib/api/auth';

/**
 * 비밀번호 찾기 폼 컴포넌트
 * - 이메일 입력으로 재설정 링크 발송
 * - 보안: 이메일 존재 여부와 무관하게 동일한 응답
 */
export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await sendPasswordResetLink(data);

      if (response.success) {
        setIsSuccess(true);
      } else {
        // 보안: 실제로는 실패해도 동일한 응답을 보여줌
        setIsSuccess(true);
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
        <Alert variant="success" title="이메일 발송 완료">
          <p>
            <strong>{getValues('email')}</strong>로 비밀번호 재설정 링크를
            발송했습니다.
          </p>
          <p className="mt-2 text-body-sm">
            이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요.
          </p>
        </Alert>

        <div className="text-center space-y-3">
          <Button
            type="button"
            variant="soft"
            fullWidth
            onClick={() => setIsSuccess(false)}
          >
            다른 이메일로 재시도
          </Button>
          <p className="text-body-sm text-neutral-text-sub">
            <Link href="/login" className="link">
              로그인으로 돌아가기
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 안내 문구 */}
      <p className="text-body text-neutral-text-sub">
        가입 시 사용한 이메일 주소를 입력하시면 비밀번호 재설정 링크를
        보내드립니다.
      </p>

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

      {/* 재설정 링크 발송 버튼 */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        재설정 링크 발송
      </Button>

      {/* 로그인 링크 */}
      <p className="text-center text-body text-neutral-text-sub">
        비밀번호가 기억나셨나요?{' '}
        <Link href="/login" className="link font-semibold">
          로그인
        </Link>
      </p>
    </form>
  );
}
