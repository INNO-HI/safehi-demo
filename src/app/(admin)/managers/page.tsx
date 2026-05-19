'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useManagers } from '@/hooks/useManagers';
import { PageHeader } from '@/components/layout/PageHeader';
import { ManagerKPIGrid } from '@/components/features/dashboard/ManagerKPIGrid';
import { ManagerFilters } from '@/components/features/dashboard/ManagerFilters';
import { ManagerTable } from '@/components/features/dashboard/ManagerTable';

// ============================================================
// 매니저 관리 목록 페이지
// T009: 매니저 목록 페이지
// ============================================================

export default function ManagersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    managers,
    totalCount,
    statusCounts,
    kpis,
    filters,
    setStatus,
    setSearch,
    setDong,
    setCenter,
    resetFilters,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,
    isLoading,
    exportToExcel,
  } = useManagers();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

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
        title="매니저 관리"
        description="돌봄 매니저 현황을 확인하고 관리합니다"
        userName={user?.name}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-3 lg:px-8 pb-8 pt-2">
        <div className="space-y-6">
          {/* KPI 카드 그리드 */}
          <ManagerKPIGrid kpis={kpis} isLoading={isLoading} />

          {/* 필터 영역 */}
          <ManagerFilters
            filters={filters}
            onSearchChange={setSearch}
            onDongChange={setDong}
            onCenterChange={setCenter}
            onReset={resetFilters}
          />

          {/* 테이블 */}
          <div className="bg-white rounded-2xl shadow-elevated border border-neutral-border/30">
            <ManagerTable
              managers={managers}
              statusCounts={statusCounts}
              currentStatus={filters.status}
              onStatusChange={setStatus}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              totalItems={totalCount}
              onPageChange={goToPage}
              onPageSizeChange={setPageSize}
              onExportAll={exportToExcel}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
