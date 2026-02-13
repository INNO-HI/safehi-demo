'use client';

import { useState, useCallback, useMemo } from 'react';
import type { PageSize, PaginationState } from '@/types/dashboard';

// ============================================================
// usePagination 훅
// T018: 페이지네이션 상태 관리
// ============================================================

interface UsePaginationOptions {
  /** 전체 항목 수 */
  totalItems: number;
  /** 초기 페이지 (기본: 1) */
  initialPage?: number;
  /** 초기 페이지 크기 (기본: 10) */
  initialPageSize?: PageSize;
  /** 페이지 변경 시 콜백 */
  onPageChange?: (page: number) => void;
  /** 페이지 크기 변경 시 콜백 */
  onPageSizeChange?: (size: PageSize) => void;
}

interface UsePaginationReturn {
  /** 현재 상태 */
  pagination: PaginationState;
  /** 현재 페이지 */
  currentPage: number;
  /** 페이지 크기 */
  pageSize: PageSize;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 현재 페이지 항목의 시작 인덱스 (0 기반) */
  startIndex: number;
  /** 현재 페이지 항목의 종료 인덱스 (0 기반, 포함) */
  endIndex: number;
  /** 첫 페이지 여부 */
  isFirstPage: boolean;
  /** 마지막 페이지 여부 */
  isLastPage: boolean;
  /** 페이지 이동 */
  goToPage: (page: number) => void;
  /** 다음 페이지 */
  nextPage: () => void;
  /** 이전 페이지 */
  prevPage: () => void;
  /** 첫 페이지 */
  firstPage: () => void;
  /** 마지막 페이지 */
  lastPage: () => void;
  /** 페이지 크기 변경 */
  setPageSize: (size: PageSize) => void;
  /** 배열에서 현재 페이지 항목 추출 */
  paginate: <T>(items: T[]) => T[];
  /** 초기화 */
  reset: () => void;
}

/**
 * 페이지네이션 상태 관리 훅
 */
export function usePagination(options: UsePaginationOptions): UsePaginationReturn {
  const {
    totalItems,
    initialPage = 1,
    initialPageSize = 10,
    onPageChange,
    onPageSizeChange,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState<PageSize>(initialPageSize);

  // 전체 페이지 수 계산
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  // 현재 페이지가 유효한지 확인하고 조정
  const validCurrentPage = useMemo(
    () => Math.min(Math.max(1, currentPage), totalPages),
    [currentPage, totalPages]
  );

  // 시작/종료 인덱스
  const startIndex = useMemo(
    () => (validCurrentPage - 1) * pageSize,
    [validCurrentPage, pageSize]
  );

  const endIndex = useMemo(
    () => Math.min(startIndex + pageSize - 1, totalItems - 1),
    [startIndex, pageSize, totalItems]
  );

  // 첫/마지막 페이지 여부
  const isFirstPage = validCurrentPage === 1;
  const isLastPage = validCurrentPage === totalPages;

  // 페이지 이동
  const goToPage = useCallback(
    (page: number) => {
      const newPage = Math.min(Math.max(1, page), totalPages);
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
        onPageChange?.(newPage);
      }
    },
    [totalPages, currentPage, onPageChange]
  );

  // 다음 페이지
  const nextPage = useCallback(() => {
    if (!isLastPage) {
      goToPage(validCurrentPage + 1);
    }
  }, [isLastPage, validCurrentPage, goToPage]);

  // 이전 페이지
  const prevPage = useCallback(() => {
    if (!isFirstPage) {
      goToPage(validCurrentPage - 1);
    }
  }, [isFirstPage, validCurrentPage, goToPage]);

  // 첫 페이지
  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  // 마지막 페이지
  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [totalPages, goToPage]);

  // 페이지 크기 변경
  const setPageSize = useCallback(
    (size: PageSize) => {
      if (size !== pageSize) {
        setPageSizeState(size);
        // 페이지 크기 변경 시 첫 페이지로 이동
        setCurrentPage(1);
        onPageSizeChange?.(size);
        onPageChange?.(1);
      }
    },
    [pageSize, onPageSizeChange, onPageChange]
  );

  // 배열에서 현재 페이지 항목 추출
  const paginate = useCallback(
    <T>(items: T[]): T[] => {
      return items.slice(startIndex, startIndex + pageSize);
    },
    [startIndex, pageSize]
  );

  // 초기화
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSizeState(initialPageSize);
  }, [initialPage, initialPageSize]);

  // 상태 객체
  const pagination: PaginationState = useMemo(
    () => ({
      currentPage: validCurrentPage,
      pageSize,
      totalItems,
      totalPages,
    }),
    [validCurrentPage, pageSize, totalItems, totalPages]
  );

  return {
    pagination,
    currentPage: validCurrentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    isFirstPage,
    isLastPage,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPageSize,
    paginate,
    reset,
  };
}

export default usePagination;
