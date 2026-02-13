'use client';

import { Card } from '@/components/ui/Card';
import type { CareLogDetail, VisitType } from '@/types/dashboard';
import { visitTypeLabels } from '@/types/dashboard';
import { formatDateTime } from '@/lib/utils/date';

interface VisitInfoCardProps {
  visitInfo: CareLogDetail['visitInfo'];
}

/**
 * 방문 유형별 아이콘
 */
function VisitTypeIcon({ type }: { type: VisitType }) {
  if (type === 'visit') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary-600"
      >
        <path
          d="M3.33337 10L10 3.33333L16.6667 10V16.6667H3.33337V10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 16.6667V10H12.5V16.6667"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-purple-600"
    >
      <path
        d="M18.3334 14.1V16.6C18.3344 16.8321 18.2867 17.0618 18.1937 17.2745C18.1007 17.4871 17.9644 17.6779 17.7934 17.8349C17.6225 17.9918 17.4206 18.1113 17.2007 18.1856C16.9808 18.26 16.7478 18.2876 16.5167 18.2667C13.9524 17.988 11.4892 17.1118 9.32508 15.7084C7.31155 14.4289 5.60451 12.7219 4.32508 10.7084C2.91675 8.53438 2.04021 6.05917 1.76675 3.48337C1.74591 3.25293 1.77324 3.02067 1.84702 2.80139C1.92081 2.58211 2.03953 2.38061 2.19562 2.20969C2.3517 2.03877 2.54149 1.90229 2.75319 1.80881C2.9649 1.71534 3.19382 1.66689 3.42508 1.66671H5.92508C6.32953 1.66273 6.72148 1.80594 7.02825 2.06965C7.33502 2.33336 7.53533 2.69957 7.59175 3.10004C7.69723 3.90008 7.89286 4.68565 8.17508 5.44171C8.28723 5.73999 8.31143 6.06414 8.2448 6.37577C8.17818 6.6874 8.02377 6.97347 7.80008 7.20004L6.74175 8.25837C7.92805 10.3447 9.65545 12.0721 11.7417 13.2584L12.8001 12.2C13.0266 11.9764 13.3127 11.8219 13.6244 11.7553C13.936 11.6887 14.2601 11.7129 14.5584 11.825C15.3145 12.1073 16.1 12.3029 16.9001 12.4084C17.3049 12.4655 17.6746 12.6694 17.9389 12.9813C18.2032 13.2932 18.3437 13.6914 18.3334 14.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 방문 정보 카드 컴포넌트
 * 방문 일시, 유형, 담당 매니저, 소속 센터를 표시합니다.
 */
export function VisitInfoCard({ visitInfo }: VisitInfoCardProps) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">방문 정보</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 방문 일시 */}
        <div>
          <dt className="text-sm text-neutral-500 mb-1">방문 일시</dt>
          <dd className="text-base font-medium text-neutral-900">
            {formatDateTime(visitInfo.visitDate)}
          </dd>
        </div>

        {/* 방문 유형 */}
        <div>
          <dt className="text-sm text-neutral-500 mb-1">방문 유형</dt>
          <dd className="flex items-center gap-2 text-base font-medium text-neutral-900">
            <VisitTypeIcon type={visitInfo.visitType} />
            {visitTypeLabels[visitInfo.visitType]}
          </dd>
        </div>

        {/* 담당 매니저 */}
        <div>
          <dt className="text-sm text-neutral-500 mb-1">담당 매니저</dt>
          <dd className="text-base font-medium text-neutral-900">
            {visitInfo.managerName}
          </dd>
        </div>

        {/* 소속 센터 */}
        <div>
          <dt className="text-sm text-neutral-500 mb-1">소속 센터</dt>
          <dd className="text-base font-medium text-neutral-900">
            {visitInfo.centerName}
          </dd>
        </div>
      </div>
    </Card>
  );
}
