'use client';

import { useState, type HTMLAttributes } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils/cn';
import type { DistrictVisit } from '@/types/statistics';
import { DistrictVisitsModal } from './DistrictVisitsModal';

export interface DistrictVisitChartProps extends HTMLAttributes<HTMLDivElement> {
  data: DistrictVisit[];
  displayLimit?: number;
}

// 차트 색상 (메인 컬러)
const BAR_COLOR = '#448CFF';

// 커스텀 툴팁
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DistrictVisit }>;
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const { district, visits, rank } = payload[0].payload;

  return (
    <div className="bg-white border border-neutral-border rounded-lg px-3 py-2 shadow-lg">
      <p className="text-caption text-neutral-text-sub">{rank}위 · {district}</p>
      <p className="text-body font-semibold text-neutral-text">
        {visits.toLocaleString()}회 방문
      </p>
    </div>
  );
}

/**
 * 동별 방문 현황 가로 막대 차트 컴포넌트
 * 상위 N개의 동별 방문 횟수를 가로 막대 차트로 시각화
 */
export function DistrictVisitChart({
  data,
  displayLimit = 5,
  className,
  ...props
}: DistrictVisitChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 표시할 데이터 (상위 N개)
  const displayData = data.slice(0, displayLimit);

  return (
    <>
      <div
        className={cn(
          'bg-white rounded-lg px-6 pt-6 pb-4 border border-neutral-border flex flex-col',
          className
        )}
        {...props}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-h3 text-neutral-text">동별 방문 현황</h2>
          {data.length > displayLimit && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-primary font-medium hover:underline min-h-[44px] px-2 flex items-center"
            >
              전체보기
            </button>
          )}
        </div>

        {/* 차트 영역 - flex-1로 남은 공간 모두 채움 */}
        <div className="flex-1 min-h-[260px]">
          {displayData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-neutral-text-sub">
              데이터가 없습니다
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis
                  type="category"
                  dataKey="district"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: '#1F2937' }}
                  width={55}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                <Bar dataKey="visits" radius={[0, 4, 4, 0]}>
                  {displayData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BAR_COLOR}
                      fillOpacity={1 - index * 0.08}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 전체보기 모달 */}
      <DistrictVisitsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
      />
    </>
  );
}
