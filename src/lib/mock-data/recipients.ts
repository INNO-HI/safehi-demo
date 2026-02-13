// ============================================================
// Mock 대상자 데이터
// T045: 892명 중 샘플 대상자 Mock 데이터
// ============================================================

import type { Recipient, RecipientStatus, RecipientFilters, Gender } from '@/types/dashboard';

// 이름 풀
const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '류', '전'];
const lastNames = ['복동', '순자', '영희', '철수', '만복', '순희', '말순', '점순', '복녀', '영자', '순옥', '말자', '복례', '영옥', '순덕', '봉수', '정자', '금순', '옥분', '말분'];

// 동 목록
const dongs = ['목동 1동', '목동 2동', '목동 3동', '목동 4동', '목동 5동', '신정동', '신월동'];

// 담당 매니저
const managers = ['이영희', '박지민', '김민수', '최서윤', '정수진'];

// 주소 풀
const addresses = [
  '목동아파트 101동', '목동아파트 102동', '목동아파트 103동',
  '신정빌라 1호', '신정빌라 2호', '신정빌라 3호',
  '신월주공 201동', '신월주공 202동', '신월주공 203동',
  '행복주택 A동', '행복주택 B동', '행복주택 C동',
];

/**
 * 상세 페이지와 일치하는 고정 대상자 데이터 (처음 5명)
 * recipient-details.ts와 동기화됨
 */
const fixedRecipients: Recipient[] = [
  {
    id: 'rec-0001',
    name: '김복동 어르신',
    age: 78,
    gender: 'female',
    dong: '목동 5동',
    address: '목동아파트 103동 502호',
    managerName: '김민수',
    lastVisitDate: new Date('2026-01-12T09:00:00'),
    visitCount: 64,
    status: 'normal',
  },
  {
    id: 'rec-0002',
    name: '이순자 어르신',
    age: 82,
    gender: 'male',
    dong: '신정동',
    address: '신정아파트 201동 1203호',
    managerName: '이영희',
    lastVisitDate: new Date('2026-01-12T10:30:00'),
    visitCount: 64,
    status: 'urgent',
  },
  {
    id: 'rec-0003',
    name: '박영희 어르신',
    age: 75,
    gender: 'female',
    dong: '목동 3동',
    address: '목동빌라 B동 301호',
    managerName: '박지민',
    lastVisitDate: new Date('2026-01-11T14:00:00'),
    visitCount: 42,
    status: 'normal',
  },
  {
    id: 'rec-0004',
    name: '최철수 어르신',
    age: 80,
    gender: 'male',
    dong: '신월동',
    address: '신월아파트 105동 801호',
    managerName: '김민수',
    lastVisitDate: new Date('2026-01-10T15:00:00'),
    visitCount: 38,
    status: 'caution',
  },
  {
    id: 'rec-0005',
    name: '정만복 어르신',
    age: 72,
    gender: 'female',
    dong: '목동 7동',
    address: '현대아파트 501동 403호',
    managerName: '이영희',
    lastVisitDate: null,
    visitCount: 0,
    status: 'unvisited',
  },
];

/**
 * 랜덤 대상자 생성 (6번째부터)
 */
function generateRecipient(id: number): Recipient {
  const firstName = firstNames[id % firstNames.length];
  const lastName = lastNames[id % lastNames.length];
  const name = `${firstName}${lastName} 어르신`;

  const statuses: RecipientStatus[] = ['normal', 'caution', 'urgent', 'unvisited'];
  const statusWeights = [0.7, 0.15, 0.05, 0.1]; // 정상 70%, 주의 15%, 긴급 5%, 미방문 10%

  let statusIndex = 0;
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < statusWeights.length; i++) {
    cumulative += statusWeights[i];
    if (rand < cumulative) {
      statusIndex = i;
      break;
    }
  }

  const status = statuses[statusIndex];
  const daysAgo = status === 'unvisited' ? null : Math.floor(Math.random() * 14);
  const lastVisitDate = daysAgo !== null ? new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo) : null;

  return {
    id: `rec-${String(id).padStart(4, '0')}`,
    name,
    age: 65 + Math.floor(Math.random() * 30), // 65-94세
    gender: Math.random() > 0.4 ? 'female' : 'male' as Gender, // 여성 60%, 남성 40%
    dong: dongs[id % dongs.length],
    address: addresses[id % addresses.length],
    managerName: managers[id % managers.length],
    lastVisitDate,
    visitCount: status === 'unvisited' ? 0 : Math.floor(Math.random() * 30) + 1,
    status,
  };
}

// 전체 대상자 데이터 생성 (고정 5명 + 랜덤 45명 = 50명)
export const mockRecipients: Recipient[] = [
  ...fixedRecipients,
  ...Array.from({ length: 45 }, (_, i) => generateRecipient(i + 6)),
];

// 전체 대상자 수 (KPI용)
export const totalRecipientCount = 892;

// 상태별 KPI
export const recipientKPIs = {
  total: totalRecipientCount,
  normal: 624,
  caution: 134,
  urgent: 45,
  unvisited: 89,
};

// 동 옵션
export const recipientDongOptions = [
  { value: 'all', label: '전체' },
  ...dongs.map((dong) => ({ value: dong, label: dong })),
];

// 매니저 옵션
export const managerOptions = [
  { value: 'all', label: '전체' },
  ...managers.map((manager) => ({ value: manager, label: manager })),
];

/**
 * 대상자 필터링 함수
 */
export function filterRecipients(
  recipients: Recipient[],
  filters: RecipientFilters
): Recipient[] {
  return recipients.filter((recipient) => {
    // 상태 필터
    if (filters.status !== 'all' && recipient.status !== filters.status) {
      return false;
    }

    // 검색어 필터 (이름, 주소)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchName = recipient.name.toLowerCase().includes(searchLower);
      const matchAddress = recipient.address.toLowerCase().includes(searchLower);
      const matchDong = recipient.dong.toLowerCase().includes(searchLower);

      if (!matchName && !matchAddress && !matchDong) {
        return false;
      }
    }

    // 동 필터
    if (filters.dong !== 'all' && recipient.dong !== filters.dong) {
      return false;
    }

    // 매니저 필터
    if (filters.manager !== 'all' && recipient.managerName !== filters.manager) {
      return false;
    }

    return true;
  });
}

/**
 * 상태별 카운트 계산
 */
export function getRecipientStatusCounts(
  recipients: Recipient[]
): Record<RecipientStatus | 'all', number> {
  const counts: Record<RecipientStatus | 'all', number> = {
    all: recipients.length,
    normal: 0,
    caution: 0,
    urgent: 0,
    unvisited: 0,
  };

  for (const recipient of recipients) {
    counts[recipient.status]++;
  }

  return counts;
}

/**
 * 대상자 목록 가져오기 (Mock API)
 */
export function getRecipients(filters: RecipientFilters): Promise<{
  recipients: Recipient[];
  totalCount: number;
  statusCounts: Record<RecipientStatus | 'all', number>;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredRecipients = filterRecipients(mockRecipients, filters);
      const statusCounts = getRecipientStatusCounts(mockRecipients);

      resolve({
        recipients: filteredRecipients,
        totalCount: filteredRecipients.length,
        statusCounts,
      });
    }, 200);
  });
}

/**
 * 대상자 KPI 가져오기 (Mock API)
 */
export function getRecipientKPIs(): Promise<typeof recipientKPIs> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recipientKPIs);
    }, 100);
  });
}
