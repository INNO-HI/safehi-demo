/**
 * 대상자 상세 mock (메모/방문/건강/정책 포함)
 */

import type {
  RecipientDetailExtended,
  Memo,
  MemoExtended,
  Visit,
  Policy,
  VisitSummary,
  MonthlyVisitStat,
  PolicyRecommendation,
} from '@/types/dashboard';
import { mockRecipients } from './recipients';
import { mockManagers } from './managers';

const phones = ['010-2222-1111', '010-3333-2222', '010-4444-3333', '010-5555-4444', '010-6666-5555', '010-7777-6666'];
const relationships = ['딸', '아들', '며느리', '사위', '손자', '조카'];
const diseasePool = ['고혈압', '당뇨', '관절염', '치매 초기', '심부전', '갑상선기능저하', '백내장'];
const medicationPool = ['혈압약', '당뇨약', '관절염약', '아스피린', '비타민D', '오메가3'];

function pick<T>(arr: T[], seed: number, count: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < count; i++) {
    out.push(arr[(seed + i * 7) % arr.length]);
  }
  return Array.from(new Set(out));
}

function pseudoRandom(seed: number, max: number): number {
  return Math.abs((seed * 9301 + 49297) % 233280) % max;
}

function buildDetail(recipientId: string): RecipientDetailExtended | null {
  const r = mockRecipients.find((x) => x.id === recipientId);
  if (!r) return null;

  const idNum = parseInt(r.id.split('-')[1] || '1', 10);
  const seed = idNum;
  const manager = mockManagers.find((m) => m.name === r.managerName) || mockManagers[0];

  const careStartDate = new Date('2025-09-01');
  careStartDate.setDate(careStartDate.getDate() + pseudoRandom(seed, 90));

  const monthlyVisits: MonthlyVisitStat[] = [
    { month: '2025-12', count: 2 + (seed % 4) },
    { month: '2026-01', count: 3 + (seed % 3) },
    { month: '2026-02', count: 2 + (seed % 5) },
    { month: '2026-03', count: 3 + (seed % 4) },
    { month: '2026-04', count: 4 + (seed % 3) },
    { month: '2026-05', count: 2 + (seed % 4) },
  ];

  const recentVisits: VisitSummary[] = Array.from({ length: 5 }, (_, i) => {
    const d = new Date('2026-05-15');
    d.setDate(d.getDate() - i * 4);
    return {
      id: `vis-${r.id}-${i}`,
      careLogId: `cl-vis-${r.id}-${i}`,
      visitDate: d,
      visitType: i === 1 ? 'call' : 'visit',
      managerName: r.managerName,
      summary: i === 0 ? '안부 확인 및 약 복용 점검' : i === 1 ? '전화 상담 — 컨디션 양호' : '정기 방문 — 식사·복약 양호',
    };
  });

  const memos: MemoExtended[] = [
    {
      id: `memo-${r.id}-1`,
      recipientId: r.id,
      authorId: manager.id,
      authorName: manager.name,
      content: '냉장고에 유통기한 지난 식품이 있어 정리해드림. 다음 방문 시 재확인 필요.',
      createdAt: new Date('2026-05-11T15:00:00'),
      type: 'normal',
    },
    {
      id: `memo-${r.id}-2`,
      recipientId: r.id,
      authorId: manager.id,
      authorName: manager.name,
      content: r.status === 'urgent' ? '혈압 수치 170/100, 보호자에게 연락하여 진료 권유' : '약 복용 시간 잊으시는 경우 잦음. 알람 설정 안내',
      createdAt: new Date('2026-05-08T10:30:00'),
      type: r.status === 'urgent' ? 'warning' : 'normal',
    },
    {
      id: `memo-${r.id}-3`,
      recipientId: r.id,
      authorId: 'admin-1',
      authorName: '센터장 박상민',
      content: '복지정책 신청서 작성 도와드림. 다음 주 결과 통보 예정.',
      createdAt: new Date('2026-04-29T14:00:00'),
      type: 'normal',
    },
  ];

  const policyRecommendations: PolicyRecommendation[] = [
    { id: 'pol-1', name: '노인맞춤돌봄서비스', description: '주 1회 직접 방문 안전·안부 확인', icon: 'support', badge: '적합' },
    { id: 'pol-2', name: '응급안전안심서비스', description: '24시간 응급호출 단말기 무상 지원', icon: 'safety', badge: '추천' },
    { id: 'pol-3', name: '치매안심센터 등록', description: '치매 예방·관리 프로그램 무료 참여', icon: 'health', badge: '추천' },
    { id: 'pol-4', name: '독거노인 안부 전화서비스', description: '주 3회 안부 전화 (사회복지사)', icon: 'welfare', badge: '적합' },
  ];

  return {
    id: r.id,
    name: r.name,
    age: r.age,
    gender: r.gender,
    status: r.status,
    basicInfo: {
      address: r.address,
      dong: r.dong,
      phone: phones[seed % phones.length],
      emergencyContact: {
        name: ['김지연', '이수영', '박정민', '최은서', '정현우'][seed % 5],
        relationship: relationships[seed % relationships.length],
        phone: phones[(seed + 2) % phones.length],
      },
    },
    manager: {
      id: manager.id,
      name: manager.name,
      phone: manager.phone,
      centerName: manager.centerName,
    },
    healthInfo: {
      diseases: pick(diseasePool, seed, 2 + (seed % 3)),
      medications: pick(medicationPool, seed + 3, 2 + (seed % 2)),
      notes: r.status === 'urgent'
        ? '최근 혈압 수치 불안정. 매일 측정 및 기록 필요.'
        : '특이사항 없음. 정기 복약 관리 중.',
    },
    recentVisits,
    careStartDate,
    kpi: {
      monthlyVisits: monthlyVisits[monthlyVisits.length - 1].count,
      totalVisits: monthlyVisits.reduce((s, v) => s + v.count, 0) * 3,
      totalReports: monthlyVisits.reduce((s, v) => s + v.count, 0),
      urgentHistory: r.status === 'urgent' ? 2 : r.status === 'caution' ? 1 : 0,
    },
    urgentAlert: r.status === 'urgent'
      ? {
          message: '혈압 수치 비정상',
          detail: '최근 측정값 170/100 — 보호자 통보 및 진료 권유 완료',
          createdAt: new Date('2026-05-11T15:00:00'),
        }
      : undefined,
    memos,
    monthlyVisits,
    policyRecommendations,
  };
}

