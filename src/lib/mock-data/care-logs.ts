/**
 * 돌봄 일지 상세 Mock 데이터 (cl-001 ~ cl-012)
 */

import type {
  CareLog,
  CareLogDetailExtended,
  CareCondition,
  Feedback,
  CareContentBlock,
  RequiredAction,
  RecommendedPolicy,
} from '@/types/dashboard';

export const mockCareLogs: CareLog[] = [
  { id: 'cl-001', recipientName: '김순자', managerName: '김민수', centerName: '강남돌봄센터', visitDate: new Date('2026-05-12T09:30:00'), registeredAt: new Date('2026-05-12T10:15:00'), status: 'pending' },
  { id: 'cl-002', recipientName: '이영숙', managerName: '이영희', centerName: '서초돌봄센터', visitDate: new Date('2026-05-12T11:00:00'), registeredAt: new Date('2026-05-12T11:45:00'), status: 'approved' },
  { id: 'cl-003', recipientName: '박옥순', managerName: '박지현', centerName: '강남돌봄센터', visitDate: new Date('2026-05-11T14:00:00'), registeredAt: new Date('2026-05-11T15:20:00'), status: 'urgent' },
  { id: 'cl-004', recipientName: '최정자', managerName: '최동욱', centerName: '송파돌봄센터', visitDate: new Date('2026-05-11T10:00:00'), registeredAt: new Date('2026-05-11T10:50:00'), status: 'approved' },
  { id: 'cl-005', recipientName: '정영자', managerName: '이영희', centerName: '서초돌봄센터', visitDate: new Date('2026-05-10T13:30:00'), registeredAt: new Date('2026-05-10T14:10:00'), status: 'rejected' },
  { id: 'cl-006', recipientName: '한춘자', managerName: '김민수', centerName: '강남돌봄센터', visitDate: new Date('2026-05-10T09:00:00'), registeredAt: new Date('2026-05-10T09:40:00'), status: 'pending' },
  { id: 'cl-007', recipientName: '오정숙', managerName: '오태규', centerName: '송파돌봄센터', visitDate: new Date('2026-05-09T15:00:00'), registeredAt: new Date('2026-05-09T16:00:00'), status: 'approved' },
  { id: 'cl-008', recipientName: '장영희', managerName: '장서윤', centerName: '서초돌봄센터', visitDate: new Date('2026-05-09T10:30:00'), registeredAt: new Date('2026-05-09T11:20:00'), status: 'pending' },
  { id: 'cl-009', recipientName: '윤순옥', managerName: '김민수', centerName: '강남돌봄센터', visitDate: new Date('2026-05-08T14:00:00'), registeredAt: new Date('2026-05-08T14:50:00'), status: 'approved' },
  { id: 'cl-010', recipientName: '조복순', managerName: '최동욱', centerName: '송파돌봄센터', visitDate: new Date('2026-05-08T11:00:00'), registeredAt: new Date('2026-05-08T11:30:00'), status: 'urgent' },
  { id: 'cl-011', recipientName: '임영남', managerName: '이영희', centerName: '서초돌봄센터', visitDate: new Date('2026-05-07T09:30:00'), registeredAt: new Date('2026-05-07T10:10:00'), status: 'approved' },
  { id: 'cl-012', recipientName: '송석호', managerName: '김민수', centerName: '강남돌봄센터', visitDate: new Date('2026-05-07T13:00:00'), registeredAt: new Date('2026-05-07T13:45:00'), status: 'pending' },
];

const cond = (status: CareCondition['status'], label: string, description?: string): CareCondition => ({ status, label, description });

