'use client';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

/**
 * 스켈레톤 로딩 컴포넌트
 * 데이터 로딩 중 placeholder UI를 표시합니다.
 */
export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('bg-neutral-200 rounded animate-pulse', className)}
      style={{ width, height }}
      aria-busy="true"
      aria-label="로딩 중"
    />
  );
}

/**
 * 텍스트 스켈레톤 (한 줄)
 */
export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={cn('h-4 w-full', className)} />;
}

/**
 * 제목 스켈레톤
 */
export function SkeletonTitle({ className }: { className?: string }) {
  return <Skeleton className={cn('h-6 w-48', className)} />;
}

/**
 * 카드 스켈레톤
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl p-4 space-y-3', className)}>
      <SkeletonTitle />
      <SkeletonText />
      <SkeletonText className="w-3/4" />
    </div>
  );
}
