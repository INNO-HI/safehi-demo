'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { passwordStrengthChecks, getPasswordStrength } from '@/lib/validations/auth';

interface PasswordStrengthIndicatorProps {
  password: string;
}

/**
 * 비밀번호 강도 표시 컴포넌트
 * - 실시간으로 비밀번호 조건 충족 여부 표시
 * - 강도 바 시각화
 */
export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const checks = useMemo(() => passwordStrengthChecks(password), [password]);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const strengthConfig = {
    weak: { label: '약함', color: 'bg-status-danger', barCount: 1 },
    medium: { label: '보통', color: 'bg-status-warning', barCount: 2 },
    strong: { label: '강함', color: 'bg-status-success', barCount: 3 },
  };

  const config = strengthConfig[strength];

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-3">
      {/* 강도 바 */}
      <div className="space-y-1">
        <div className="flex gap-1">
          {[1, 2, 3].map((bar) => (
            <div
              key={bar}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                bar <= config.barCount ? config.color : 'bg-neutral-border'
              )}
            />
          ))}
        </div>
        <p className={cn('text-caption', {
          'text-status-danger': strength === 'weak',
          'text-status-warning': strength === 'medium',
          'text-status-success': strength === 'strong',
        })}>
          비밀번호 강도: {config.label}
        </p>
      </div>

      {/* 조건 체크리스트 */}
      <ul className="space-y-1">
        <ConditionItem
          met={checks.minLength}
          label="8자 이상"
        />
        <ConditionItem
          met={checks.hasSpecialChar}
          label="특수문자 포함"
        />
        <ConditionItem
          met={checks.hasNumber}
          label="숫자 포함"
        />
      </ul>
    </div>
  );
}

interface ConditionItemProps {
  met: boolean;
  label: string;
}

function ConditionItem({ met, label }: ConditionItemProps) {
  return (
    <li className="flex items-center gap-2 text-caption">
      {met ? (
        <svg
          className="w-4 h-4 text-status-success"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-neutral-text-tertiary"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="3" />
        </svg>
      )}
      <span
        className={cn(
          met ? 'text-status-success' : 'text-neutral-text-tertiary'
        )}
      >
        {label}
      </span>
    </li>
  );
}
