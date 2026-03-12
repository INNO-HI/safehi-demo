'use client';

import { forwardRef } from 'react';
import type { ManagerKPIs } from '@/types/dashboard';

// ============================================================
// ManagerKPIGrid 컴포넌트
// 매니저 현황 KPI 카드 그리드
// ============================================================

interface ManagerKPIGridProps {
  kpis: ManagerKPIs;
  className?: string;
  isLoading?: boolean;
}

interface KPIItemProps {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

function KPIItem({ label, value, color }: KPIItemProps) {
  return (
    <div className="p-4 rounded-xl bg-white shadow-elevated border border-neutral-border/30">
      <p className={`text-sm font-medium ${color}`}>{label}</p>
      <p className="text-2xl font-bold text-neutral-900 mt-1">
        {value.toLocaleString()}
        <span className="text-sm font-normal text-neutral-500 ml-1">명</span>
      </p>
    </div>
  );
}

function KPIItemSkeleton() {
  return (
    <div className="p-4 rounded-lg bg-neutral-100 animate-pulse">
      <div className="h-4 w-16 bg-neutral-200 rounded mb-2" />
      <div className="h-8 w-20 bg-neutral-200 rounded" />
    </div>
  );
}

/**
 * ManagerKPIGrid 컴포넌트
 * 매니저 현황 KPI 카드 그리드
 */
export const ManagerKPIGrid = forwardRef<HTMLDivElement, ManagerKPIGridProps>(
  function ManagerKPIGrid({ kpis, className = '', isLoading = false }, ref) {
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}
        >
          <KPIItemSkeleton />
          <KPIItemSkeleton />
          <KPIItemSkeleton />
          <KPIItemSkeleton />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}
      >
        <KPIItem
          label="전체 매니저"
          value={kpis.total}
          color="text-neutral-text-sub"
          bgColor=""
        />
        <KPIItem
          label="근무 중"
          value={kpis.active}
          color="text-status-success"
          bgColor=""
        />
        <KPIItem
          label="휴무"
          value={kpis.leave}
          color="text-status-warning"
          bgColor=""
        />
        <KPIItem
          label="퇴직"
          value={kpis.retired}
          color="text-status-muted"
          bgColor=""
        />
      </div>
    );
  }
);

export default ManagerKPIGrid;
