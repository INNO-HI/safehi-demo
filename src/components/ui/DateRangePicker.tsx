'use client';

import { forwardRef, useId, useState, useCallback } from 'react';
import { formatDate } from '@/lib/utils/date';

// ============================================================
// DateRangePicker 컴포넌트
// T010: 날짜 범위 선택 컴포넌트
// ============================================================

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  /** 시작 날짜 레이블 */
  startLabel?: string;
  /** 종료 날짜 레이블 */
  endLabel?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 최소 날짜 */
  minDate?: Date;
  /** 최대 날짜 */
  maxDate?: Date;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 수직 배치 */
  vertical?: boolean;
}

// 크기별 스타일
const sizeStyles = {
  sm: 'h-9 text-sm px-3',
  md: 'h-11 text-base px-4',
  lg: 'h-12 text-lg px-5',
};

/**
 * DateRangePicker 컴포넌트
 * 날짜 범위 선택에 사용
 */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      value,
      onChange,
      className = '',
      startLabel = '시작일',
      endLabel = '종료일',
      disabled = false,
      minDate,
      maxDate,
      size = 'md',
      vertical = false,
    },
    ref
  ) {
    const id = useId();
    const [error, setError] = useState<string | null>(null);

    // 날짜 문자열을 Date로 변환
    const parseDate = (dateStr: string): Date | null => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    };

    // Date를 input[type="date"]용 문자열로 변환
    const toInputValue = (date: Date | null): string => {
      if (!date) return '';
      return formatDate(date);
    };

    // 시작일 변경
    const handleStartChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = parseDate(e.target.value);

        // 유효성 검사
        if (newStart && value.end && newStart > value.end) {
          setError('시작일은 종료일보다 이전이어야 합니다');
          return;
        }

        setError(null);
        onChange({ ...value, start: newStart });
      },
      [onChange, value]
    );

    // 종료일 변경
    const handleEndChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEnd = parseDate(e.target.value);

        // 유효성 검사
        if (newEnd && value.start && newEnd < value.start) {
          setError('종료일은 시작일보다 이후여야 합니다');
          return;
        }

        setError(null);
        onChange({ ...value, end: newEnd });
      },
      [onChange, value]
    );

    // 초기화
    const handleClear = useCallback(() => {
      setError(null);
      onChange({ start: null, end: null });
    }, [onChange]);

    const containerClass = vertical
      ? 'flex flex-col gap-3'
      : 'flex flex-wrap items-center gap-3';

    return (
      <div ref={ref} className={`${className}`}>
        <div className={containerClass}>
          {/* 시작일 */}
          <div className="flex items-center gap-2">
            <label
              htmlFor={`${id}-start`}
              className="text-sm font-medium text-neutral-600 whitespace-nowrap"
            >
              {startLabel}
            </label>
            <input
              id={`${id}-start`}
              type="date"
              value={toInputValue(value.start)}
              onChange={handleStartChange}
              disabled={disabled}
              min={minDate ? toInputValue(minDate) : undefined}
              max={maxDate ? toInputValue(maxDate) : undefined}
              className={`
                rounded-lg border border-neutral-300
                bg-white text-neutral-900
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                disabled:bg-neutral-100 disabled:cursor-not-allowed
                transition-colors duration-200
                ${sizeStyles[size]}
              `}
            />
          </div>

          {/* 구분자 */}
          <span className="text-neutral-400" aria-hidden="true">
            ~
          </span>

          {/* 종료일 */}
          <div className="flex items-center gap-2">
            <label
              htmlFor={`${id}-end`}
              className="text-sm font-medium text-neutral-600 whitespace-nowrap"
            >
              {endLabel}
            </label>
            <input
              id={`${id}-end`}
              type="date"
              value={toInputValue(value.end)}
              onChange={handleEndChange}
              disabled={disabled}
              min={minDate ? toInputValue(minDate) : undefined}
              max={maxDate ? toInputValue(maxDate) : undefined}
              className={`
                rounded-lg border border-neutral-300
                bg-white text-neutral-900
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                disabled:bg-neutral-100 disabled:cursor-not-allowed
                transition-colors duration-200
                ${sizeStyles[size]}
              `}
            />
          </div>

          {/* 초기화 버튼 */}
          {(value.start || value.end) && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="
                px-3 py-1.5 text-sm text-neutral-600
                hover:text-neutral-900 hover:bg-neutral-100
                rounded-md transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              초기화
            </button>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default DateRangePicker;
