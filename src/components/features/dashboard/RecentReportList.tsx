'use client';

import { forwardRef, useState } from 'react';
import Link from 'next/link';
import type { RecentReport, ReportType, RiskLevel } from '@/types/dashboard';
import { getCareLogStatusLabel, careLogStatusToBadgeVariant } from '@/lib/utils/status';
import { Badge } from '@/components/ui/Badge';

// ============================================================
// RecentReportList 컴포넌트
// 관리자용: 필터 + 위험도 + 보고서 유형 + 액션
// ============================================================

interface RecentReportListProps {
  reports: RecentReport[];
  className?: string;
  isLoading?: boolean;
}

// 보고서 유형 라벨
const reportTypeLabels: Record<ReportType, string> = {
  visit: '방문 보고서',
  health_check: '건강 체크',
  call_consult: '전화 상담',
};

// 위험도 뱃지 스타일
const riskBadgeStyles: Record<RiskLevel, { label: string; bg: string; text: string }> = {
  normal: { label: '정상', bg: 'bg-status-success-light', text: 'text-status-success' },
  caution: { label: '주의', bg: 'bg-status-warning-light', text: 'text-status-warning' },
  danger: { label: '위험', bg: 'bg-status-danger-light', text: 'text-status-danger' },
};

// 필터 탭
type FilterTab = 'all' | 'urgent' | 'pending' | 'approved';
const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'urgent', label: '긴급' },
  { key: 'pending', label: '대기' },
  { key: 'approved', label: '승인' },
];

function filterReports(reports: RecentReport[], tab: FilterTab): RecentReport[] {
  switch (tab) {
    case 'urgent': return reports.filter((r) => r.isUrgent || r.status === 'urgent');
    case 'pending': return reports.filter((r) => r.status === 'pending');
    case 'approved': return reports.filter((r) => r.status === 'approved');
    default: return reports;
  }
}

function getFilterCount(reports: RecentReport[], tab: FilterTab): number {
  return filterReports(reports, tab).length;
}

/** 날짜를 M/D HH:mm 형식으로 포맷 */
function formatCompactDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}`;
}

/** 보고서 항목 스켈레톤 */
function ReportItemSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 px-5 animate-pulse">
      <div className="flex-1 min-w-0">
        <div className="h-4 w-32 bg-neutral-100 rounded mb-2" />
        <div className="h-3 w-48 bg-neutral-100 rounded" />
      </div>
      <div className="h-6 w-16 bg-neutral-100 rounded-full" />
    </div>
  );
}

/**
 * RecentReportList 컴포넌트
 * 관리자용 최근 보고서 목록
 */
export const RecentReportList = forwardRef<HTMLDivElement, RecentReportListProps>(
  function RecentReportList({ reports, className = '', isLoading = false }, ref) {
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const filtered = filterReports(reports, activeTab);

    return (
      <div
        ref={ref}
        className={`bg-white rounded-2xl shadow-elevated border border-neutral-border/30 ${className}`}
      >
        {/* 헤더 + 필터 */}
        <div className="px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-neutral-text">최근 보고서</h2>
            <Link
              href="/care-logs"
              className="text-sm text-primary hover:opacity-80 font-medium"
            >
              전체 보기
            </Link>
          </div>

          {/* 필터 탭 (숫자 표시) */}
          <div className="flex gap-2">
            {filterTabs.map((tab) => {
              const count = getFilterCount(reports, tab.key);
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[32px] ${
                    activeTab === tab.key
                      ? 'bg-primary text-white'
                      : 'text-neutral-text-sub hover:bg-neutral-50'
                  }`}
                >
                  {tab.label}
                  {tab.key !== 'all' && count > 0 && (
                    <span className={`ml-1 ${activeTab === tab.key ? 'text-white/80' : 'text-neutral-text-tertiary'}`}>
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 목록 */}
        <div className="divide-y divide-neutral-100">
          {isLoading ? (
            <>
              <ReportItemSkeleton />
              <ReportItemSkeleton />
              <ReportItemSkeleton />
              <ReportItemSkeleton />
              <ReportItemSkeleton />
            </>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-neutral-text-sub">
              해당하는 보고서가 없습니다
            </div>
          ) : (
            filtered.map((report) => {
              const risk = report.riskLevel ? riskBadgeStyles[report.riskLevel] : null;
              const typeName = report.reportType ? reportTypeLabels[report.reportType] : '보고서';

              return (
                <div
                  key={report.id}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors ${
                    report.isUrgent ? 'border-l-3 border-l-status-danger' : ''
                  }`}
                >
                  {/* 위험도 뱃지 */}
                  <div className="flex-shrink-0">
                    {risk && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${risk.bg} ${risk.text}`}>
                        {risk.label}
                      </span>
                    )}
                  </div>

                  {/* 정보 - 이름만 크게, 나머지 아래 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-neutral-text truncate">
                        {report.recipientName}
                      </span>
                      {report.isUrgent && (
                        <span className="text-xs font-semibold text-status-danger bg-status-danger-light px-1.5 py-0.5 rounded animate-urgent-pulse">긴급</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-text-sub mt-0.5">
                      {report.dong && `${report.dong} · `}{typeName} · {report.managerName} · {formatCompactDate(report.registeredAt)}
                    </p>
                  </div>

                  {/* 상태 뱃지 */}
                  <Badge
                    variant={careLogStatusToBadgeVariant(report.status)}
                    size="sm"
                  >
                    {getCareLogStatusLabel(report.status)}
                  </Badge>

                  {/* 액션 */}
                  <Link
                    href={`/care-logs?id=${report.id}`}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors min-h-[32px] flex items-center"
                  >
                    상세보기
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
);

export default RecentReportList;
