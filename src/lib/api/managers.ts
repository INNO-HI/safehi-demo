/**
 * 매니저 API
 * /core/dashboard/managers/*
 */

import type { Manager, ManagerDetailExtended, ManagerStatus, ManagerFilters, ManagerKPIs } from '@/types/dashboard';
import { apiGet } from './client';

export interface ManagersResult {
  managers: Manager[];
  totalCount: number;
  statusCounts: Record<ManagerStatus | 'all', number>;
}

/**
 * 매니저 목록 조회
 */
export async function getManagers(filters: ManagerFilters): Promise<ManagersResult> {
  const params = new URLSearchParams();
  params.set('status', filters.status || 'all');
  if (filters.search) params.set('search', filters.search);
  if (filters.dong && filters.dong !== 'all') params.set('dong', filters.dong);
  if (filters.center && filters.center !== 'all') params.set('center', filters.center);

  return apiGet<ManagersResult>(`/managers?${params.toString()}`);
}

/**
 * 매니저 KPI 조회
 */
export async function getManagerKPIs(): Promise<ManagerKPIs> {
  return apiGet<ManagerKPIs>('/managers/kpi');
}

/**
 * 매니저 상세 조회
 */
export async function getManagerDetail(id: string): Promise<ManagerDetailExtended | null> {
  try {
    return await apiGet<ManagerDetailExtended>(`/managers/${id}`);
  } catch {
    return null;
  }
}

/**
 * 매니저별 보고서 목록 조회
 */
export async function getManagerReports(
  managerId: string,
  filters: { status: string; dateRange: { start: Date | null; end: Date | null } }
): Promise<{
  reports: Array<{ id: string; recipientId: string; recipientName: string; visitDate: string; registeredAt: string; status: string }>;
  totalCount: number;
  statusCounts: Record<string, number>;
}> {
  const params = new URLSearchParams();
  params.set('status', filters.status || 'all');
  if (filters.dateRange?.start) params.set('dateStart', filters.dateRange.start.toISOString());
  if (filters.dateRange?.end) params.set('dateEnd', filters.dateRange.end.toISOString());

  return apiGet(`/managers/${managerId}/reports?${params.toString()}`);
}

/**
 * 매니저별 방문 기록 목록 조회
 */
export async function getManagerVisits(
  managerId: string,
  filters: { visitType: string; search: string; dateRange: { start: Date | null; end: Date | null } }
): Promise<{
  visits: Array<{ id: string; recipientId: string; recipientName: string; visitDate: string; visitType: string; result: string }>;
  totalCount: number;
  typeCounts: Record<string, number>;
}> {
  const params = new URLSearchParams();
  params.set('visitType', filters.visitType || 'all');
  if (filters.search) params.set('search', filters.search);
  if (filters.dateRange?.start) params.set('dateStart', filters.dateRange.start.toISOString());
  if (filters.dateRange?.end) params.set('dateEnd', filters.dateRange.end.toISOString());

  return apiGet(`/managers/${managerId}/visits?${params.toString()}`);
}
