'use client';

import { Modal } from '@/components/ui/Modal';
import type { DistrictVisit } from '@/types/statistics';

export interface DistrictVisitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DistrictVisit[];
}

/**
 * 동별 방문 현황 전체보기 모달
 * 모든 동의 방문 횟수를 테이블 형태로 표시
 */
export function DistrictVisitsModal({
  isOpen,
  onClose,
  data,
}: DistrictVisitsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="동별 방문 현황 전체보기"
      size="md"
    >
      <div className="space-y-2">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-neutral-bg rounded-lg text-caption text-neutral-text-sub font-medium">
          <span>순위</span>
          <span>동 이름</span>
          <span className="text-right">방문 횟수</span>
        </div>

        {/* 테이블 바디 */}
        <div className="max-h-96 overflow-y-auto">
          {data.map((item) => (
            <div
              key={item.district}
              className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-neutral-border last:border-b-0 hover:bg-neutral-bg/50 transition-colors"
            >
              <span className="text-body text-neutral-text font-medium">
                {item.rank}위
              </span>
              <span className="text-body text-neutral-text">{item.district}</span>
              <span className="text-body text-neutral-text text-right font-semibold">
                {item.visits.toLocaleString()}회
              </span>
            </div>
          ))}
        </div>

        {/* 합계 */}
        <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-primary-light/30 rounded-lg mt-4">
          <span className="text-body text-neutral-text font-semibold">합계</span>
          <span className="text-body text-neutral-text">{data.length}개 동</span>
          <span className="text-body text-primary-main text-right font-bold">
            {data.reduce((sum, d) => sum + d.visits, 0).toLocaleString()}회
          </span>
        </div>
      </div>
    </Modal>
  );
}
