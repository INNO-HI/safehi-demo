'use client';

import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button, Input, Alert } from '@/components/ui';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
// import { EmailVerification } from './EmailVerification';  // [메일 인증 기능 비활성화]
import { AgreementCheckbox, defaultAgreements } from './AgreementCheckbox';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { register as registerApi } from '@/lib/api/auth';
import { formatPhoneNumber } from '@/lib/utils/format';

/**
 * 회원가입 폼 컴포넌트
 * - 이름, 이메일(인증), 비밀번호(강도표시), 연락처
 * - 약관 동의 (전체 동의 기능)
 * - 실시간 유효성 검증
 */
export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void emailVerified;
  void setEmailVerified;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      phone: '',
      agreements: {
        terms: false,
        privacy: false,
        marketing: false,
      },
    },
    mode: 'onChange',
  });

  const password = watch('password');
  const email = watch('email');
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void email;

  // 전화번호 자동 포맷팅
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      setValue('phone', formatted, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = async (data: RegisterFormData) => {
    // 이메일 인증 확인 [메일 인증 기능 비활성화 - 체크 제거]
    // if (!emailVerified) {
    //   setServerError('이메일 인증을 완료해주세요.');
    //   return;
    // }

    // 필수 약관 동의 확인
    if (!data.agreements.terms || !data.agreements.privacy) {
      setServerError('필수 약관에 동의해주세요.');
      return;
    }

    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await registerApi(data);

      if (response.success) {
        setSuccessMessage(
          '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.'
        );
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setServerError(response.error || '회원가입에 실패했습니다.');
      }
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <Alert variant="success">
        {successMessage}
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 서버 에러 메시지 */}
      {serverError && (
        <Alert variant="danger" dismissible onDismiss={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      {/* 이름 */}
      <Input
        type="text"
        label="이름"
        placeholder="홍길동"
        autoComplete="name"
        required
        error={errors.name?.message}
        {...register('name')}
      />

      {/* 이메일 + 인증 */}
      <div className="space-y-2">
        <Input
          type="email"
          label="이메일"
          placeholder="example@email.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        {/* 메일 인증 기능 비활성화 */}
        {/* <EmailVerification
          email={email}
          onVerified={() => setEmailVerified(true)}
          disabled={!email || !!errors.email || emailVerified}
        /> */}
      </div>

      {/* 비밀번호 */}
      <div>
        <Input
          type="password"
          label="비밀번호"
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

      {/* 연락처 */}
      <Input
        type="tel"
        label="연락처"
        placeholder="010-0000-0000"
        autoComplete="tel"
        required
        error={errors.phone?.message}
        {...register('phone', {
          onChange: handlePhoneChange,
        })}
      />

      {/* 약관 동의 */}
      <Controller
        name="agreements"
        control={control}
        render={({ field }) => (
          <AgreementCheckbox
            agreements={defaultAgreements}
            values={field.value}
            onChange={field.onChange}
            error={
              errors.agreements?.terms?.message ||
              errors.agreements?.privacy?.message
            }
          />
        )}
      />

      {/* 회원가입 버튼 */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        회원가입
      </Button>

      {/* 로그인 링크 */}
      <p className="text-center text-body text-neutral-text-sub">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="link font-semibold">
          로그인
        </Link>
      </p>
    </form>
  );
}
