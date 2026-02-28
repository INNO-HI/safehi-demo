'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CareLog, CareLogStatus, CareLogFilters, PageSize } from '@/types/dashboard';
import { getCareLogs, updateBulkCareLogStatus } from '@/lib/api/care-logs';
import { usePagination } from './usePagination';
import { useSelection } from './useSelection';

// ============================================================
// useCareLogs 훅
// T036: 돌봄 일지 데이터 필터링, 페이지네이션 포함
// ============================================================

interface UseCareLogsOptions {
  initialFilters?: Partial<CareLogFilters>;
  initialPageSize?: PageSize;
}

interface UseCareLogsReturn {
  // 데이터
  logs: CareLog[];
  totalCount: number;
  statusCounts: Record<CareLogStatus | 'all', number>;

  // 필터
  filters: CareLogFilters;
  setStatus: (status: CareLogStatus | 'all') => void;
  setSearch: (search: string) => void;
  setDateRange: (start: Date | null, end: Date | null) => void;
  setDong: (dong: string | 'all') => void;
  resetFilters: () => void;

  // 페이지네이션
  currentPage: number;
  pageSize: PageSize;
  totalPages: number;
  goToPage: (page: number) => void;
  setPageSize: (size: PageSize) => void;

  // 선택
  selectedIds: Set<string>;
  selectedCount: number;
  isAllSelected: boolean;
  isSelected: (id: string) => boolean;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;

  // 로딩/에러
  isLoading: boolean;
  error: Error | null;

  // 액션
  bulkApprove: () => Promise<void>;
  bulkReject: () => Promise<void>;
  refetch: () => void;
}

const defaultFilters: CareLogFilters = {
  status: 'all',
  search: '',
  dateRange: { start: null, end: null },
  dong: 'all',
};

/**
 * 돌봄 일지 관리 훅
 */
export function useCareLogs(options: UseCareLogsOptions = {}): UseCareLogsReturn {
  const { initialFilters = {}, initialPageSize = 10 } = options;

  // 상태
  const [filters, setFilters] = useState<CareLogFilters>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [allLogs, setAllLogs] = useState<CareLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<CareLogStatus | 'all', number>>({
    all: 0,
    pending: 0,
    urgent: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 페이지네이션 (서버 사이드 페이지네이션 사용)
  const {
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,
  } = usePagination({
    totalItems: totalCount,
    initialPageSize,
    onPageChange: () => {
      // 페이지 변경 시 선택 초기화
      selection.deselectAll();
    },
  });

  // 서버에서 이미 페이지네이션된 데이터를 직접 사용
  const logs = allLogs;

  // 선택 상태
  const selection = useSelection({
    items: logs,
    getItemId: (log) => log.id,
  });

  // 데이터 가져오기
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getCareLogs(filters, currentPage, pageSize);
      setAllLogs(result.logs);
      setTotalCount(result.totalCount);
      setStatusCounts(result.statusCounts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('데이터를 불러오는데 실패했습니다'));
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 필터 변경 시 첫 페이지로 이동
  const updateFiltersAndReset = useCallback(
    (newFilters: Partial<CareLogFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      goToPage(1);
      selection.deselectAll();
    },
    [goToPage, selection]
  );

  // 상태 필터 변경
  const setStatus = useCallback(
    (status: CareLogStatus | 'all') => {
      updateFiltersAndReset({ status });
    },
    [updateFiltersAndReset]
  );

  // 검색어 변경
  const setSearch = useCallback(
    (search: string) => {
      updateFiltersAndReset({ search });
    },
    [updateFiltersAndReset]
  );

  // 날짜 범위 변경
  const setDateRange = useCallback(
    (start: Date | null, end: Date | null) => {
      updateFiltersAndReset({ dateRange: { start, end } });
    },
    [updateFiltersAndReset]
  );

  // 동 필터 변경
  const setDong = useCallback(
    (dong: string | 'all') => {
      updateFiltersAndReset({ dong });
    },
    [updateFiltersAndReset]
  );

  // 필터 초기화
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    goToPage(1);
    selection.deselectAll();
  }, [goToPage, selection]);

  // 일괄 승인
  const bulkApprove = useCallback(async () => {
    if (selection.selectedCount === 0) return;

    try {
      await updateBulkCareLogStatus(selection.selectedArray, 'approved');
      selection.deselectAll();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('승인 처리에 실패했습니다'));
    }
  }, [selection, fetchData]);

  // 일괄 반려
  const bulkReject = useCallback(async () => {
    if (selection.selectedCount === 0) return;

    try {
      await updateBulkCareLogStatus(selection.selectedArray, 'rejected');
      selection.deselectAll();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('반려 처리에 실패했습니다'));
    }
  }, [selection, fetchData]);

  return {
    // 데이터
    logs,
    totalCount,
    statusCounts,

    // 필터
    filters,
    setStatus,
    setSearch,
    setDateRange,
    setDong,
    resetFilters,

    // 페이지네이션
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,

    // 선택
    selectedIds: selection.selectedIds,
    selectedCount: selection.selectedCount,
    isAllSelected: selection.isAllSelected,
    isSelected: selection.isSelected,
    toggleSelect: selection.toggleSelect,
    toggleSelectAll: selection.toggleSelectAll,
    clearSelection: selection.deselectAll,

    // 로딩/에러
    isLoading,
    error,

    // 액션
    bulkApprove,
    bulkReject,
    refetch: fetchData,
  };
}

export default useCareLogs;
