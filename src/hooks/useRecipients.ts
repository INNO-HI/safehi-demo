'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Recipient, RecipientStatus, RecipientFilters, PageSize } from '@/types/dashboard';
import { getRecipients, getRecipientKPIs } from '@/lib/api/recipients';
import type { RecipientKPIs } from '@/lib/api/recipients';
import { exportRecipientsToExcel } from '@/lib/utils/export';
import { usePagination } from './usePagination';

// ============================================================
// useRecipients 훅
// T046: 대상자 데이터 필터링, 페이지네이션, 내보내기 포함
// ============================================================

interface UseRecipientsOptions {
  initialFilters?: Partial<RecipientFilters>;
  initialPageSize?: PageSize;
}

interface UseRecipientsReturn {
  // 데이터
  recipients: Recipient[];
  allRecipients: Recipient[];
  totalCount: number;
  statusCounts: Record<RecipientStatus | 'all', number>;
  kpis: RecipientKPIs;

  // 필터
  filters: RecipientFilters;
  setStatus: (status: RecipientStatus | 'all') => void;
  setSearch: (search: string) => void;
  setDong: (dong: string | 'all') => void;
  setManager: (manager: string | 'all') => void;
  resetFilters: () => void;

  // 페이지네이션
  currentPage: number;
  pageSize: PageSize;
  totalPages: number;
  goToPage: (page: number) => void;
  setPageSize: (size: PageSize) => void;

  // 선택
  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;
  clearSelection: () => void;
  selectedCount: number;

  // 로딩/에러
  isLoading: boolean;
  error: Error | null;

  // 액션
  exportToExcel: () => void;
  exportSelectedToExcel: () => void;
  refetch: () => void;
}

const defaultFilters: RecipientFilters = {
  status: 'all',
  search: '',
  dong: 'all',
  manager: 'all',
};

/**
 * 대상자 관리 훅
 */
export function useRecipients(options: UseRecipientsOptions = {}): UseRecipientsReturn {
  const { initialFilters = {}, initialPageSize = 10 } = options;

  // 상태
  const [filters, setFilters] = useState<RecipientFilters>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [allRecipients, setAllRecipients] = useState<Recipient[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<RecipientStatus | 'all', number>>({
    all: 0,
    normal: 0,
    caution: 0,
    urgent: 0,
    unvisited: 0,
  });
  const [kpis, setKPIs] = useState<RecipientKPIs>({ total: 0, normal: 0, caution: 0, urgent: 0, unvisited: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 페이지네이션
  const {
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,
    paginate,
  } = usePagination({
    totalItems: allRecipients.length,
    initialPageSize,
  });

  // 현재 페이지 데이터
  const recipients = useMemo(() => paginate(allRecipients), [paginate, allRecipients]);

  // 데이터 가져오기
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [recipientsResult, kpisResult] = await Promise.all([
        getRecipients(filters),
        getRecipientKPIs(),
      ]);

      setAllRecipients(recipientsResult.recipients);
      setStatusCounts(recipientsResult.statusCounts);
      setKPIs(kpisResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('데이터를 불러오는데 실패했습니다'));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 필터 변경 시 첫 페이지로 이동
  const updateFiltersAndReset = useCallback(
    (newFilters: Partial<RecipientFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      goToPage(1);
    },
    [goToPage]
  );

  // 상태 필터 변경
  const setStatus = useCallback(
    (status: RecipientStatus | 'all') => {
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

  // 동 필터 변경
  const setDong = useCallback(
    (dong: string | 'all') => {
      updateFiltersAndReset({ dong });
    },
    [updateFiltersAndReset]
  );

  // 매니저 필터 변경
  const setManager = useCallback(
    (manager: string | 'all') => {
      updateFiltersAndReset({ manager });
    },
    [updateFiltersAndReset]
  );

  // 필터 초기화
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    goToPage(1);
  }, [goToPage]);

  // Excel 내보내기 (전체)
  const exportToExcel = useCallback(() => {
    exportRecipientsToExcel(allRecipients);
  }, [allRecipients]);

  // Excel 내보내기 (선택된 항목만)
  const exportSelectedToExcel = useCallback(() => {
    const selectedRecipients = allRecipients.filter((r) => selectedIds.has(r.id));
    if (selectedRecipients.length === 0) {
      alert('선택된 대상자가 없습니다.');
      return;
    }
    exportRecipientsToExcel(selectedRecipients);
  }, [allRecipients, selectedIds]);

  // 선택 초기화
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    // 데이터
    recipients,
    allRecipients,
    totalCount: allRecipients.length,
    statusCounts,
    kpis,

    // 필터
    filters,
    setStatus,
    setSearch,
    setDong,
    setManager,
    resetFilters,

    // 페이지네이션
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,

    // 선택
    selectedIds,
    setSelectedIds,
    clearSelection,
    selectedCount: selectedIds.size,

    // 로딩/에러
    isLoading,
    error,

    // 액션
    exportToExcel,
    exportSelectedToExcel,
    refetch: fetchData,
  };
}

export default useRecipients;
