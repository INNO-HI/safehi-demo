'use client';

import { useState, useEffect } from 'react';
import type { DashboardKPI, RecentReport, Notification } from '@/types/dashboard';
import {
  getDashboardKPI,
  getRecentReports,
  getNotifications,
  getUnreadNotificationCount,
} from '@/lib/api/dashboard';

// ============================================================
// Mock 데이터 (디자인 확인용)
// ============================================================

const mockKPI: DashboardKPI = {
  todayVisits: { title: '오늘 방문', value: 12, change: 8, changeDirection: 'up', progressColor: 'blue', progressPercent: 75 },
  pendingReports: { title: '미완료 보고서', value: 3, change: 2, changeDirection: 'down', progressColor: 'yellow', progressPercent: 30 },
  approvedCount: { title: '승인 완료', value: 28, change: 5, changeDirection: 'up', progressColor: 'green', progressPercent: 90 },
  totalRecipients: { title: '전체 대상자', value: 156, change: 3, changeDirection: 'up', progressColor: 'neutral', progressPercent: 65 },
};

const mockReports: RecentReport[] = [
  { id: '1', recipientName: '김영희', managerName: '박민수', registeredAt: new Date('2026-03-11T09:30:00'), status: 'approved', isUrgent: false, reportType: 'visit', riskLevel: 'normal', dong: '역삼동' },
  { id: '2', recipientName: '이순자', managerName: '김지현', registeredAt: new Date('2026-03-11T10:15:00'), status: 'pending', isUrgent: false, reportType: 'health_check', riskLevel: 'caution', dong: '삼성동' },
  { id: '3', recipientName: '박철수', managerName: '이영호', registeredAt: new Date('2026-03-11T11:00:00'), status: 'urgent', isUrgent: true, reportType: 'visit', riskLevel: 'danger', dong: '대치동' },
  { id: '4', recipientName: '정미경', managerName: '박민수', registeredAt: new Date('2026-03-10T14:20:00'), status: 'approved', isUrgent: false, reportType: 'call_consult', riskLevel: 'normal', dong: '논현동' },
  { id: '5', recipientName: '최동욱', managerName: '김지현', registeredAt: new Date('2026-03-10T16:45:00'), status: 'rejected', isUrgent: false, reportType: 'visit', riskLevel: 'caution', dong: '청담동' },
];

const mockNotifications: Notification[] = [
  { id: '1', title: '긴급 방문 요청', content: '박철수님 긴급 방문이 요청되었습니다.', createdAt: new Date('2026-03-11T08:00:00'), isUrgent: true, icon: 'warning' },
  { id: '2', title: '보고서 승인 완료', content: '김영희님 방문 보고서가 승인되었습니다.', createdAt: new Date('2026-03-11T09:30:00'), isUrgent: false, icon: 'success' },
  { id: '3', title: '새 보고서 등록', content: '이순자님 건강 체크 보고서가 등록되었습니다.', createdAt: new Date('2026-03-11T10:15:00'), isUrgent: false, icon: 'report' },
  { id: '4', title: '일정 알림', content: '오후 2시 정미경님 방문 일정이 있습니다.', createdAt: new Date('2026-03-11T12:00:00'), isUrgent: false, icon: 'info' },
];

// ============================================================
// useDashboardKPI 훅
// T029: 대시보드 KPI 데이터 fetching
// ============================================================

interface UseDashboardKPIReturn {
  kpi: DashboardKPI | null;
  recentReports: RecentReport[];
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 대시보드 KPI 및 관련 데이터 fetching 훅
 * API 실패 시 mock 데이터로 폴백
 */
export function useDashboardKPI(): UseDashboardKPIReturn {
  const [kpi, setKPI] = useState<DashboardKPI | null>(null);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [kpiData, reportsData, notificationsData, unreadCountData] =
        await Promise.all([
          getDashboardKPI(),
          getRecentReports(5),
          getNotifications(4),
          getUnreadNotificationCount(),
        ]);

      setKPI(kpiData);
      setRecentReports(reportsData);
      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch {
      // API 실패 시 mock 데이터로 폴백
      setKPI(mockKPI);
      setRecentReports(mockReports);
      setNotifications(mockNotifications);
      setUnreadCount(2);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    kpi,
    recentReports,
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: fetchData,
  };
}

export default useDashboardKPI;
