import type { Visit } from '@/types/dashboard';

// ============================================================
// T038: 방문 기록 Mock 데이터
// ============================================================

/**
 * 방문 기록 Mock 데이터
 */
export const mockVisits: Visit[] = [
  // 대상자 1 (김복동 어르신)의 방문 기록
  {
    id: 'visit-001',
    recipientId: 'rec-0001',
    careLogId: 'cl-001',
    visitDate: new Date('2026-01-12T09:00:00'),
    visitType: 'visit',
    managerName: '김민수',
    summary: '건강 상태 양호, 식사량 보통',
  },
  {
    id: 'visit-002',
    recipientId: 'rec-0001',
    careLogId: 'cl-005',
    visitDate: new Date('2026-01-10T10:00:00'),
    visitType: 'call',
    managerName: '김민수',
    summary: '안부 전화, 특이사항 없음',
  },
  {
    id: 'visit-003',
    recipientId: 'rec-0001',
    careLogId: 'cl-008',
    visitDate: new Date('2026-01-08T09:30:00'),
    visitType: 'visit',
    managerName: '김민수',
    summary: '정기 방문, 혈압 측정 완료',
  },
  {
    id: 'visit-004',
    recipientId: 'rec-0001',
    careLogId: 'cl-012',
    visitDate: new Date('2026-01-05T11:00:00'),
    visitType: 'visit',
    managerName: '김민수',
    summary: '주거 환경 점검. 난방 상태 양호.',
  },
  {
    id: 'visit-005',
    recipientId: 'rec-0001',
    careLogId: 'cl-015',
    visitDate: new Date('2026-01-02T15:30:00'),
    visitType: 'call',
    managerName: '김민수',
    summary: '건강 상태 확인 통화. 특이사항 없음.',
  },

  // 대상자 2 (이순자 어르신)의 방문 기록
  {
    id: 'visit-006',
    recipientId: 'rec-0002',
    careLogId: 'cl-002',
    visitDate: new Date('2026-01-12T10:30:00'),
    visitType: 'visit',
    managerName: '이영희',
    summary: '긴급: 건강 악화, 병원 동행 필요',
  },
  {
    id: 'visit-007',
    recipientId: 'rec-0002',
    careLogId: 'cl-010',
    visitDate: new Date('2026-01-09T11:00:00'),
    visitType: 'visit',
    managerName: '이영희',
    summary: '정기 방문, 컨디션 저하 확인',
  },
  {
    id: 'visit-008',
    recipientId: 'rec-0002',
    careLogId: 'cl-016',
    visitDate: new Date('2026-01-06T14:00:00'),
    visitType: 'visit',
    managerName: '이영희',
    summary: '정서 상태 확인. 우울감 호소.',
  },
  {
    id: 'visit-009',
    recipientId: 'rec-0002',
    careLogId: 'cl-019',
    visitDate: new Date('2026-01-03T11:00:00'),
    visitType: 'call',
    managerName: '이영희',
    summary: '안부 전화 및 건강 상태 확인.',
  },

  // 대상자 3 (박영희 어르신)의 방문 기록
  {
    id: 'visit-010',
    recipientId: 'rec-0003',
    careLogId: 'cl-003',
    visitDate: new Date('2026-01-11T14:00:00'),
    visitType: 'call',
    managerName: '박지현',
    summary: '안부 전화, 특이사항 없음',
  },
  {
    id: 'visit-011',
    recipientId: 'rec-0003',
    careLogId: 'cl-020',
    visitDate: new Date('2026-01-07T10:30:00'),
    visitType: 'visit',
    managerName: '박지현',
    summary: '정기 방문. 낙상 주의 안내.',
  },
  {
    id: 'visit-012',
    recipientId: 'rec-0003',
    careLogId: 'cl-023',
    visitDate: new Date('2026-01-04T15:00:00'),
    visitType: 'call',
    managerName: '박지현',
    summary: '건강 상태 확인 전화. 특이사항 없음.',
  },

  // 대상자 4 (최철수 어르신)의 방문 기록
  {
    id: 'visit-013',
    recipientId: 'rec-0004',
    careLogId: 'cl-004',
    visitDate: new Date('2026-01-10T15:00:00'),
    visitType: 'visit',
    managerName: '김민수',
    summary: '정기 방문, 청소 필요 확인',
  },
  {
    id: 'visit-014',
    recipientId: 'rec-0004',
    careLogId: 'cl-025',
    visitDate: new Date('2026-01-06T10:00:00'),
    visitType: 'call',
    managerName: '김민수',
    summary: '안부 전화. 약 복용 확인.',
  },

  // 대상자 5 (정만복 어르신)의 방문 기록 - 신규 대상자라 아직 없음
];

/**
 * 특정 대상자의 방문 기록 조회 (최신순 정렬)
 */
export function getVisitsByRecipientId(recipientId: string): Visit[] {
  return mockVisits
    .filter((visit) => visit.recipientId === recipientId)
    .sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
}

/**
 * 날짜 범위로 필터링된 방문 기록 조회
 */
export function getVisitsByDateRange(
  recipientId: string,
  startDate: Date | null,
  endDate: Date | null
): Visit[] {
  let visits = getVisitsByRecipientId(recipientId);

  if (startDate) {
    visits = visits.filter((visit) => visit.visitDate >= startDate);
  }

  if (endDate) {
    // endDate의 하루 끝까지 포함
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    visits = visits.filter((visit) => visit.visitDate <= endOfDay);
  }

  return visits;
}
