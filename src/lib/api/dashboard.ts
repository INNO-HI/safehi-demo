/**
 * 대시보드 API
 * GET /core/dashboard/kpi, /recent-reports, /notifications
 *
 * 백엔드 미연동 시 빈 응답으로 fallback (v1.0.0: 신규 계정 빈 대시보드)
 */

import type { DashboardKPI, RecentReport, Notification } from '@/types/dashboard';
import { apiGet } from './client';

const EMPTY_KPI: DashboardKPI = {
  todayVisits: { title: '오늘 방문', value: 0, change: 0, changeDirection: 'none', progressColor: 'blue', progressPercent: 0 },
  pendingReports: { title: '대기 보고서', value: 0, change: 0, changeDirection: 'none', progressColor: 'yellow', progressPercent: 0 },
  approvedCount: { title: '승인 완료', value: 0, change: 0, changeDirection: 'none', progressColor: 'green', progressPercent: 0 },
  totalRecipients: { title: '돌봄 대상자', value: 0, change: 0, changeDirection: 'none', progressColor: 'purple', progressPercent: 0 },
};

export async function getDashboardKPI(): Promise<DashboardKPI> {
  try {
    return await apiGet<DashboardKPI>('/kpi');
  } catch {
    return EMPTY_KPI;
  }
}

export async function getRecentReports(limit: number = 5): Promise<RecentReport[]> {
  try {
    return await apiGet<RecentReport[]>(`/recent-reports?limit=${limit}`);
  } catch {
    return [];
  }
}

export async function getNotifications(limit: number = 4): Promise<Notification[]> {
  try {
    return await apiGet<Notification[]>(`/notifications?limit=${limit}`);
  } catch {
    return [];
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  const notifications = await getNotifications(100);
  return notifications.filter((n) => n.isUrgent).length;
}
