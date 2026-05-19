'use client';

import { forwardRef, useId } from 'react';

// ============================================================
// Tabs 컴포넌트
// T008: 상태 탭용 컴포넌트
// ============================================================

export interface TabOption<T extends string = string> {
  value: T;
  label: string;
  count?: number;
  disabled?: boolean;
  /** 카운트 뱃지 색상 (활성/비활성 모두) */
  badgeColor?: { active: string; inactive: string };
}

export interface TabsProps<T extends string = string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /** 탭 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  /** 접근성 라벨 */
  ariaLabel?: string;
}

// 크기별 스타일
const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-2.5 text-lg',
};

/**
 * Tabs 컴포넌트
 * 상태 필터링 탭에 사용
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs<T extends string>(
  {
    options,
    value,
    onChange,
    className = '',
    size = 'md',
    fullWidth = false,
    ariaLabel = '탭 목록',
  }: TabsProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const id = useId();

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={ariaLabel}
      className={`
        flex gap-1.5 p-1 rounded-xl bg-neutral-100 overflow-x-auto
        ${fullWidth ? 'w-full' : 'max-w-full'}
        ${className}
      `}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const tabId = `${id}-tab-${option.value}`;

        return (
          <button
            key={option.value}
            id={tabId}
            role="tab"
            type="button"
            aria-selected={isSelected}
            aria-controls={`${id}-panel-${option.value}`}
            disabled={option.disabled}
            onClick={() => onChange(option.value as T)}
            className={`
              relative flex items-center justify-center gap-1.5 whitespace-nowrap
              rounded-lg font-medium transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
              min-w-[44px] min-h-[44px] px-3
              ${sizeStyles[size]}
              ${fullWidth ? 'flex-1' : ''}
              ${
                isSelected
                  ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-black/5'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }
              ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span>{option.label}</span>
            {option.count !== undefined && (
              <span
                className={`
                  inline-flex items-center justify-center
                  min-w-[20px] h-5 px-1.5
                  rounded-full text-xs font-medium
                  ${
                    option.badgeColor
                      ? (isSelected ? option.badgeColor.active : option.badgeColor.inactive)
                      : (isSelected ? 'bg-primary-100 text-primary-700' : 'bg-neutral-200 text-neutral-600')
                  }
                `}
              >
                {option.count > 99 ? '99+' : option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}) as <T extends string>(
  props: TabsProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

export default Tabs;
