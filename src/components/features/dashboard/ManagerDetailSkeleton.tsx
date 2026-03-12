'use client';

// ============================================================
// ManagerDetailSkeleton 컴포넌트
// T012: 매니저 상세 페이지 로딩 스켈레톤
// ============================================================

function SkeletonBox({ className = '' }: { className?: string }) {
  return <div className={`bg-neutral-200 rounded animate-pulse ${className}`} />;
}

/**
 * 매니저 상세 페이지 로딩 스켈레톤
 */
export function ManagerDetailSkeleton() {
  return (
    <>
      {/* 헤더 스켈레톤 */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 mx-6 mt-4 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SkeletonBox className="w-11 h-11" />
            <div>
              <SkeletonBox className="w-24 h-4 mb-2" />
              <SkeletonBox className="w-32 h-7" />
            </div>
          </div>
          <SkeletonBox className="w-20 h-7" />
        </div>
      </div>

      {/* 콘텐츠 스켈레톤 */}
      <div className="px-8 pb-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 좌측 컬럼 */}
          <div className="space-y-6">
            {/* 프로필 카드 */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
              <div className="flex items-start gap-5">
                <SkeletonBox className="w-20 h-20 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <SkeletonBox className="w-32 h-7 mb-2" />
                  <SkeletonBox className="w-48 h-5 mb-4" />
                  <div className="space-y-2">
                    <SkeletonBox className="w-40 h-4" />
                    <SkeletonBox className="w-36 h-4" />
                    <SkeletonBox className="w-44 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* 업무 통계 */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
              <SkeletonBox className="w-24 h-6 mb-4" />
              <div className="grid grid-cols-2 gap-3">
                <SkeletonBox className="h-20" />
                <SkeletonBox className="h-20" />
                <SkeletonBox className="h-20" />
                <SkeletonBox className="h-20" />
              </div>
            </div>
          </div>

          {/* 우측 컬럼 */}
          <div className="space-y-6">
            {/* 최근 보고서 */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
              <div className="flex items-center justify-between mb-4">
                <SkeletonBox className="w-28 h-6" />
                <SkeletonBox className="w-20 h-5" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg">
                    <div className="flex-1">
                      <SkeletonBox className="w-28 h-4 mb-2" />
                      <SkeletonBox className="w-20 h-3" />
                    </div>
                    <SkeletonBox className="w-12 h-5" />
                  </div>
                ))}
              </div>
            </div>

            {/* 최근 방문 기록 */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
              <div className="flex items-center justify-between mb-4">
                <SkeletonBox className="w-32 h-6" />
                <SkeletonBox className="w-20 h-5" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border border-neutral-100 rounded-lg">
                    <SkeletonBox className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <SkeletonBox className="w-28 h-4 mb-2" />
                      <SkeletonBox className="w-40 h-3" />
                    </div>
                    <SkeletonBox className="w-16 h-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerDetailSkeleton;
