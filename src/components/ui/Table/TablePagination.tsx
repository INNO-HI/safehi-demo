'use client';

import { forwardRef, useCallback, useMemo } from 'react';
import type { PageSize } from '@/types/dashboard';
import { pageSizeOptions } from '@/types/dashboard';

// ============================================================
// TablePagination 컴포넌트
// T014: 테이블 페이지네이션
// ============================================================

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: PageSize;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;
  className?: string;
  /** 페이지 사이즈 변경 가능 */
  showPageSize?: boolean;
  /** 표시할 페이지 버튼 수 */
  siblingCount?: number;
}

/**
 * 페이지 범위 계산
 */
function getPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis')[] {
  const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', totalPages];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightRange = Array.from(
      { length: 3 + 2 * siblingCount },
      (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
    );
    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
}

/**
 * TablePagination 컴포넌트
 * 테이블 페이지네이션
 */
export const TablePagination = forwardRef<HTMLDivElement, TablePaginationProps>(
  function TablePagination(
    {
      currentPage,
      totalPages,
      pageSize,
      totalItems,
      onPageChange,
      onPageSizeChange,
      className = '',
      showPageSize = true,
      siblingCount = 1,
    },
    ref
  ) {
    const pages = useMemo(
      () => getPageRange(currentPage, totalPages, siblingCount),
      [currentPage, totalPages, siblingCount]
    );

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const handlePrevious = useCallback(() => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }, [currentPage, onPageChange]);

    const handleNext = useCallback(() => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    }, [currentPage, totalPages, onPageChange]);

    const handlePageSizeChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onPageSizeChange(Number(e.target.value) as PageSize);
      },
      [onPageSizeChange]
    );

    if (totalPages === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={`
          flex flex-wrap items-center justify-between gap-4
          px-4 py-3 border-t border-neutral-200 bg-white
          ${className}
        `}
      >
        {/* 왼쪽: 표시 정보 */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-600">
            {totalItems > 0 ? (
              <>
                <span className="font-medium">{startItem}</span>
                {' - '}
                <span className="font-medium">{endItem}</span>
                {' / '}
                <span className="font-medium">{totalItems}</span>건
              </>
            ) : (
              '0건'
            )}
          </span>

          {showPageSize && (
            <div className="flex items-center gap-2">
              <label htmlFor="page-size" className="text-sm text-neutral-600">
                표시
              </label>
              <select
                id="page-size"
                value={pageSize}
                onChange={handlePageSizeChange}
                className="
                  h-9 px-2 text-sm rounded-md
                  border border-neutral-300
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                "
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}개
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 오른쪽: 페이지 버튼 */}
        <nav aria-label="페이지 탐색" className="flex items-center gap-1">
          {/* 이전 버튼 */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
            className="
              w-7 h-7 flex items-center justify-center
              rounded-full text-neutral-text-sub
              hover:bg-neutral-bg disabled:opacity-40
              disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* 페이지 번호 */}
          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-7 h-7 flex items-center justify-center text-neutral-text-tertiary text-sm"
                >
                  ...
                </span>
              );
            }

            const isCurrentPage = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isCurrentPage ? 'page' : undefined}
                className={`
                  min-w-[28px] h-7 px-2 flex items-center justify-center
                  rounded-full text-sm font-medium
                  transition-colors duration-200
                  ${
                    isCurrentPage
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-neutral-text-sub hover:bg-neutral-bg'
                  }
                `}
              >
                {page}
              </button>
            );
          })}

          {/* 다음 버튼 */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
            className="
              w-7 h-7 flex items-center justify-center
              rounded-full text-neutral-text-sub
              hover:bg-neutral-bg disabled:opacity-40
              disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </nav>
      </div>
    );
  }
);

export default TablePagination;
