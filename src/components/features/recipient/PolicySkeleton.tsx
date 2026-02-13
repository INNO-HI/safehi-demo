'use client';

import { Skeleton } from '@/components/ui/Skeleton';

// ============================================================
// T049: PolicySkeleton 컴포넌트
// AI 정책 추천 페이지 로딩 상태
// ============================================================

/**
 * 개별 정책 카드 스켈레톤
 */
function PolicyCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4">
      <div className="flex items-start gap-4">
        {/* 매칭 점수 */}
        <div className="shrink-0 text-center">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-8 h-3 mx-auto mt-1" />
        </div>

        {/* 정책 정보 */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-48 h-5" />
            <Skeleton className="w-12 h-5 rounded-full" />
          </div>
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>

        {/* 아이콘 */}
        <Skeleton className="w-5 h-5 shrink-0" />
      </div>
    </div>
  );
}

/**
 * AI 정책 추천 페이지 스켈레톤
 */
export function PolicySkeleton() {
  return (
    <div className="space-y-6" aria-label="정책 추천 로딩 중" role="status">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-28 h-9 rounded-lg" />
        <Skeleton className="w-40 h-6" />
      </div>

      {/* AI 분석 안내 */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-6 h-6 rounded shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        </div>
      </div>

      {/* 새로고침 버튼 영역 */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-28 h-10 rounded-lg" />
      </div>

      {/* 정책 카드 목록 */}
      <div className="space-y-3">
        <PolicyCardSkeleton />
        <PolicyCardSkeleton />
        <PolicyCardSkeleton />
      </div>

      <span className="sr-only">AI 정책 추천을 불러오는 중입니다</span>
    </div>
  );
}
