/**
 * 대상자 관리 Mock 데이터
 * 백엔드 미연동 시 임시 데이터
 */

import type { Recipient, RecipientStatus } from '@/types/dashboard';

const dongs = ['역삼동', '삼성동', '대치동', '도곡동', '개포동', '일원동', '수서동', '세곡동'];
const managers = ['김민수', '이영희', '박지현', '최동욱', '정수연', '한미라', '오태규', '장서윤'];
const lastNames = ['김', '이', '박', '최', '정', '한', '오', '장', '윤', '조', '임', '송', '서', '강', '류'];
const firstNames = ['순자', '영숙', '옥순', '정자', '영자', '춘자', '정숙', '영희', '순옥', '복순', '영남', '석호', '철수', '기영', '만복', '종호', '병철', '두식'];

function randomDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  return d;
}

function randomStatus(): RecipientStatus {
  const r = Math.random();
  if (r < 0.5) return 'normal';
  if (r < 0.7) return 'caution';
  if (r < 0.85) return 'urgent';
  return 'unvisited';
}

// 48명의 대상자 데이터 생성
export const mockRecipients: Recipient[] = Array.from({ length: 48 }, (_, i) => {
  const lastName = lastNames[i % lastNames.length];
  const firstName = firstNames[i % firstNames.length];
  const dong = dongs[i % dongs.length];
  const manager = managers[i % managers.length];
  const status = randomStatus();
  const hasVisit = status !== 'unvisited';

  return {
    id: `recipient-${String(i + 1).padStart(3, '0')}`,
    name: `${lastName}${firstName}`,
    age: 65 + Math.floor(Math.random() * 20),
    gender: Math.random() > 0.4 ? 'female' as const : 'male' as const,
    dong,
    address: `서울시 강남구 ${dong} ${100 + Math.floor(Math.random() * 900)}번지`,
    managerName: manager,
    lastVisitDate: hasVisit ? randomDate(30) : null,
    visitCount: hasVisit ? Math.floor(Math.random() * 20) + 1 : 0,
    status,
  };
});

// 상태별 카운트 계산
export function getMockStatusCounts(recipients: Recipient[]): Record<RecipientStatus | 'all', number> {
  const counts: Record<RecipientStatus | 'all', number> = {
    all: recipients.length,
    normal: 0,
    caution: 0,
    urgent: 0,
    unvisited: 0,
  };
  recipients.forEach((r) => {
    counts[r.status]++;
  });
  return counts;
}

// Mock KPI
export const mockRecipientKPIs = {
  total: 48,
  normal: 24,
  caution: 10,
  urgent: 7,
  unvisited: 7,
};
