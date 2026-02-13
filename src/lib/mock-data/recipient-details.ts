import type { RecipientDetailExtended } from '@/types/dashboard';

/**
 * 대상자 상세 Mock 데이터 (확장)
 */
export const mockRecipientDetails: RecipientDetailExtended[] = [
  // 목록 데이터 ID와 일치: rec-0001 ~ rec-0005
  {
    id: 'rec-0001',
    name: '김복동 어르신',
    age: 78,
    gender: 'female',
    status: 'normal',
    basicInfo: {
      address: '서울시 양천구 목동 5동 목동아파트 103동 502호',
      dong: '목동 5동',
      phone: '010-1234-5678',
      emergencyContact: {
        name: '박철수',
        relationship: '아들',
        phone: '010-9876-5432',
      },
    },
    manager: {
      id: 'm1',
      name: '김민수',
      phone: '010-1111-2222',
      centerName: '양천구 노인복지센터',
    },
    healthInfo: {
      diseases: ['고혈압', '당뇨'],
      medications: ['혈압약 (아침)', '당뇨약 (아침, 저녁)'],
      notes: '계단 이동 시 숨이 차다고 호소. 무리한 활동 자제 권고.',
    },
    recentVisits: [
      {
        id: 'v1',
        careLogId: 'cl-001',
        visitDate: new Date('2026-01-12T09:00:00'),
        visitType: 'visit',
        managerName: '김민수',
        summary: '건강 상태 양호, 식사량 보통',
      },
      {
        id: 'v2',
        careLogId: 'cl-005',
        visitDate: new Date('2026-01-10T10:00:00'),
        visitType: 'call',
        managerName: '김민수',
        summary: '안부 전화, 특이사항 없음',
      },
      {
        id: 'v3',
        careLogId: 'cl-008',
        visitDate: new Date('2026-01-08T09:30:00'),
        visitType: 'visit',
        managerName: '김민수',
        summary: '정기 방문, 혈압 측정 완료',
      },
    ],
    // 확장 필드
    careStartDate: new Date('2024-05-15'),
    kpi: {
      monthlyVisits: 8,
      totalVisits: 64,
      totalReports: 64,
      urgentHistory: 1,
    },
    memos: [
      {
        id: 'memo-1',
        recipientId: 'rec-0001',
        authorId: 'admin-1',
        authorName: '김담당',
        content: '혼자 외출 시 낙상 위험 있음. 보행 보조 필요.',
        createdAt: new Date('2024-12-15'),
        type: 'warning',
      },
      {
        id: 'memo-2',
        recipientId: 'rec-0001',
        authorId: 'admin-1',
        authorName: '김담당',
        content: '아들 이민호씨가 주 1회 방문 중. 주말 연락 가능.',
        createdAt: new Date('2024-11-20'),
        type: 'normal',
      },
    ],
    monthlyVisits: [
      { month: '8월', count: 6 },
      { month: '9월', count: 8 },
      { month: '10월', count: 7 },
      { month: '11월', count: 8 },
      { month: '12월', count: 7 },
      { month: '1월', count: 8 },
    ],
    policyRecommendations: [
      {
        id: 'pr-1',
        name: '노인 만성질환 관리 지원',
        description: '월 최대 10만원 의료비 지원',
        icon: 'health',
        badge: '적합',
      },
      {
        id: 'pr-2',
        name: '독거노인 응급안전서비스',
        description: '24시간 응급 호출 시스템 설치',
        icon: 'safety',
        badge: '추천',
      },
    ],
  },
  {
    id: 'rec-0002',
    name: '이순자 어르신',
    age: 82,
    gender: 'male',
    status: 'urgent',
    basicInfo: {
      address: '서울시 양천구 신정동 신정아파트 201동 1203호',
      dong: '신정동',
      phone: '010-2345-6789',
      emergencyContact: {
        name: '이미영',
        relationship: '딸',
        phone: '010-8765-4321',
      },
    },
    manager: {
      id: 'm2',
      name: '이영희',
      phone: '010-2222-3333',
      centerName: '양천구 노인복지센터',
    },
    healthInfo: {
      diseases: ['심장병', '관절염'],
      medications: ['심장약 (아침, 저녁)', '소염진통제 (필요 시)'],
      notes: '최근 가슴 통증 호소. 병원 방문 예정. 우울감 지속 관찰 필요.',
    },
    recentVisits: [
      {
        id: 'v4',
        careLogId: 'cl-002',
        visitDate: new Date('2026-01-12T10:30:00'),
        visitType: 'visit',
        managerName: '이영희',
        summary: '긴급: 건강 악화, 병원 동행 필요',
      },
      {
        id: 'v5',
        careLogId: 'cl-010',
        visitDate: new Date('2026-01-09T11:00:00'),
        visitType: 'visit',
        managerName: '이영희',
        summary: '정기 방문, 컨디션 저하 확인',
      },
    ],
    // 확장 필드 (긴급 상태)
    careStartDate: new Date('2024-05-15'),
    kpi: {
      monthlyVisits: 8,
      totalVisits: 64,
      totalReports: 64,
      urgentHistory: 3,
    },
    urgentAlert: {
      message: '현재 긴급 상태',
      detail: '혈압 상승 (160/100), 어지러움 증상 → 병원 진료 권유',
      createdAt: new Date('2026-01-12T10:30:00'),
    },
    memos: [
      {
        id: 'memo-3',
        recipientId: 'rec-0002',
        authorId: 'admin-1',
        authorName: '김담당',
        content: '혼자 외출 시 낙상 위험 있음. 보행 보조 필요.',
        createdAt: new Date('2024-12-15'),
        type: 'warning',
      },
      {
        id: 'memo-4',
        recipientId: 'rec-0002',
        authorId: 'admin-1',
        authorName: '김담당',
        content: '딸 이미영씨가 주 1회 방문 중. 주말 연락 가능.',
        createdAt: new Date('2024-11-20'),
        type: 'normal',
      },
    ],
    monthlyVisits: [
      { month: '8월', count: 6 },
      { month: '9월', count: 8 },
      { month: '10월', count: 7 },
      { month: '11월', count: 8 },
      { month: '12월', count: 7 },
      { month: '1월', count: 8 },
    ],
    policyRecommendations: [
      {
        id: 'pr-3',
        name: '노인 만성질환 관리 지원',
        description: '월 최대 10만원 의료비 지원',
        icon: 'health',
        badge: '적합',
      },
      {
        id: 'pr-4',
        name: '독거노인 응급안전서비스',
        description: '24시간 응급 호출 시스템 설치',
        icon: 'safety',
        badge: '추천',
      },
    ],
  },
  {
    id: 'rec-0003',
    name: '박영희 어르신',
    age: 75,
    gender: 'female',
    status: 'normal',
    basicInfo: {
      address: '서울시 양천구 목동 3동 목동빌라 B동 301호',
      dong: '목동 3동',
      phone: '010-3456-7890',
      emergencyContact: {
        name: '김정호',
        relationship: '남편',
        phone: '010-7654-3210',
      },
    },
    manager: {
      id: 'm3',
      name: '박지현',
      phone: '010-3333-4444',
      centerName: '양천구 노인복지센터',
    },
    healthInfo: {
      diseases: ['골다공증'],
      medications: ['칼슘제 (아침)'],
      notes: '낙상 주의. 거동 시 지팡이 사용.',
    },
    recentVisits: [
      {
        id: 'v6',
        careLogId: 'cl-003',
        visitDate: new Date('2026-01-11T14:00:00'),
        visitType: 'call',
        managerName: '박지현',
        summary: '안부 전화, 특이사항 없음',
      },
    ],
  },
  {
    id: 'rec-0004',
    name: '최철수 어르신',
    age: 80,
    gender: 'male',
    status: 'caution',
    basicInfo: {
      address: '서울시 양천구 신월동 신월아파트 105동 801호',
      dong: '신월동',
      phone: '010-4567-8901',
      emergencyContact: {
        name: '최영미',
        relationship: '딸',
        phone: '010-6543-2109',
      },
    },
    manager: {
      id: 'm1',
      name: '김민수',
      phone: '010-1111-2222',
      centerName: '양천구 노인복지센터',
    },
    healthInfo: {
      diseases: ['치매 초기', '고혈압'],
      medications: ['치매약 (아침)', '혈압약 (아침)'],
      notes: '경도 인지장애. 약 복용 확인 필요. 외출 시 보호자 동행 권고.',
    },
    recentVisits: [
      {
        id: 'v7',
        careLogId: 'cl-004',
        visitDate: new Date('2026-01-10T15:00:00'),
        visitType: 'visit',
        managerName: '김민수',
        summary: '정기 방문, 청소 필요 확인',
      },
    ],
  },
  {
    id: 'rec-0005',
    name: '정만복 어르신',
    age: 72,
    gender: 'female',
    status: 'unvisited',
    basicInfo: {
      address: '서울시 양천구 목동 7동 현대아파트 501동 403호',
      dong: '목동 7동',
      phone: '010-5678-9012',
      emergencyContact: {
        name: '정민호',
        relationship: '아들',
        phone: '010-5432-1098',
      },
    },
    manager: {
      id: 'm2',
      name: '이영희',
      phone: '010-2222-3333',
      centerName: '양천구 노인복지센터',
    },
    healthInfo: {
      diseases: [],
      medications: [],
      notes: '신규 등록 대상자. 첫 방문 예정.',
    },
    recentVisits: [],
  },
];

/**
 * ID로 대상자 상세 조회
 */
export function getRecipientDetailById(id: string): RecipientDetailExtended | undefined {
  return mockRecipientDetails.find((r) => r.id === id);
}

/**
 * 모든 대상자 상세 목록 조회
 */
export function getAllRecipientDetails(): RecipientDetailExtended[] {
  return mockRecipientDetails;
}
