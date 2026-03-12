'use client';

import { forwardRef } from 'react';

// ============================================================
// Badge 컴포넌트
// T007: 상태별 색상 변형 지원
// ============================================================

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  /** 점(dot) 표시 여부 */
  dot?: boolean;
  /** 숫자 배지 (알림 카운트 등) */
  count?: number;
}

// 변형별 스타일
const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-status-muted-light text-[#6B7685]',
  success: 'bg-status-success-light text-status-success',
  warning: 'bg-status-warning-light text-status-warning',
  danger: 'bg-status-danger-light text-status-danger animate-urgent-pulse',
  info: 'bg-status-info-light text-status-info',
};

// 크기별 스타일
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

// 점 스타일
const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-status-muted',
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
  info: 'bg-status-info',
};

/**
 * Badge 컴포넌트
 * 상태 표시, 카운트, 태그 등에 사용
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, variant = 'default', size = 'md', className = '', dot = false, count },
  ref
) {
  // 카운트가 있는 경우 숫자 배지로 표시
  if (count !== undefined) {
    const displayCount = count > 99 ? '99+' : count;
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center justify-center
          min-w-[20px] h-5 px-1.5
          rounded-full text-xs font-medium
          bg-status-danger text-white
          ${className}
        `}
      >
        {displayCount}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={`
        inline-flex items-center gap-1.5
        rounded-full font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
});

export default Badge;
