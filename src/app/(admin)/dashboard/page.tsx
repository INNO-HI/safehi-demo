'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardKPI } from '@/hooks/useDashboardKPI';
import { PageHeader } from '@/components/layout/PageHeader';
import { KPIGrid } from '@/components/features/dashboard/KPIGrid';
import { RecentReportList } from '@/components/features/dashboard/RecentReportList';
import { NotificationPanel } from '@/components/features/dashboard/NotificationPanel';
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
    // 로딩 완료 후 인증되지 않은 사용자는 로그인으로 리다이렉트
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logoutApi();
    logout();
    router.push('/login');
  };

  const handleNotificationClick = () => {
    // 알림 패널 표시 또는 알림 페이지로 이동
    console.log('알림 클릭');
  };

  const handleProfileClick = () => {
    // 프로필 메뉴 표시 또는 프로필 페이지로 이동
    handleLogout();
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-base text-neutral-500">로딩 중...</p>
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
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* KPI 카드 그리드 */}
          {kpi && <KPIGrid data={kpi} isLoading={dataLoading} />}

          {/* 하단 영역: 최근 보고서 + 알림 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 최근 보고서 */}
            <RecentReportList reports={recentReports} isLoading={dataLoading} />

            {/* 알림 패널 */}
            <NotificationPanel notifications={notifications} isLoading={dataLoading} />
          </div>
        </div>
      </div>
    </>
  );
}
