'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role'> {
  label?: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Toggle 스위치 컴포넌트
 * 접근성: role="switch", aria-checked, 최소 44x44px 터치 영역
 */
const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      className,
      label,
      description,
      checked = false,
      onCheckedChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const toggleId = id || props.name;

    return (
      <label
        htmlFor={toggleId}
        className={cn(
          'flex items-center justify-between gap-3 cursor-pointer min-h-[44px]',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <span className="block text-body font-medium text-neutral-text">
                {label}
              </span>
            )}
            {description && (
              <span className="block text-caption text-neutral-text-sub mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            id={toggleId}
            type="checkbox"
            role="switch"
            aria-checked={checked}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="sr-only peer"
            {...props}
          />
          {/* 트랙 */}
          <div
            className={cn(
              'w-11 h-6 rounded-full transition-colors duration-200',
              'peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary-light',
              checked ? 'bg-[#3b82f6]' : 'bg-[#e2e8f0]'
            )}
          />
          {/* 썸 (동그라미) */}
          <div
            className={cn(
              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full',
              'shadow-sm transition-transform duration-200',
              checked && 'translate-x-5'
            )}
          />
        </div>
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

export { Toggle };
