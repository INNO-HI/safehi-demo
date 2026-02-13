'use client';

import { useState, useEffect } from 'react';
import type { RecipientDetailExtended } from '@/types/dashboard';
import { getRecipientDetailById } from '@/lib/api/recipients';

interface UseRecipientDetailReturn {
  data: RecipientDetailExtended | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 대상자 상세 조회 훅
 */
export function useRecipientDetail(id: string): UseRecipientDetailReturn {
  const [data, setData] = useState<RecipientDetailExtended | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const recipient = await getRecipientDetailById(id);
        if (cancelled) return;
        if (recipient) {
          setData(recipient);
          setError(null);
        } else {
          setError(new Error('대상자를 찾을 수 없습니다'));
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('데이터를 불러오는데 실패했습니다'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  return {
    data,
    isLoading,
    error,
  };
}
