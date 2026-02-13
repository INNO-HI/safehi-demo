'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import type { RecentReport } from '@/types/dashboard';
import { formatRelativeTime } from '@/lib/utils/date';
import { getCareLogStatusLabel, careLogStatusToBadgeVariant } from '@/lib/utils/status';
import { Badge } from '@/components/ui/Badge';

// ============================================================
// RecentReportList 컴포넌트
// T032: 최근 보고서 5건 목록
// ============================================================

interface RecentReportListProps {
  reports: RecentReport[];
  className?: string;
  isLoading?: boolean;
}

/**
 * 보고서 항목 스켈레톤
 */
function ReportItemSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 animate-pulse">
      <div className="flex-1 min-w-0">
        <div className="h-4 w-32 bg-neutral-200 rounded mb-2" />
        <div className="h-3 w-24 bg-neutral-200 rounded" />
      </div>
      <div className="h-6 w-16 bg-neutral-200 rounded-full" />
    </div>
  );
}

/**
 * RecentReportList 컴포넌트
 * 최근 보고서 목록
 */
export const RecentReportList = forwardRef<HTMLDivElement, RecentReportListProps>(
  function RecentReportList({ reports, className = '', isLoading = false }, ref) {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl shadow-sm border border-neutral-200 ${className}`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">최근 보고서</h2>
          <Link
            href="/care-logs"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            전체 보기
          </Link>
        </div>

        {/* 목록 */}
        <div className="divide-y divide-neutral-100">
          {isLoading ? (
            <>
              <div className="px-5">
                <ReportItemSkeleton />
              </div>
              <div className="px-5">
                <ReportItemSkeleton />
              </div>
              <div className="px-5">
                <ReportItemSkeleton />
              </div>
              <div className="px-5">
                <ReportItemSkeleton />
              </div>
              <div className="px-5">
                <ReportItemSkeleton />
              </div>
            </>
          ) : reports.length === 0 ? (
            <div className="px-5 py-8 text-center text-neutral-500">
              최근 보고서가 없습니다
            </div>
          ) : (
            reports.map((report) => (
              <Link
                key={report.id}
                href={`/care-logs?id=${report.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-neutral-900 truncate">
                      {report.recipientName}
                    </span>
                    {report.isUrgent && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">
                    {report.managerName} · {formatRelativeTime(report.registeredAt)}
                  </p>
                </div>
                <Badge
                  variant={careLogStatusToBadgeVariant(report.status)}
                  size="sm"
                >
                  {getCareLogStatusLabel(report.status)}
                </Badge>
              </Link>
            ))
          )}
        </div>
      </div>
    );
  }
);

export default RecentReportList;
