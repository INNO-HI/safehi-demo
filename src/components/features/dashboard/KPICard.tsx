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

// 프로그레스 바 색상
const progressColorStyles: Record<KPIProgressColor, string> = {
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
};

// 프로그레스 바 배경 색상
const progressBgStyles: Record<KPIProgressColor, string> = {
  blue: 'bg-blue-100',
  yellow: 'bg-yellow-100',
  green: 'bg-green-100',
  purple: 'bg-purple-100',
};

// 증감 아이콘 및 색상
function ChangeIndicator({
  change,
  direction,
}: {
  change: number;
  direction: ChangeDirection;
}) {
  if (direction === 'none' || change === 0) {
    return <span className="text-sm text-neutral-500">변동 없음</span>;
  }

  const isUp = direction === 'up';
  const colorClass = isUp ? 'text-green-600' : 'text-red-600';
  const bgClass = isUp ? 'bg-green-100' : 'bg-red-100';

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
        bg-white rounded-xl shadow-sm border border-neutral-200
        p-5 flex flex-col gap-3
        ${className}
      `}
    >
      {/* 제목 */}
      <h3 className="text-sm font-medium text-neutral-500">{title}</h3>

      {/* 값과 증감 */}
      <div className="flex items-end justify-between gap-2">
        <span className="text-3xl font-bold text-neutral-900">{value.toLocaleString()}</span>
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
