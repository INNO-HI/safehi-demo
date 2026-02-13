'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import type { VisitSummary, VisitType } from '@/types/dashboard';
import { visitTypeLabels } from '@/types/dashboard';
import { formatDate } from '@/lib/utils/date';

interface RecentVisitsSummaryProps {
  visits: VisitSummary[];
  recipientId: string;
}

/**
 * 방문 유형별 아이콘
 */
function VisitTypeIcon({ type }: { type: VisitType }) {
  if (type === 'visit') {
    return (
      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-600"
        >
          <path
            d="M2.66669 8L8.00002 2.66667L13.3334 8V13.3333H2.66669V8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-purple-600"
      >
        <path
          d="M14.6667 11.28V13.28C14.6675 13.4657 14.6294 13.6495 14.555 13.8196C14.4806 13.9897 14.3715 14.1423 14.2347 14.2679C14.098 14.3935 13.9365 14.489 13.7606 14.5485C13.5847 14.608 13.3983 14.6301 13.2134 14.6133C11.1619 14.3904 9.19138 13.6895 7.46002 12.5667C5.84924 11.5432 4.48361 10.1776 3.46002 8.56666C2.33336 6.82751 1.63217 4.84733 1.41336 2.78666C1.39673 2.60235 1.41859 2.41654 1.47762 2.24112C1.53665 2.06569 1.63163 1.90449 1.7565 1.76776C1.88136 1.63102 2.0332 1.52184 2.20255 1.44705C2.37192 1.37227 2.55506 1.33351 2.74002 1.33333H4.74002C5.06363 1.33018 5.37719 1.44475 5.6226 1.65572C5.86802 1.86669 6.02827 2.15966 6.07336 2.48C6.15778 3.12006 6.31429 3.74852 6.54002 4.35333C6.62978 4.59199 6.64914 4.85131 6.59584 5.10062C6.54254 5.34992 6.41902 5.57877 6.24002 5.76L5.39336 6.60666C6.34244 8.27578 7.72424 9.65758 9.39336 10.6067L10.24 9.76C10.4213 9.58099 10.6501 9.45747 10.8994 9.40417C11.1487 9.35088 11.408 9.37024 11.6467 9.46C12.2515 9.68573 12.88 9.84224 13.52 9.92666C13.8439 9.97238 14.1397 10.1356 14.3511 10.3851C14.5625 10.6345 14.675 10.9531 14.6667 11.28Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * 최근 방문 요약 컴포넌트
 * 최근 3건의 방문 기록을 카드로 표시합니다.
 */
export function RecentVisitsSummary({
  visits,
  recipientId,
}: RecentVisitsSummaryProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">최근 방문</h2>
        <Link
          href={`/recipients/${recipientId}/visits`}
          className="text-sm text-primary-600 hover:underline"
        >
          전체 보기
        </Link>
      </div>

      {visits.length === 0 ? (
        <p className="text-neutral-500 text-sm py-4 text-center">
          방문 기록이 없습니다
        </p>
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => (
            <Link
              key={visit.id}
              href={`/care-logs/${visit.careLogId}`}
              className="block bg-neutral-50 rounded-lg p-3 hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <VisitTypeIcon type={visit.visitType} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-900">
                      {visitTypeLabels[visit.visitType]}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatDate(visit.visitDate)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    {visit.summary}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {visit.managerName}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
