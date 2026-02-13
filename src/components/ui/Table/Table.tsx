'use client';

import { forwardRef } from 'react';

// ============================================================
// Table 컴포넌트
// T011: 테이블 컨테이너
// ============================================================

export interface TableProps {
  children: React.ReactNode;
  className?: string;
  /** 고정 레이아웃 사용 */
  fixedLayout?: boolean;
  /** 스트라이프 배경 */
  striped?: boolean;
  /** 호버 효과 */
  hoverable?: boolean;
  /** 테두리 */
  bordered?: boolean;
  /** 컴팩트 모드 */
  compact?: boolean;
  /** 접근성 라벨 */
  ariaLabel?: string;
  /** 접근성 설명 ID */
  ariaDescribedBy?: string;
}

/**
 * Table 컴포넌트
 * 데이터 테이블의 컨테이너
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    children,
    className = '',
    fixedLayout = false,
    striped = false,
    hoverable = true,
    bordered = false,
    compact = false,
    ariaLabel,
    ariaDescribedBy,
  },
  ref
) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table
        ref={ref}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={`
          w-full text-left
          ${fixedLayout ? 'table-fixed' : 'table-auto'}
          ${striped ? 'table-striped' : ''}
          ${hoverable ? 'table-hoverable' : ''}
          ${bordered ? 'table-bordered' : ''}
          ${compact ? 'table-compact' : ''}
          ${className}
        `}
      >
        {children}
      </table>
    </div>
  );
});

// ============================================================
// TableHead 컴포넌트
// ============================================================

export interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead({ children, className = '' }, ref) {
    return (
      <thead
        ref={ref}
        className={`bg-neutral-50 border-b border-neutral-200 ${className}`}
      >
        {children}
      </thead>
    );
  }
);

// ============================================================
// TableBody 컴포넌트
// ============================================================

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ children, className = '' }, ref) {
    return (
      <tbody ref={ref} className={`divide-y divide-neutral-200 ${className}`}>
        {children}
      </tbody>
    );
  }
);

// ============================================================
// TableCell 컴포넌트
// ============================================================

export interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
  /** 헤더 셀 여부 */
  isHeader?: boolean;
  /** 정렬 */
  align?: 'left' | 'center' | 'right';
  /** 컬럼 스팬 */
  colSpan?: number;
  /** 행 스팬 */
  rowSpan?: number;
  /** 너비 */
  width?: string;
}

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const TableCell = forwardRef<
  HTMLTableCellElement,
  TableCellProps
>(function TableCell(
  {
    children,
    className = '',
    isHeader = false,
    align = 'left',
    colSpan,
    rowSpan,
    width,
  },
  ref
) {
  const Component = isHeader ? 'th' : 'td';
  const baseStyles = isHeader
    ? 'px-4 py-3 text-sm font-semibold text-neutral-700'
    : 'px-4 py-3 text-sm text-neutral-900';

  return (
    <Component
      ref={ref as React.Ref<HTMLTableCellElement>}
      colSpan={colSpan}
      rowSpan={rowSpan}
      style={width ? { width } : undefined}
      className={`
        ${baseStyles}
        ${alignStyles[align]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
});

export default Table;
