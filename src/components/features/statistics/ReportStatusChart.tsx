'use client';

import { type HTMLAttributes } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils/cn';
import {
  REPORT_STATUS_COLORS,
  REPORT_STATUS_LABELS,
} from '@/lib/constants/statistics';
import type { ReportStatusDistribution } from '@/types/statistics';

export interface ReportStatusChartProps extends HTMLAttributes<HTMLDivElement> {
  data: ReportStatusDistribution;
}

// 상태 키 타입
type StatusKey = 'approved' | 'pending' | 'urgent' | 'rejected';

// 차트 데이터 변환
function transformToChartData(data: ReportStatusDistribution) {
  const statuses: StatusKey[] = ['approved', 'pending', 'urgent', 'rejected'];

  return statuses.map((status) => ({
    name: REPORT_STATUS_LABELS[status],
    value: data[status],
    color: REPORT_STATUS_COLORS[status],
    percentage: data.total > 0 ? Math.round((data[status] / data.total) * 100) : 0,
  }));
}

// 커스텀 툴팁
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; percentage: number } }>;
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const { name, value, percentage } = payload[0].payload;

  return (
    <div className="bg-white border border-neutral-border rounded-lg px-3 py-2 shadow-lg">
      <p className="text-caption text-neutral-text-sub">{name}</p>
      <p className="text-body font-semibold text-neutral-text">
        {value.toLocaleString()}건 ({percentage}%)
      </p>
    </div>
  );
}

/**
 * 보고서 처리 현황 도넛 차트 컴포넌트
 * 승인/대기/긴급/반려 상태 분포를 도넛 차트로 시각화
 */
export function ReportStatusChart({
  data,
  className,
  ...props
}: ReportStatusChartProps) {
  const chartData = transformToChartData(data);

  return (
    <div
      className={cn(
        'bg-white rounded-lg p-6 border border-neutral-border',
        className
      )}
      {...props}
    >
      {/* 헤더 */}
      <h2 className="text-h3 text-neutral-text mb-4">보고서 처리 현황</h2>

      {/* 차트 영역 */}
      <div className="relative h-48">
        {data.total === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-text-sub">
            데이터가 없습니다
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* 중앙 레이블 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-h2 font-semibold text-neutral-text">
                  {data.total.toLocaleString()}
                </p>
                <p className="text-caption text-neutral-text-sub">총 건수</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 범례 */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-caption text-neutral-text-sub truncate">
              {item.name}
            </span>
            <span className="text-caption font-medium text-neutral-text ml-auto">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
