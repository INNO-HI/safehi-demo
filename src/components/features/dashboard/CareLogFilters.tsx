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
          flex flex-wrap items-end gap-4 p-4
          bg-white rounded-lg border border-neutral-200
          ${className}
        `}
      >
        {/* 검색 */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-neutral-600 mb-1.5">
            검색
          </label>
          <SearchInput
            value={filters.search}
            onChange={onSearchChange}
            placeholder="대상자, 종사자, 센터명 검색"
            debounceMs={300}
          />
        </div>

        {/* 날짜 범위 */}
        <div className="min-w-[300px]">
          <label className="block text-sm font-medium text-neutral-600 mb-1.5">
            방문일
          </label>
          <DateRangePicker
            value={filters.dateRange}
            onChange={(range: DateRange) =>
              onDateRangeChange(range.start, range.end)
            }
            size="md"
          />
        </div>

        {/* 동 필터 */}
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-neutral-600 mb-1.5">
            동
          </label>
          <Select
            value={filters.dong}
            onChange={(e) => onDongChange(e.target.value as string | 'all')}
            options={dongOptions}
          />
        </div>

        {/* 초기화 버튼 */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="
              h-11 px-4 text-sm font-medium
              text-neutral-600 hover:text-neutral-900
              hover:bg-neutral-100 rounded-lg
              transition-colors duration-200
            "
          >
            필터 초기화
          </button>
        )}
      </div>
    );
  }
);

export default CareLogFilters;
