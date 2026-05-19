/**
 * 매니저 Mock 데이터 (결정적)
 */

import type {
  Manager,
  ManagerDetailExtended,
  ManagerStatus,
  ManagerKPIs,
  ManagerMonthlyActivity,
  ManagerAssignedRecipient,
  ManagerReport,
  ManagerVisit,
} from '@/types/dashboard';
import { mockRecipients } from './recipients';

interface ManagerSeed {
  id: string;
  name: string;
  gender: 'male' | 'female';
  email: string;
  phone: string;
  centerName: string;
  assignedDongs: string[];
  status: ManagerStatus;
  startDate: Date;
}

const MANAGER_SEEDS: ManagerSeed[] = [
  { id: 'm-1', name: '김민수', gender: 'male', email: 'minsu.kim@safehi.kr', phone: '010-2345-6789', centerName: '강남돌봄센터', assignedDongs: ['역삼동', '삼성동'], status: 'active', startDate: new Date('2023-03-02') },
  { id: 'm-2', name: '이영희', gender: 'female', email: 'younghee.lee@safehi.kr', phone: '010-3456-7890', centerName: '서초돌봄센터', assignedDongs: ['대치동', '도곡동'], status: 'active', startDate: new Date('2022-07-15') },
  { id: 'm-3', name: '박지현', gender: 'female', email: 'jihyun.park@safehi.kr', phone: '010-4567-8901', centerName: '강남돌봄센터', assignedDongs: ['개포동'], status: 'active', startDate: new Date('2024-01-08') },
  { id: 'm-4', name: '최동욱', gender: 'male', email: 'dongwook.choi@safehi.kr', phone: '010-5678-9012', centerName: '송파돌봄센터', assignedDongs: ['일원동', '수서동'], status: 'active', startDate: new Date('2023-09-20') },
  { id: 'm-5', name: '정수연', gender: 'female', email: 'suyeon.jung@safehi.kr', phone: '010-6789-0123', centerName: '서초돌봄센터', assignedDongs: ['세곡동'], status: 'leave', startDate: new Date('2022-04-11') },
  { id: 'm-6', name: '한미라', gender: 'female', email: 'mira.han@safehi.kr', phone: '010-7890-1234', centerName: '강남돌봄센터', assignedDongs: ['역삼동'], status: 'active', startDate: new Date('2023-11-30') },
  { id: 'm-7', name: '오태규', gender: 'male', email: 'taegyu.oh@safehi.kr', phone: '010-8901-2345', centerName: '송파돌봄센터', assignedDongs: ['수서동', '세곡동'], status: 'active', startDate: new Date('2021-06-04') },
  { id: 'm-8', name: '장서윤', gender: 'female', email: 'seoyun.jang@safehi.kr', phone: '010-9012-3456', centerName: '서초돌봄센터', assignedDongs: ['삼성동'], status: 'retired', startDate: new Date('2020-02-17') },
];

// 매니저별 담당 대상자 수, 월 방문 결정적 생성
function recipientsAssignedTo(managerName: string) {
  return mockRecipients.filter((r) => r.managerName === managerName);
}

export const mockManagers: Manager[] = MANAGER_SEEDS.map((m) => {
  const assigned = recipientsAssignedTo(m.name);
  const monthly = assigned.reduce((s, r) => s + r.visitCount, 0);
  return {
    id: m.id,
    name: m.name,
    gender: m.gender,
    centerName: m.centerName,
    phone: m.phone,
    assignedDongs: m.assignedDongs,
    recipientCount: assigned.length,
    monthlyVisits: monthly,
    status: m.status,
  };
});

export const mockManagerKPIs: ManagerKPIs = {
  total: mockManagers.length,
  active: mockManagers.filter((m) => m.status === 'active').length,
  leave: mockManagers.filter((m) => m.status === 'leave').length,
  retired: mockManagers.filter((m) => m.status === 'retired').length,
};

export function getMockManagerStatusCounts(): Record<ManagerStatus | 'all', number> {
  return {
    all: mockManagers.length,
    active: mockManagerKPIs.active,
    leave: mockManagerKPIs.leave,
    retired: mockManagerKPIs.retired,
  };
}

// 매니저 상세 (확장)
function buildMonthlyActivities(baseSeed: number): ManagerMonthlyActivity[] {
  const months = ['2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];
  return months.map((m, i) => {
    const s = baseSeed + i;
    return {
      month: m,
      regularVisits: 6 + (s % 8),
      emergencyVisits: (s % 3),
      callConsults: 2 + (s % 5),
    };
  });
}

function buildAssignedRecipients(managerName: string): ManagerAssignedRecipient[] {
  return mockRecipients
    .filter((r) => r.managerName === managerName)
    .slice(0, 6)
    .map((r) => ({
      id: r.id,
      name: r.name,
      gender: r.gender,
      dong: r.dong,
      careStartDate: new Date('2025-09-01'),
      lastVisitDate: r.lastVisitDate,
      isUrgent: r.status === 'urgent',
    }));
}

function buildRecentReports(managerName: string): ManagerReport[] {
  const assigned = mockRecipients.filter((r) => r.managerName === managerName).slice(0, 5);
  return assigned.map((r, i) => ({
    id: `rep-${managerName}-${i}`,
    recipientId: r.id,
    recipientName: r.name,
    visitDate: new Date(`2026-05-${String(10 + i).padStart(2, '0')}T10:00:00`),
    registeredAt: new Date(`2026-05-${String(10 + i).padStart(2, '0')}T14:00:00`),
    status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'approved' : 'approved',
  }));
}

function buildRecentVisits(managerName: string): ManagerVisit[] {
  const assigned = mockRecipients.filter((r) => r.managerName === managerName).slice(0, 5);
  return assigned.map((r, i) => ({
    id: `vis-${managerName}-${i}`,
    recipientId: r.id,
    recipientName: r.name,
    visitDate: new Date(`2026-05-${String(10 + i).padStart(2, '0')}T10:00:00`),
    visitType: i % 4 === 0 ? 'emergency' : i % 3 === 0 ? 'call' : 'regular',
    result: i % 2 === 0 ? '건강 양호, 정상 식사' : '약 복용 확인 필요',
  }));
}

export const mockManagerDetails: Record<string, ManagerDetailExtended> = Object.fromEntries(
  MANAGER_SEEDS.map((seed) => {
    const list = mockManagers.find((m) => m.id === seed.id)!;
    const assignedRecipients = buildAssignedRecipients(seed.name);
    const recentReports = buildRecentReports(seed.name);
    const recentVisits = buildRecentVisits(seed.name);
    const monthlyActivities = buildMonthlyActivities(seed.id.charCodeAt(2) || 0);

    const monthlyVisits = list.monthlyVisits;
    const monthlyReports = recentReports.length * 4;
    const approved = recentReports.filter((r) => r.status === 'approved').length;
    const approvalRate = Math.round((approved / Math.max(1, recentReports.length)) * 100);
    const totalVisits = monthlyVisits * 6;

    const detail: ManagerDetailExtended = {
      ...list,
      email: seed.email,
      startDate: seed.startDate,
      stats: {
        monthlyVisits,
        monthlyReports,
        approvalRate,
        totalRecipients: list.recipientCount,
      },
      recentReports,
      recentVisits,
      totalVisits,
      reportCounts: {
        approved: monthlyReports - 2,
        pending: 2,
        rejected: 0,
      },
      assignedRecipients,
      monthlyActivities,
    };

    return [seed.id, detail] as const;
  })
);
