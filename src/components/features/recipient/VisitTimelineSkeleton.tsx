'use client';

import { Skeleton } from '@/components/ui/Skeleton';

// ============================================================
// T043: VisitTimelineSkeleton 컴포넌트
// 방문 기록 페이지 로딩 상태
// ============================================================

/**
 * 개별 타임라인 아이템 스켈레톤
 */
function TimelineItemSkeleton({ isLast = false }: { isLast?: boolean }) {
  return (
    <div className="relative pl-8 pb-6">
      {/* 타임라인 선 */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 w-0.5 h-[calc(100%-24px)] bg-neutral-200" />
      )}

      {/* 아이콘 원 */}
      <Skeleton className="absolute left-0 top-1 w-6 h-6 rounded-full" />

      {/* 콘텐츠 카드 */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
        {/* 헤더 */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-12 h-5 rounded-full" />
          <Skeleton className="w-20 h-4" />
        </div>

        {/* 요약 */}
        <div className="space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>

        {/* 링크 */}
        <Skeleton className="w-24 h-4" />
      </div>
    </div>
  );
}

/**
 * 날짜 필터 스켈레톤
 */
function DateFilterSkeleton() {
  return (
    <div className="flex items-end gap-3">
      <div className="space-y-1.5">
        <Skeleton className="w-12 h-4" />
        <Skeleton className="w-32 h-11 rounded-lg" />
      </div>
      <Skeleton className="w-4 h-4 mb-3" />
      <div className="space-y-1.5">
        <Skeleton className="w-12 h-4" />
        <Skeleton className="w-32 h-11 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * 방문 기록 페이지 스켈레톤
 */
export function VisitTimelineSkeleton() {
  return (
    <div className="space-y-6" aria-label="방문 기록 로딩 중" role="status">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-28 h-9 rounded-lg" />
        <Skeleton className="w-32 h-6" />
      </div>

      {/* 날짜 필터 스켈레톤 */}
      <DateFilterSkeleton />

      {/* 타임라인 스켈레톤 */}
      <div>
        <TimelineItemSkeleton />
        <TimelineItemSkeleton />
        <TimelineItemSkeleton />
        <TimelineItemSkeleton isLast />
      </div>

      <span className="sr-only">방문 기록을 불러오는 중입니다</span>
    </div>
  );
}
