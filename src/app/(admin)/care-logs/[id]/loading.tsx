import { CareLogDetailSkeleton } from '@/components/features/care-log/CareLogDetailSkeleton';

/**
 * 돌봄 일지 상세 페이지 로딩 UI
 */
export default function CareLogDetailLoading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CareLogDetailSkeleton />
    </div>
  );
}
