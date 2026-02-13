'use client';

import type { Visit } from '@/types/dashboard';
import { VisitTimelineItem } from './VisitTimelineItem';

// ============================================================
// T040: VisitTimeline 컴포넌트
// 방문 기록 타임라인
// ============================================================

interface VisitTimelineProps {
  visits: Visit[];
  className?: string;
}

/**
 * 방문 기록 타임라인 컴포넌트
 */
export function VisitTimeline({ visits, className = '' }: VisitTimelineProps) {
  if (visits.length === 0) {
    return (
      <div
        className={`text-center py-12 bg-neutral-50 rounded-xl ${className}`}
        role="status"
        aria-label="방문 기록 없음"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-4 text-neutral-300"
          aria-hidden="true"
        >
          <path
            d="M40 12H8V40H40V12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 8V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 8V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 24H40"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-neutral-500">방문 기록이 없습니다</p>
        <p className="text-sm text-neutral-400 mt-1">
          선택한 기간에 방문 기록이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className={className} role="feed" aria-label="방문 기록 타임라인">
      {visits.map((visit, index) => (
        <VisitTimelineItem
          key={visit.id}
          visit={visit}
          isFirst={index === 0}
          isLast={index === visits.length - 1}
        />
      ))}
    </div>
  );
}
