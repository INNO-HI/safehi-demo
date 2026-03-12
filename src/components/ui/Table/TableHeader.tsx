'use client';

import { forwardRef, useCallback } from 'react';
import type { SortDirection } from '@/types/dashboard';

// ============================================================
// TableHeader 컴포넌트
// T012: 테이블 헤더 행
// ============================================================

export interface ColumnDef {
  id: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableHeaderProps {
  columns: ColumnDef[];
  className?: string;
  /** 체크박스 표시 */
  showCheckbox?: boolean;
  /** 전체 선택 상태 */
  isAllSelected?: boolean;
  /** 전체 선택 토글 */
  onSelectAll?: () => void;
  /** 정렬 컬럼 */
  sortColumn?: string | null;
  /** 정렬 방향 */
  sortDirection?: SortDirection;
  /** 정렬 변경 */
  onSort?: (columnId: string) => void;
}

/**
 * 정렬 아이콘 컴포넌트
 */
function SortIcon({
  direction,
  isActive,
}: {
  direction: SortDirection;
  isActive: boolean;
}) {
  return (
    <span
      className={`ml-1 inline-flex flex-col ${isActive ? 'text-primary-600' : 'text-neutral-300'}`}
      aria-hidden="true"
    >
      <svg
        className={`w-3 h-3 -mb-1 ${direction === 'asc' && isActive ? 'text-primary-600' : ''}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 8l-6 6h12z" />
      </svg>
      <svg
        className={`w-3 h-3 ${direction === 'desc' && isActive ? 'text-primary-600' : ''}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 16l-6-6h12z" />
      </svg>
    </span>
  );
}

/**
 * TableHeader 컴포넌트
 * 테이블 헤더 행
 */
export const TableHeader = forwardRef<HTMLTableRowElement, TableHeaderProps>(
  function TableHeader(
    {
      columns,
      className = '',
      showCheckbox = false,
      isAllSelected = false,
      onSelectAll,
      sortColumn,
      sortDirection,
      onSort,
    },
    ref
  ) {
    const handleSort = useCallback(
      (columnId: string) => {
        if (onSort) {
          onSort(columnId);
        }
      },
      [onSort]
    );

    const alignStyles = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };

    return (
      <tr ref={ref} className={className}>
        {/* 체크박스 컬럼 */}
        {showCheckbox && (
          <th
            scope="col"
            className="px-3 py-3 w-10"
          >
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onSelectAll}
                aria-label="전체 선택"
                className="
                  w-4 h-4 rounded border-neutral-300
                  text-primary-600 focus:ring-primary-500
                  cursor-pointer
                "
              />
            </div>
          </th>
        )}

        {/* 데이터 컬럼 */}
        {columns.map((column) => {
          const isActive = sortColumn === column.id;
          const isSortable = column.sortable ?? false;

          return (
            <th
              key={column.id}
              scope="col"
              style={column.width ? { width: column.width } : undefined}
              className={`
                px-4 py-3 text-sm font-semibold text-neutral-700
                ${alignStyles[column.align || 'left']}
                ${isSortable ? 'cursor-pointer select-none hover:bg-neutral-100' : ''}
              `}
              onClick={isSortable ? () => handleSort(column.id) : undefined}
              aria-sort={
                isActive
                  ? sortDirection === 'asc'
                    ? 'ascending'
                    : sortDirection === 'desc'
                      ? 'descending'
                      : 'none'
                  : undefined
              }
            >
              <div className="inline-flex items-center">
                {column.label}
                {isSortable && (
                  <SortIcon
                    direction={isActive ? sortDirection ?? null : null}
                    isActive={isActive}
                  />
                )}
              </div>
            </th>
          );
        })}
      </tr>
    );
  }
);

export default TableHeader;
