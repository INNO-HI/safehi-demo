'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import { useAuth } from '@/hooks/useAuth';
import { useCareLogs } from '@/hooks/useCareLogs';
import { PageHeader } from '@/components/layout/PageHeader';
import { CareLogFilters } from '@/components/features/dashboard/CareLogFilters';
import { CareLogTable } from '@/components/features/dashboard/CareLogTable';

// ============================================================
// 돌봄 일지 목록 페이지
// T039, T041-T044: 돌봄 일지 목록 + 일괄 처리 기능
// ============================================================

export default function CareLogsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    logs,
    totalCount,
    statusCounts,
    filters,
    setStatus,
    setSearch,
    setDateRange,
    setDong,
    resetFilters,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    setPageSize,
    selectedIds,
    selectedCount,
    isAllSelected,
    toggleSelect,
    toggleSelectAll,
    bulkApprove,
    bulkReject,
    isLoading,
  } = useCareLogs();

  // PDF 내보내기
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `돌봄일지_${new Date().toISOString().split('T')[0]}`,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // 일괄 승인 처리
  const handleBulkApprove = async () => {
    setIsProcessing(true);
    try {
      await bulkApprove();
    } finally {
      setIsProcessing(false);
    }
  };

  // 일괄 반려 처리
  const handleBulkReject = async () => {
    setIsProcessing(true);
    try {
      await bulkReject();
    } finally {
      setIsProcessing(false);
    }
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
        title="돌봄 일지"
        description="돌봄 일지를 조회하고 관리합니다"
        userName={user?.name}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 필터 영역 */}
          <CareLogFilters
            filters={filters}
            onSearchChange={setSearch}
            onDateRangeChange={setDateRange}
            onDongChange={setDong}
            onReset={resetFilters}
          />

          {/* 테이블 (PDF 내보내기 대상) */}
          <div
            ref={printRef}
            className="bg-white rounded-xl shadow-sm border border-neutral-200"
          >
            <CareLogTable
              logs={logs}
              statusCounts={statusCounts}
              currentStatus={filters.status}
              onStatusChange={setStatus}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              totalItems={totalCount}
              onPageChange={goToPage}
              onPageSizeChange={setPageSize}
              showCheckbox={true}
              selectedIds={selectedIds}
              isAllSelected={isAllSelected}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              selectedCount={selectedCount}
              onApprove={handleBulkApprove}
              onReject={handleBulkReject}
              onExportPDF={handlePrint}
              isProcessing={isProcessing}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
