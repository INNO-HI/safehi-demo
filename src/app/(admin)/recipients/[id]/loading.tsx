import { RecipientDetailSkeleton } from '@/components/features/recipient/RecipientDetailSkeleton';

/**
 * 대상자 상세 페이지 로딩 UI
 */
export default function RecipientDetailLoading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <RecipientDetailSkeleton />
    </div>
  );
}
