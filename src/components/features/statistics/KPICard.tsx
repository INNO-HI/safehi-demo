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
  /** 전월 대비 증감 수치 */
  change?: number;
}

/**
 * KPI 카드 컴포넌트
 * 핵심 성과 지표를 표시하는 카드
 * 증감 지표와 하이라이트 지원
 */
export function KPICard({
  label,
  value,
  unit,
  icon,
  iconBgColor,
  isHighlighted = false,
  highlightColor = '#F08C8C',
  change,
  className,
  ...props
}: KPICardProps) {
  return (
    <div
      className={cn(
        'w-[160px] h-[160px] bg-white rounded-xl p-5 border transition-all flex flex-col justify-between flex-shrink-0',
        isHighlighted
          ? 'border bg-[#F08C8C]/5'
          : 'border-neutral-border hover:shadow-md',
        className
      )}
      style={isHighlighted ? { borderColor: `${highlightColor}40` } : undefined}
      {...props}
    >
      {/* 상단: 아이콘 + 라벨 */}
      <div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
          style={{ backgroundColor: `${iconBgColor}15` }}
        >
          <span style={{ color: iconBgColor }}>{icon}</span>
        </div>
        <p className="text-xs text-neutral-text-sub">{label}</p>
      </div>

      {/* 하단: 숫자 + 증감 */}
      <div>
        <p
          className={cn(
            'text-[28px] leading-none font-bold tracking-tight',
            isHighlighted ? '' : 'text-neutral-text'
          )}
          style={isHighlighted ? { color: highlightColor } : undefined}
        >
          {value.toLocaleString()}
          <span
            className="text-xs font-normal ml-1"
            style={{ color: isHighlighted ? highlightColor : '#B9C3CF' }}
          >
            {unit}
          </span>
        </p>
        {change !== undefined && change !== 0 && (
          <span
            className={cn(
              'text-xs font-medium flex items-center gap-0.5 mt-1.5',
              change > 0 ? 'text-status-danger' : 'text-status-success'
            )}
          >
            {change > 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            전월 대비 {Math.abs(change)}
          </span>
        )}
      </div>
    </div>
  );
}

// KPI 타입별 아이콘 정의 (filled 스타일)
export const KPI_ICONS = {
  // 전체 대상자 — 사람 두 명 (꽉 찬 실루엣)
  totalRecipients: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="3.5" />
      <path d="M1.5 20c0-3.5 3-6.5 7.5-6.5s7.5 3 7.5 6.5H1.5z" />
      <circle cx="17.5" cy="7.5" r="2.5" opacity="0.45" />
      <path d="M15 20c0-2.2.8-4.2 2.2-5.6.6-.2 1.2-.4 1.8-.4 2.8 0 5 2.2 5 5H15z" opacity="0.45" />
    </svg>
  ),
  // 주의 대상자 — 느낌표 방패
  cautionCases: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L3 7v5c0 5.25 3.83 10.15 9 11.25C17.17 22.15 21 17.25 21 12V7l-9-5z" opacity="0.25" />
      <path d="M12 2L3 7v5c0 5.25 3.83 10.15 9 11.25C17.17 22.15 21 17.25 21 12V7l-9-5z" />
      <rect x="11" y="7" width="2" height="6" rx="1" fill="white" />
      <circle cx="12" cy="16" r="1.2" fill="white" />
    </svg>
  ),
  // 긴급 대상자 — 경고 삼각형
  emergencyCases: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <rect x="11" y="9" width="2" height="5" rx="1" fill="white" />
      <circle cx="12" cy="17" r="1.2" fill="white" />
    </svg>
  ),
  // 미처리 보고서 — 문서 + 시계
  pendingReports: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a7 7 0 0 1-1-3.5 7 7 0 0 1 7-7V8l-6-6H6z" opacity="0.35" />
      <path d="M14 2v6h6" fill="currentColor" opacity="0.2" />
      <path d="M14 2l6 6h-4a2 2 0 0 1-2-2V2z" />
      <circle cx="17" cy="17" r="5" />
      <path d="M17 14.5v3l2 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
  monthlyVisits: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10.5z" />
      <rect x="9" y="13" width="6" height="9" rx="1" fill="white" />
    </svg>
  ),
  processedReports: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z" />
      <path d="M14 2l6 6h-4a2 2 0 0 1-2-2V2z" opacity="0.3" fill="white" />
      <path d="M8 13h8M8 17h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
  activeManagers: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2H4z" />
    </svg>
  ),
};
