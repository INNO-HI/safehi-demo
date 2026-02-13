// ============================================================
// Mock 돌봄 일지 데이터
// T035: 42건의 돌봄 일지 Mock 데이터
// ============================================================

import type { CareLog, CareLogStatus, CareLogFilters } from '@/types/dashboard';

// 돌봄 일지 샘플 데이터 (42건)
export const mockCareLogs: CareLog[] = [
  // 긴급 (urgent) - 3건
  {
    id: 'cl-001',
    recipientName: '이복동 어르신',
    managerName: '이영희',
    centerName: '목동돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    registeredAt: new Date(Date.now() - 1000 * 60 * 15),
    status: 'urgent',
  },
  {
    id: 'cl-002',
    recipientName: '박순자 어르신',
    managerName: '최서윤',
    centerName: '신정돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 4),
    registeredAt: new Date(Date.now() - 1000 * 60 * 30),
    status: 'urgent',
  },
  {
    id: 'cl-003',
    recipientName: '김만복 어르신',
    managerName: '박지민',
    centerName: '목동돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 5),
    registeredAt: new Date(Date.now() - 1000 * 60 * 45),
    status: 'urgent',
  },

  // 대기 (pending) - 12건
  {
    id: 'cl-004',
    recipientName: '김철수 어르신',
    managerName: '박지민',
    centerName: '신월돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 3),
    registeredAt: new Date(Date.now() - 1000 * 60 * 45),
    status: 'pending',
  },
  {
    id: 'cl-005',
    recipientName: '박영희 어르신',
    managerName: '김민수',
    centerName: '목동돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 4),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'pending',
  },
  {
    id: 'cl-006',
    recipientName: '정순희 어르신',
    managerName: '이영희',
    centerName: '신정돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 6),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: 'pending',
  },
  {
    id: 'cl-007',
    recipientName: '한명숙 어르신',
    managerName: '최서윤',
    centerName: '신월돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 8),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    status: 'pending',
  },
  {
    id: 'cl-008',
    recipientName: '오정자 어르신',
    managerName: '박지민',
    centerName: '목동돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 10),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'pending',
  },
  {
    id: 'cl-009',
    recipientName: '윤봉수 어르신',
    managerName: '김민수',
    centerName: '신정돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 12),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    status: 'pending',
  },
  {
    id: 'cl-010',
    recipientName: '송복례 어르신',
    managerName: '이영희',
    centerName: '신월돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 14),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 7),
    status: 'pending',
  },
  {
    id: 'cl-011',
    recipientName: '강순덕 어르신',
    managerName: '최서윤',
    centerName: '목동돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 16),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'pending',
  },
  {
    id: 'cl-012',
    recipientName: '임말순 어르신',
    managerName: '박지민',
    centerName: '신정돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 18),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 9),
    status: 'pending',
  },
  {
    id: 'cl-013',
    recipientName: '조옥분 어르신',
    managerName: '김민수',
    centerName: '신월돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 20),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
    status: 'pending',
  },
  {
    id: 'cl-014',
    recipientName: '황점순 어르신',
    managerName: '이영희',
    centerName: '목동돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 22),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 11),
    status: 'pending',
  },
  {
    id: 'cl-015',
    recipientName: '배순임 어르신',
    managerName: '최서윤',
    centerName: '신정돌봄센터',
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    status: 'pending',
  },

  // 승인 (approved) - 20건
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `cl-${16 + i}`.padStart(6, '0').replace(/^0+/, 'cl-'),
    recipientName: [
      '최순자 어르신', '정만복 어르신', '김영자 어르신', '박복순 어르신', '이춘자 어르신',
      '한금순 어르신', '오말자 어르신', '신복남 어르신', '강영옥 어르신', '임순옥 어르신',
      '조복자 어르신', '황말순 어르신', '배영순 어르신', '서점순 어르신', '권순자 어르신',
      '양복순 어르신', '손영희 어르신', '노순덕 어르신', '하복례 어르신', '전말자 어르신',
    ][i],
    managerName: ['이영희', '박지민', '김민수', '최서윤'][i % 4],
    centerName: ['목동돌봄센터', '신정돌봄센터', '신월돌봄센터'][i % 3],
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 1)),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 1) + 1000 * 60 * 60 * 2),
    status: 'approved' as CareLogStatus,
  })),

  // 반려 (rejected) - 7건
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `cl-${36 + i}`.padStart(6, '0').replace(/^0+/, 'cl-'),
    recipientName: [
      '문순자 어르신', '장복자 어르신', '유말순 어르신', '안점순 어르신',
      '홍복녀 어르신', '고순희 어르신', '류영자 어르신',
    ][i],
    managerName: ['이영희', '박지민', '김민수', '최서윤'][i % 4],
    centerName: ['목동돌봄센터', '신정돌봄센터', '신월돌봄센터'][i % 3],
    visitDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 5)),
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 4)),
    status: 'rejected' as CareLogStatus,
  })),
];

