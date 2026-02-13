'use client';

import { forwardRef } from 'react';
import type { DashboardKPI } from '@/types/dashboard';
import { KPICard } from './KPICard';

// ============================================================
// KPIGrid 컴포넌트
// T031: 4개 KPI 카드 가로 배열
// ============================================================

interface KPIGridProps {
  data: DashboardKPI;
  className?: string;
  isLoading?: boolean;
}

/**
 * KPI 스켈레톤 카드
 */
function KPICardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5 flex flex-col gap-3 animate-pulse">
      {/* 제목 */}
      <div className="h-4 w-20 bg-neutral-200 rounded" />

      {/* 값 */}
      <div className="flex items-end justify-between gap-2">
        <div className="h-9 w-24 bg-neutral-200 rounded" />
        <div className="h-6 w-16 bg-neutral-200 rounded-full" />
      </div>

      {/* 프로그레스 바 */}
      <div className="h-2 w-full bg-neutral-200 rounded-full" />
    </div>
  );
}

/**
 * KPIGrid 컴포넌트
 * 대시보드 KPI 카드 그리드
 */
export const KPIGrid = forwardRef<HTMLDivElement, KPIGridProps>(function KPIGrid(
  { data, className = '', isLoading = false },
  ref
) {
  if (isLoading) {
    return (
      <div
        ref={ref}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
      >
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      <KPICard data={data.todayVisits} />
      <KPICard data={data.pendingReports} />
      <KPICard data={data.approvedCount} />
      <KPICard data={data.totalRecipients} />
    </div>
  );
});

export default KPIGrid;
