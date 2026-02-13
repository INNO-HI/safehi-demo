'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { CareLogDetail, CareLogStatus } from '@/types/dashboard';
import { careLogStatusLabels } from '@/types/dashboard';
import { formatDateTime } from '@/lib/utils/date';

interface CareLogDetailHeaderProps {
  careLog: CareLogDetail;
  onBack: () => void;
}

/**
 * 상태별 배지 variant 매핑
 */
function getStatusVariant(
  status: CareLogStatus
): 'default' | 'warning' | 'success' | 'danger' {
  switch (status) {
    case 'pending':
      return 'default';
    case 'urgent':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'danger';
    default:
      return 'default';
  }
}

/**
 * 돌봄 일지 상세 헤더 컴포넌트
 * 대상자명, 상태 배지, 작성일시를 표시합니다.
 */
export function CareLogDetailHeader({
  careLog,
  onBack,
}: CareLogDetailHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        {/* 뒤로가기 버튼 */}
        <Button variant="secondary" size="sm" onClick={onBack} className="shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          목록으로
        </Button>

        {/* 대상자명 및 작성일시 */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">
            {careLog.recipientName}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {formatDateTime(careLog.createdAt)} 작성
          </p>
        </div>
      </div>

      {/* 상태 배지 */}
      <Badge
        variant={getStatusVariant(careLog.status)}
        className="self-start sm:self-center"
      >
        {careLogStatusLabels[careLog.status]}
      </Badge>
    </header>
  );
}
