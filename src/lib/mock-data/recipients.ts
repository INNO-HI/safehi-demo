/**
 * 대상자 관리 Mock 데이터 (결정적 — SSG 하이드레이션 안정성 보장)
 */

import type { Recipient, RecipientStatus } from '@/types/dashboard';

const dongs = ['역삼동', '삼성동', '대치동', '도곡동', '개포동', '일원동', '수서동', '세곡동'];
const managers = ['김민수', '이영희', '박지현', '최동욱', '정수연', '한미라', '오태규', '장서윤'];
const lastNames = ['김', '이', '박', '최', '정', '한', '오', '장', '윤', '조', '임', '송', '서', '강', '류'];
const firstNames = ['순자', '영숙', '옥순', '정자', '영자', '춘자', '정숙', '영희', '순옥', '복순', '영남', '석호', '철수', '기영', '만복', '종호', '병철', '두식'];

// 결정적 의사난수 (인덱스 기반)
function pseudoRandom(seed: number, max: number): number {
  return Math.abs((seed * 9301 + 49297) % 233280) % max;
}

function deterministicDate(seed: number, maxDaysAgo: number): Date {
  const daysAgo = pseudoRandom(seed, maxDaysAgo);
  const d = new Date('2026-05-19T09:00:00');
  d.setDate(d.getDate() - daysAgo);
  return d;
}

function deterministicStatus(seed: number): RecipientStatus {
  const r = seed % 100;
  if (r < 50) return 'normal';
  if (r < 70) return 'caution';
  if (r < 85) return 'urgent';
  return 'unvisited';
}

// 48명의 대상자 데이터 (결정적 생성)
export const mockRecipients: Recipient[] = Array.from({ length: 48 }, (_, i) => {
  const seed = i + 1;
  const lastName = lastNames[i % lastNames.length];
  const firstName = firstNames[i % firstNames.length];
  const dong = dongs[i % dongs.length];
  const manager = managers[i % managers.length];
  const status = deterministicStatus(seed);
  const hasVisit = status !== 'unvisited';

  return {
    id: `recipient-${String(i + 1).padStart(3, '0')}`,
    name: `${lastName}${firstName}`,
    age: 65 + pseudoRandom(seed, 20),
    gender: (seed % 5 === 0 ? 'male' : 'female') as 'male' | 'female',
    dong,
    address: `서울시 강남구 ${dong} ${100 + pseudoRandom(seed * 7, 900)}번지`,
    managerName: manager,
    lastVisitDate: hasVisit ? deterministicDate(seed, 30) : null,
    visitCount: hasVisit ? (pseudoRandom(seed, 19) + 1) : 0,
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

// Mock KPI (실제 데이터와 일치)
const _counts = getMockStatusCounts(mockRecipients);
export const mockRecipientKPIs = {
  total: _counts.all,
  normal: _counts.normal,
  caution: _counts.caution,
  urgent: _counts.urgent,
  unvisited: _counts.unvisited,
};
