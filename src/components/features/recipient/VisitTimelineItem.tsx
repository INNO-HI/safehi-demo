'use client';

import Link from 'next/link';
import type { Visit } from '@/types/dashboard';
import { visitTypeLabels } from '@/types/dashboard';
import { formatDate } from '@/lib/utils/date';
import { Badge } from '@/components/ui/Badge';

// ============================================================
// T041: VisitTimelineItem 컴포넌트
// 타임라인 개별 방문 항목
// ============================================================

interface VisitTimelineItemProps {
  visit: Visit;
  isFirst?: boolean;
  isLast?: boolean;
}

/**
 * 방문 유형에 따른 아이콘
 */
function VisitTypeIcon({ type }: { type: 'visit' | 'call' }) {
  if (type === 'visit') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M10 10.8333C11.3807 10.8333 12.5 9.71404 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71404 8.61929 10.8333 10 10.8333Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 18.3333C10 18.3333 16.6667 13.3333 16.6667 8.33333C16.6667 4.65143 13.6819 1.66667 10 1.66667C6.31811 1.66667 3.33334 4.65143 3.33334 8.33333C3.33334 13.3333 10 18.3333 10 18.3333Z"
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
      aria-hidden="true"
    >
      <path
        d="M18.3333 14.1V16.6C18.3343 16.8321 18.2867 17.0618 18.1937 17.2745C18.1008 17.4871 17.9644 17.678 17.7934 17.8349C17.6224 17.9918 17.4205 18.1113 17.2006 18.1856C16.9808 18.26 16.748 18.2876 16.5167 18.2667C13.9523 17.9881 11.489 17.1118 9.32499 15.7083C7.31151 14.4289 5.60439 12.7218 4.32499 10.7083C2.91663 8.53436 2.04019 6.05917 1.76666 3.48334C1.74583 3.25293 1.77321 3.02069 1.84707 2.80139C1.92092 2.58209 2.03963 2.38061 2.19562 2.20973C2.35162 2.03885 2.54143 1.90229 2.75302 1.8086C2.9646 1.71491 3.19348 1.66624 3.42499 1.66667H5.92499C6.32941 1.66273 6.72148 1.80593 7.02812 2.06965C7.33476 2.33336 7.53505 2.69958 7.59166 3.10001C7.69717 3.90006 7.89286 4.68565 8.17499 5.44167C8.2871 5.73998 8.31137 6.06412 8.24491 6.37577C8.17844 6.68741 8.02404 6.97347 7.79999 7.20001L6.74166 8.25834C7.92795 10.3447 9.65536 12.0721 11.7417 13.2583L12.8 12.2C13.0265 11.976 13.3126 11.8216 13.6242 11.7551C13.9359 11.6886 14.26 11.7129 14.5583 11.825C15.3144 12.1072 16.0999 12.3028 16.9 12.4083C17.3048 12.4655 17.6745 12.6694 17.9388 12.9814C18.203 13.2934 18.3435 13.6914 18.3333 14.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 타임라인 개별 방문 항목 컴포넌트
 */
export function VisitTimelineItem({
  visit,
  isFirst: _isFirst = false,
  isLast = false,
}: VisitTimelineItemProps) {
  return (
    <article
      className="relative pl-8 pb-6"
      aria-label={`${formatDate(visit.visitDate)} ${visitTypeLabels[visit.visitType]}`}
    >
      {/* 타임라인 선 */}
      {!isLast && (
        <div
          className="absolute left-[11px] top-8 w-0.5 h-[calc(100%-24px)] bg-neutral-200"
          aria-hidden="true"
        />
      )}

      {/* 아이콘 원 */}
      <div
        className={`
          absolute left-0 top-1 w-6 h-6 rounded-full
          flex items-center justify-center
          ${visit.visitType === 'visit'
            ? 'bg-primary-100 text-primary-600'
            : 'bg-green-100 text-green-600'
          }
        `}
        aria-hidden="true"
      >
        <VisitTypeIcon type={visit.visitType} />
      </div>

      {/* 콘텐츠 카드 */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        {/* 헤더 */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <time
            dateTime={visit.visitDate.toISOString()}
            className="text-sm font-medium text-neutral-900"
          >
            {formatDate(visit.visitDate)}
          </time>
          <Badge
            variant={visit.visitType === 'visit' ? 'default' : 'success'}
            size="sm"
          >
            {visitTypeLabels[visit.visitType]}
          </Badge>
          <span className="text-sm text-neutral-500">
            담당: {visit.managerName}
          </span>
        </div>

        {/* 요약 */}
        <p className="text-sm text-neutral-700 leading-relaxed">
          {visit.summary}
        </p>

        {/* 상세 보기 링크 */}
        <div className="mt-3">
          <Link
            href={`/care-logs/${visit.careLogId}`}
            className="
              inline-flex items-center gap-1
              text-sm text-primary-600 hover:text-primary-700
              font-medium
              min-h-[44px] min-w-[44px]
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              rounded
            "
          >
            돌봄 일지 보기
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
