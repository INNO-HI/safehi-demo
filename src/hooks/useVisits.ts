'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Visit, VisitFilters } from '@/types/dashboard';
import { getVisitsByRecipientId } from '@/lib/api/visits';

// ============================================================
// T039: useVisits 훅
// 방문 기록 조회 및 날짜 필터 기능
// ============================================================

interface UseVisitsReturn {
  visits: Visit[];
  isLoading: boolean;
  error: Error | null;
  filters: VisitFilters;
  setFilters: (filters: VisitFilters) => void;
  clearFilters: () => void;
  refresh: () => void;
}

const initialFilters: VisitFilters = {
  dateRange: {
    start: null,
    end: null,
  },
};

/**
 * 방문 기록 조회 훅
 * @param recipientId 대상자 ID
 */
export function useVisits(recipientId: string): UseVisitsReturn {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<VisitFilters>(initialFilters);

  // 방문 기록 조회
  const fetchVisits = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getVisitsByRecipientId(
        recipientId,
        filters.dateRange.start,
        filters.dateRange.end
      );
      setVisits(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('방문 기록을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, [recipientId, filters.dateRange.start, filters.dateRange.end]);

  // 초기 로드 및 필터 변경 시 재조회
  useEffect(() => {
    let cancelled = false;

    const doFetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getVisitsByRecipientId(
          recipientId,
          filters.dateRange.start,
          filters.dateRange.end
        );
        if (!cancelled) setVisits(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('방문 기록을 불러오는데 실패했습니다.'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    doFetch();

    return () => { cancelled = true; };
  }, [recipientId, filters.dateRange.start, filters.dateRange.end]);

  // 필터 초기화
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // 새로고침
  const refresh = useCallback(() => {
    fetchVisits();
  }, [fetchVisits]);

  return {
    visits,
    isLoading,
    error,
    filters,
    setFilters,
    clearFilters,
    refresh,
  };
}
