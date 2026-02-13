'use client';

import { forwardRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Recipient, RecipientStatus, PageSize } from '@/types/dashboard';
import { formatDate } from '@/lib/utils/date';
import { getRecipientStatusLabel, recipientStatusToBadgeVariant, getGenderLabel } from '@/lib/utils/status';
import { recipientStatusTabOptions } from '@/lib/utils/status';
import {
  Table,
  TableHead,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  TableRowCheckbox,
  TablePagination,
  EmptyRow,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';

// ============================================================
// RecipientTable 컴포넌트
// T049: 대상자 테이블 + 상태 탭
// ============================================================

interface RecipientTableProps {
  recipients: Recipient[];
  statusCounts: Record<RecipientStatus | 'all', number>;

  // 상태 탭
  currentStatus: RecipientStatus | 'all';
  onStatusChange: (status: RecipientStatus | 'all') => void;

  // 페이지네이션
  currentPage: number;
  pageSize: PageSize;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;

  // 선택
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;

  // 내보내기
  onExportAll?: () => void;
  onExportSelected?: () => void;
  selectedCount?: number;

  // 로딩
  isLoading?: boolean;
  className?: string;
}

// 테이블 컬럼 정의
const columns = [
  { id: 'name', label: '대상자', width: '16%' },
  { id: 'age', label: '나이', width: '7%', align: 'center' as const },
  { id: 'gender', label: '성별', width: '6%', align: 'center' as const },
  { id: 'dong', label: '동', width: '11%' },
  { id: 'address', label: '주소', width: '17%' },
  { id: 'managerName', label: '담당 매니저', width: '11%' },
  { id: 'lastVisitDate', label: '최근 방문', width: '11%' },
  { id: 'status', label: '상태', width: '9%', align: 'center' as const },
];

/**
 * 아바타 이니셜 컴포넌트
 */
function Avatar({ name, gender }: { name: string; gender: 'male' | 'female' }) {
  const initial = name.charAt(0);
  const bgColor = gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700';

  return (
    <div
      className={`
        flex items-center justify-center w-9 h-9
        rounded-full text-sm font-semibold
        ${bgColor}
      `}
    >
      {initial}
    </div>
  );
}

/**
 * 테이블 스켈레톤 행
 */
function TableSkeleton({ colCount, showCheckbox }: { colCount: number; showCheckbox?: boolean }) {
  const totalCols = showCheckbox ? colCount + 1 : colCount;
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: totalCols }).map((_, j) => (
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
 * RecipientTable 컴포넌트
 * 대상자 테이블
 */
export const RecipientTable = forwardRef<HTMLDivElement, RecipientTableProps>(
  function RecipientTable(
    {
      recipients,
      statusCounts,
      currentStatus,
      onStatusChange,
      currentPage,
      pageSize,
      totalPages,
      totalItems,
      onPageChange,
      onPageSizeChange,
      selectedIds,
      onSelectionChange,
      onExportAll,
      onExportSelected,
      selectedCount = 0,
      isLoading = false,
      className = '',
    },
    ref
  ) {
    const router = useRouter();
    const showCheckbox = !!onSelectionChange;

    // 행 클릭 시 상세 페이지로 이동
    const handleRowClick = (id: string) => {
      router.push(`/recipients/${id}`);
    };

    // 개별 체크박스 토글
    const handleToggleSelection = (id: string) => {
      if (!onSelectionChange || !selectedIds) return;
      const newSelected = new Set(selectedIds);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      onSelectionChange(newSelected);
    };

    // 전체 선택/해제
    const handleSelectAll = () => {
      if (!onSelectionChange || !selectedIds) return;
      const allCurrentPageIds = recipients.map((r) => r.id);
      const allSelected = allCurrentPageIds.every((id) => selectedIds.has(id));

      const newSelected = new Set(selectedIds);
      if (allSelected) {
        // 현재 페이지 모두 해제
        allCurrentPageIds.forEach((id) => newSelected.delete(id));
      } else {
        // 현재 페이지 모두 선택
        allCurrentPageIds.forEach((id) => newSelected.add(id));
      }
      onSelectionChange(newSelected);
    };

    // 전체 선택 상태 계산
    const isAllSelected = useMemo(() => {
      if (!selectedIds || recipients.length === 0) return false;
      return recipients.every((r) => selectedIds.has(r.id));
    }, [selectedIds, recipients]);

    // 상태 탭 옵션 (카운트 포함)
    const tabOptions = useMemo(
      () =>
        recipientStatusTabOptions.map((option) => ({
          ...option,
          count: statusCounts[option.value],
        })),
      [statusCounts]
    );

    const colSpan = showCheckbox ? columns.length + 1 : columns.length;

    return (
      <div ref={ref} className={className}>
        {/* 상태 탭 + 내보내기 버튼 */}
        <div className="flex items-center justify-between">
          <Tabs
            options={tabOptions}
            value={currentStatus}
            onChange={onStatusChange}
            ariaLabel="대상자 상태 필터"
          />
          {(onExportAll || onExportSelected) && (
            <div className="flex items-center gap-1">
              {onExportAll && (
                <Button
                  variant="soft"
                  size="sm"
                  onClick={onExportAll}
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
                  전체 Excel
                </Button>
              )}
              {onExportSelected && (
                <Button
                  variant="soft"
                  size="sm"
                  onClick={onExportSelected}
                  disabled={selectedCount === 0}
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  선택 Excel{selectedCount > 0 ? ` (${selectedCount})` : ''}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 테이블 - 상단 간격 없음 */}
        <Table ariaLabel="대상자 목록">
          <TableHead>
            <TableHeader
              columns={columns}
              showCheckbox={showCheckbox}
              isAllSelected={isAllSelected}
              onSelectAll={handleSelectAll}
            />
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton colCount={columns.length} showCheckbox={showCheckbox} />
            ) : recipients.length === 0 ? (
              <EmptyRow colSpan={colSpan} message="검색 결과가 없습니다" />
            ) : (
              recipients.map((recipient) => {
                const isSelected = selectedIds?.has(recipient.id) ?? false;
                return (
                  <TableRow
                    key={recipient.id}
                    onClick={() => handleRowClick(recipient.id)}
                    isSelected={isSelected}
                    className="cursor-pointer"
                  >
                    {showCheckbox && (
                      <TableRowCheckbox
                        checked={isSelected}
                        onChange={() => handleToggleSelection(recipient.id)}
                        ariaLabel={`${recipient.name} 선택`}
                      />
                    )}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={recipient.name} gender={recipient.gender} />
                        <div>
                          <p className="font-medium text-neutral-900">{recipient.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="center">{recipient.age}세</TableCell>
                    <TableCell align="center">{getGenderLabel(recipient.gender)}</TableCell>
                    <TableCell>{recipient.dong}</TableCell>
                    <TableCell>
                      <span className="truncate block max-w-[200px]" title={recipient.address}>
                        {recipient.address}
                      </span>
                    </TableCell>
                    <TableCell>{recipient.managerName}</TableCell>
                    <TableCell>
                      {recipient.lastVisitDate
                        ? formatDate(recipient.lastVisitDate)
                        : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Badge
                        variant={recipientStatusToBadgeVariant(recipient.status)}
                        size="sm"
                      >
                        {getRecipientStatusLabel(recipient.status)}
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

export default RecipientTable;
