'use client';

import { forwardRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { CareLog, CareLogStatus, PageSize } from '@/types/dashboard';
import { formatDateTime, formatRelativeTime } from '@/lib/utils/date';
import { getCareLogStatusLabel, careLogStatusToBadgeVariant } from '@/lib/utils/status';
import { careLogStatusTabOptions } from '@/lib/utils/status';
import {
  Table,
  TableHead,
  TableBody,
  TableHeader,
  TableRow,
  TableRowCheckbox,
  TableCell,
  TablePagination,
  EmptyRow,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';

// ============================================================
// CareLogTable 컴포넌트
// T038: 돌봄 일지 테이블 + 상태 탭
// ============================================================

interface CareLogTableProps {
  logs: CareLog[];
  statusCounts: Record<CareLogStatus | 'all', number>;

  // 상태 탭
  currentStatus: CareLogStatus | 'all';
  onStatusChange: (status: CareLogStatus | 'all') => void;

  // 페이지네이션
  currentPage: number;
  pageSize: PageSize;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;

  // 선택 (선택적)
  showCheckbox?: boolean;
  selectedIds?: Set<string>;
  isAllSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;

  // 일괄 처리 액션
  selectedCount?: number;
  onApprove?: () => void;
  onReject?: () => void;
  onExportPDF?: () => void;
  isProcessing?: boolean;

  // 로딩
  isLoading?: boolean;
  className?: string;
}

// 테이블 컬럼 정의
const columns = [
  { id: 'recipientName', label: '대상자', width: '15%' },
  { id: 'managerName', label: '담당 종사자', width: '12%' },
  { id: 'centerName', label: '소속 센터', width: '15%' },
  { id: 'visitDate', label: '방문일시', width: '18%' },
  { id: 'registeredAt', label: '등록시간', width: '15%' },
  { id: 'status', label: '상태', width: '10%', align: 'center' as const },
];

/**
 * 테이블 스켈레톤 행
 */
function TableSkeleton({ colCount }: { colCount: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: colCount }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-neutral-200 rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

/**
 * CareLogTable 컴포넌트
 * 돌봄 일지 테이블
 */
export const CareLogTable = forwardRef<HTMLDivElement, CareLogTableProps>(
  function CareLogTable(
    {
      logs,
      statusCounts,
      currentStatus,
      onStatusChange,
      currentPage,
      pageSize,
      totalPages,
      totalItems,
      onPageChange,
      onPageSizeChange,
      showCheckbox = false,
      selectedIds = new Set(),
      isAllSelected = false,
      onToggleSelect,
      onToggleSelectAll,
      selectedCount = 0,
      onApprove,
      onReject,
      onExportPDF,
      isProcessing = false,
      isLoading = false,
      className = '',
    },
    ref
  ) {
    const router = useRouter();

    // 행 클릭 시 상세 페이지로 이동
    const handleRowClick = (id: string) => {
      router.push(`/care-logs/${id}`);
    };

    // 상태 탭 옵션 (카운트 포함)
    const tabOptions = useMemo(
      () =>
        careLogStatusTabOptions.map((option) => ({
          ...option,
          count: statusCounts[option.value],
        })),
      [statusCounts]
    );

    const colCount = columns.length + (showCheckbox ? 1 : 0);
    const showActions = selectedCount > 0 && (onApprove || onReject || onExportPDF);

    return (
      <div ref={ref} className={className}>
        {/* 상태 탭 + 액션 버튼 */}
        <div className="flex items-center justify-between">
          <Tabs
            options={tabOptions}
            value={currentStatus}
            onChange={onStatusChange}
            ariaLabel="돌봄 일지 상태 필터"
          />

          {/* 선택 시 액션 버튼 */}
          {showActions && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600 whitespace-nowrap">
                <span className="font-semibold text-primary-600">{selectedCount}</span>건 선택
              </span>
              {onApprove && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onApprove}
                  disabled={isProcessing}
                >
                  <span className="whitespace-nowrap">{isProcessing ? '처리 중...' : '승인'}</span>
                </Button>
              )}
              {onReject && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onReject}
                  disabled={isProcessing}
                >
                  <span className="whitespace-nowrap">{isProcessing ? '처리 중...' : '반려'}</span>
                </Button>
              )}
              {onExportPDF && (
                <Button
                  variant="soft"
                  size="sm"
                  onClick={onExportPDF}
                  disabled={isProcessing}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">PDF</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 테이블 */}
        <Table ariaLabel="돌봄 일지 목록">
          <TableHead>
            <TableHeader
              columns={columns}
              showCheckbox={showCheckbox}
              isAllSelected={isAllSelected}
              onSelectAll={onToggleSelectAll}
            />
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton colCount={colCount} />
            ) : logs.length === 0 ? (
              <EmptyRow colSpan={colCount} message="검색 결과가 없습니다" />
            ) : (
              logs.map((log) => {
                const isSelected = selectedIds.has(log.id);

                return (
                  <TableRow
                    key={log.id}
                    isSelected={isSelected}
                    onClick={() => handleRowClick(log.id)}
                    className="cursor-pointer hover:bg-neutral-50"
                  >
                    {showCheckbox && onToggleSelect && (
                      <TableRowCheckbox
                        checked={isSelected}
                        onChange={() => onToggleSelect(log.id)}
                        ariaLabel={`${log.recipientName} 선택`}
                      />
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-900">
                          {log.recipientName}
                        </span>
                        {log.status === 'urgent' && (
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{log.managerName}</TableCell>
                    <TableCell>{log.centerName}</TableCell>
                    <TableCell>{formatDateTime(log.visitDate)}</TableCell>
                    <TableCell>
                      <span title={formatDateTime(log.registeredAt)}>
                        {formatRelativeTime(log.registeredAt)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <Badge
                        variant={careLogStatusToBadgeVariant(log.status)}
                        size="sm"
                      >
                        {getCareLogStatusLabel(log.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* 페이지네이션 - 상단 간격 추가 */}
        {!isLoading && totalPages > 0 && (
          <TablePagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>
    );
  }
);

export default CareLogTable;