// 미리 모든 recipient detail 캐시
export const mockRecipientDetails: Record<string, RecipientDetailExtended> = Object.fromEntries(
  mockRecipients.map((r) => [r.id, buildDetail(r.id)] as const)
    .filter((pair): pair is [string, RecipientDetailExtended] => pair[1] !== null)
);

// 메모 전용
export function mockMemosFor(recipientId: string): Memo[] {
  return mockRecipientDetails[recipientId]?.memos || [];
}

// 방문 기록 전용 (Visit interface는 VisitSummary 와 약간 다름)
export function mockVisitsFor(recipientId: string): Visit[] {
  const details = mockRecipientDetails[recipientId];
  if (!details) return [];
  return details.recentVisits.map((v) => ({
    id: v.id,
    recipientId,
    careLogId: v.careLogId,
    visitDate: v.visitDate,
    visitType: v.visitType,
    managerName: v.managerName,
    summary: v.summary,
  }));
}

// 정책 전용 (Policy interface 풀버전)
export function mockPoliciesFor(recipientId: string): Policy[] {
  const details = mockRecipientDetails[recipientId];
  if (!details?.policyRecommendations) return [];
  return details.policyRecommendations.map((p, i) => ({
    id: p.id,
    name: p.name,
    summary: p.description,
    matchScore: 85 + i * 3,
    applicationMethod: i === 0 ? '읍·면·동 행정복지센터 방문 신청' : '온라인(복지로) 또는 콜센터(129) 신청',
    details: {
      description: `${p.name}는 어르신의 안전과 일상생활을 지원하기 위한 정부 복지 사업입니다.`,
      eligibility: ['만 65세 이상', '기초생활수급자 또는 차상위 계층 우선', '독거 또는 고위험군'],
      benefits: ['주 1회 이상 방문 안부 확인', '응급 시 즉시 대응', '복지정책 안내·연계'],
      documents: ['신청서', '신분증', '주민등록등본'],
      contactInfo: '보건복지상담센터 129',
    },
  }));
}
