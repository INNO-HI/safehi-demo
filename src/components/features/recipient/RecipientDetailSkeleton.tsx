'use client';

import { Skeleton, SkeletonText, SkeletonTitle } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

/**
 * 대상자 상세 스켈레톤 컴포넌트
 * 데이터 로딩 중 표시됩니다.
 */
export function RecipientDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="대상자 정보 로딩 중">
      {/* 헤더 스켈레톤 */}
      <header className="flex items-center gap-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-14 w-14 rounded-full" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SkeletonTitle />
            <Skeleton className="h-5 w-12" />
          </div>
          <SkeletonText className="w-20" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기본 정보 카드 스켈레톤 */}
        <Card className="p-5">
          <SkeletonTitle className="mb-4" />
          <div className="space-y-4">
            <div className="col-span-2">
              <Skeleton className="h-3 w-12 mb-2" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-12 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-neutral-200">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
            <div className="pt-4 border-t border-neutral-200">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        </Card>

        {/* 건강 정보 카드 스켈레톤 */}
        <Card className="p-5">
          <SkeletonTitle className="mb-4" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-200">
              <Skeleton className="h-3 w-16 mb-2" />
              <div className="space-y-2">
                <SkeletonText />
                <SkeletonText className="w-3/4" />
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-200">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        </Card>
      </div>

      {/* 최근 방문 스켈레톤 */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <SkeletonTitle />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-50 rounded-lg p-3 flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <SkeletonText />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 네비게이션 버튼 스켈레톤 */}
      <div className="flex gap-3">
        <Skeleton className="h-11 w-32" />
        <Skeleton className="h-11 w-32" />
        <Skeleton className="h-11 w-32" />
      </div>
    </div>
  );
}
