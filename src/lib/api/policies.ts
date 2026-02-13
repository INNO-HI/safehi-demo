/**
 * AI 정책 추천 API
 * /core/dashboard/recipients/:id/policies
 */

import type { Policy } from '@/types/dashboard';
import { apiGet, apiPost } from './client';

/**
 * 대상자별 정책 추천 목록 조회
 */
export async function getPoliciesForRecipient(recipientId: string): Promise<Policy[]> {
  return apiGet<Policy[]>(`/recipients/${recipientId}/policies`);
}

/**
 * AI 정책 재분석 (새로고침)
 */
export async function refreshPoliciesForRecipient(recipientId: string): Promise<Policy[]> {
  return apiPost<Policy[]>(`/recipients/${recipientId}/policies/refresh`);
}
