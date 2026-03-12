// 통계/리포트 페이지 Mock 데이터

import type {
  StatisticsKPI,
  MonthlyVisitTrend,
  ReportStatusDistribution,
  DistrictVisit,
  ManagerRanking,
  RecipientStatusDistribution,
  StatisticsOverview,
} from '@/types/statistics';

// KPI 데이터 (월별)
export const mockKPIData: Record<string, StatisticsKPI> = {
  '2026-03': {
    totalRecipients: 1263,
    monthlyVisits: 912,
    processedReports: 798,
    emergencyCases: 9,
    activeManagers: 24,
  },
  '2026-02': {
    totalRecipients: 1248,
    monthlyVisits: 856,
    processedReports: 743,
    emergencyCases: 12,
    activeManagers: 23,
  },
  '2026-01': {
    totalRecipients: 1235,
    monthlyVisits: 892,
    processedReports: 812,
    emergencyCases: 8,
    activeManagers: 25,
  },
  '2025-12': {
    totalRecipients: 1220,
    monthlyVisits: 756,
    processedReports: 698,
    emergencyCases: 15,
    activeManagers: 22,
  },
  '2025-11': {
    totalRecipients: 1198,
    monthlyVisits: 834,
    processedReports: 756,
    emergencyCases: 10,
    activeManagers: 24,
  },
  '2025-10': {
    totalRecipients: 1180,
    monthlyVisits: 798,
    processedReports: 723,
    emergencyCases: 7,
    activeManagers: 21,
  },
  '2025-09': {
    totalRecipients: 1165,
    monthlyVisits: 812,
    processedReports: 745,
    emergencyCases: 9,
    activeManagers: 23,
  },
  '2025-08': {
    totalRecipients: 1150,
    monthlyVisits: 678,
    processedReports: 612,
    emergencyCases: 11,
    activeManagers: 20,
  },
  '2025-07': {
    totalRecipients: 1132,
    monthlyVisits: 723,
    processedReports: 667,
    emergencyCases: 6,
    activeManagers: 22,
  },
  '2025-06': {
    totalRecipients: 1115,
    monthlyVisits: 756,
    processedReports: 698,
    emergencyCases: 8,
    activeManagers: 21,
  },
  '2025-05': {
    totalRecipients: 1098,
    monthlyVisits: 789,
    processedReports: 712,
    emergencyCases: 5,
    activeManagers: 23,
  },
  '2025-04': {
    totalRecipients: 1082,
    monthlyVisits: 745,
    processedReports: 678,
    emergencyCases: 9,
    activeManagers: 22,
  },
  '2025-03': {
    totalRecipients: 1065,
    monthlyVisits: 712,
    processedReports: 645,
    emergencyCases: 7,
    activeManagers: 20,
  },
};

// 월별 방문 추이 데이터 (6개월)
export const mockVisitTrend6Months: MonthlyVisitTrend[] = [
  { month: '2025-10', label: '10월', visits: 798 },
  { month: '2025-11', label: '11월', visits: 834 },
  { month: '2025-12', label: '12월', visits: 756 },
  { month: '2026-01', label: '1월', visits: 892 },
  { month: '2026-02', label: '2월', visits: 856 },
  { month: '2026-03', label: '3월', visits: 912 },
];

// 월별 방문 추이 데이터 (12개월)
export const mockVisitTrend12Months: MonthlyVisitTrend[] = [
  { month: '2025-04', label: '4월', visits: 745 },
  { month: '2025-05', label: '5월', visits: 789 },
  { month: '2025-06', label: '6월', visits: 756 },
  { month: '2025-07', label: '7월', visits: 723 },
  { month: '2025-08', label: '8월', visits: 678 },
  { month: '2025-09', label: '9월', visits: 812 },
  { month: '2025-10', label: '10월', visits: 798 },
  { month: '2025-11', label: '11월', visits: 834 },
  { month: '2025-12', label: '12월', visits: 756 },
  { month: '2026-01', label: '1월', visits: 892 },
  { month: '2026-02', label: '2월', visits: 856 },
  { month: '2026-03', label: '3월', visits: 912 },
];

