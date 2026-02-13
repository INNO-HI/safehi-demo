/**
 * 메모 API
 * /core/dashboard/recipients/:id/memos
 */

import type { Memo } from '@/types/dashboard';
import { apiGet, apiPost } from './client';

/**
 * 대상자별 메모 목록 조회
 */
export async function getMemosByRecipientId(recipientId: string): Promise<Memo[]> {
  return apiGet<Memo[]>(`/recipients/${recipientId}/memos`);
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
  return apiPost<Memo>(`/recipients/${recipientId}/memos`, {
    content,
    authorId,
    authorName,
  });
}
