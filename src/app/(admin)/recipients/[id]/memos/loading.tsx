import { MemoSkeleton } from '@/components/features/recipient/MemoSkeleton';

/**
 * 담당자 메모 페이지 로딩 UI
 */
export default function MemosLoading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <MemoSkeleton />
    </div>
  );
}
