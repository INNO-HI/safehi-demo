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
            placeholder="매니저 이름 검색"
            debounceMs={300}
          />
        </div>

        {/* 담당 동 필터 */}
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-neutral-600 mb-1.5">
            담당 동
          </label>
          <Select
            value={filters.dong}
            onChange={(e) => onDongChange(e.target.value as string | 'all')}
            options={managerDongOptions}
          />
        </div>

        {/* 소속 센터 필터 */}
        <div className="min-w-[180px]">
          <label className="block text-sm font-medium text-neutral-600 mb-1.5">
            소속 센터
          </label>
          <Select
            value={filters.center}
            onChange={(e) => onCenterChange(e.target.value as string | 'all')}
            options={centerOptions}
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

export default ManagerFilters;
