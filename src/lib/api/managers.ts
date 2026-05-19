/**
 * 매니저 API
 * /core/dashboard/managers/*
 */

import type { Manager, ManagerDetailExtended, ManagerStatus, ManagerFilters, ManagerKPIs, ReportStatus, ManagerVisitType } from '@/types/dashboard';
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

  try {
    return await apiGet<ManagersResult>(`/managers?${params.toString()}`);
  } catch {
    return {
      managers: [],
      totalCount: 0,
      statusCounts: { all: 0, active: 0, leave: 0, retired: 0 },
    };
  }
}

/**
 * 매니저 KPI 조회
 */
export async function getManagerKPIs(): Promise<ManagerKPIs> {
  try {
    return await apiGet<ManagerKPIs>('/managers/kpi');
  } catch {
    return { total: 0, active: 0, leave: 0, retired: 0 };
  }
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
  reports: Array<{ id: string; recipientId: string; recipientName: string; visitDate: Date; registeredAt: Date; status: ReportStatus }>;
  totalCount: number;
  statusCounts: Record<string, number>;
}> {
  const params = new URLSearchParams();
  params.set('status', filters.status || 'all');
  if (filters.dateRange?.start) params.set('dateStart', filters.dateRange.start.toISOString());
  if (filters.dateRange?.end) params.set('dateEnd', filters.dateRange.end.toISOString());

  let response: {
    reports: Array<{ id: string; recipientId: string; recipientName: string; visitDate: string; registeredAt: string; status: string }>;
    totalCount: number;
    statusCounts: Record<string, number>;
  };
  try {
    response = await apiGet<{
      reports: Array<{ id: string; recipientId: string; recipientName: string; visitDate: string; registeredAt: string; status: string }>;
      totalCount: number;
      statusCounts: Record<string, number>;
    }>(`/managers/${managerId}/reports?${params.toString()}`);
  } catch {
    response = { reports: [], totalCount: 0, statusCounts: { all: 0, pending: 0, approved: 0, rejected: 0 } };
  }

  return {
    ...response,
    reports: response.reports.map(report => ({
      id: report.id,
      recipientId: report.recipientId,
      recipientName: report.recipientName,
      visitDate: new Date(report.visitDate),
      registeredAt: new Date(report.registeredAt),
      status: report.status as ReportStatus,
    })) as Array<{ id: string; recipientId: string; recipientName: string; visitDate: Date; registeredAt: Date; status: ReportStatus }>,
  };
}

/**
 * 매니저별 방문 기록 목록 조회
 */
export async function getManagerVisits(
  managerId: string,
  filters: { visitType: string; search: string; dateRange: { start: Date | null; end: Date | null } }
): Promise<{
  visits: Array<{ id: string; recipientId: string; recipientName: string; visitDate: Date; visitType: ManagerVisitType; result: string }>;
  totalCount: number;
  typeCounts: Record<string, number>;
}> {
  const params = new URLSearchParams();
  params.set('visitType', filters.visitType || 'all');
  if (filters.search) params.set('search', filters.search);
  if (filters.dateRange?.start) params.set('dateStart', filters.dateRange.start.toISOString());
  if (filters.dateRange?.end) params.set('dateEnd', filters.dateRange.end.toISOString());

  let response: {
    visits: Array<{ id: string; recipientId: string; recipientName: string; visitDate: string; visitType: string; result: string }>;
    totalCount: number;
    typeCounts: Record<string, number>;
  };
  try {
    response = await apiGet<{
      visits: Array<{ id: string; recipientId: string; recipientName: string; visitDate: string; visitType: string; result: string }>;
      totalCount: number;
      typeCounts: Record<string, number>;
    }>(`/managers/${managerId}/visits?${params.toString()}`);
  } catch {
    response = { visits: [], totalCount: 0, typeCounts: { all: 0, regular: 0, emergency: 0, call: 0 } };
  }

  return {
    ...response,
    visits: response.visits.map(visit => ({
      id: visit.id,
      recipientId: visit.recipientId,
      recipientName: visit.recipientName,
      visitDate: new Date(visit.visitDate),
      visitType: visit.visitType as ManagerVisitType,
      result: visit.result,
    })) as Array<{ id: string; recipientId: string; recipientName: string; visitDate: Date; visitType: ManagerVisitType; result: string }>,
  };
}
