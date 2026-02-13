'use client';

import { Card } from '@/components/ui/Card';
import type { CareCondition, CareConditionStatus } from '@/types/dashboard';
import { cn } from '@/lib/utils/cn';

interface CareContentCardsProps {
  careContent: {
    healthStatus: CareCondition;
    mealStatus: CareCondition;
    emotionalStatus: CareCondition;
    livingEnvironment: CareCondition;
  };
}

/**
 * 상태별 색상 클래스
 */
function getStatusColor(status: CareConditionStatus) {
  switch (status) {
    case 'good':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        icon: 'text-green-600',
      };
    case 'normal':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        icon: 'text-blue-600',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        icon: 'text-yellow-600',
      };
    case 'bad':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        icon: 'text-red-600',
      };
    default:
      return {
        bg: 'bg-neutral-50',
        border: 'border-neutral-200',
        text: 'text-neutral-700',
        icon: 'text-neutral-600',
      };
  }
}

/**
 * 상태별 아이콘
 */
function StatusIcon({ status }: { status: CareConditionStatus }) {
  const colors = getStatusColor(status);

  if (status === 'good') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={colors.icon}
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="10" r="1" fill="currentColor" />
        <circle cx="15" cy="10" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (status === 'warning' || status === 'bad') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={colors.icon}
      >
        <path
          d="M10.29 3.86L1.82 18C1.64 18.31 1.55 18.67 1.55 19.03C1.55 19.39 1.64 19.74 1.82 20.05C1.99 20.36 2.25 20.62 2.56 20.79C2.87 20.97 3.22 21.05 3.58 21.05H20.52C20.88 21.05 21.23 20.97 21.54 20.79C21.85 20.62 22.11 20.36 22.28 20.05C22.46 19.74 22.55 19.39 22.55 19.03C22.55 18.67 22.46 18.31 22.28 18L13.81 3.86C13.64 3.56 13.38 3.32 13.08 3.15C12.78 2.98 12.44 2.89 12.09 2.89C11.74 2.89 11.4 2.98 11.1 3.15C10.8 3.32 10.54 3.56 10.37 3.86H10.29Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 9V13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 17H12.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // normal
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={colors.icon}
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 14H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * 개별 돌봄 상태 카드
 */
function CareStatusCard({
  title,
  condition,
}: {
  title: string;
  condition: CareCondition;
}) {
  const colors = getStatusColor(condition.status);

  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-start gap-3">
        <StatusIcon status={condition.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-neutral-900">{title}</h3>
            <span className={cn('text-sm font-medium', colors.text)}>
              {condition.label}
            </span>
          </div>
          {condition.description && (
            <p className="text-sm text-neutral-600">{condition.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 돌봄 내용 카드 컴포넌트
 * 건강 상태, 식사 상태, 정서 상태, 생활 환경을 카드 형식으로 표시합니다.
 */
export function CareContentCards({ careContent }: CareContentCardsProps) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">돌봄 내용</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CareStatusCard title="건강 상태" condition={careContent.healthStatus} />
        <CareStatusCard title="식사 상태" condition={careContent.mealStatus} />
        <CareStatusCard
          title="정서 상태"
          condition={careContent.emotionalStatus}
        />
        <CareStatusCard
          title="생활 환경"
          condition={careContent.livingEnvironment}
        />
      </div>
    </Card>
  );
}
