'use client';

import { forwardRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Manager, ManagerStatus, PageSize } from '@/types/dashboard';
import { getManagerStatusLabel, managerStatusToBadgeVariant } from '@/lib/utils/status';
import { managerStatusTabOptions } from '@/lib/utils/status';
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
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';

// ============================================================
// ManagerTable 컴포넌트
// T008: 매니저 테이블 + 상태 탭
// ============================================================

interface ManagerTableProps {
  managers: Manager[];
  statusCounts: Record<ManagerStatus | 'all', number>;

  // 상태 탭
  currentStatus: ManagerStatus | 'all';
  onStatusChange: (status: ManagerStatus | 'all') => void;

  // 페이지네이션
  currentPage: number;
  pageSize: PageSize;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;

  // 내보내기
  onExportAll?: () => void;

  // 로딩
  isLoading?: boolean;
  className?: string;
}

// 테이블 컬럼 정의
const columns = [
  { id: 'name', label: '매니저', width: '18%' },
  { id: 'centerName', label: '소속 센터', width: '20%' },
  { id: 'assignedDongs', label: '담당 동', width: '18%' },
  { id: 'recipientCount', label: '담당 대상자', width: '12%', align: 'center' as const },
  { id: 'monthlyVisits', label: '이번 달 방문', width: '12%', align: 'center' as const },
  { id: 'status', label: '상태', width: '10%', align: 'center' as const },
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
 * ManagerTable 컴포넌트
 * 매니저 테이블
 */
export const ManagerTable = forwardRef<HTMLDivElement, ManagerTableProps>(
  function ManagerTable(
    {
      managers,
      statusCounts,
      currentStatus,
      onStatusChange,
      currentPage,
      pageSize,
      totalPages,
      totalItems,
      onPageChange,
      onPageSizeChange,
      onExportAll,
      isLoading = false,
      className = '',
    },
    ref
  ) {
    const router = useRouter();

    // 행 클릭 시 상세 페이지로 이동
    const handleRowClick = (id: string) => {
      router.push(`/managers/${id}`);
    };

    // 상태 탭 옵션 (카운트 포함)
    const tabOptions = useMemo(
      () =>
        managerStatusTabOptions.map((option) => ({
          ...option,
          count: statusCounts[option.value],
        })),
      [statusCounts]
    );

    const colSpan = columns.length;

    return (
      <div ref={ref} className={className}>
        {/* 상태 탭 + 내보내기 버튼 */}
        <div className="flex items-center justify-between">
          <Tabs
            options={tabOptions}
            value={currentStatus}
            onChange={onStatusChange}
            ariaLabel="매니저 상태 필터"
          />
          {onExportAll && (
            <div className="flex items-center gap-1">
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
                Excel 내보내기
              </Button>
            </div>
          )}
        </div>

        {/* 테이블 */}
        <Table ariaLabel="매니저 목록">
          <TableHead>
            <TableHeader columns={columns} />
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton colCount={columns.length} />
            ) : managers.length === 0 ? (
              <EmptyRow colSpan={colSpan} message="검색 결과가 없습니다" />
            ) : (
              managers.map((manager) => (
                <TableRow
                  key={manager.id}
                  onClick={() => handleRowClick(manager.id)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={manager.name} gender={manager.gender} />
                      <div>
                        <p className="font-medium text-neutral-900">{manager.name}</p>
                        <p className="text-sm text-neutral-500">{manager.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{manager.centerName}</TableCell>
                  <TableCell>
                    <span className="truncate block max-w-[180px]" title={manager.assignedDongs.join(', ')}>
                      {manager.assignedDongs.join(', ')}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <span className="font-medium">{manager.recipientCount}</span>
                    <span className="text-sm text-neutral-500 ml-0.5">명</span>
                  </TableCell>
                  <TableCell align="center">
                    <span className="font-medium">{manager.monthlyVisits}</span>
                    <span className="text-sm text-neutral-500 ml-0.5">회</span>
                  </TableCell>
                  <TableCell align="center">
                    <Badge
                      variant={managerStatusToBadgeVariant(manager.status)}
                      size="sm"
                    >
                      {getManagerStatusLabel(manager.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 페이지네이션 */}
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

export default ManagerTable;
