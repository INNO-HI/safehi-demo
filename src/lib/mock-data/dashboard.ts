// ============================================================
// Mock 대시보드 데이터
// T026-T028: 대시보드 KPI, 최근 보고서, 알림 데이터
// ============================================================

import type { DashboardKPI, RecentReport, Notification, CareLogStatus } from '@/types/dashboard';

// ============================================================
// T026: Mock 대시보드 KPI 데이터
// ============================================================

export const mockDashboardKPI: DashboardKPI = {
  todayVisits: {
    title: '오늘 방문',
    value: 24,
    change: 3,
    changeDirection: 'up',
    progressColor: 'blue',
    progressPercent: 75,
  },
  pendingReports: {
    title: '대기 중 보고서',
    value: 12,
    change: -2,
    changeDirection: 'down',
    progressColor: 'yellow',
    progressPercent: 30,
  },
  approvedCount: {
    title: '승인 완료',
    value: 156,
    change: 8,
    changeDirection: 'up',
    progressColor: 'green',
    progressPercent: 90,
  },
  totalRecipients: {
    title: '담당 대상자',
    value: 892,
    change: 0,
    changeDirection: 'none',
    progressColor: 'purple',
    progressPercent: 100,
  },
};

// ============================================================
// T027: Mock 최근 보고서 데이터
// ============================================================

export const mockRecentReports: RecentReport[] = [
  {
    id: 'rpt-001',
    recipientName: '이복동 어르신',
    managerName: '이영희',
    registeredAt: new Date(Date.now() - 1000 * 60 * 15), // 15분 전
    status: 'urgent' as CareLogStatus,
    isUrgent: true,
  },
  {
    id: 'rpt-002',
    recipientName: '김철수 어르신',
    managerName: '박지민',
    registeredAt: new Date(Date.now() - 1000 * 60 * 45), // 45분 전
    status: 'pending' as CareLogStatus,
    isUrgent: false,
  },
  {
    id: 'rpt-003',
    recipientName: '박영희 어르신',
    managerName: '김민수',
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    status: 'pending' as CareLogStatus,
    isUrgent: false,
  },
  {
    id: 'rpt-004',
    recipientName: '최순자 어르신',
    managerName: '이영희',
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
    status: 'approved' as CareLogStatus,
    isUrgent: false,
  },
  {
    id: 'rpt-005',
    recipientName: '정만복 어르신',
    managerName: '최서윤',
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
    status: 'approved' as CareLogStatus,
    isUrgent: false,
  },
];

// ============================================================
// T028: Mock 알림 데이터
// ============================================================

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: '긴급 보고서 접수',
    content: '이복동 어르신 보고서가 긴급으로 접수되었습니다. 확인이 필요합니다.',
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10분 전
    isUrgent: true,
    link: '/care-logs?status=urgent',
    icon: 'warning',
  },
  {
    id: 'notif-002',
    title: '보고서 승인 요청',
    content: '3건의 새로운 보고서가 승인 대기 중입니다.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    isUrgent: false,
    link: '/care-logs?status=pending',
    icon: 'report',
  },
  {
    id: 'notif-003',
    title: '신규 대상자 등록',
    content: '목동 3동에 2명의 신규 대상자가 등록되었습니다.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    isUrgent: false,
    link: '/recipients',
    icon: 'info',
  },
  {
    id: 'notif-004',
    title: '월간 보고서 완료',
    content: '12월 월간 보고서가 정상적으로 생성되었습니다.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 어제
    isUrgent: false,
    icon: 'success',
  },
];

// ============================================================
// Mock API 시뮬레이션 함수
// ============================================================

/** 대시보드 KPI 가져오기 */
export function getDashboardKPI(): Promise<DashboardKPI> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDashboardKPI);
    }, 200);
  });
}

/** 최근 보고서 가져오기 */
export function getRecentReports(limit: number = 5): Promise<RecentReport[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRecentReports.slice(0, limit));
    }, 200);
  });
}

/** 알림 가져오기 */
export function getNotifications(limit: number = 4): Promise<Notification[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNotifications.slice(0, limit));
    }, 200);
  });
}

/** 읽지 않은 알림 개수 */
export function getUnreadNotificationCount(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNotifications.filter((n) => n.isUrgent).length);
    }, 100);
  });
}
