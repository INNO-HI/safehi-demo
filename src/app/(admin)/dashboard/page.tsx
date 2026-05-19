'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardKPI } from '@/hooks/useDashboardKPI';
import { PageHeader } from '@/components/layout/PageHeader';
import { KPIGrid } from '@/components/features/dashboard/KPIGrid';
import { RecentReportList } from '@/components/features/dashboard/RecentReportList';
import { NotificationPanel } from '@/components/features/dashboard/NotificationPanel';
import JejuDongMap from '@/components/features/dashboard/JejuDongMap';
import { logout as logoutApi } from '@/lib/api/auth';

// ============================================================
// 대시보드 페이지
// T034: 대시보드 홈 페이지 구현 (KPI + 보고서 + 알림)
// ============================================================

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { kpi, recentReports, notifications, unreadCount, isLoading: dataLoading } = useDashboardKPI();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  void logout;
  void logoutApi;

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-text-sub">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        title="대시보드"
        description={`안녕하세요, ${user?.name}님! 오늘도 좋은 하루 되세요.`}
        userName={user?.name}
        notificationCount={unreadCount}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-3 lg:px-8 pb-8 pt-2">
        <div className="space-y-4">
          {/* KPI + 알림 */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
            {/* 좌측: KPI */}
            <div>
              {kpi && <KPIGrid data={kpi} isLoading={dataLoading} />}
            </div>

            {/* 우측: 알림 */}
            <NotificationPanel notifications={notifications} isLoading={dataLoading} />
          </div>

          {/* 제주 동단위 돌봄 현황 지도 */}
          <JejuDongMap />

          {/* 최근 보고서 */}
          <RecentReportList reports={recentReports} isLoading={dataLoading} />
        </div>
      </div>
    </>
  );
}
