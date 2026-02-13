/**
 * 대상자 API
 * /core/dashboard/recipients/*
 */

import type { Recipient, RecipientDetailExtended, RecipientStatus, RecipientFilters } from '@/types/dashboard';
import { apiGet } from './client';

export interface RecipientsResult {
  recipients: Recipient[];
  totalCount: number;
  statusCounts: Record<RecipientStatus | 'all', number>;
}

export interface RecipientKPIs {
  total: number;
  normal: number;
  caution: number;
  urgent: number;
  unvisited: number;
}

/**
 * 대상자 목록 조회
 */
export async function getRecipients(filters: RecipientFilters): Promise<RecipientsResult> {
  const params = new URLSearchParams();
  params.set('status', filters.status || 'all');
  if (filters.search) params.set('search', filters.search);
  if (filters.dong && filters.dong !== 'all') params.set('dong', filters.dong);
  if (filters.manager && filters.manager !== 'all') params.set('manager', filters.manager);

  return apiGet<RecipientsResult>(`/recipients?${params.toString()}`);
}

/**
 * 대상자 KPI 조회
 */
export async function getRecipientKPIs(): Promise<RecipientKPIs> {
  return apiGet<RecipientKPIs>('/recipients/kpi');
}

/**
 * 대상자 상세 조회
 */
export async function getRecipientDetailById(id: string): Promise<RecipientDetailExtended | null> {
  try {
    return await apiGet<RecipientDetailExtended>(`/recipients/${id}`);
  } catch {
    return null;
  }
}
