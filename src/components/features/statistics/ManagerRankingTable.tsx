'use client';

import { useState, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ManagerRanking } from '@/types/statistics';
import { ManagerRankingModal } from './ManagerRankingModal';

export interface ManagerRankingTableProps extends HTMLAttributes<HTMLDivElement> {
  data: ManagerRanking[];
  displayLimit?: number;
}

/**
 * 매니저 활동 순위 테이블 컴포넌트
 * 상위 N명의 매니저 실적(방문, 보고서, 승인률)을 표시
 */
export function ManagerRankingTable({
  data,
  displayLimit = 5,
  className,
  ...props
}: ManagerRankingTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 표시할 데이터 (상위 N명)
  const displayData = data.slice(0, displayLimit);

  return (
    <>
      <div
        className={cn(
          'bg-white rounded-lg p-6 border border-neutral-border',
          className
        )}
        {...props}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-neutral-text">매니저 활동 순위</h2>
          {data.length > displayLimit && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-primary font-medium hover:underline min-h-[44px] px-2 flex items-center"
            >
              전체보기
            </button>
          )}
        </div>

        {/* 테이블 */}
        {displayData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-neutral-text-sub">
            데이터가 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {displayData.map((manager) => (
              <div
                key={manager.id}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-neutral-bg/50"
              >
                {/* 순위 */}
                <div className="w-8 flex-shrink-0 text-center">
                  <span className={cn(
                    'text-body font-medium',
                    manager.rank <= 3 ? 'text-primary font-semibold' : 'text-neutral-text-sub'
                  )}>
                    {manager.rank}
                  </span>
                </div>

                {/* 아바타 + 이름 */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0"
                    style={{ backgroundColor: manager.avatarColor }}
                  >
                    {manager.initials}
                  </div>
                  <span className="text-body text-neutral-text font-medium truncate">
                    {manager.name}
                  </span>
                </div>

                {/* 실적 */}
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-caption text-neutral-text-sub">방문</p>
                    <p className="text-body font-semibold text-neutral-text">
                      {manager.visits}회
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-neutral-text-sub">보고서</p>
                    <p className="text-body font-semibold text-neutral-text">
                      {manager.reports}건
                    </p>
                  </div>
                  <div className="w-14">
                    <p className="text-caption text-neutral-text-sub">승인률</p>
                    <p className="text-body font-semibold text-status-success">
                      {manager.approvalRate}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 전체보기 모달 */}
      <ManagerRankingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
      />
    </>
  );
}
