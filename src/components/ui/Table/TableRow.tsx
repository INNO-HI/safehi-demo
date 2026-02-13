'use client';

import { forwardRef } from 'react';

// ============================================================
// TableRow 컴포넌트
// T013: 테이블 데이터 행
// ============================================================

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  /** 선택됨 상태 */
  isSelected?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 호버 효과 비활성화 */
  disableHover?: boolean;
  /** 행 ID (접근성) */
  id?: string;
}

/**
 * TableRow 컴포넌트
 * 테이블 데이터 행
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    {
      children,
      className = '',
      isSelected = false,
      onClick,
      disableHover = false,
      id,
    },
    ref
  ) {
    const isClickable = !!onClick;

    return (
      <tr
        ref={ref}
        id={id}
        onClick={onClick}
        className={`
          transition-colors duration-150
          ${isSelected ? 'bg-primary-50' : 'bg-white'}
          ${!disableHover ? 'hover:bg-neutral-50' : ''}
          ${isClickable ? 'cursor-pointer' : ''}
          ${className}
        `}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
        aria-selected={isSelected}
      >
        {children}
      </tr>
    );
  }
);

// ============================================================
// TableRowCheckbox 컴포넌트
// ============================================================

export interface TableRowCheckboxProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
}

export const TableRowCheckbox = forwardRef<HTMLInputElement, TableRowCheckboxProps>(
  function TableRowCheckbox({ checked, onChange, ariaLabel = '선택' }, ref) {
    return (
      <td className="px-4 py-3 w-12">
        <div className="flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              e.stopPropagation();
              onChange();
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label={ariaLabel}
            className="
              w-5 h-5 rounded border-neutral-300
              text-primary-600 focus:ring-primary-500
              cursor-pointer
            "
          />
        </div>
      </td>
    );
  }
);

// ============================================================
// EmptyRow 컴포넌트
// ============================================================

export interface EmptyRowProps {
  colSpan: number;
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyRow({
  colSpan,
  message = '데이터가 없습니다',
  icon,
}: EmptyRowProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-neutral-500"
      >
        <div className="flex flex-col items-center gap-3">
          {icon || (
            <svg
              className="w-12 h-12 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          )}
          <span className="text-base">{message}</span>
        </div>
      </td>
    </tr>
  );
}

export default TableRow;
