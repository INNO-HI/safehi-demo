'use client';

import { forwardRef } from 'react';
import type { KPICard as KPICardType, KPIProgressColor, ChangeDirection } from '@/types/dashboard';

// ============================================================
// KPICard 컴포넌트
// T030: 값, 증감, 프로그레스 바 표시
// ============================================================

interface KPICardProps {
  data: KPICardType;
  className?: string;
}

// 프로그레스 바 색상 (프로젝트 테마 기반)
const progressColorStyles: Record<KPIProgressColor, string> = {
  blue: 'bg-primary',
  yellow: 'bg-status-warning',
  green: 'bg-status-success',
  purple: 'bg-primary-dark',
  neutral: 'bg-neutral-text-tertiary',
};

// 프로그레스 바 배경 색상
const progressBgStyles: Record<KPIProgressColor, string> = {
  blue: 'bg-primary-bg',
  yellow: 'bg-status-warning-light',
  green: 'bg-status-success-light',
  purple: 'bg-primary-bg',
  neutral: 'bg-neutral-bg',
};

// 아이콘 배경 색상
const iconBgStyles: Record<KPIProgressColor, string> = {
  blue: 'bg-primary-bg',
  yellow: 'bg-status-warning-light',
  green: 'bg-status-success-light',
  purple: 'bg-primary-bg',
  neutral: 'bg-neutral-bg',
};

// 아이콘 색상
const iconColorStyles: Record<KPIProgressColor, string> = {
  blue: 'text-primary',
  yellow: 'text-status-warning',
  green: 'text-status-success',
  purple: 'text-primary-dark',
  neutral: 'text-neutral-text-tertiary',
};

/** KPI 아이콘 (filled 스타일 + 원형 배경) */
function KPIIcon({ color }: { color: KPIProgressColor }) {
  const iconCls = `w-5 h-5 ${iconColorStyles[color]}`;

  const icon = (() => {
    switch (color) {
      case 'blue': // 오늘 방문
        return (
          <svg className={iconCls} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
            <path d="M9.5 13.5l2 2 4-4-1.41-1.41L11.5 12.67l-1.09-1.08L9.5 13.5z" opacity=".8" />
          </svg>
        );
      case 'yellow': // 대기 보고서
        return (
          <svg className={iconCls} viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
            <path d="M14 2v6h6" opacity=".5" />
            <path d="M12 18a1 1 0 100-2 1 1 0 000 2zm0-8a1 1 0 00-1 1v3a1 1 0 002 0v-3a1 1 0 00-1-1z" fill="white" />
          </svg>
        );
      case 'green': // 승인 완료
        return (
          <svg className={iconCls} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white" />
          </svg>
        );
      case 'neutral': // 전체 대상자
      case 'purple':
        return (
          <svg className={iconCls} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="7" r="4" />
            <path d="M9 13c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
            <circle cx="17" cy="8" r="3" opacity=".7" />
            <path d="M21 15v2h-4v-2c0-1.1-.5-2.09-1.28-2.86C17.82 12.46 21 13.67 21 15z" opacity=".7" />
          </svg>
        );
    }
  })();

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgStyles[color]}`}>
      {icon}
    </div>
  );
}

// 증감 아이콘 및 색상
function ChangeIndicator({
  change,
  direction,
}: {
  change: number;
  direction: ChangeDirection;
}) {
  if (direction === 'none' || change === 0) {
    return <span className="text-sm text-neutral-text-tertiary">변동 없음</span>;
  }

  const isUp = direction === 'up';
  const colorClass = isUp ? 'text-status-success' : 'text-status-danger';
  const bgClass = isUp ? 'bg-status-success-light' : 'bg-status-danger-light';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium ${colorClass} ${bgClass}`}
    >
      {isUp ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {Math.abs(change)}
    </span>
  );
}

/**
 * KPICard 컴포넌트
 * 대시보드 KPI 카드
 */
export const KPICard = forwardRef<HTMLDivElement, KPICardProps>(function KPICard(
  { data, className = '' },
  ref
) {
  const { title, value, change, changeDirection, progressColor, progressPercent } = data;

  return (
    <div
      ref={ref}
      className={`
        bg-white rounded-2xl shadow-elevated border border-neutral-border/30
        p-4 flex flex-col justify-between h-[160px]
        ${className}
      `}
    >
      {/* 아이콘 + 제목 */}
      <div className="flex items-center gap-3">
        <KPIIcon color={progressColor} />
        <h3 className="text-sm font-medium text-neutral-text-sub">{title}</h3>
      </div>

      {/* 값과 증감 */}
      <div className="flex items-end gap-2">
        <span className="text-[36px] font-bold text-neutral-text leading-none">{value.toLocaleString()}</span>
        <ChangeIndicator change={change} direction={changeDirection} />
      </div>

      {/* 프로그레스 바 */}
      {progressPercent !== undefined && (
        <div className="mt-1">
          <div className={`w-full h-2 rounded-full ${progressBgStyles[progressColor]}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColorStyles[progressColor]}`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default KPICard;
