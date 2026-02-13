/**
 * 돌봄 일지 API
 * /core/dashboard/care-logs/*
 */

import type { CareLog, CareLogStatus, CareLogFilters, CareLogDetailExtended, Feedback } from '@/types/dashboard';
import { apiGet, apiPatch, apiPost } from './client';

export interface CareLogsResult {
  logs: CareLog[];
  totalCount: number;
  statusCounts: Record<CareLogStatus | 'all', number>;
}

/**
 * 돌봄 일지 목록 조회 (필터, 페이지네이션 포함)
 */
export async function getCareLogs(
  filters: CareLogFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<CareLogsResult> {
  const params = new URLSearchParams();
  params.set('status', filters.status || 'all');
  if (filters.search) params.set('search', filters.search);
  if (filters.dateRange?.start) params.set('dateStart', filters.dateRange.start.toISOString());
  if (filters.dateRange?.end) params.set('dateEnd', filters.dateRange.end.toISOString());
  if (filters.dong && filters.dong !== 'all') params.set('dong', filters.dong);
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  return apiGet<CareLogsResult>(`/care-logs?${params.toString()}`);
}

/**
 * 돌봄 일지 상세 조회
 */
export async function getCareLogDetailById(id: string): Promise<CareLogDetailExtended | null> {
  try {
    return await apiGet<CareLogDetailExtended>(`/care-logs/${id}`);
  } catch {
    return null;
  }
}

/**
 * 일괄 상태 변경
 */
export async function updateBulkCareLogStatus(
  ids: string[],
  status: CareLogStatus
): Promise<{ success: boolean; count: number }> {
  return apiPatch<{ success: boolean; count: number }>('/care-logs/bulk-status', { ids, status });
}

/**
 * 단건 상태 변경
 */
export async function updateCareLogStatus(
  id: string,
  status: CareLogStatus,
  reason?: string
): Promise<{ success: boolean; id: string; newStatus: string }> {
  return apiPatch<{ success: boolean; id: string; newStatus: string }>(`/care-logs/${id}/status`, {
    status,
    reason,
  });
}

/**
 * 피드백 추가
 */
export async function addCareLogFeedback(
  careLogId: string,
  content: string
): Promise<Feedback> {
  return apiPost<Feedback>(`/care-logs/${careLogId}/feedback`, { content });
}
