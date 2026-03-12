'use client';

import { forwardRef } from 'react';

// ============================================================
// RecipientKPIGrid 컴포넌트
// T047: 대상자 KPI 카드 5개 그리드
// ============================================================

interface RecipientKPIs {
  total: number;
  normal: number;
  caution: number;
  urgent: number;
  unvisited: number;
}

interface RecipientKPIGridProps {
  kpis: RecipientKPIs;
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
 * RecipientKPIGrid 컴포넌트
 * 대상자 현황 KPI 카드 그리드
 */
export const RecipientKPIGrid = forwardRef<HTMLDivElement, RecipientKPIGridProps>(
  function RecipientKPIGrid({ kpis, className = '', isLoading = false }, ref) {
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}
        >
          <KPIItemSkeleton />
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
        className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}
      >
        <KPIItem
          label="전체 대상자"
          value={kpis.total}
          color="text-neutral-text-sub"
          bgColor=""
        />
        <KPIItem
          label="정상"
          value={kpis.normal}
          color="text-status-success"
          bgColor=""
        />
        <KPIItem
          label="주의"
          value={kpis.caution}
          color="text-status-warning"
          bgColor=""
        />
        <KPIItem
          label="긴급"
          value={kpis.urgent}
          color="text-status-danger"
          bgColor=""
        />
        <KPIItem
          label="미방문"
          value={kpis.unvisited}
          color="text-status-muted"
          bgColor=""
        />
      </div>
    );
  }
);

export default RecipientKPIGrid;
