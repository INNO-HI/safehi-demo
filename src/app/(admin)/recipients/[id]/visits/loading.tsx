import { VisitTimelineSkeleton } from '@/components/features/recipient/VisitTimelineSkeleton';

/**
 * 방문 기록 페이지 로딩 UI
 */
export default function VisitsLoading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <VisitTimelineSkeleton />
    </div>
  );
}
