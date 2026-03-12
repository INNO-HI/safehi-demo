'use client';

import { type HTMLAttributes, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';

export interface StatisticsHeaderProps extends HTMLAttributes<HTMLElement> {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

/**
 * 통계 페이지 헤더 컴포넌트
 * 제목과 기간 선택 드롭다운 (연월 통합)
 */
export function StatisticsHeader({
  selectedMonth,
  onMonthChange,
  className,
  ...props
}: StatisticsHeaderProps) {
  // 최근 12개월 옵션 생성
  const availableMonths = useMemo(() => {
    const months: { value: string; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      months.push({
        value: `${year}-${String(month).padStart(2, '0')}`,
        label: `${year}년 ${month}월`,
      });
    }
    return months;
  }, []);

  return (
    <header
      className={cn('flex items-center justify-between', className)}
      {...props}
    >
      {/* 페이지 제목 */}
      <h1 className="text-h1 text-neutral-text">통계/리포트</h1>

      {/* 기간 선택 */}
      <div className="relative">
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className={cn(
            'h-11 px-4 pr-10 appearance-none',
            'bg-white border border-neutral-border rounded-lg',
            'text-body text-neutral-text',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'cursor-pointer min-w-[140px]'
          )}
          aria-label="기간 선택"
        >
          {availableMonths.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-text-sub">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}
