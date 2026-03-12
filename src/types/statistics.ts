// 통계/리포트 페이지 TypeScript 타입 정의

// KPI 카드에 표시되는 핵심 성과 지표
export interface StatisticsKPI {
  totalRecipients: number;
  monthlyVisits: number;
  processedReports: number;
  emergencyCases: number;
  activeManagers: number;
}

// 월별 방문 추이 차트 데이터
export interface MonthlyVisitTrend {
  month: string;      // "2025-01" 형식
  label: string;      // "1월" 형식
  visits: number;
}

// 보고서 처리 현황 데이터
export interface ReportStatusDistribution {
  approved: number;
  pending: number;
  urgent: number;
  rejected: number;
  total: number;
}

// 도넛 차트용 변환 타입
export interface ReportStatusChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

// 동별 방문 현황 데이터
export interface DistrictVisit {
  district: string;
  visits: number;
  rank: number;
}

// 매니저 활동 순위 데이터
export interface ManagerRanking {
  id: string;
  rank: number;
  name: string;
  initials: string;
  avatarColor: string;
  visits: number;
  reports: number;
  approvalRate: number;
}

// 대상자 상태 분포 트렌드
export interface RecipientTrends {
  normalChange: number;
  cautionChange: number;
  urgentChange: number;
  unvisitedChange: number;
}

// 대상자 상태 전환 데이터 (전월 대비)
export interface RecipientStatusTransition {
  toNormal: number;      // 주의/긴급 → 정상 전환
  fromNormal: number;    // 정상 → 주의/긴급 전환
}

// 대상자 상태 분포 데이터
export interface RecipientStatusDistribution {
  normal: number;
  caution: number;
  urgent: number;
  unvisited: number;
  total: number;
  trends: RecipientTrends;
  transition?: RecipientStatusTransition;
}

// 상태별 표시용 타입
export interface RecipientStatusCard {
  status: 'normal' | 'caution' | 'urgent' | 'unvisited';
  label: string;
  count: number;
  percentage: number;
  color: string;
  change?: number;
}

// 리포트 템플릿 유형
export type ReportType = 'monthly' | 'manager' | 'recipient' | 'emergency';

// 리포트 템플릿 데이터
export interface ReportTemplate {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

// 월 선택 옵션
export interface MonthOption {
  value: string;    // "2025-01" 형식
  label: string;    // "2025년 1월" 형식
}

// 기간 선택 필터
export interface StatisticsFilter {
  selectedMonth: string;
  availableMonths: MonthOption[];
}

// 전체 통계 데이터
export interface StatisticsOverview {
  kpi: StatisticsKPI;
  visitTrend: MonthlyVisitTrend[];
  reportStatus: ReportStatusDistribution;
  districtVisits: DistrictVisit[];
  managerRanking: ManagerRanking[];
  recipientStatus: RecipientStatusDistribution;
}

// API 응답 타입
export interface StatisticsResponse {
  success: boolean;
  data?: StatisticsOverview;
  error?: string;
}

// 차트 기간 타입
export type TrendPeriod = 6 | 12;
