'use client';

import { Modal } from '@/components/ui/Modal';
import { RANK_COLORS } from '@/lib/constants/statistics';
import type { ManagerRanking } from '@/types/statistics';

export interface ManagerRankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ManagerRanking[];
}

// 메달 아이콘 컴포넌트
function MedalIcon({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <span className="text-body text-neutral-text-sub font-medium">
        {rank}위
      </span>
    );
  }

  const color = RANK_COLORS[rank as 1 | 2 | 3];

  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
      style={{ backgroundColor: color }}
    >
      {rank}
    </div>
  );
}

/**
 * 매니저 활동 순위 전체보기 모달
 * 모든 매니저의 실적을 테이블 형태로 표시
 */
export function ManagerRankingModal({
  isOpen,
  onClose,
  data,
}: ManagerRankingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="매니저 활동 순위 전체보기"
      size="lg"
    >
      <div className="space-y-2">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-neutral-bg rounded-lg text-caption text-neutral-text-sub font-medium">
          <span>순위</span>
          <span className="col-span-2">매니저</span>
          <span className="text-right">방문</span>
          <span className="text-right">보고서</span>
          <span className="text-right">승인률</span>
        </div>

        {/* 테이블 바디 */}
        <div className="max-h-96 overflow-y-auto">
          {data.map((manager) => (
            <div
              key={manager.id}
              className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-neutral-border last:border-b-0 hover:bg-neutral-bg/50 transition-colors items-center"
            >
              {/* 순위 */}
              <div>
                <MedalIcon rank={manager.rank} />
              </div>

              {/* 매니저 정보 */}
              <div className="col-span-2 flex items-center gap-2">
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

              {/* 방문 */}
              <span className="text-body text-neutral-text text-right font-semibold">
                {manager.visits.toLocaleString()}회
              </span>

              {/* 보고서 */}
              <span className="text-body text-neutral-text text-right font-semibold">
                {manager.reports.toLocaleString()}건
              </span>

              {/* 승인률 */}
              <span className="text-body text-status-success text-right font-semibold">
                {manager.approvalRate}%
              </span>
            </div>
          ))}
        </div>

        {/* 요약 */}
        <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-primary-light/30 rounded-lg mt-4">
          <span className="text-body text-neutral-text font-semibold">합계</span>
          <span className="col-span-2 text-body text-neutral-text">
            {data.length}명
          </span>
          <span className="text-body text-primary-main text-right font-bold">
            {data.reduce((sum, m) => sum + m.visits, 0).toLocaleString()}회
          </span>
          <span className="text-body text-primary-main text-right font-bold">
            {data.reduce((sum, m) => sum + m.reports, 0).toLocaleString()}건
          </span>
          <span className="text-body text-status-success text-right font-bold">
            {data.length > 0
              ? Math.round(data.reduce((sum, m) => sum + m.approvalRate, 0) / data.length)
              : 0}
            % 평균
          </span>
        </div>
      </div>
    </Modal>
  );
}
