import type { Memo } from '@/types/dashboard';

// ============================================================
// T032: 담당자 메모 Mock 데이터
// ============================================================

/**
 * 담당자 메모 Mock 데이터
 * recipientId로 그룹화되어 있음
 */
export const mockMemos: Memo[] = [
  // 대상자 1 (김복동 어르신)의 메모
  {
    id: 'memo-001',
    recipientId: 'rec-0001',
    authorId: 'manager-001',
    authorName: '김민수',
    content: '최근 혈압이 다소 높아져 병원 방문을 권유했습니다. 다음 방문 시 복약 상태 확인 필요합니다.',
    createdAt: new Date('2026-01-08T14:30:00'),
  },
  {
    id: 'memo-002',
    recipientId: 'rec-0001',
    authorId: 'manager-001',
    authorName: '김민수',
    content: '보호자와 통화 완료. 주말에 아들분이 방문 예정이라고 합니다.',
    createdAt: new Date('2026-01-05T10:15:00'),
  },
  {
    id: 'memo-003',
    recipientId: 'rec-0001',
    authorId: 'manager-002',
    authorName: '이영희',
    content: '식사량 감소 경향이 있어 영양 보충제 복용을 권장드렸습니다. 보호자에게도 안내 완료.',
    createdAt: new Date('2026-01-02T16:45:00'),
  },

  // 대상자 2 (이순자 어르신)의 메모
  {
    id: 'memo-004',
    recipientId: 'rec-0002',
    authorId: 'manager-002',
    authorName: '이영희',
    content: '어르신께서 우울감을 호소하셔서 정서 지원 프로그램 연계를 진행중입니다.',
    createdAt: new Date('2026-01-09T11:00:00'),
  },
  {
    id: 'memo-005',
    recipientId: 'rec-0002',
    authorId: 'manager-002',
    authorName: '이영희',
    content: '가슴 통증 호소로 병원 동행 예정. 보호자에게 연락 완료.',
    createdAt: new Date('2026-01-06T09:30:00'),
  },

  // 대상자 3 (박영희 어르신)의 메모
  {
    id: 'memo-006',
    recipientId: 'rec-0003',
    authorId: 'manager-003',
    authorName: '박지현',
    content: '안부 전화 완료. 건강 상태 양호하심.',
    createdAt: new Date('2026-01-10T08:20:00'),
  },
  {
    id: 'memo-007',
    recipientId: 'rec-0003',
    authorId: 'manager-003',
    authorName: '박지현',
    content: '낙상 주의 안내 완료. 지팡이 사용 권장드림.',
    createdAt: new Date('2026-01-07T15:00:00'),
  },

  // 대상자 4 (최철수 어르신)의 메모
  {
    id: 'memo-008',
    recipientId: 'rec-0004',
    authorId: 'manager-001',
    authorName: '김민수',
    content: '경도 인지장애로 약 복용 확인 필요. 외출 시 보호자 동행 권고.',
    createdAt: new Date('2026-01-08T13:00:00'),
  },

  // 대상자 5 (정만복 어르신)의 메모
  {
    id: 'memo-009',
    recipientId: 'rec-0005',
    authorId: 'manager-002',
    authorName: '이영희',
    content: '신규 등록 대상자. 첫 방문 예정. 건강 상태 확인 필요.',
    createdAt: new Date('2026-01-10T10:30:00'),
  },
];

/**
 * 특정 대상자의 메모 목록 조회 (최신순 정렬)
 */
export function getMemosByRecipientId(recipientId: string): Memo[] {
  return mockMemos
    .filter((memo) => memo.recipientId === recipientId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * 새 메모 추가 (Mock)
 * 실제 환경에서는 API 호출로 대체됨
 */
export function addMemoMock(
  recipientId: string,
  content: string,
  authorId: string,
  authorName: string
): Memo {
  const newMemo: Memo = {
    id: `memo-${Date.now()}`,
    recipientId,
    authorId,
    authorName,
    content,
    createdAt: new Date(),
  };

  // Mock 데이터에 추가 (실제로는 서버에서 처리)
  mockMemos.unshift(newMemo);

  return newMemo;
}
