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
      // 모든 데이터를 병렬로 가져오기
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
    } catch (err) {
      setError(err instanceof Error ? err : new Error('데이터를 불러오는데 실패했습니다'));
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
