'use client';

import { Skeleton, SkeletonText, SkeletonTitle } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

/**
 * 돌봄 일지 상세 스켈레톤 컴포넌트
 * 데이터 로딩 중 표시됩니다.
 */
export function CareLogDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="돌봄 일지 로딩 중">
      {/* 헤더 스켈레톤 */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <div>
            <SkeletonTitle className="mb-2" />
            <SkeletonText className="w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-16" />
      </header>

      {/* 방문 정보 카드 스켈레톤 */}
      <Card className="p-5">
        <SkeletonTitle className="mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </Card>

      {/* 돌봄 내용 카드 스켈레톤 */}
      <Card className="p-5">
        <SkeletonTitle className="mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <SkeletonText className="w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 특이사항 스켈레톤 */}
      <Card className="p-5">
        <SkeletonTitle className="mb-4" />
        <SkeletonText className="w-full mb-2" />
        <SkeletonText className="w-3/4" />
      </Card>

      {/* 버튼 스켈레톤 */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-11 w-24" />
        <Skeleton className="h-11 w-24" />
      </div>
    </div>
  );
}
