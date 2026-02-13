'use client';

import { useState, useEffect } from 'react';
import type { ManagerDetailExtended } from '@/types/dashboard';
import { getManagerDetail } from '@/lib/api/managers';

interface UseManagerDetailReturn {
  data: ManagerDetailExtended | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 매니저 상세 조회 훅
 */
export function useManagerDetail(id: string): UseManagerDetailReturn {
  const [data, setData] = useState<ManagerDetailExtended | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // API 호출 시뮬레이션 (200ms 지연)
    const fetchData = async () => {
      try {
        const manager = await getManagerDetail(id);
        if (manager) {
          setData(manager);
          setError(null);
        } else {
          setError(new Error('매니저를 찾을 수 없습니다'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('데이터를 불러오는데 실패했습니다'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return {
    data,
    isLoading,
    error,
  };
}

export default useManagerDetail;
