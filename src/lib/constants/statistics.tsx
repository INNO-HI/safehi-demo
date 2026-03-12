// 통계/리포트 페이지 상수 정의

import type { ReportTemplate } from '@/types/statistics';

// 대상자 상태별 색상 (디자인 시스템 기반)
export const STATUS_COLORS = {
  normal: '#6EA8FE',     // 정상 - 승인 블루
  caution: '#F6C56F',    // 주의 - 경고 앰버
  urgent: '#F08C8C',     // 긴급 - 위험 코랄
  unvisited: '#B9C3CF',  // 미방문 - 뮤트 그레이
} as const;

// 보고서 상태별 색상 (디자인 시스템 기반)
export const REPORT_STATUS_COLORS = {
  approved: '#6EA8FE',   // 승인 - 블루
  pending: '#F6C56F',    // 대기 - 앰버
  urgent: '#F08C8C',     // 긴급 - 코랄
  rejected: '#B9C3CF',   // 반려 - 그레이
} as const;

// KPI 카드 아이콘 색상 (디자인 시스템 기반)
export const KPI_ICON_COLORS = {
  totalRecipients: '#6EA8FE',    // 승인 블루
  monthlyVisits: '#6EA8FE',      // 승인 블루
  processedReports: '#F6C56F',   // 경고 앰버
  emergencyCases: '#F08C8C',     // 위험 코랄
  activeManagers: '#6EA8FE',     // 승인 블루
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
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" opacity="0.25" />
        <rect x="6" y="13" width="3" height="5" rx="0.5" />
        <rect x="10.5" y="9" width="3" height="9" rx="0.5" />
        <rect x="15" y="6" width="3" height="12" rx="0.5" />
      </svg>
    ),
    iconBgColor: '#6EA8FE',
  },
  {
    id: 'manager-performance',
    type: 'manager',
    title: '매니저 실적 리포트',
    description: '방문 횟수, 승인률 분석',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="6" r="3" />
        <path d="M2 19c0-3 2.5-5.5 7-5.5s7 2.5 7 5.5H2z" />
        <circle cx="17" cy="7.5" r="2.2" opacity="0.45" />
        <path d="M16 19c0-1.8.6-3.4 1.8-4.6.4-.15.8-.25 1.2-.25 2.2 0 4 1.8 4 4H16z" opacity="0.45" />
      </svg>
    ),
    iconBgColor: '#6EA8FE',
  },
  {
    id: 'recipient-status',
    type: 'recipient',
    title: '대상자 현황 리포트',
    description: '상태별, 지역별 분포',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10.5z" />
        <rect x="9" y="13" width="6" height="9" rx="1" fill="white" />
      </svg>
    ),
    iconBgColor: '#F6C56F',
  },
  {
    id: 'emergency-cases',
    type: 'emergency',
    title: '긴급 케이스 리포트',
    description: '긴급/주의 대상자 목록',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <rect x="11" y="9" width="2" height="5" rx="1" fill="white" />
        <circle cx="12" cy="17" r="1.2" fill="white" />
      </svg>
    ),
    iconBgColor: '#F08C8C',
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
