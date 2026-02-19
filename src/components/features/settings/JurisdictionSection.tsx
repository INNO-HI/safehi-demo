'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { JurisdictionInfo } from '@/types/settings';

interface JurisdictionSectionProps {
  jurisdiction: JurisdictionInfo;
}

// 통계 카드 데이터 매핑
const statCards = [
  { key: 'dongCount' as const, label: '담당 동', color: 'text-primary' },
  { key: 'centerCount' as const, label: '복지센터', color: 'text-primary-dark' },
  { key: 'managerCount' as const, label: '소속 매니저', color: 'text-primary' },
];

/**
 * 관할 구역 섹션
 * 기관 정보, 통계 카드, 동 목록 (읽기 전용)
 */
export function JurisdictionSection({ jurisdiction }: JurisdictionSectionProps) {
  const [showAll, setShowAll] = useState(false);

  // 동 목록 요약 표시
  const visibleDongs = showAll ? jurisdiction.dongList : jurisdiction.dongList.slice(0, 7);
  const remainingCount = jurisdiction.dongList.length - 7;

  return (
    <Card variant="default" padding="md" className="h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-h3 font-semibold text-neutral-text flex items-center gap-2 whitespace-nowrap">
          <svg className="w-5 h-5 flex-shrink-0 text-neutral-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          관할 구역
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="flex-shrink-0 w-fit !min-h-0 !py-1 !px-2"
        >
          {showAll ? '접기' : '전체보기'}
        </Button>
      </div>

      {/* 기관 정보 */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg border border-neutral-border bg-neutral-50">
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary-bg">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <p className="text-body font-semibold text-neutral-text">{jurisdiction.organizationName}</p>
          <p className="text-caption text-neutral-text-sub">{jurisdiction.department}</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {statCards.map(({ key, label, color }) => (
          <div key={key} className="text-center p-3 rounded-lg border border-neutral-border bg-neutral-50">
            <p className={`text-h2 font-bold ${color}`}>
              {jurisdiction[key]}
            </p>
            <p className="text-caption text-neutral-text-sub">{label}</p>
          </div>
        ))}
      </div>

      {/* 동 목록 */}
      <p className="text-body text-neutral-text-sub">
        {showAll
          ? visibleDongs.join(', ')
          : `${visibleDongs.join(', ')}${remainingCount > 0 ? ` 외 ${remainingCount}개 동` : ''}`
        }
      </p>
    </Card>
  );
}
