'use client';

import { forwardRef } from 'react';
import type { RecipientFilters as RecipientFiltersType } from '@/types/dashboard';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { recipientDongOptions, managerOptions } from '@/lib/utils/filter-options';

// ============================================================
// RecipientFilters 컴포넌트
// T048: 대상자 필터 (검색, 동, 매니저)
// ============================================================

interface RecipientFiltersProps {
  filters: RecipientFiltersType;
  onSearchChange: (search: string) => void;
  onDongChange: (dong: string | 'all') => void;
  onManagerChange: (manager: string | 'all') => void;
  onReset: () => void;
  className?: string;
}

/**
 * RecipientFilters 컴포넌트
 * 대상자 필터 영역
 */
export const RecipientFilters = forwardRef<HTMLDivElement, RecipientFiltersProps>(
  function RecipientFilters(
    {
      filters,
      onSearchChange,
      onDongChange,
      onManagerChange,
      onReset,
      className = '',
    },
    ref
  ) {
    // 필터가 적용되어 있는지 확인
    const hasActiveFilters =
      filters.search !== '' ||
      filters.dong !== 'all' ||
      filters.manager !== 'all';

    return (
      <div
        ref={ref}
        className={`
          flex flex-wrap items-center gap-3 p-4
          bg-white rounded-lg border border-neutral-200
          ${className}
        `}
      >
        {/* 검색 */}
        <div className="w-full sm:w-[300px]">
          <SearchInput
            value={filters.search}
            onChange={onSearchChange}
            placeholder="이름, 주소, 동 검색"
            debounceMs={300}
          />
        </div>

        {/* 동 필터 */}
        <div className="min-w-[150px]">
          <Select
            value={filters.dong}
            onChange={(e) => onDongChange(e.target.value as string | 'all')}
            options={recipientDongOptions}
          />
        </div>

        {/* 담당 매니저 필터 */}
        <div className="min-w-[150px]">
          <Select
            value={filters.manager}
            onChange={(e) => onManagerChange(e.target.value as string | 'all')}
            options={managerOptions}
          />
        </div>

        {/* 초기화 버튼 (항상 표시, 비활성 시 투명) */}
        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className={`
            h-11 px-4 text-sm font-medium
            rounded-lg transition-colors duration-200
            ${hasActiveFilters
              ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              : 'text-transparent cursor-default pointer-events-none'
            }
          `}
        >
          필터 초기화
        </button>
      </div>
    );
  }
);

export default RecipientFilters;
