'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs } from '@/components/ui/Tabs';
import { SearchInput } from '@/components/ui/SearchInput';
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
import { managerVisitTypeTabOptions } from '@/lib/utils/status';
import { formatDate } from '@/lib/utils/date';
import { getManagerDetail, getManagerVisits } from '@/lib/api/managers';
import type { ManagerVisit, ManagerVisitType, PageSize } from '@/types/dashboard';

// ============================================================
// 매니저 방문 기록 전체 페이지
// T022: 매니저별 방문 기록 전체 조회
// ============================================================

const columns = [
  { id: 'visitType', label: '유형', width: '12%', align: 'center' as const },
  { id: 'recipientName', label: '대상자', width: '20%' },
  { id: 'visitDate', label: '방문일', width: '18%' },
  { id: 'result', label: '방문 결과', width: '40%' },
];

// T023: 방문 유형별 아이콘
function VisitTypeIcon({ type }: { type: ManagerVisitType }) {
  const config = {
    regular: { icon: '🏠', bgColor: 'bg-blue-100 text-blue-600' },
    emergency: { icon: '🚨', bgColor: 'bg-red-100 text-red-600' },
    call: { icon: '📞', bgColor: 'bg-purple-100 text-purple-600' },
  };

  const { icon, bgColor } = config[type];

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${bgColor}`}>
      <span aria-hidden="true">{icon}</span>
    </div>
  );
}

export default function ManagerVisitsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // 상태
  const [managerName, setManagerName] = useState<string>('');
  const [visits, setVisits] = useState<ManagerVisit[]>([]);
  const [typeCounts, setTypeCounts] = useState<Record<ManagerVisitType | 'all', number>>({
    all: 0,
    regular: 0,
    emergency: 0,
    call: 0,
  });
  const [typeFilter, setTypeFilter] = useState<ManagerVisitType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
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
      const [managerData, visitsData] = await Promise.all([
        getManagerDetail(id),
        getManagerVisits(id, { visitType: typeFilter, search: searchQuery, dateRange }),
      ]);

      if (managerData) {
        setManagerName(managerData.name);
      }
      setVisits(visitsData.visits);
      setTypeCounts(visitsData.typeCounts);
    } finally {
      setIsLoading(false);
    }
  }, [id, typeFilter, searchQuery, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 필터 변경 시 첫 페이지로 이동
  const handleTypeChange = (type: ManagerVisitType | 'all') => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

  // 페이지네이션
  const totalPages = Math.ceil(visits.length / pageSize);
  const paginatedVisits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return visits.slice(start, start + pageSize);
  }, [visits, currentPage, pageSize]);

  // 탭 옵션 (카운트 포함)
  const tabOptions = useMemo(
    () =>
      managerVisitTypeTabOptions.map((option) => ({
        ...option,
        count: typeCounts[option.value],
      })),
    [typeCounts]
  );

  const handleBack = () => {
    router.push(`/managers/${id}`);
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
                {managerName ? `${managerName}님의 방문 기록` : '방문 기록'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          {/* 필터 영역 */}
          <div className="p-4 border-b border-neutral-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Tabs
                options={tabOptions}
                value={typeFilter}
                onChange={handleTypeChange}
                ariaLabel="방문 유형 필터"
              />
              <div className="w-64">
                <SearchInput
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="대상자명 검색"
                  debounceMs={300}
                />
              </div>
            </div>
          </div>

          {/* 테이블 */}
          <Table ariaLabel="방문 기록 목록">
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
              ) : paginatedVisits.length === 0 ? (
                // T024: 빈 상태 UI
                <EmptyRow colSpan={columns.length} message="방문 기록이 없습니다" />
              ) : (
                paginatedVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell align="center">
                      <div className="flex justify-center">
                        <VisitTypeIcon type={visit.visitType} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-neutral-900">{visit.recipientName}</span>
                    </TableCell>
                    <TableCell>{formatDate(visit.visitDate)}</TableCell>
                    <TableCell>
                      <span
                        className={`text-sm ${
                          visit.visitType === 'emergency' ? 'text-red-600' : 'text-neutral-700'
                        }`}
                      >
                        {visit.result}
                      </span>
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
                totalItems={visits.length}
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
