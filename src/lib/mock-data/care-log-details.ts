import type { CareLogDetailExtended } from '@/types/dashboard';

/**
 * 돌봄 일지 상세 Mock 데이터 (확장)
 */
export const mockCareLogDetails: CareLogDetailExtended[] = [
  // 목록 데이터 ID와 일치: cl-001 ~ cl-005
  {
    id: 'cl-001',
    recipientId: 'rec-0001',
    recipientName: '이복동 어르신',
    status: 'pending',
    createdAt: new Date('2025-01-04T10:30:00'),
    visitInfo: {
      visitDate: new Date('2025-01-04T10:30:00'),
      visitType: 'visit',
      managerName: '이영희',
      centerName: '목동종합사회복지관',
    },
    visitLocation: '서울시 양천구 목동서로 225, 목동아파트 103동 1502호',
    careContent: {
      healthStatus: {
        status: 'good',
        label: '양호',
        description: '혈압 정상, 컨디션 좋음',
      },
      mealStatus: {
        status: 'normal',
        label: '보통',
        description: '식사량 평소의 80%',
      },
      emotionalStatus: {
        status: 'good',
        label: '양호',
        description: '밝은 표정, 대화 적극적',
      },
      livingEnvironment: {
        status: 'good',
        label: '양호',
        description: '청결 상태 양호',
      },
    },
    careContentBlocks: [
      {
        title: '건강 상태 확인',
        content:
          '어르신께서 최근 며칠간 식사량이 줄었다고 하셨습니다. 혈압 측정 결과 145/92mmHg로 평소보다 다소 높게 측정되었습니다. 어지러움 증상이 간헐적으로 있다고 호소하셨습니다.',
      },
      {
        title: '생활 환경 점검',
        content:
          '거실 및 화장실 조명이 어두워 낙상 위험이 있어 보입니다.\n냉장고 내 유통기한 지난 식품 3개 발견하여 폐기 처리하였습니다.',
      },
      {
        title: '정서 상태',
        content: '최근 외출을 거의 하지 않으시고 무기력한 모습을 보이셨습니다.',
      },
    ],
    requiredActions: [
      {
        id: 'action-1',
        priority: 'urgent',
        content: '혈압 상승 및 어지러움 증상 - 병원 진료 권유 필요',
      },
      {
        id: 'action-2',
        priority: 'warning',
        content: '거실/화장실 조명 교체 - 낙상 예방 조치 필요',
      },
      {
        id: 'action-3',
        priority: 'normal',
        content: '사회적 고립감 해소를 위한 프로그램 연계 검토',
      },
    ],
    recommendedPolicies: [
      {
        id: 'policy-1',
        name: '노인 무료 건강검진',
        organization: '양천구 보건소 주관',
        schedule: '매월 둘째, 넷째 주 화요일',
      },
      {
        id: 'policy-2',
        name: '어르신 행복나눔 프로그램',
        organization: '목동종합사회복지관',
        schedule: '매주 수요일, 금요일 오후 2시',
      },
    ],
    feedbacks: [
      {
        id: 'fb-1',
        careLogId: 'cl-001',
        authorId: 'admin-1',
        authorName: '김담당',
        authorRole: '구청',
        content: '혈압 수치가 높네요. 병원 방문 여부를 추적 관찰해주세요.',
        createdAt: new Date('2025-01-03T14:30:00'),
      },
      {
        id: 'fb-2',
        careLogId: 'cl-001',
        authorId: 'manager-1',
        authorName: '이영희',
        authorRole: '종사자',
        content: '네, 다음 방문 시 병원 진료 여부 확인하겠습니다.',
        createdAt: new Date('2025-01-03T16:45:00'),
        isReply: true,
      },
    ],
    notes:
      '다음 방문 시 손자 결혼 이야기 들어드리기로 함. 혈압약 복용 여부 재확인 필요.',
    photos: ['/mock-images/care-log-1-1.jpg', '/mock-images/care-log-1-2.jpg'],
  },
  {
    id: 'cl-002',
    recipientId: 'rec-0002',
    recipientName: '박순자 어르신',
    status: 'urgent',
    createdAt: new Date('2026-01-12T11:00:00'),
    visitInfo: {
      visitDate: new Date('2026-01-12T10:30:00'),
      visitType: 'visit',
      managerName: '이영희',
      centerName: '양천구 노인복지센터',
    },
    careContent: {
      healthStatus: {
        status: 'warning',
        label: '주의 필요',
        description: '가슴 통증 호소, 병원 방문 권유',
      },
      mealStatus: {
        status: 'bad',
        label: '위험',
        description: '3일간 식사 거의 못함',
      },
      emotionalStatus: {
        status: 'warning',
        label: '주의 필요',
        description: '우울감 호소',
      },
      livingEnvironment: {
        status: 'normal',
        label: '보통',
        description: '정리 필요',
      },
    },
    notes:
      '긴급: 보호자에게 연락 완료. 내일 병원 동행 예정. 우울감 지속 시 정신건강 상담 연계 고려.',
    photos: [],
  },
  {
    id: 'cl-003',
    recipientId: 'rec-0003',
    recipientName: '김만복 어르신',
    status: 'approved',
    createdAt: new Date('2026-01-11T14:30:00'),
    visitInfo: {
      visitDate: new Date('2026-01-11T14:00:00'),
      visitType: 'call',
      managerName: '박지현',
      centerName: '양천구 노인복지센터',
    },
    careContent: {
      healthStatus: {
        status: 'good',
        label: '양호',
        description: '건강 상태 양호',
      },
      mealStatus: {
        status: 'good',
        label: '양호',
        description: '식사 잘 하심',
      },
      emotionalStatus: {
        status: 'good',
        label: '양호',
        description: '기분 좋음',
      },
      livingEnvironment: {
        status: 'good',
        label: '양호',
        description: '깔끔함',
      },
    },
    notes: '안부 전화. 특이사항 없음. 다음 주 정기 방문 예정.',
    photos: [],
  },
  {
    id: 'cl-004',
    recipientId: 'rec-0004',
    recipientName: '김철수 어르신',
    status: 'rejected',
    createdAt: new Date('2026-01-10T16:00:00'),
    visitInfo: {
      visitDate: new Date('2026-01-10T15:00:00'),
      visitType: 'visit',
      managerName: '김민수',
      centerName: '양천구 노인복지센터',
    },
    careContent: {
      healthStatus: {
        status: 'normal',
        label: '보통',
        description: '특이사항 없음',
      },
      mealStatus: {
        status: 'normal',
        label: '보통',
        description: '식사량 보통',
      },
      emotionalStatus: {
        status: 'normal',
        label: '보통',
        description: '평소와 같음',
      },
      livingEnvironment: {
        status: 'warning',
        label: '주의 필요',
        description: '청소 필요',
      },
    },
    notes: '방문 시간 기록 오류',
    photos: ['/mock-images/care-log-4-1.jpg'],
    rejectionReason: '방문 시간이 일정과 맞지 않습니다. 확인 후 재제출 바랍니다.',
    rejectedAt: new Date('2026-01-10T17:30:00'),
    rejectedBy: '관리자',
  },
  {
    id: 'cl-005',
    recipientId: 'rec-0005',
    recipientName: '정순자 어르신',
    status: 'pending',
    createdAt: new Date('2026-01-10T10:00:00'),
    visitInfo: {
      visitDate: new Date('2026-01-10T09:30:00'),
      visitType: 'call',
      managerName: '김민수',
      centerName: '양천구 노인복지센터',
    },
    careContent: {
      healthStatus: {
        status: 'good',
        label: '양호',
        description: '전화 응답 명확',
      },
      mealStatus: {
        status: 'good',
        label: '양호',
        description: '아침 식사 완료',
      },
      emotionalStatus: {
        status: 'good',
        label: '양호',
        description: '기분 좋음',
      },
      livingEnvironment: {
        status: 'good',
        label: '양호',
        description: '확인 어려움',
      },
    },
    notes: '안부 전화. 손자 결혼 소식으로 기분 좋으심.',
    photos: [],
  },
];

/**
 * ID로 돌봄 일지 상세 조회
 */
export function getCareLogDetailById(id: string): CareLogDetailExtended | undefined {
  return mockCareLogDetails.find((log) => log.id === id);
}

/**
 * 대상자 ID로 돌봄 일지 목록 조회
 */
export function getCareLogsByRecipientId(recipientId: string): CareLogDetailExtended[] {
  return mockCareLogDetails.filter((log) => log.recipientId === recipientId);
}
