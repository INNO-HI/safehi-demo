/**
 * 대시보드 홈 mock 데이터
 */

import type { DashboardKPI, RecentReport, Notification } from '@/types/dashboard';
import { mockCareLogs } from './care-logs';
import { mockRecipients } from './recipients';

const totalRecipients = mockRecipients.length;
const totalCareLogs = mockCareLogs.length;
const pendingCount = mockCareLogs.filter((l) => l.status === 'pending' || l.status === 'urgent').length;
const approvedCount = mockCareLogs.filter((l) => l.status === 'approved').length;

export const mockDashboardKPI: DashboardKPI = {
  todayVisits: {
    title: '오늘 방문',
    value: 14,
    change: 3,
    changeDirection: 'up',
    progressColor: 'blue',
    progressPercent: 70,
  },
  pendingReports: {
    title: '대기 보고서',
    value: pendingCount,
    change: -2,
    changeDirection: 'down',
    progressColor: 'yellow',
    progressPercent: Math.round((pendingCount / Math.max(1, totalCareLogs)) * 100),
  },
  approvedCount: {
    title: '승인 완료',
    value: approvedCount,
    change: 5,
    changeDirection: 'up',
    progressColor: 'green',
    progressPercent: Math.round((approvedCount / Math.max(1, totalCareLogs)) * 100),
  },
  totalRecipients: {
    title: '돌봄 대상자',
    value: totalRecipients,
    change: 2,
    changeDirection: 'up',
    progressColor: 'purple',
    progressPercent: 100,
  },
};

export const mockRecentReports: RecentReport[] = mockCareLogs.slice(0, 5).map((l) => ({
  id: l.id,
  recipientName: l.recipientName,
  managerName: l.managerName,
  registeredAt: l.registeredAt,
  status: l.status,
  isUrgent: l.status === 'urgent',
  reportType: 'visit',
  riskLevel: l.status === 'urgent' ? 'danger' : l.status === 'pending' ? 'caution' : 'normal',
  dong: '역삼동',
}));

export const mockNotifications: Notification[] = [
  {
    id: 'noti-1',
    title: '긴급 보고서 도착',
    content: '이복순 어르신 — 혈압 수치 비정상으로 즉시 확인이 필요합니다.',
    createdAt: new Date('2026-05-19T08:25:00'),
    isUrgent: true,
    icon: 'warning',
    link: '/care-logs/cl-003',
  },
  {
    id: 'noti-2',
    title: '신규 매니저 등록',
    content: '한미라 매니저가 강남돌봄센터에 새로 합류했습니다.',
    createdAt: new Date('2026-05-19T07:10:00'),
    isUrgent: false,
    icon: 'info',
  },
  {
    id: 'noti-3',
    title: '주간 보고서 생성 완료',
    content: '2026년 5월 3주차 보고서가 생성되어 대기 중입니다.',
    createdAt: new Date('2026-05-18T18:00:00'),
    isUrgent: false,
    icon: 'report',
    link: '/statistics',
  },
  {
    id: 'noti-4',
    title: '복지 정책 매칭 알림',
    content: '12명의 대상자에게 신규 정책이 매칭되었습니다.',
    createdAt: new Date('2026-05-18T14:30:00'),
    isUrgent: false,
    icon: 'success',
  },
];
