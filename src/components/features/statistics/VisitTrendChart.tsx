'use client';

import { type HTMLAttributes } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils/cn';
import type { MonthlyVisitTrend, TrendPeriod } from '@/types/statistics';

export interface VisitTrendChartProps extends HTMLAttributes<HTMLDivElement> {
  data: MonthlyVisitTrend[];
  period: TrendPeriod;
  onPeriodChange: (period: TrendPeriod) => void;
  isLoading?: boolean;
}

// 차트 색상
const CHART_COLOR = '#3D8B6E';

// 커스텀 툴팁 컴포넌트
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white border border-neutral-border rounded-lg px-3 py-2 shadow-lg">
      <p className="text-caption text-neutral-text-sub">{label}</p>
      <p className="text-body font-semibold text-neutral-text">
        {payload[0].value.toLocaleString()}회 방문
      </p>
    </div>
  );
}

/**
 * 월별 방문 추이 차트 컴포넌트
 * AreaChart로 시간에 따른 방문 횟수 변화를 시각화
 */
export function VisitTrendChart({
  data,
  period,
  onPeriodChange,
  isLoading = false,
  className,
  ...props
}: VisitTrendChartProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg p-6 border border-neutral-border',
        className
      )}
      {...props}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 text-neutral-text">월별 방문 추이</h2>

        {/* 기간 탭 */}
        <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
          <button
            onClick={() => onPeriodChange(6)}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              'min-h-[36px]', // 접근성
              period === 6
                ? 'bg-white text-[#3D8B6E] shadow-sm border border-[#3D8B6E]/20'
                : 'text-neutral-500 hover:text-neutral-700'
            )}
            aria-pressed={period === 6}
          >
            6개월
          </button>
          <button
            onClick={() => onPeriodChange(12)}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              'min-h-[36px]', // 접근성
              period === 12
                ? 'bg-white text-[#3D8B6E] shadow-sm border border-[#3D8B6E]/20'
                : 'text-neutral-500 hover:text-neutral-700'
            )}
            aria-pressed={period === 12}
          >
            1년
          </button>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="h-56">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse flex items-center gap-2 text-neutral-text-sub">
              <svg
                className="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
              데이터 로딩 중...
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-text-sub">
            데이터가 없습니다
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLOR} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
                tickFormatter={(value) => value.toLocaleString()}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="visits"
                stroke={CHART_COLOR}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisits)"
                dot={{ r: 4, fill: CHART_COLOR, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: CHART_COLOR, strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
