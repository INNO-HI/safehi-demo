'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Policy } from '@/types/dashboard';
import { getPoliciesForRecipient, refreshPoliciesForRecipient } from '@/lib/api/policies';

// ============================================================
// T046: usePolicies 훅
// AI 정책 추천 조회 및 새로고침 기능
// ============================================================

interface UsePoliciesReturn {
  policies: Policy[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
  lastUpdated: Date | null;
}

/**
 * AI 정책 추천 조회 훅
 * @param recipientId 대상자 ID
 */
export function usePolicies(recipientId: string): UsePoliciesReturn {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 정책 목록 조회
  const fetchPolicies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPoliciesForRecipient(recipientId);
      setPolicies(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('정책 추천을 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, [recipientId]);

  // 초기 로드
  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  // AI 재분석 (새로고침)
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const data = await refreshPoliciesForRecipient(recipientId);
      setPolicies(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('정책 재분석에 실패했습니다.'));
    } finally {
      setIsRefreshing(false);
    }
  }, [recipientId]);

  return {
    policies,
    isLoading,
    error,
    refresh,
    isRefreshing,
    lastUpdated,
  };
}
