'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Manager, ManagerStatus, ManagerFilters, ManagerKPIs, PageSize } from '@/types/dashboard';
import { getManagers, getManagerKPIs } from '@/lib/api/managers';
import { exportManagersToExcel } from '@/lib/utils/export';
import { usePagination } from './usePagination';

// ============================================================
// useManagers 훅
// 매니저 데이터 필터링, 페이지네이션, 내보내기 포함
// ============================================================

interface UseManagersOptions {
  initialFilters?: Partial<ManagerFilters>;
  initialPageSize?: PageSize;
}

interface UseManagersReturn {
  // 데이터
  managers: Manager[];
  allManagers: Manager[];
  totalCount: number;
  statusCounts: Record<ManagerStatus | 'all', number>;
  kpis: ManagerKPIs;

  // 필터
  filters: ManagerFilters;
  setStatus: (status: ManagerStatus | 'all') => void;
  setSearch: (search: string) => void;
  setDong: (dong: string | 'all') => void;
  setCenter: (center: string | 'all') => void;
  resetFilters: () => void;

  // 페이지네이션
  currentPage: number;
  pageSize: PageSize;
  totalPages: number;
  goToPage: (page: number) => void;
  setPageSize: (size: PageSize) => void;

  // 로딩/에러
  isLoading: boolean;
  error: Error | null;

  // 액션
  exportToExcel: () => void;
  refetch: () => void;
}

const defaultFilters: ManagerFilters = {
  status: 'all',
  search: '',
  dong: 'all',
  center: 'all',
};

/**
 * 매니저 관리 훅
 */
export function useManagers(options: UseManagersOptions = {}): UseManagersReturn {
  const { initialFilters = {}, initialPageSize = 10 } = options;

  // 상태
  const [filters, setFilters] = useState<ManagerFilters>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [allManagers, setAllManagers] = useState<Manager[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<ManagerStatus | 'all', number>>({
    all: 0,
    active: 0,
    leave: 0,
    retired: 0,
  });
  const [kpis, setKPIs] = useState<ManagerKPIs>({ total: 0, active: 0, leave: 0, retired: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 페이지네이션
  const {
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,
    paginate,
  } = usePagination({
    totalItems: allManagers.length,
    initialPageSize,
  });

  // 현재 페이지 데이터
  const managers = useMemo(() => paginate(allManagers), [paginate, allManagers]);

  // 데이터 가져오기
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [managersResult, kpisResult] = await Promise.all([
        getManagers(filters),
        getManagerKPIs(),
      ]);

      setAllManagers(managersResult.managers);
      setStatusCounts(managersResult.statusCounts);
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
    (newFilters: Partial<ManagerFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      goToPage(1);
    },
    [goToPage]
  );

  // 상태 필터 변경
  const setStatus = useCallback(
    (status: ManagerStatus | 'all') => {
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

  // 센터 필터 변경
  const setCenter = useCallback(
    (center: string | 'all') => {
      updateFiltersAndReset({ center });
    },
    [updateFiltersAndReset]
  );

  // 필터 초기화
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    goToPage(1);
  }, [goToPage]);

  // Excel 내보내기
  const exportToExcel = useCallback(() => {
    exportManagersToExcel(allManagers);
  }, [allManagers]);

  return {
    // 데이터
    managers,
    allManagers,
    totalCount: allManagers.length,
    statusCounts,
    kpis,

    // 필터
    filters,
    setStatus,
    setSearch,
    setDong,
    setCenter,
    resetFilters,

    // 페이지네이션
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,

    // 로딩/에러
    isLoading,
    error,

    // 액션
    exportToExcel,
    refetch: fetchData,
  };
}

export default useManagers;
