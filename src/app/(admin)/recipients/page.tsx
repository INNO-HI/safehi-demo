'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRecipients } from '@/hooks/useRecipients';
import { PageHeader } from '@/components/layout/PageHeader';
import { RecipientKPIGrid } from '@/components/features/dashboard/RecipientKPIGrid';
import { RecipientFilters } from '@/components/features/dashboard/RecipientFilters';
import { RecipientTable } from '@/components/features/dashboard/RecipientTable';

// ============================================================
// 대상자 관리 목록 페이지
// T050-T051: 대상자 관리 페이지 + Excel 내보내기
// ============================================================

export default function RecipientsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    recipients,
    totalCount,
    statusCounts,
    kpis,
    filters,
    setStatus,
    setSearch,
    setDong,
    setManager,
    resetFilters,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,
    isLoading,
    selectedIds,
    setSelectedIds,
    selectedCount,
    exportToExcel,
    exportSelectedToExcel,
  } = useRecipients();

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
        title="대상자 관리"
        description="돌봄 대상자 현황을 확인하고 관리합니다"
        userName={user?.name}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* KPI 카드 그리드 */}
          <RecipientKPIGrid kpis={kpis} isLoading={isLoading} />

          {/* 필터 영역 */}
          <RecipientFilters
            filters={filters}
            onSearchChange={setSearch}
            onDongChange={setDong}
            onManagerChange={setManager}
            onReset={resetFilters}
          />

          {/* 테이블 */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
            <RecipientTable
              recipients={recipients}
              statusCounts={statusCounts}
              currentStatus={filters.status}
              onStatusChange={setStatus}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              totalItems={totalCount}
              onPageChange={goToPage}
              onPageSizeChange={setPageSize}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onExportAll={exportToExcel}
              onExportSelected={exportSelectedToExcel}
              selectedCount={selectedCount}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
