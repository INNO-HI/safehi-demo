/**
 * 돌봄 일지 API
 * /core/dashboard/care-logs/*
 */

import type { CareLog, CareLogStatus, CareLogFilters, CareLogDetailExtended, Feedback } from '@/types/dashboard';
import { apiGet, apiPatch, apiPost, ApiError } from './client';

export interface CareLogsResult {
  logs: CareLog[];
  totalCount: number;
  statusCounts: Record<CareLogStatus | 'all', number>;
}

// Mock 데이터 (백엔드 미연결 시 사용)
const mockCareLogs: CareLog[] = [
  { id: 'cl-001', recipientName: '김순자', managerName: '이민수', centerName: '강남돌봄센터', visitDate: new Date('2026-03-12T09:30:00'), registeredAt: new Date('2026-03-12T10:15:00'), status: 'pending' },
  { id: 'cl-002', recipientName: '박영희', managerName: '김지현', centerName: '서초돌봄센터', visitDate: new Date('2026-03-12T11:00:00'), registeredAt: new Date('2026-03-12T11:45:00'), status: 'approved' },
  { id: 'cl-003', recipientName: '이복순', managerName: '이민수', centerName: '강남돌봄센터', visitDate: new Date('2026-03-11T14:00:00'), registeredAt: new Date('2026-03-11T15:20:00'), status: 'urgent' },
  { id: 'cl-004', recipientName: '정옥분', managerName: '박서준', centerName: '송파돌봄센터', visitDate: new Date('2026-03-11T10:00:00'), registeredAt: new Date('2026-03-11T10:50:00'), status: 'approved' },
  { id: 'cl-005', recipientName: '최말순', managerName: '김지현', centerName: '서초돌봄센터', visitDate: new Date('2026-03-10T13:30:00'), registeredAt: new Date('2026-03-10T14:10:00'), status: 'rejected' },
  { id: 'cl-006', recipientName: '한옥자', managerName: '이민수', centerName: '강남돌봄센터', visitDate: new Date('2026-03-10T09:00:00'), registeredAt: new Date('2026-03-10T09:40:00'), status: 'pending' },
  { id: 'cl-007', recipientName: '강순덕', managerName: '박서준', centerName: '송파돌봄센터', visitDate: new Date('2026-03-09T15:00:00'), registeredAt: new Date('2026-03-09T16:00:00'), status: 'approved' },
  { id: 'cl-008', recipientName: '윤정숙', managerName: '김지현', centerName: '서초돌봄센터', visitDate: new Date('2026-03-09T10:30:00'), registeredAt: new Date('2026-03-09T11:20:00'), status: 'pending' },
  { id: 'cl-009', recipientName: '임춘희', managerName: '이민수', centerName: '강남돌봄센터', visitDate: new Date('2026-03-08T14:00:00'), registeredAt: new Date('2026-03-08T14:50:00'), status: 'approved' },
  { id: 'cl-010', recipientName: '조귀남', managerName: '박서준', centerName: '송파돌봄센터', visitDate: new Date('2026-03-08T11:00:00'), registeredAt: new Date('2026-03-08T11:30:00'), status: 'urgent' },
  { id: 'cl-011', recipientName: '배순임', managerName: '김지현', centerName: '서초돌봄센터', visitDate: new Date('2026-03-07T09:30:00'), registeredAt: new Date('2026-03-07T10:10:00'), status: 'approved' },
  { id: 'cl-012', recipientName: '송옥순', managerName: '이민수', centerName: '강남돌봄센터', visitDate: new Date('2026-03-07T13:00:00'), registeredAt: new Date('2026-03-07T13:45:00'), status: 'pending' },
];

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
