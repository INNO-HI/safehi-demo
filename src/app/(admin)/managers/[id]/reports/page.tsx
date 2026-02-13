'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import {
  Table,
  TableHead,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  TablePagination,
  EmptyRow,
} from '@/components/ui/Table';
import {
  reportStatusTabOptions,
  reportStatusToBadgeVariant,
  getReportStatusLabel,
} from '@/lib/utils/status';
import { formatDate } from '@/lib/utils/date';
import { getManagerDetail } from '@/lib/api/managers';
import { getManagerReports } from '@/lib/mock-data/managers';
import type { ManagerReport, ReportStatus, PageSize } from '@/types/dashboard';

// ============================================================
// 매니저 보고서 전체 페이지
// T018: 매니저별 보고서 전체 목록 조회
// ============================================================

const columns = [
  { id: 'recipientName', label: '대상자', width: '25%' },
  { id: 'visitDate', label: '방문일', width: '25%' },
  { id: 'registeredAt', label: '등록일', width: '25%' },
  { id: 'status', label: '상태', width: '15%', align: 'center' as const },
];

export default function ManagerReportsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // 상태
  const [managerName, setManagerName] = useState<string>('');
  const [reports, setReports] = useState<ManagerReport[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<ReportStatus | 'all', number>>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [dateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [managerData, reportsData] = await Promise.all([
        getManagerDetail(id),
        getManagerReports(id, { status: statusFilter, dateRange }),
      ]);

      if (managerData) {
        setManagerName(managerData.name);
      }
      setReports(reportsData.reports);
      setStatusCounts(reportsData.statusCounts);
    } finally {
      setIsLoading(false);
    }
  }, [id, statusFilter, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 필터 변경 시 첫 페이지로 이동
  const handleStatusChange = (status: ReportStatus | 'all') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // 페이지네이션
  const totalPages = Math.ceil(reports.length / pageSize);
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return reports.slice(start, start + pageSize);
  }, [reports, currentPage, pageSize]);

  // 탭 옵션 (카운트 포함)
  const tabOptions = useMemo(
    () =>
      reportStatusTabOptions.map((option) => ({
        ...option,
        count: statusCounts[option.value],
      })),
    [statusCounts]
  );

  const handleBack = () => {
    router.push(`/managers/${id}`);
  };

  // T019: 보고서 행 클릭 시 /care-logs/[id] 상세 페이지로 이동
  const handleRowClick = (reportId: string) => {
    router.push(`/care-logs/${reportId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-neutral-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-11 h-11 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="매니저 상세로 돌아가기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <p className="text-sm text-neutral-600 mb-0.5">매니저 관리</p>
              <h1 className="text-2xl font-bold text-neutral-900">
                {managerName ? `${managerName}님의 보고서` : '보고서 목록'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          {/* 상태 탭 */}
          <div className="p-4 border-b border-neutral-200">
            <Tabs
              options={tabOptions}
              value={statusFilter}
              onChange={handleStatusChange}
              ariaLabel="보고서 상태 필터"
            />
          </div>

          {/* 테이블 */}
          <Table ariaLabel="보고서 목록">
            <TableHead>
              <TableHeader columns={columns} />
            </TableHead>
            <TableBody>
              {isLoading ? (
                // 스켈레톤
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {columns.map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : paginatedReports.length === 0 ? (
                // T020: 빈 상태 UI
                <EmptyRow colSpan={columns.length} message="작성된 보고서가 없습니다" />
              ) : (
                paginatedReports.map((report) => (
                  <TableRow
                    key={report.id}
                    onClick={() => handleRowClick(report.id)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <span className="font-medium text-neutral-900">{report.recipientName}</span>
                    </TableCell>
                    <TableCell>{formatDate(report.visitDate)}</TableCell>
                    <TableCell>{formatDate(report.registeredAt)}</TableCell>
                    <TableCell align="center">
                      <Badge variant={reportStatusToBadgeVariant(report.status)} size="sm">
                        {getReportStatusLabel(report.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          {!isLoading && totalPages > 0 && (
            <div className="p-4 border-t border-neutral-200">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={reports.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
