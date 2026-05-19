/**
 * 메모 API
 * /core/dashboard/recipients/:id/memos
 */

import type { Memo } from '@/types/dashboard';
import { apiGet, apiPost } from './client';
import { mockMemosFor } from '@/lib/mock-data/recipient-details';

/**
 * 대상자별 메모 목록 조회
 */
export async function getMemosByRecipientId(recipientId: string): Promise<Memo[]> {
  try {
    return await apiGet<Memo[]>(`/recipients/${recipientId}/memos`);
  } catch {
    return mockMemosFor(recipientId);
  }
}

/**
 * 메모 추가
 */
export async function addMemo(
  recipientId: string,
  content: string,
  authorId?: string,
  authorName?: string
): Promise<Memo> {
  try {
    return await apiPost<Memo>(`/recipients/${recipientId}/memos`, {
      content,
      authorId,
      authorName,
    });
  } catch {
    // Mock 모드: 가짜 메모 객체 반환 (실제 저장 X)
    return {
      id: `memo-${Date.now()}`,
      content,
      authorId: authorId || 'mock-user',
      authorName: authorName || '데모 사용자',
      createdAt: new Date(),
    } as Memo;
  }
}
