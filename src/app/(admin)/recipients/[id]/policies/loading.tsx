import { PolicySkeleton } from '@/components/features/recipient/PolicySkeleton';

/**
 * AI 정책 추천 페이지 로딩 UI
 */
export default function PoliciesLoading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PolicySkeleton />
    </div>
  );
}
