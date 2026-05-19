/**
 * 대상자 API
 * /core/dashboard/recipients/*
 * 백엔드 미연동 시 Mock 데이터 자동 fallback
 */

import type { Recipient, RecipientDetailExtended, RecipientStatus, RecipientFilters } from '@/types/dashboard';
import { apiGet, ApiError } from './client';
import { mockRecipients, getMockStatusCounts, mockRecipientKPIs } from '@/lib/mock-data/recipients';
import { mockRecipientDetails } from '@/lib/mock-data/recipient-details';

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

/** Mock 필터링 */
function filterMockRecipients(filters: RecipientFilters): RecipientsResult {
  let filtered = [...mockRecipients];

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((r) => r.status === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.managerName.toLowerCase().includes(q) ||
        r.dong.toLowerCase().includes(q)
    );
  }
  if (filters.dong && filters.dong !== 'all') {
    filtered = filtered.filter((r) => r.dong === filters.dong);
  }
  if (filters.manager && filters.manager !== 'all') {
    filtered = filtered.filter((r) => r.managerName === filters.manager);
  }

  return {
    recipients: filtered,
    totalCount: filtered.length,
    statusCounts: getMockStatusCounts(mockRecipients),
  };
}

/**
 * 대상자 목록 조회
 */
export async function getRecipients(filters: RecipientFilters): Promise<RecipientsResult> {
  try {
    const params = new URLSearchParams();
    params.set('status', filters.status || 'all');
    if (filters.search) params.set('search', filters.search);
    if (filters.dong && filters.dong !== 'all') params.set('dong', filters.dong);
    if (filters.manager && filters.manager !== 'all') params.set('manager', filters.manager);

    return await apiGet<RecipientsResult>(`/recipients?${params.toString()}`);
  } catch {
    return filterMockRecipients(filters);
  }
}

/**
 * 대상자 KPI 조회
 */
export async function getRecipientKPIs(): Promise<RecipientKPIs> {
  try {
    return await apiGet<RecipientKPIs>('/recipients/kpi');
  } catch {
    return mockRecipientKPIs;
  }
}

/**
 * 대상자 상세 조회
 */
export async function getRecipientDetailById(id: string): Promise<RecipientDetailExtended | null> {
  try {
    return await apiGet<RecipientDetailExtended>(`/recipients/${id}`);
  } catch (err) {
    // Mock fallback: 정확 매칭 or 첫 항목 (데모 안정)
    const detail = mockRecipientDetails[id] || mockRecipientDetails['recipient-001'];
    if (detail) return detail;
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}
