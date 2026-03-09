// 통계/리포트 페이지 상수 정의

import type { ReportTemplate } from '@/types/statistics';

// 대상자 상태별 색상
export const STATUS_COLORS = {
  normal: '#3D8B6E',     // 정상 - 초록
  caution: '#C4940A',    // 주의 - 노랑
  urgent: '#C45A5A',     // 긴급 - 빨강
  unvisited: '#64748B',  // 미방문 - 회색
} as const;

// 보고서 상태별 색상
export const REPORT_STATUS_COLORS = {
  approved: '#3D8B6E',   // 승인 - 초록
  pending: '#C4940A',    // 대기 - 노랑
  urgent: '#C45A5A',     // 긴급 - 빨강
  rejected: '#64748B',   // 반려 - 회색
} as const;

// KPI 카드 아이콘 색상
export const KPI_ICON_COLORS = {
  totalRecipients: '#2E6AB3',    // 파랑
  monthlyVisits: '#3D8B6E',      // 초록
  processedReports: '#C4940A',   // 노랑
  emergencyCases: '#C45A5A',     // 빨강
  activeManagers: '#7C6B9E',     // 보라
} as const;

// 메달 순위 색상
export const RANK_COLORS = {
  1: '#FCD34D',  // 금
  2: '#D1D5DB',  // 은
  3: '#F59E0B',  // 동
} as const;

// 차트 기간 옵션
export const TREND_PERIODS = {
  SIX_MONTHS: 6,
  ONE_YEAR: 12,
} as const;

// 상태별 레이블
export const STATUS_LABELS = {
  normal: '정상',
  caution: '주의',
  urgent: '긴급',
  unvisited: '미방문',
} as const;

// 보고서 상태별 레이블
export const REPORT_STATUS_LABELS = {
  approved: '승인',
  pending: '대기',
  urgent: '긴급',
  rejected: '반려',
} as const;

// KPI 카드 레이블
export const KPI_LABELS = {
  totalRecipients: '전체 대상자',
  monthlyVisits: '이번 달 방문',
  processedReports: '보고서 처리',
  emergencyCases: '긴급 케이스',
  activeManagers: '활동 매니저',
} as const;

// KPI 카드 단위
export const KPI_UNITS = {
  totalRecipients: '명',
  monthlyVisits: '회',
  processedReports: '건',
  emergencyCases: '건',
  activeManagers: '명',
} as const;

// 기본 리포트 템플릿
export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'monthly-summary',
    type: 'monthly',
    title: '월간 종합 리포트',
    description: '방문, 보고서, 대상자 현황',
    icon: '📊',
    iconBgColor: '#2E6AB3',
  },
  {
    id: 'manager-performance',
    type: 'manager',
    title: '매니저 실적 리포트',
    description: '방문 횟수, 승인률 분석',
    icon: '👥',
    iconBgColor: '#3D8B6E',
  },
  {
    id: 'recipient-status',
    type: 'recipient',
    title: '대상자 현황 리포트',
    description: '상태별, 지역별 분포',
    icon: '🏠',
    iconBgColor: '#C4940A',
  },
  {
    id: 'emergency-cases',
    type: 'emergency',
    title: '긴급 케이스 리포트',
    description: '긴급/주의 대상자 목록',
    icon: '🚨',
    iconBgColor: '#C45A5A',
  },
];

// 최근 12개월 옵션 생성 헬퍼
export function generateAvailableMonths(): { value: string; label: string }[] {
  const months: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    months.push({
      value: `${year}-${String(month).padStart(2, '0')}`,
      label: `${year}년 ${month}월`,
    });
  }
  return months;
}

// 현재 월 가져오기
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}
