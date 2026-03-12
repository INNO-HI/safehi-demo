'use client';

import { forwardRef } from 'react';
import type { ManagerFilters as ManagerFiltersType } from '@/types/dashboard';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { managerDongOptions, centerOptions } from '@/lib/utils/filter-options';

// ============================================================
// ManagerFilters 컴포넌트
// 매니저 필터 (검색, 담당 동, 소속 센터)
// ============================================================

interface ManagerFiltersProps {
  filters: ManagerFiltersType;
  onSearchChange: (search: string) => void;
  onDongChange: (dong: string | 'all') => void;
  onCenterChange: (center: string | 'all') => void;
  onReset: () => void;
  className?: string;
}

/**
 * ManagerFilters 컴포넌트
 * 매니저 필터 영역
 */
export const ManagerFilters = forwardRef<HTMLDivElement, ManagerFiltersProps>(
  function ManagerFilters(
    {
      filters,
      onSearchChange,
      onDongChange,
      onCenterChange,
      onReset,
      className = '',
    },
    ref
  ) {
    // 필터가 적용되어 있는지 확인
    const hasActiveFilters =
      filters.search !== '' ||
      filters.dong !== 'all' ||
      filters.center !== 'all';

    return (
      <div
        ref={ref}
        className={`
          flex items-center gap-3 p-4
          bg-white rounded-2xl shadow-sm border border-neutral-border/30
          ${className}
        `}
      >
        {/* 검색 */}
        <div className="w-[300px] shrink-0">
          <SearchInput
            value={filters.search}
            onChange={onSearchChange}
            placeholder="매니저 이름 검색"
            debounceMs={300}
          />
        </div>

        {/* 담당 동 필터 */}
        <div className="shrink-0 w-[140px]">
          <Select
            value={filters.dong}
            onChange={(e) => onDongChange(e.target.value as string | 'all')}
            options={managerDongOptions}
          />
        </div>

        {/* 소속 센터 필터 */}
        <div className="shrink-0 w-[180px]">
          <Select
            value={filters.center}
            onChange={(e) => onCenterChange(e.target.value as string | 'all')}
            options={centerOptions}
          />
        </div>

        {/* 스페이서 */}
        <div className="flex-1" />

        {/* 초기화 버튼 (항상 표시) */}
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

export default ManagerFilters;
