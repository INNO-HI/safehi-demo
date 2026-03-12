'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants/statistics';
import type { RecipientStatusDistribution } from '@/types/statistics';

export interface RecipientStatusCardsProps extends HTMLAttributes<HTMLDivElement> {
  data: RecipientStatusDistribution;
}

// 상태 키 타입
type StatusKey = 'normal' | 'caution' | 'urgent' | 'unvisited';

// 트렌드 키 매핑
const TREND_KEYS: Record<StatusKey, keyof RecipientStatusDistribution['trends']> = {
  normal: 'normalChange',
  caution: 'cautionChange',
  urgent: 'urgentChange',
  unvisited: 'unvisitedChange',
};

// 트렌드 아이콘
function TrendIcon({ value }: { value: number }) {
  if (value === 0) return null;

  const isPositive = value > 0;

  return (
    <span
      className={cn(
        'inline-flex items-center text-caption',
        isPositive ? 'text-status-success' : 'text-status-error'
      )}
    >
      {isPositive ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
      {Math.abs(value)}
    </span>
  );
}

/**
 * 대상자 상태 분포 카드 컴포넌트
 * 정상/주의/긴급/미방문 상태별 인원수와 추이를 표시
 */
export function RecipientStatusCards({
  data,
  className,
  ...props
}: RecipientStatusCardsProps) {
  const statuses: StatusKey[] = ['normal', 'caution', 'urgent', 'unvisited'];

  return (
    <div
      className={cn(
        'bg-white rounded-lg p-6 border border-neutral-border flex flex-col',
        className
      )}
      {...props}
    >
      {/* 헤더 + 전체 대상자 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 text-neutral-text">대상자 상태 분포</h2>
        <span className="text-body text-neutral-text">
          전체 <span className="font-semibold">{data.total.toLocaleString()}</span>명
        </span>
      </div>

      {/* 상태 카드 그리드 */}
      <div className="grid grid-cols-4 gap-4 flex-1">
        {statuses.map((status) => {
          const count = data[status];
          const percentage = data.total > 0 ? Math.round((count / data.total) * 100) : 0;
          const trendKey = TREND_KEYS[status];
          const trend = data.trends[trendKey];
          const color = STATUS_COLORS[status];
          const label = STATUS_LABELS[status];
          const isUrgent = status === 'urgent' && count > 0;

          return (
            <div
              key={status}
              className={cn(
                'p-6 rounded-lg border transition-all flex flex-col',
                isUrgent
                  ? 'bg-status-danger-light'
                  : 'border-neutral-border hover:shadow-sm'
              )}
              style={isUrgent ? { borderColor: `${color}40` } : undefined}
            >
              {/* 라벨 + 색상 인디케이터 */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-body text-neutral-text-sub">{label}</span>
              </div>

              {/* 인원수 */}
              <p
                className={cn(
                  'text-[32px] leading-tight font-semibold flex-1 flex items-center',
                  isUrgent ? '' : 'text-neutral-text'
                )}
                style={isUrgent ? { color } : undefined}
              >
                {count.toLocaleString()}
                <span className="text-h3 font-normal ml-1">명</span>
              </p>

              {/* 비율 + 트렌드 */}
              <div className="flex items-center justify-between mt-3">
                <span className="text-body text-neutral-text-sub">
                  {percentage}%
                </span>
                <TrendIcon value={trend} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 전월 대비 전환 현황 */}
      {data.transition && (
        <div className="mt-4 pt-4 border-t border-neutral-border">
          <p className="text-body text-neutral-text-sub mb-3">전월 대비 상태 전환</p>
          <div className="grid grid-cols-2 gap-4">
            {/* 정상 → 주의/긴급 */}
            <div className="flex items-center gap-3 px-4 py-4 bg-status-danger-light rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-body font-medium" style={{ color: STATUS_COLORS.normal }}>
                  정상
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B9C3CF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                <span className="text-body font-medium" style={{ color: STATUS_COLORS.caution }}>
                  주의
                </span>
                <span className="text-body text-neutral-text-sub">/</span>
                <span className="text-body font-medium" style={{ color: STATUS_COLORS.urgent }}>
                  긴급
                </span>
              </div>
              <span className="text-h3 text-neutral-text ml-auto">
                <span className="font-semibold text-status-error">{data.transition.fromNormal}</span>
                <span className="text-body text-neutral-text-sub ml-1">명</span>
              </span>
            </div>

            {/* 주의/긴급 → 정상 */}
            <div className="flex items-center gap-3 px-4 py-4 bg-status-success-light rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-body font-medium" style={{ color: STATUS_COLORS.caution }}>
                  주의
                </span>
                <span className="text-body text-neutral-text-sub">/</span>
                <span className="text-body font-medium" style={{ color: STATUS_COLORS.urgent }}>
                  긴급
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B9C3CF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                <span className="text-body font-medium" style={{ color: STATUS_COLORS.normal }}>
                  정상
                </span>
              </div>
              <span className="text-h3 text-neutral-text ml-auto">
                <span className="font-semibold text-status-success">{data.transition.toNormal}</span>
                <span className="text-body text-neutral-text-sub ml-1">명</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