// 보고서 처리 현황 데이터 (월별)
export const mockReportStatusData: Record<string, ReportStatusDistribution> = {
  '2026-03': {
    approved: 512,
    pending: 168,
    urgent: 38,
    rejected: 80,
    total: 798,
  },
  '2026-02': {
    approved: 456,
    pending: 187,
    urgent: 52,
    rejected: 48,
    total: 743,
  },
  '2026-01': {
    approved: 523,
    pending: 156,
    urgent: 45,
    rejected: 88,
    total: 812,
  },
  '2025-12': {
    approved: 412,
    pending: 178,
    urgent: 38,
    rejected: 70,
    total: 698,
  },
  '2025-11': {
    approved: 489,
    pending: 145,
    urgent: 42,
    rejected: 80,
    total: 756,
  },
  '2025-10': {
    approved: 456,
    pending: 167,
    urgent: 35,
    rejected: 65,
    total: 723,
  },
};

// 동별 방문 현황 데이터
export const mockDistrictVisitsData: DistrictVisit[] = [
  { district: '목동 5동', visits: 324, rank: 1 },
  { district: '신월 7동', visits: 287, rank: 2 },
  { district: '신정 1동', visits: 245, rank: 3 },
  { district: '화곡 2동', visits: 212, rank: 4 },
  { district: '등촌 3동', visits: 198, rank: 5 },
  { district: '가양 1동', visits: 178, rank: 6 },
  { district: '염창동', visits: 165, rank: 7 },
  { district: '발산 1동', visits: 156, rank: 8 },
  { district: '공항동', visits: 134, rank: 9 },
  { district: '마곡동', visits: 112, rank: 10 },
];

// 매니저 활동 순위 데이터
export const mockManagerRankingData: ManagerRanking[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    rank: 1,
    name: '이영희',
    initials: '이영',
    avatarColor: '#448CFF',
    visits: 89,
    reports: 82,
    approvalRate: 96,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    rank: 2,
    name: '박수현',
    initials: '박수',
    avatarColor: '#5B9BD5',
    visits: 84,
    reports: 78,
    approvalRate: 94,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    rank: 3,
    name: '최민수',
    initials: '최민',
    avatarColor: '#6BA3D6',
    visits: 78,
    reports: 72,
    approvalRate: 92,
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-234567890123',
    rank: 4,
    name: '김지원',
    initials: '김지',
    avatarColor: '#94A3B8',
    visits: 72,
    reports: 65,
    approvalRate: 90,
  },
  {
    id: 'e5f6a7b8-c9d0-1234-ef01-345678901234',
    rank: 5,
    name: '정다영',
    initials: '정다',
    avatarColor: '#94A3B8',
    visits: 68,
    reports: 62,
    approvalRate: 91,
  },
  {
    id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
    rank: 6,
    name: '홍길동',
    initials: '홍길',
    avatarColor: '#94A3B8',
    visits: 65,
    reports: 58,
    approvalRate: 89,
  },
  {
    id: 'a7b8c9d0-e1f2-3456-0123-567890123456',
    rank: 7,
    name: '강민호',
    initials: '강민',
    avatarColor: '#94A3B8',
    visits: 62,
    reports: 55,
    approvalRate: 88,
  },
  {
    id: 'b8c9d0e1-f2a3-4567-1234-678901234567',
    rank: 8,
    name: '윤서연',
    initials: '윤서',
    avatarColor: '#94A3B8',
    visits: 58,
    reports: 52,
    approvalRate: 90,
  },
  {
    id: 'c9d0e1f2-a3b4-5678-2345-789012345678',
    rank: 9,
    name: '임태호',
    initials: '임태',
    avatarColor: '#94A3B8',
    visits: 54,
    reports: 48,
    approvalRate: 87,
  },
  {
    id: 'd0e1f2a3-b4c5-6789-3456-890123456789',
    rank: 10,
    name: '송미경',
    initials: '송미',
    avatarColor: '#94A3B8',
    visits: 50,
    reports: 45,
    approvalRate: 91,
  },
];

