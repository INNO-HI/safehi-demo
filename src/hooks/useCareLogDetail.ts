'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CareLogDetailExtended } from '@/types/dashboard';
import { getCareLogDetailById, updateCareLogStatus, addCareLogFeedback } from '@/lib/api/care-logs';
import { useAuthStore } from '@/hooks/useAuth';

interface UseCareLogDetailReturn {
  data: CareLogDetailExtended | null;
  isLoading: boolean;
  error: Error | null;
  approve: () => Promise<void>;
  reject: (reason: string) => Promise<void>;
  requestRevision: (reason: string) => Promise<void>;
  addFeedback: (content: string) => Promise<void>;
  isProcessing: boolean;
}

/**
 * 돌봄 일지 상세 조회 및 승인/반려 처리 훅
 */
export function useCareLogDetail(id: string): UseCareLogDetailReturn {
  const [data, setData] = useState<CareLogDetailExtended | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 데이터 로딩
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const careLog = await getCareLogDetailById(id);
        if (cancelled) return;
        if (careLog) {
          setData(careLog);
          setError(null);
        } else {
          setError(new Error('돌봄 일지를 찾을 수 없습니다'));
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('데이터를 불러오는데 실패했습니다'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  // 승인 처리
  const approve = useCallback(async () => {
    if (!data) return;
    if (data.status !== 'pending' && data.status !== 'urgent') {
      throw new Error('대기 또는 긴급 상태의 일지만 승인할 수 있습니다');
    }

    setIsProcessing(true);
    try {
      await updateCareLogStatus(data.id, 'approved');
      setData({ ...data, status: 'approved' });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('승인 처리에 실패했습니다'));
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [data]);

  // 반려 처리
  const reject = useCallback(
    async (reason: string) => {
      if (!data) return;
      if (data.status !== 'pending' && data.status !== 'urgent') {
        throw new Error('대기 또는 긴급 상태의 일지만 반려할 수 있습니다');
      }
      if (!reason || reason.trim().length < 10) {
        throw new Error('반려 사유는 10자 이상 입력해야 합니다');
      }

      setIsProcessing(true);
      try {
        await updateCareLogStatus(data.id, 'rejected', reason.trim());
        const { user } = useAuthStore.getState();
        setData({
          ...data,
          status: 'rejected',
          rejectionReason: reason.trim(),
          rejectedAt: new Date(),
          rejectedBy: user?.name ?? '담당자',
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('반려 처리에 실패했습니다'));
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [data]
  );

  // 수정 요청 처리
  const requestRevision = useCallback(
    async (reason: string) => {
      if (!data) return;
      if (data.status !== 'pending' && data.status !== 'urgent') {
        throw new Error('대기 또는 긴급 상태의 일지만 수정 요청할 수 있습니다');
      }
      if (!reason || reason.trim().length < 5) {
        throw new Error('수정 요청 사유는 5자 이상 입력해야 합니다');
      }

      setIsProcessing(true);

      try {
        // 수정 요청은 피드백으로 추가
        const newFeedback = await addCareLogFeedback(data.id, `[수정 요청] ${reason.trim()}`);

        setData({
          ...data,
          feedbacks: [...(data.feedbacks || []), newFeedback],
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [data]
  );

  // 피드백 추가
  const addFeedback = useCallback(
    async (content: string) => {
      if (!data) return;
      if (!content || content.trim().length < 2) {
        throw new Error('피드백 내용을 입력해주세요');
      }

      setIsProcessing(true);

      try {
        const newFeedback = await addCareLogFeedback(data.id, content.trim());

        setData({
          ...data,
          feedbacks: [...(data.feedbacks || []), newFeedback],
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [data]
  );

  return {
    data,
    isLoading,
    error,
    approve,
    reject,
    requestRevision,
    addFeedback,
    isProcessing,
  };
}
