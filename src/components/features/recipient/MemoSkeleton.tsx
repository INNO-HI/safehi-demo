'use client';

import { Skeleton } from '@/components/ui/Skeleton';

// ============================================================
// T036: MemoSkeleton 컴포넌트
// 담당자 메모 페이지 로딩 상태
// ============================================================

/**
 * 개별 메모 카드 스켈레톤
 */
function MemoCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
      {/* 헤더: 아바타, 이름, 날짜 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-16 h-4" />
        </div>
        <Skeleton className="w-20 h-4" />
      </div>

      {/* 내용 */}
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />
      </div>
    </div>
  );
}

/**
 * 메모 폼 스켈레톤
 */
function MemoFormSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-full h-24 rounded-lg" />
      <div className="flex justify-end">
        <Skeleton className="w-24 h-11 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * 담당자 메모 페이지 스켈레톤
 */
export function MemoSkeleton() {
  return (
    <div className="space-y-6" aria-label="메모 로딩 중" role="status">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-24 h-9 rounded-lg" />
        <Skeleton className="w-32 h-6" />
      </div>

      {/* 메모 폼 스켈레톤 */}
      <MemoFormSkeleton />

      {/* 메모 목록 스켈레톤 */}
      <div className="space-y-4">
        <MemoCardSkeleton />
        <MemoCardSkeleton />
        <MemoCardSkeleton />
      </div>

      <span className="sr-only">메모를 불러오는 중입니다</span>
    </div>
  );
}
