// 통계/리포트 페이지 Zod 유효성 검사 스키마

import { z } from 'zod';

// KPI 데이터 스키마
export const statisticsKPISchema = z.object({
  totalRecipients: z.number().min(0, '0 이상이어야 합니다'),
  monthlyVisits: z.number().min(0, '0 이상이어야 합니다'),
  processedReports: z.number().min(0, '0 이상이어야 합니다'),
  emergencyCases: z.number().min(0, '0 이상이어야 합니다'),
  activeManagers: z.number().min(0, '0 이상이어야 합니다'),
});

// 월별 방문 추이 스키마
export const monthlyVisitTrendSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, '올바른 연월 형식이 아닙니다 (YYYY-MM)'),
  label: z.string().min(1, '레이블은 필수입니다'),
  visits: z.number().min(0, '0 이상이어야 합니다'),
});

// 보고서 상태 분포 스키마
export const reportStatusDistributionSchema = z.object({
  approved: z.number().min(0, '0 이상이어야 합니다'),
  pending: z.number().min(0, '0 이상이어야 합니다'),
  urgent: z.number().min(0, '0 이상이어야 합니다'),
  rejected: z.number().min(0, '0 이상이어야 합니다'),
  total: z.number().min(0, '0 이상이어야 합니다'),
});

// 도넛 차트용 데이터 스키마
export const reportStatusChartDataSchema = z.object({
  name: z.string().min(1),
  value: z.number().min(0),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '올바른 HEX 색상 형식이 아닙니다'),
  percentage: z.number().min(0).max(100),
});

// 동별 방문 스키마
export const districtVisitSchema = z.object({
  district: z.string().min(1, '동 이름은 필수입니다'),
  visits: z.number().min(0, '0 이상이어야 합니다'),
  rank: z.number().min(1, '순위는 1 이상이어야 합니다'),
});

// 매니저 순위 스키마
export const managerRankingSchema = z.object({
  id: z.string().uuid('올바른 UUID 형식이 아닙니다'),
  rank: z.number().min(1, '순위는 1 이상이어야 합니다'),
  name: z.string().min(1, '이름은 필수입니다'),
  initials: z.string().min(1).max(2, '이니셜은 1-2글자여야 합니다'),
  avatarColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '올바른 HEX 색상 형식이 아닙니다'),
  visits: z.number().min(0, '0 이상이어야 합니다'),
  reports: z.number().min(0, '0 이상이어야 합니다'),
  approvalRate: z.number().min(0).max(100, '승인률은 0-100% 사이여야 합니다'),
});

// 대상자 트렌드 스키마
export const recipientTrendsSchema = z.object({
  normalChange: z.number(),
  cautionChange: z.number(),
  urgentChange: z.number(),
  unvisitedChange: z.number(),
});

// 대상자 상태 분포 스키마
export const recipientStatusDistributionSchema = z.object({
  normal: z.number().min(0, '0 이상이어야 합니다'),
  caution: z.number().min(0, '0 이상이어야 합니다'),
  urgent: z.number().min(0, '0 이상이어야 합니다'),
  unvisited: z.number().min(0, '0 이상이어야 합니다'),
  total: z.number().min(0, '0 이상이어야 합니다'),
  trends: recipientTrendsSchema,
});

// 상태별 카드 표시용 스키마
export const recipientStatusCardSchema = z.object({
  status: z.enum(['normal', 'caution', 'urgent', 'unvisited']),
  label: z.string().min(1),
  count: z.number().min(0),
  percentage: z.number().min(0).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  change: z.number().optional(),
});

// 리포트 타입 스키마
export const reportTypeSchema = z.enum(['monthly', 'manager', 'recipient', 'emergency']);

// 리포트 템플릿 스키마
export const reportTemplateSchema = z.object({
  id: z.string().min(1),
  type: reportTypeSchema,
  title: z.string().min(1, '제목은 필수입니다'),
  description: z.string(),
  icon: z.string().min(1),
  iconBgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

// 월 선택 옵션 스키마
export const monthOptionSchema = z.object({
  value: z.string().regex(/^\d{4}-\d{2}$/, '올바른 연월 형식이 아닙니다 (YYYY-MM)'),
  label: z.string().min(1),
});

// 필터 스키마
export const statisticsFilterSchema = z.object({
  selectedMonth: z.string().regex(/^\d{4}-\d{2}$/),
  availableMonths: z.array(monthOptionSchema),
});

// 전체 통계 개요 스키마
export const statisticsOverviewSchema = z.object({
  kpi: statisticsKPISchema,
  visitTrend: z.array(monthlyVisitTrendSchema),
  reportStatus: reportStatusDistributionSchema,
  districtVisits: z.array(districtVisitSchema),
  managerRanking: z.array(managerRankingSchema),
  recipientStatus: recipientStatusDistributionSchema,
});

// API 응답 스키마
export const statisticsResponseSchema = z.object({
  success: z.boolean(),
  data: statisticsOverviewSchema.optional(),
  error: z.string().optional(),
});

// 차트 기간 타입 스키마
export const trendPeriodSchema = z.union([z.literal(6), z.literal(12)]);

// 타입 추론
export type StatisticsKPIInput = z.input<typeof statisticsKPISchema>;
export type MonthlyVisitTrendInput = z.input<typeof monthlyVisitTrendSchema>;
export type ReportStatusDistributionInput = z.input<typeof reportStatusDistributionSchema>;
export type DistrictVisitInput = z.input<typeof districtVisitSchema>;
export type ManagerRankingInput = z.input<typeof managerRankingSchema>;
export type RecipientStatusDistributionInput = z.input<typeof recipientStatusDistributionSchema>;
export type ReportTemplateInput = z.input<typeof reportTemplateSchema>;
export type MonthOptionInput = z.input<typeof monthOptionSchema>;
export type StatisticsFilterInput = z.input<typeof statisticsFilterSchema>;
export type StatisticsOverviewInput = z.input<typeof statisticsOverviewSchema>;
export type StatisticsResponseInput = z.input<typeof statisticsResponseSchema>;
export type TrendPeriodInput = z.input<typeof trendPeriodSchema>;
