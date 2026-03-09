'use client';

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface KPICardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  unit: string;
  icon: ReactNode;
  iconBgColor: string;
  isHighlighted?: boolean;
  highlightColor?: string;
}

/**
 * KPI 카드 컴포넌트
 * 핵심 성과 지표를 표시하는 카드
 * 긴급 케이스 등 강조 필요 시 하이라이트 적용
 */
export function KPICard({
  label,
  value,
  unit,
  icon,
  iconBgColor,
  isHighlighted = false,
  highlightColor = '#C45A5A',
  className,
  ...props
}: KPICardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg p-4 border transition-all',
        isHighlighted
          ? 'border bg-red-50/50'
          : 'border-neutral-border hover:shadow-md',
        className
      )}
      style={isHighlighted ? { borderColor: `${highlightColor}40` } : undefined}
      {...props}
    >
      <div className="flex items-start gap-3">
        {/* 아이콘 */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${iconBgColor}15` }}
        >
          <span style={{ color: iconBgColor }}>{icon}</span>
        </div>

        {/* 텍스트 영역 */}
        <div className="flex-1 min-w-0">
          <p className="text-caption text-neutral-text-sub truncate">{label}</p>
          <p
            className={cn(
              'text-h2 font-semibold mt-1',
              isHighlighted ? '' : 'text-neutral-text'
            )}
            style={isHighlighted ? { color: highlightColor } : undefined}
          >
            {value.toLocaleString()}
            <span className="text-body font-normal ml-0.5">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// KPI 타입별 아이콘 정의
export const KPI_ICONS = {
  totalRecipients: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  monthlyVisits: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  processedReports: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  emergencyCases: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  activeManagers: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};
