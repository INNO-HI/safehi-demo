'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  StatisticsOverview,
  MonthlyVisitTrend,
  TrendPeriod,
} from '@/types/statistics';
import {
  fetchStatisticsOverview,
  fetchVisitTrend,
} from '@/lib/api/statistics';
import { getCurrentMonth } from '@/lib/constants/statistics';

interface UseStatisticsState {
  data: StatisticsOverview | null;
  isLoading: boolean;
  error: string | null;
  selectedMonth: string;
  trendPeriod: TrendPeriod;
}

interface UseStatisticsReturn extends UseStatisticsState {
  setSelectedMonth: (month: string) => void;
  setTrendPeriod: (period: TrendPeriod) => void;
  refetch: () => Promise<void>;
  visitTrendData: MonthlyVisitTrend[];
  isVisitTrendLoading: boolean;
}

/**
 * 통계 데이터 관리 훅
 * 페이지에서 모든 통계 데이터와 상태를 관리
 */
export function useStatistics(): UseStatisticsReturn {
  // 기본 상태
  const [data, setData] = useState<StatisticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());

  // 방문 추이 차트 상태 (별도 관리 - 탭 전환용)
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>(6);
  const [visitTrendData, setVisitTrendData] = useState<MonthlyVisitTrend[]>([]);
  const [isVisitTrendLoading, setIsVisitTrendLoading] = useState(false);

  // 전체 데이터 조회
  const fetchData = useCallback(async (month: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchStatisticsOverview(month);

      if (response.success && response.data) {
        setData(response.data);
        setVisitTrendData(response.data.visitTrend);
      } else {
        setError(response.error || '데이터를 불러오는 중 오류가 발생했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 방문 추이 데이터만 조회 (탭 전환 시)
  const fetchVisitTrendData = useCallback(async (period: TrendPeriod) => {
    setIsVisitTrendLoading(true);

    try {
      const response = await fetchVisitTrend(period);

      if (response.success && response.data) {
        setVisitTrendData(response.data);
      }
    } catch (err) {
      // 에러 시 기존 데이터 유지
      console.error('방문 추이 데이터 조회 오류:', err);
    } finally {
      setIsVisitTrendLoading(false);
    }
  }, []);

  // 월 변경 핸들러
  const handleMonthChange = useCallback(
    (month: string) => {
      setSelectedMonth(month);
      fetchData(month);
    },
    [fetchData]
  );

  // 기간 변경 핸들러
  const handlePeriodChange = useCallback(
    (period: TrendPeriod) => {
      setTrendPeriod(period);
      fetchVisitTrendData(period);
    },
    [fetchVisitTrendData]
  );

  // 데이터 새로고침
  const refetch = useCallback(async () => {
    await fetchData(selectedMonth);
  }, [fetchData, selectedMonth]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchData(selectedMonth);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    isLoading,
    error,
    selectedMonth,
    trendPeriod,
    setSelectedMonth: handleMonthChange,
    setTrendPeriod: handlePeriodChange,
    refetch,
    visitTrendData,
    isVisitTrendLoading,
  };
}
