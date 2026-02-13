'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

// ============================================================
// T042: DateRangeFilter 컴포넌트
// 날짜 범위 필터
// ============================================================

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  onClear: () => void;
  className?: string;
}

/**
 * Date 객체를 input date 형식 문자열로 변환
 */
function formatDateForInput(date: Date | null): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

/**
 * input date 문자열을 Date 객체로 변환
 */
function parseInputDate(dateString: string): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * 날짜 범위 필터 컴포넌트
 */
export function DateRangeFilter({
  startDate,
  endDate,
  onDateChange,
  onClear,
  className = '',
}: DateRangeFilterProps) {
  const [localStart, setLocalStart] = useState(formatDateForInput(startDate));
  const [localEnd, setLocalEnd] = useState(formatDateForInput(endDate));

  // 외부 상태 변경 시 로컬 상태 동기화
  useEffect(() => {
    setLocalStart(formatDateForInput(startDate));
    setLocalEnd(formatDateForInput(endDate));
  }, [startDate, endDate]);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalStart(value);
    onDateChange(parseInputDate(value), endDate);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalEnd(value);
    onDateChange(startDate, parseInputDate(value));
  };

  const handleClear = () => {
    setLocalStart('');
    setLocalEnd('');
    onClear();
  };

  const hasFilter = startDate || endDate;

  return (
    <div
      className={`flex flex-wrap items-end gap-3 ${className}`}
      role="group"
      aria-label="날짜 범위 필터"
    >
      {/* 시작일 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="filter-start-date"
          className="text-sm font-medium text-neutral-700"
        >
          시작일
        </label>
        <input
          type="date"
          id="filter-start-date"
          value={localStart}
          onChange={handleStartChange}
          max={localEnd || undefined}
          className="
            px-3 py-2 min-h-[44px]
            border border-neutral-300 rounded-lg
            text-sm text-neutral-900
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          "
        />
      </div>

      {/* 구분자 */}
      <span className="text-neutral-400 pb-3" aria-hidden="true">
        ~
      </span>

      {/* 종료일 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="filter-end-date"
          className="text-sm font-medium text-neutral-700"
        >
          종료일
        </label>
        <input
          type="date"
          id="filter-end-date"
          value={localEnd}
          onChange={handleEndChange}
          min={localStart || undefined}
          className="
            px-3 py-2 min-h-[44px]
            border border-neutral-300 rounded-lg
            text-sm text-neutral-900
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          "
        />
      </div>

      {/* 초기화 버튼 */}
      {hasFilter && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleClear}
          className="min-h-[44px]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
            aria-hidden="true"
          >
            <path
              d="M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 4L12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          필터 초기화
        </Button>
      )}
    </div>
  );
}
