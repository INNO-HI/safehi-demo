'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { KPICard, KPI_ICONS } from './KPICard';
import { KPI_ICON_COLORS, KPI_LABELS, KPI_UNITS } from '@/lib/constants/statistics';
import type { StatisticsKPI } from '@/types/statistics';

export interface KPICardGridProps extends HTMLAttributes<HTMLElement> {
  kpi: StatisticsKPI;
}

/**
 * KPI 카드 그리드 컴포넌트
 * 5개의 KPI 카드를 가로로 배치
 */
export function KPICardGrid({ kpi, className, ...props }: KPICardGridProps) {
  const kpiItems: Array<{
    key: keyof StatisticsKPI;
    icon: React.ReactNode;
    iconBgColor: string;
    label: string;
    unit: string;
    isHighlighted?: boolean;
    highlightColor?: string;
  }> = [
    {
      key: 'totalRecipients',
      icon: KPI_ICONS.totalRecipients,
      iconBgColor: KPI_ICON_COLORS.totalRecipients,
      label: KPI_LABELS.totalRecipients,
      unit: KPI_UNITS.totalRecipients,
    },
    {
      key: 'monthlyVisits',
      icon: KPI_ICONS.monthlyVisits,
      iconBgColor: KPI_ICON_COLORS.monthlyVisits,
      label: KPI_LABELS.monthlyVisits,
      unit: KPI_UNITS.monthlyVisits,
    },
    {
      key: 'processedReports',
      icon: KPI_ICONS.processedReports,
      iconBgColor: KPI_ICON_COLORS.processedReports,
      label: KPI_LABELS.processedReports,
      unit: KPI_UNITS.processedReports,
    },
    {
      key: 'emergencyCases',
      icon: KPI_ICONS.emergencyCases,
      iconBgColor: KPI_ICON_COLORS.emergencyCases,
      label: KPI_LABELS.emergencyCases,
      unit: KPI_UNITS.emergencyCases,
      isHighlighted: kpi.emergencyCases > 0,
      highlightColor: KPI_ICON_COLORS.emergencyCases,
    },
    {
      key: 'activeManagers',
      icon: KPI_ICONS.activeManagers,
      iconBgColor: KPI_ICON_COLORS.activeManagers,
      label: KPI_LABELS.activeManagers,
      unit: KPI_UNITS.activeManagers,
    },
  ];

  return (
    <section
      aria-label="핵심 성과 지표"
      className={cn('grid grid-cols-5 gap-4', className)}
      {...props}
    >
      {kpiItems.map((item) => (
        <KPICard
          key={item.key}
          label={item.label}
          value={kpi[item.key]}
          unit={item.unit}
          icon={item.icon}
          iconBgColor={item.iconBgColor}
          isHighlighted={item.isHighlighted}
          highlightColor={item.highlightColor}
        />
      ))}
    </section>
  );
}
