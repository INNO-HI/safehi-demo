/**
 * 대시보드 API
 * GET /core/dashboard/kpi, /recent-reports, /notifications
 */

import type { DashboardKPI, RecentReport, Notification } from '@/types/dashboard';
import { apiGet } from './client';

export async function getDashboardKPI(): Promise<DashboardKPI> {
  return apiGet<DashboardKPI>('/kpi');
}

export async function getRecentReports(limit: number = 5): Promise<RecentReport[]> {
  return apiGet<RecentReport[]>(`/recent-reports?limit=${limit}`);
}

export async function getNotifications(limit: number = 4): Promise<Notification[]> {
  return apiGet<Notification[]>(`/notifications?limit=${limit}`);
}

export async function getUnreadNotificationCount(): Promise<number> {
  const notifications = await getNotifications(100);
  // urgent 알림의 수를 미읽음 수로 간주
  return notifications.filter((n) => n.isUrgent).length;
}