function buildDetail(log: CareLog, index: number): CareLogDetailExtended {
  const recipientId = `recipient-${String(((index % 48) + 1)).padStart(3, '0')}`;

  const careContentBlocks: CareContentBlock[] = [
    { title: '식사 상태', content: '하루 세 끼 모두 식사하셨으며 입맛도 평소와 비슷합니다. 점심에는 직접 끓이신 된장찌개를 드셨습니다.' },
    { title: '복약 관리', content: '혈압약과 당뇨약을 정해진 시간에 복용하셨습니다. 잔량 확인 결과 7일분 남아 있어 다음 주 처방 안내 드렸습니다.' },
    { title: '정서 상태', content: '대체로 안정적이나 가족 안부 전화를 받지 못한 점에 대해 서운함을 표현하셨습니다. 다음 방문 시 가족 연락 권유 예정입니다.' },
    { title: '주거 환경', content: '실내 온도 22도, 환기 양호. 화장실 미끄럼방지 매트 마모로 교체 권고 드렸습니다.' },
  ];

  const requiredActions: RequiredAction[] = log.status === 'urgent'
    ? [
        { id: 'a-1', priority: 'urgent', content: '혈압 수치 비정상(170/100) → 즉시 보호자 연락 및 진료 권고' },
        { id: 'a-2', priority: 'warning', content: '냉장고 내 유통기한 경과 식품 다수 → 정리 필요' },
      ]
    : log.status === 'pending'
    ? [
        { id: 'a-1', priority: 'warning', content: '약 잔량 7일 → 다음 주 처방 안내' },
        { id: 'a-2', priority: 'normal', content: '화장실 미끄럼방지 매트 교체 권고' },
      ]
    : [
        { id: 'a-1', priority: 'normal', content: '월말 정기 건강 체크 예정' },
      ];

  const recommendedPolicies: RecommendedPolicy[] = [
    { id: 'p-1', name: '노인맞춤돌봄서비스', organization: '보건복지부', schedule: '주 1회 직접 서비스' },
    { id: 'p-2', name: '응급안전안심서비스', organization: '한국사회보장정보원', schedule: '24시간 상시 안전 확인' },
  ];

  const feedbacks: Feedback[] = [
    {
      id: `fb-${log.id}-1`,
      careLogId: log.id,
      authorId: 'admin-1',
      authorName: '센터장 박상민',
      authorRole: '센터장',
      content: '꼼꼼한 작성 감사합니다. 혈압 추이를 다음 보고서에도 기록해주세요.',
      createdAt: new Date(log.registeredAt.getTime() + 86400000),
    },
  ];

  return {
    id: log.id,
    recipientId,
    recipientName: log.recipientName,
    status: log.status,
    createdAt: log.registeredAt,
    visitInfo: {
      visitDate: log.visitDate,
      visitType: 'visit',
      managerName: log.managerName,
      centerName: log.centerName,
    },
    careContent: {
      healthStatus: cond(log.status === 'urgent' ? 'warning' : 'normal', log.status === 'urgent' ? '혈압 상승 관찰' : '특이사항 없음'),
      mealStatus: cond('good', '하루 3끼 정상 식사'),
      emotionalStatus: cond(log.status === 'urgent' ? 'warning' : 'normal', log.status === 'urgent' ? '불안 호소' : '안정'),
      livingEnvironment: cond('normal', '청결 보통, 미끄럼방지 매트 교체 권고'),
    },
    notes: '오늘 방문 시 어르신 컨디션 전반적으로 양호하셨으며, 약 복용 및 식사 모두 잘 챙기고 계셨습니다. 다음 방문은 일주일 후로 예정입니다.',
    photos: [],
    rejectionReason: log.status === 'rejected' ? '필수 항목 누락(약 복용 사진) — 재제출 요청' : undefined,
    rejectedAt: log.status === 'rejected' ? new Date(log.registeredAt.getTime() + 3600000) : undefined,
    rejectedBy: log.status === 'rejected' ? '센터장 박상민' : undefined,
    visitLocation: `${log.centerName} 관할 자택`,
    careContentBlocks,
    requiredActions,
    recommendedPolicies,
    feedbacks,
  };
}

export const mockCareLogDetails: Record<string, CareLogDetailExtended> = Object.fromEntries(
  mockCareLogs.map((log, i) => [log.id, buildDetail(log, i)] as const)
);
