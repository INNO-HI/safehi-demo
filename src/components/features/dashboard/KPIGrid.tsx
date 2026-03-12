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
    <div className="bg-white rounded-2xl shadow-elevated border border-neutral-border/30 p-4 flex flex-col justify-between h-[160px] animate-pulse">
      <div className="h-4 w-20 bg-neutral-bg rounded" />
      <div>
        <div className="h-7 w-16 bg-neutral-bg rounded" />
        <div className="h-5 w-12 bg-neutral-bg rounded-full mt-2" />
      </div>
      <div className="h-2 w-full bg-neutral-bg rounded-full" />
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
