'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { sendEmailVerification, verifyEmailCode } from '@/lib/api/auth';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  disabled?: boolean;
}

/**
 * 이메일 인증 컴포넌트
 * - 인증 코드 발송
 * - 인증 코드 입력 및 확인
 * - 재발송 타이머 (60초)
 */
export function EmailVerification({
  email,
  onVerified,
  disabled = false,
}: EmailVerificationProps) {
  const [step, setStep] = useState<'initial' | 'code-sent' | 'verified'>(
    'initial'
  );
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // 재발송 타이머
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendCode = async () => {
    if (!email || disabled) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await sendEmailVerification(email);

      if (response.success) {
        setStep('code-sent');
        setResendTimer(60);
      } else {
        setError(response.error || '인증 코드 발송에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError('인증 코드를 입력해주세요.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await verifyEmailCode(email, code);

      if (response.success) {
        setStep('verified');
        onVerified();
      } else {
        setError(response.error || '인증 코드가 올바르지 않습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'verified') {
    return (
      <div className="flex items-center gap-2 text-status-success">
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-body-sm">이메일 인증 완료</span>
      </div>
    );
  }

  if (step === 'code-sent') {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="인증 코드 6자리"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            error={error || undefined}
            className="flex-1"
          />
          <Button
            type="button"
            variant="primary"
            onClick={handleVerifyCode}
            loading={isLoading}
            disabled={isLoading || !code.trim()}
          >
            확인
          </Button>
        </div>

        <div className="flex items-center justify-between text-caption text-neutral-text-sub">
          <span>인증 코드가 발송되었습니다. (테스트: 123456)</span>
          <button
            type="button"
            onClick={handleSendCode}
            disabled={resendTimer > 0 || isLoading}
            className="text-primary hover:underline disabled:text-neutral-text-tertiary disabled:no-underline"
          >
            {resendTimer > 0 ? `재발송 (${resendTimer}초)` : '재발송'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="soft"
        size="sm"
        onClick={handleSendCode}
        loading={isLoading}
        disabled={disabled || isLoading || !email}
      >
        인증 코드 발송
      </Button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