// 동 목록 (필터용)
export const dongOptions = [
  { value: 'all', label: '전체' },
  { value: '목동', label: '목동' },
  { value: '신정동', label: '신정동' },
  { value: '신월동', label: '신월동' },
];

// 센터 목록 (필터용)
export const centerOptions = [
  { value: 'all', label: '전체' },
  { value: '목동돌봄센터', label: '목동돌봄센터' },
  { value: '신정돌봄센터', label: '신정돌봄센터' },
  { value: '신월돌봄센터', label: '신월돌봄센터' },
];

/**
 * 돌봄 일지 필터링 함수
 */
export function filterCareLogs(logs: CareLog[], filters: CareLogFilters): CareLog[] {
  return logs.filter((log) => {
    // 상태 필터
    if (filters.status !== 'all' && log.status !== filters.status) {
      return false;
    }

    // 검색어 필터 (대상자, 종사자, 센터)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchName = log.recipientName.toLowerCase().includes(searchLower);
      const matchManager = log.managerName.toLowerCase().includes(searchLower);
      const matchCenter = log.centerName.toLowerCase().includes(searchLower);

      if (!matchName && !matchManager && !matchCenter) {
        return false;
      }
    }

    // 날짜 범위 필터
    if (filters.dateRange.start && log.visitDate < filters.dateRange.start) {
      return false;
    }
    if (filters.dateRange.end) {
      const endOfDay = new Date(filters.dateRange.end);
      endOfDay.setHours(23, 59, 59, 999);
      if (log.visitDate > endOfDay) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 상태별 카운트 계산
 */
export function getCareLogStatusCounts(logs: CareLog[]): Record<CareLogStatus | 'all', number> {
  const counts: Record<CareLogStatus | 'all', number> = {
    all: logs.length,
    pending: 0,
    urgent: 0,
    approved: 0,
    rejected: 0,
  };

  for (const log of logs) {
    counts[log.status]++;
  }

  return counts;
}

/**
 * 돌봄 일지 가져오기 (Mock API)
 */
export function getCareLogs(filters: CareLogFilters): Promise<{
  logs: CareLog[];
  totalCount: number;
  statusCounts: Record<CareLogStatus | 'all', number>;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredLogs = filterCareLogs(mockCareLogs, filters);
      const statusCounts = getCareLogStatusCounts(mockCareLogs);

      resolve({
        logs: filteredLogs,
        totalCount: filteredLogs.length,
        statusCounts,
      });
    }, 200);
  });
}

/**
 * 일괄 상태 변경 (Mock API)
 */
export function updateCareLogStatus(
  ids: string[],
  _newStatus: 'approved' | 'rejected'
): Promise<{ success: boolean; count: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock: 실제로는 상태를 변경하지 않음
      resolve({ success: true, count: ids.length });
    }, 300);
  });
}
