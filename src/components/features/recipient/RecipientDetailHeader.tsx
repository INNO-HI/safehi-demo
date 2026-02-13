'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { RecipientDetail, RecipientStatus, Gender } from '@/types/dashboard';
import { recipientStatusLabels } from '@/types/dashboard';

interface RecipientDetailHeaderProps {
  recipient: RecipientDetail;
  onBack: () => void;
}

/**
 * 상태별 배지 variant 매핑
 */
function getStatusVariant(
  status: RecipientStatus
): 'default' | 'warning' | 'success' | 'danger' {
  switch (status) {
    case 'normal':
      return 'success';
    case 'caution':
      return 'warning';
    case 'urgent':
      return 'danger';
    case 'unvisited':
      return 'default';
    default:
      return 'default';
  }
}

/**
 * 성별 한글 레이블
 */
function getGenderLabel(gender: Gender): string {
  return gender === 'male' ? '남' : '여';
}

/**
 * 아바타 이니셜 (이름의 첫 글자)
 */
function getInitials(name: string): string {
  return name.charAt(0);
}

/**
 * 대상자 상세 헤더 컴포넌트
 * 이름, 나이, 성별, 상태 배지, 아바타를 표시합니다.
 */
export function RecipientDetailHeader({
  recipient,
  onBack,
}: RecipientDetailHeaderProps) {
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

        {/* 아바타 */}
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
          <span className="text-xl font-semibold text-primary-700">
            {getInitials(recipient.name)}
          </span>
        </div>

        {/* 대상자 정보 */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">
              {recipient.name}
            </h1>
            <Badge
              variant={getStatusVariant(recipient.status)}
              size="sm"
            >
              {recipientStatusLabels[recipient.status]}
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-0.5">
            {recipient.age}세 · {getGenderLabel(recipient.gender)}
          </p>
        </div>
      </div>
    </header>
  );
}
