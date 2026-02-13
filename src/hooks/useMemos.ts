'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Memo } from '@/types/dashboard';
import { getMemosByRecipientId, addMemo as addMemoApi } from '@/lib/api/memos';

// ============================================================
// T033: useMemos 훅
// 담당자 메모 조회 및 추가 기능
// ============================================================

interface UseMemosReturn {
  memos: Memo[];
  isLoading: boolean;
  error: Error | null;
  addMemo: (content: string) => Promise<Memo>;
  isAdding: boolean;
  refresh: () => void;
}

/**
 * 담당자 메모 조회 및 추가 훅
 * @param recipientId 대상자 ID
 */
export function useMemos(recipientId: string): UseMemosReturn {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 메모 목록 조회
  const fetchMemos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMemosByRecipientId(recipientId);
      setMemos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('메모를 불러오는데 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, [recipientId]);

  // 초기 로드
  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  // 새 메모 추가
  const addMemo = useCallback(
    async (content: string): Promise<Memo> => {
      setIsAdding(true);
      setError(null);

      try {
        const newMemo = await addMemoApi(recipientId, content);

        // 목록 상단에 새 메모 추가
        setMemos((prev) => [newMemo, ...prev]);

        return newMemo;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('메모 작성에 실패했습니다.');
        setError(error);
        throw error;
      } finally {
        setIsAdding(false);
      }
    },
    [recipientId]
  );

  // 새로고침
  const refresh = useCallback(() => {
    fetchMemos();
  }, [fetchMemos]);

  return {
    memos,
    isLoading,
    error,
    addMemo,
    isAdding,
    refresh,
  };
}
