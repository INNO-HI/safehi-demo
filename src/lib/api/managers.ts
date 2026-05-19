/**
 * 매니저 API
 * /core/dashboard/managers/*
 *
 * 백엔드 미연동 시 mock-data/managers.ts로 fallback.
 */

import type { Manager, ManagerDetailExtended, ManagerStatus, ManagerFilters, ManagerKPIs, ReportStatus, ManagerVisitType } from '@/types/dashboard';
import { apiGet } from './client';
import {
  mockManagers,
  mockManagerKPIs,
  mockManagerDetails,
  getMockManagerStatusCounts,
} from '@/lib/mock-data/managers';

export interface ManagersResult {
  managers: Manager[];
  totalCount: number;
  statusCounts: Record<ManagerStatus | 'all', number>;
}

function filterMockManagers(filters: ManagerFilters): ManagersResult {
  let filtered = [...mockManagers];

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((m) => m.status === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.centerName.toLowerCase().includes(q) ||
        m.assignedDongs.some((d) => d.toLowerCase().includes(q))
    );
  }
  if (filters.dong && filters.dong !== 'all') {
    filtered = filtered.filter((m) => m.assignedDongs.includes(filters.dong as string));
  }
  if (filters.center && filters.center !== 'all') {
    filtered = filtered.filter((m) => m.centerName === filters.center);
  }

  return {
    managers: filtered,
    totalCount: filtered.length,
    statusCounts: getMockManagerStatusCounts(),
  };
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
    return filterMockManagers(filters);
  }
}

/**
 * 매니저 KPI 조회
 */
export async function getManagerKPIs(): Promise<ManagerKPIs> {
  try {
    return await apiGet<ManagerKPIs>('/managers/kpi');
  } catch {
    return mockManagerKPIs;
  }
}

/**
 * 매니저 상세 조회
 */
export async function getManagerDetail(id: string): Promise<ManagerDetailExtended | null> {
  try {
    return await apiGet<ManagerDetailExtended>(`/managers/${id}`);
  } catch {
    return mockManagerDetails[id] || mockManagerDetails['m-1'] || null;
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
    // Mock fallback: 매니저 상세에서 recentReports 추출하고 추가 데이터 생성
    const detail = mockManagerDetails[managerId];
    const reports = detail ? detail.recentReports : [];
    // 더 많은 보고서 시뮬레이션
    const expanded = reports.flatMap((r, i) => [
      r,
      { ...r, id: `${r.id}-a`, status: 'approved' as ReportStatus, visitDate: new Date(r.visitDate.getTime() - 86400000 * (i + 1)) },
      { ...r, id: `${r.id}-b`, status: i % 2 === 0 ? 'pending' as ReportStatus : 'approved' as ReportStatus, visitDate: new Date(r.visitDate.getTime() - 86400000 * (i + 8)) },
    ]);
    let filtered = expanded;
    if (filters.status && filters.status !== 'all') {
      filtered = expanded.filter((r) => r.status === filters.status);
    }
    const counts: Record<string, number> = {
      all: expanded.length,
      pending: expanded.filter((r) => r.status === 'pending').length,
      approved: expanded.filter((r) => r.status === 'approved').length,
      rejected: expanded.filter((r) => r.status === 'rejected').length,
    };
    response = {
      reports: filtered.map((r) => ({
        id: r.id,
        recipientId: r.recipientId,
        recipientName: r.recipientName,
        visitDate: r.visitDate.toISOString(),
        registeredAt: r.registeredAt.toISOString(),
        status: r.status,
      })),
      totalCount: filtered.length,
      statusCounts: counts,
    };
  }

  return {
    ...response,
    reports: response.reports.map((report) => ({
      id: report.id,
      recipientId: report.recipientId,
      recipientName: report.recipientName,
      visitDate: new Date(report.visitDate),
      registeredAt: new Date(report.registeredAt),
      status: report.status as ReportStatus,
    })),
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
    const detail = mockManagerDetails[managerId];
    const visits = detail ? detail.recentVisits : [];
    const expanded = visits.flatMap((v, i) => [
      v,
      { ...v, id: `${v.id}-a`, visitDate: new Date(v.visitDate.getTime() - 86400000 * (i + 3)) },
      { ...v, id: `${v.id}-b`, visitType: 'call' as ManagerVisitType, visitDate: new Date(v.visitDate.getTime() - 86400000 * (i + 10)) },
    ]);
    let filtered = expanded;
    if (filters.visitType && filters.visitType !== 'all') {
      filtered = expanded.filter((v) => v.visitType === filters.visitType);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter((v) => v.recipientName.toLowerCase().includes(q));
    }
    const typeCounts: Record<string, number> = {
      all: expanded.length,
      regular: expanded.filter((v) => v.visitType === 'regular').length,
      emergency: expanded.filter((v) => v.visitType === 'emergency').length,
      call: expanded.filter((v) => v.visitType === 'call').length,
    };
    response = {
      visits: filtered.map((v) => ({
        id: v.id,
        recipientId: v.recipientId,
        recipientName: v.recipientName,
        visitDate: v.visitDate.toISOString(),
        visitType: v.visitType,
        result: v.result,
      })),
      totalCount: filtered.length,
      typeCounts,
    };
  }

  return {
    ...response,
    visits: response.visits.map((visit) => ({
      id: visit.id,
      recipientId: visit.recipientId,
      recipientName: visit.recipientName,
      visitDate: new Date(visit.visitDate),
      visitType: visit.visitType as ManagerVisitType,
      result: visit.result,
    })),
  };
}
