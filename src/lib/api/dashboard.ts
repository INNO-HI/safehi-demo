/**
 * 대시보드 API
 * GET /core/dashboard/kpi, /recent-reports, /notifications
 *
 * 백엔드 미연동 시 mock-data/dashboard.ts로 fallback
 */

import type { DashboardKPI, RecentReport, Notification } from '@/types/dashboard';
import { apiGet } from './client';
import { mockDashboardKPI, mockRecentReports, mockNotifications } from '@/lib/mock-data/dashboard';

export async function getDashboardKPI(): Promise<DashboardKPI> {
  try {
    return await apiGet<DashboardKPI>('/kpi');
  } catch {
    return mockDashboardKPI;
  }
}

export async function getRecentReports(limit: number = 5): Promise<RecentReport[]> {
  try {
    return await apiGet<RecentReport[]>(`/recent-reports?limit=${limit}`);
  } catch {
    return mockRecentReports.slice(0, limit);
  }
}

export async function getNotifications(limit: number = 4): Promise<Notification[]> {
  try {
    return await apiGet<Notification[]>(`/notifications?limit=${limit}`);
  } catch {
    return mockNotifications.slice(0, limit);
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  const notifications = await getNotifications(100);
  return notifications.filter((n) => n.isUrgent).length;
}
