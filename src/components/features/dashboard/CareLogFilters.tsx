'use client';

import { forwardRef } from 'react';
import type { CareLogFilters as CareLogFiltersType } from '@/types/dashboard';
import { SearchInput } from '@/components/ui/SearchInput';
import { DateRangePicker, type DateRange } from '@/components/ui/DateRangePicker';
import { Select } from '@/components/ui/Select';
import { dongOptions } from '@/lib/utils/filter-options';

// ============================================================
// CareLogFilters 컴포넌트
// T037: 돌봄 일지 필터 (검색, 날짜, 드롭다운)
// ============================================================

interface CareLogFiltersProps {
  filters: CareLogFiltersType;
  onSearchChange: (search: string) => void;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  onDongChange: (dong: string | 'all') => void;
  onReset: () => void;
  className?: string;
}

/**
 * CareLogFilters 컴포넌트
 * 돌봄 일지 필터 영역
 */
export const CareLogFilters = forwardRef<HTMLDivElement, CareLogFiltersProps>(
  function CareLogFilters(
    {
      filters,
      onSearchChange,
      onDateRangeChange,
      onDongChange,
      onReset,
      className = '',
    },
    ref
  ) {
    // 필터가 적용되어 있는지 확인
    const hasActiveFilters =
      filters.search !== '' ||
      filters.dateRange.start !== null ||
      filters.dateRange.end !== null ||
      filters.dong !== 'all';

    return (
      <div
        ref={ref}
        className={`
          flex flex-wrap items-center gap-3 p-4
          bg-white rounded-2xl shadow-sm border border-neutral-border/30
          ${className}
        `}
      >
        {/* 검색 */}
        <div className="w-full sm:w-[300px] sm:shrink-0">
          <SearchInput
            value={filters.search}
            onChange={onSearchChange}
            placeholder="대상자, 종사자, 센터명 검색"
            debounceMs={300}
          />
        </div>

        {/* 날짜 범위 */}
        <div className="shrink-0">
          <DateRangePicker
            value={filters.dateRange}
            onChange={(range: DateRange) =>
              onDateRangeChange(range.start, range.end)
            }
            size="md"
          />
        </div>

        {/* 동 필터 */}
        <div className="shrink-0 w-[140px]">
          <Select
            value={filters.dong}
            onChange={(e) => onDongChange(e.target.value as string | 'all')}
            options={dongOptions}
          />
        </div>

        {/* 스페이서 */}
        <div className="flex-1" />

        {/* 초기화 버튼 */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={`
              h-11 px-4 text-sm font-medium
              rounded-lg transition-colors duration-200
              ${hasActiveFilters
                ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                : 'text-neutral-300 cursor-default'
              }
            `}
          >
            초기화
          </button>
        </div>
      </div>
    );
  }
);

export default CareLogFilters;