// 대상자 상태 분포 데이터 (월별)
export const mockRecipientStatusData: Record<string, RecipientStatusDistribution> = {
  '2026-03': {
    normal: 878,
    caution: 221,
    urgent: 82,
    unvisited: 82,
    total: 1263,
    trends: {
      normalChange: 22,
      cautionChange: -13,
      urgentChange: 4,
      unvisitedChange: 2,
    },
    transition: {
      toNormal: 21,
      fromNormal: 9,
    },
  },
  '2026-02': {
    normal: 856,
    caution: 234,
    urgent: 78,
    unvisited: 80,
    total: 1248,
    trends: {
      normalChange: 24,
      cautionChange: -12,
      urgentChange: 5,
      unvisitedChange: -4,
    },
    transition: {
      toNormal: 18,      // 주의/긴급 → 정상
      fromNormal: 7,     // 정상 → 주의/긴급
    },
  },
  '2026-01': {
    normal: 832,
    caution: 246,
    urgent: 73,
    unvisited: 84,
    total: 1235,
    trends: {
      normalChange: 18,
      cautionChange: -8,
      urgentChange: -3,
      unvisitedChange: 6,
    },
    transition: {
      toNormal: 15,
      fromNormal: 5,
    },
  },
  '2025-12': {
    normal: 814,
    caution: 254,
    urgent: 76,
    unvisited: 78,
    total: 1222,
    trends: {
      normalChange: -5,
      cautionChange: 15,
      urgentChange: 8,
      unvisitedChange: 2,
    },
    transition: {
      toNormal: 8,
      fromNormal: 12,
    },
  },
  '2025-11': {
    normal: 819,
    caution: 239,
    urgent: 68,
    unvisited: 76,
    total: 1202,
    trends: {
      normalChange: 22,
      cautionChange: -10,
      urgentChange: -2,
      unvisitedChange: -5,
    },
    transition: {
      toNormal: 20,
      fromNormal: 6,
    },
  },
  '2025-10': {
    normal: 797,
    caution: 249,
    urgent: 70,
    unvisited: 81,
    total: 1197,
    trends: {
      normalChange: 15,
      cautionChange: -6,
      urgentChange: 3,
      unvisitedChange: -2,
    },
    transition: {
      toNormal: 12,
      fromNormal: 4,
    },
  },
};

// 기본 데이터 반환 함수 (월이 없을 경우)
function getDefaultKPI(): StatisticsKPI {
  return {
    totalRecipients: 0,
    monthlyVisits: 0,
    processedReports: 0,
    emergencyCases: 0,
    activeManagers: 0,
  };
}

function getDefaultReportStatus(): ReportStatusDistribution {
  return {
    approved: 0,
    pending: 0,
    urgent: 0,
    rejected: 0,
    total: 0,
  };
}

function getDefaultRecipientStatus(): RecipientStatusDistribution {
  return {
    normal: 0,
    caution: 0,
    urgent: 0,
    unvisited: 0,
    total: 0,
    trends: {
      normalChange: 0,
      cautionChange: 0,
      urgentChange: 0,
      unvisitedChange: 0,
    },
  };
}

// 월별 통계 개요 데이터 생성
export function getMockStatisticsOverview(month: string): StatisticsOverview {
  return {
    kpi: mockKPIData[month] || getDefaultKPI(),
    visitTrend: mockVisitTrend6Months, // 기본값 6개월
    reportStatus: mockReportStatusData[month] || getDefaultReportStatus(),
    districtVisits: mockDistrictVisitsData,
    managerRanking: mockManagerRankingData,
    recipientStatus: mockRecipientStatusData[month] || getDefaultRecipientStatus(),
  };
}

// 기간별 방문 추이 데이터 반환
export function getMockVisitTrend(period: 6 | 12): MonthlyVisitTrend[] {
  return period === 6 ? mockVisitTrend6Months : mockVisitTrend12Months;
}

// 상위 N개 동별 방문 데이터 반환
export function getMockDistrictVisits(limit?: number): DistrictVisit[] {
  if (limit) {
    return mockDistrictVisitsData.slice(0, limit);
  }
  return mockDistrictVisitsData;
}

// 상위 N명 매니저 순위 반환
export function getMockManagerRanking(limit?: number): ManagerRanking[] {
  if (limit) {
    return mockManagerRankingData.slice(0, limit);
  }
  return mockManagerRankingData;
}
