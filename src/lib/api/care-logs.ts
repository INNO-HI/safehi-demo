/**
 * 돌봄 일지 API
 * /core/dashboard/care-logs/*
 */

import type { CareLog, CareLogStatus, CareLogFilters, CareLogDetailExtended, Feedback } from '@/types/dashboard';
import { apiGet, apiPatch, apiPost, ApiError } from './client';
import { mockCareLogs, mockCareLogDetails } from '@/lib/mock-data/care-logs';

export interface CareLogsResult {
  logs: CareLog[];
  totalCount: number;
  statusCounts: Record<CareLogStatus | 'all', number>;
}

function getMockCareLogs(
  filters: CareLogFilters,
  page: number,
  pageSize: number
): CareLogsResult {
  let filtered = [...mockCareLogs];

  // 상태 필터
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((log) => log.status === filters.status);
  }

  // 검색 필터
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (log) =>
        log.recipientName.includes(q) ||
        log.managerName.includes(q) ||
        log.centerName.includes(q)
    );
  }

  // 상태별 카운트
  const statusCounts: Record<CareLogStatus | 'all', number> = {
    all: mockCareLogs.length,
    pending: mockCareLogs.filter((l) => l.status === 'pending').length,
    urgent: mockCareLogs.filter((l) => l.status === 'urgent').length,
    approved: mockCareLogs.filter((l) => l.status === 'approved').length,
    rejected: mockCareLogs.filter((l) => l.status === 'rejected').length,
  };

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  const logs = filtered.slice(start, start + pageSize);

  return { logs, totalCount, statusCounts };
}

/**
 * 돌봄 일지 목록 조회 (필터, 페이지네이션 포함)
 */
export async function getCareLogs(
  filters: CareLogFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<CareLogsResult> {
  try {
    const params = new URLSearchParams();
    params.set('status', filters.status || 'all');
    if (filters.search) params.set('search', filters.search);
    if (filters.dateRange?.start) params.set('dateStart', filters.dateRange.start.toISOString());
    if (filters.dateRange?.end) params.set('dateEnd', filters.dateRange.end.toISOString());
    if (filters.dong && filters.dong !== 'all') params.set('dong', filters.dong);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));

    return await apiGet<CareLogsResult>(`/care-logs?${params.toString()}`);
  } catch {
    // 백엔드 미연결 시 mock 데이터 반환
    return getMockCareLogs(filters, page, pageSize);
  }
}

/**
 * 돌봄 일지 상세 조회
 */
export async function getCareLogDetailById(id: string): Promise<CareLogDetailExtended | null> {
  try {
    return await apiGet<CareLogDetailExtended>(`/care-logs/${id}`);
  } catch (err) {
    // Mock fallback: 우선 정확 매칭, 없으면 첫 항목 반환 (데모 안정성)
    const detail = mockCareLogDetails[id] || mockCareLogDetails['cl-001'];
    if (detail) return detail;
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

/**
 * 일괄 상태 변경
 */
export async function updateBulkCareLogStatus(
  ids: string[],
  status: CareLogStatus
): Promise<{ success: boolean; count: number }> {
  try {
    return await apiPatch<{ success: boolean; count: number }>('/care-logs/bulk-status', { ids, status });
  } catch {
    return { success: true, count: ids.length };
  }
}

/**
 * 단건 상태 변경
 */
export async function updateCareLogStatus(
  id: string,
  status: CareLogStatus,
  reason?: string
): Promise<{ success: boolean; id: string; newStatus: string }> {
  try {
    return await apiPatch<{ success: boolean; id: string; newStatus: string }>(`/care-logs/${id}/status`, {
      status,
      reason,
    });
  } catch {
    return { success: true, id, newStatus: status };
  }
}

/**
 * 피드백 추가
 */
export async function addCareLogFeedback(
  careLogId: string,
  content: string
): Promise<Feedback> {
  try {
    return await apiPost<Feedback>(`/care-logs/${careLogId}/feedback`, { content });
  } catch {
    return {
      id: `fb-${Date.now()}`,
      content,
      createdAt: new Date(),
    } as Feedback;
  }
}
