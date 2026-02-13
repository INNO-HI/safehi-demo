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
