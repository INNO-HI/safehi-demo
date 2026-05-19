'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { KPICard, KPI_ICONS } from './KPICard';
import type { RecipientStatusDistribution, ReportStatusDistribution } from '@/types/statistics';

export interface KPICardGridProps extends HTMLAttributes<HTMLElement> {
  recipientStatus: RecipientStatusDistribution;
  reportStatus: ReportStatusDistribution;
}

/**
 * 관리 KPI 카드 그리드 컴포넌트
 * 중간관리자 관점: 전체 대상자, 주의 대상자, 긴급 대상자, 미처리 보고서
 */
export function KPICardGrid({ recipientStatus, reportStatus, className, ...props }: KPICardGridProps) {
  const pendingReports = reportStatus.pending + reportStatus.urgent;

  return (
    <section
      aria-label="핵심 관리 지표"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    >
      <h2 className="text-base font-semibold text-neutral-text">전체 대상자 통계</h2>
      <div className="grid grid-cols-2 gap-3">
      <KPICard
        label="전체 대상자"
        value={recipientStatus.total}
        unit="명"
        icon={KPI_ICONS.totalRecipients}
        iconBgColor="#6EA8FE"
      />
      <KPICard
        label="주의 대상자"
        value={recipientStatus.caution}
        unit="명"
        icon={KPI_ICONS.cautionCases}
        iconBgColor="#F6C56F"
        isHighlighted={recipientStatus.caution > 0}
        highlightColor="#F6C56F"
      />
      <KPICard
        label="긴급 대상자"
        value={recipientStatus.urgent}
        unit="명"
        icon={KPI_ICONS.emergencyCases}
        iconBgColor="#F08C8C"
        isHighlighted={recipientStatus.urgent > 0}
        highlightColor="#F08C8C"
      />
      <KPICard
        label="미처리 보고서"
        value={pendingReports}
        unit="건"
        icon={KPI_ICONS.pendingReports}
        iconBgColor="#B9C3CF"
      />
      </div>
    </section>
  );
}
