# Data Model: 통계/리포트 페이지

**Feature**: 004-statistics-report
**Date**: 2026-02-16
**Status**: Complete

## Overview

통계/리포트 페이지에서 사용되는 데이터 엔티티, 관계, 유효성 검사 규칙을 정의합니다.

---

## Entities

### 1. StatisticsKPI

KPI 카드에 표시되는 핵심 성과 지표 데이터.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| totalRecipients | number | 전체 대상자 수 | >= 0 |
| monthlyVisits | number | 이번 달 총 방문 횟수 | >= 0 |
| processedReports | number | 처리된 보고서 건수 | >= 0 |
| emergencyCases | number | 긴급 케이스 수 | >= 0 |
| activeManagers | number | 활동 중인 매니저 수 | >= 0 |

**TypeScript Interface**:
```typescript
interface StatisticsKPI {
  totalRecipients: number;
  monthlyVisits: number;
  processedReports: number;
  emergencyCases: number;
  activeManagers: number;
}
```

---

### 2. MonthlyVisitTrend

월별 방문 추이 차트 데이터.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| month | string | 연월 (YYYY-MM 형식) | ISO 8601 연월 |
| label | string | 표시 레이블 (예: "1월") | 1-12월 |
| visits | number | 해당 월 방문 횟수 | >= 0 |

**TypeScript Interface**:
```typescript
interface MonthlyVisitTrend {
  month: string;      // "2025-01"
  label: string;      // "1월"
  visits: number;
}
```

---

### 3. ReportStatusDistribution

보고서 처리 현황 도넛 차트 데이터.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| approved | number | 승인된 보고서 수 | >= 0 |
| pending | number | 대기 중 보고서 수 | >= 0 |
| urgent | number | 긴급 보고서 수 | >= 0 |
| rejected | number | 반려된 보고서 수 | >= 0 |
| total | number | 전체 보고서 수 (계산값) | sum of all |

**TypeScript Interface**:
```typescript
interface ReportStatusDistribution {
  approved: number;
  pending: number;
  urgent: number;
  rejected: number;
  total: number;
}

// 도넛 차트용 변환 타입
interface ReportStatusChartData {
  name: string;       // "승인", "대기", "긴급", "반려"
  value: number;
  color: string;      // "#3D8B6E", "#C4940A", "#C45A5A", "#64748B"
  percentage: number; // 0-100
}
```

---

### 4. DistrictVisit

동별 방문 현황 데이터.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| district | string | 동 이름 | 비어있지 않음 |
| visits | number | 방문 횟수 | >= 0 |
| rank | number | 순위 (내림차순) | >= 1 |

**TypeScript Interface**:
```typescript
interface DistrictVisit {
  district: string;   // "목동 5동"
  visits: number;     // 324
  rank: number;       // 1
}
```

---

### 5. ManagerRanking

매니저 활동 순위 테이블 데이터.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | 매니저 고유 ID | UUID |
| rank | number | 순위 | >= 1 |
| name | string | 매니저 이름 | 비어있지 않음 |
| initials | string | 이니셜 (아바타용) | 1-2 글자 |
| avatarColor | string | 아바타 배경색 | HEX 색상 |
| visits | number | 방문 횟수 | >= 0 |
| reports | number | 보고서 건수 | >= 0 |
| approvalRate | number | 승인률 (%) | 0-100 |

**TypeScript Interface**:
```typescript
interface ManagerRanking {
  id: string;
  rank: number;
  name: string;
  initials: string;     // "이영" (성+이름 첫 글자)
  avatarColor: string;  // "#FCD34D" (금), "#D1D5DB" (은), "#F59E0B" (동)
  visits: number;
  reports: number;
  approvalRate: number;
}
```

---

### 6. RecipientStatusDistribution

대상자 상태 분포 데이터.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| normal | number | 정상 상태 인원 | >= 0 |
| caution | number | 주의 상태 인원 | >= 0 |
| urgent | number | 긴급 상태 인원 | >= 0 |
| unvisited | number | 미방문 인원 | >= 0 |
| total | number | 전체 인원 (계산값) | sum of all |
| trends | TrendData | 전월 대비 변화 | - |

**TypeScript Interface**:
```typescript
interface RecipientStatusDistribution {
  normal: number;
  caution: number;
  urgent: number;
  unvisited: number;
  total: number;
  trends: RecipientTrends;
}

interface RecipientTrends {
  normalChange: number;   // +24 (양수: 증가, 음수: 감소)
  cautionChange: number;
  urgentChange: number;
  unvisitedChange: number;
}

// 상태별 표시용 타입
interface RecipientStatusCard {
  status: 'normal' | 'caution' | 'urgent' | 'unvisited';
  label: string;        // "정상", "주의", "긴급", "미방문"
  count: number;
  percentage: number;   // 0-100
  color: string;        // 상태별 색상
  change?: number;      // 전월 대비 변화
}
```

---

### 7. ReportTemplate

빠른 리포트 생성 템플릿 데이터.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | 템플릿 고유 ID | enum |
| type | ReportType | 리포트 유형 | enum |
| title | string | 템플릿 제목 | 비어있지 않음 |
| description | string | 템플릿 설명 | - |
| icon | string | 아이콘 이모지 | - |
| iconBgColor | string | 아이콘 배경색 | HEX 색상 |

**TypeScript Interface**:
```typescript
type ReportType = 'monthly' | 'manager' | 'recipient' | 'emergency';

interface ReportTemplate {
  id: string;
  type: ReportType;
  title: string;           // "월간 종합 리포트"
  description: string;     // "방문, 보고서, 대상자 현황"
  icon: string;            // "📊"
  iconBgColor: string;     // "#2E6AB3"
}

// 기본 템플릿 정의
const REPORT_TEMPLATES: ReportTemplate[] = [
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
```

---

### 8. StatisticsFilter

기간 선택 필터 데이터.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| selectedMonth | string | 선택된 연월 | YYYY-MM 형식 |
| availableMonths | MonthOption[] | 선택 가능한 월 목록 | - |

**TypeScript Interface**:
```typescript
interface MonthOption {
  value: string;        // "2025-01"
  label: string;        // "2025년 1월"
}

interface StatisticsFilter {
  selectedMonth: string;
  availableMonths: MonthOption[];
}

// 최근 12개월 생성 헬퍼
function generateAvailableMonths(): MonthOption[] {
  const months: MonthOption[] = [];
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
```

---

## Entity Relationships

```text
StatisticsFilter (1) ─────────> (*) All Statistics Data
       │
       │ selectedMonth 변경 시 모든 데이터 재조회
       ▼
┌─────────────────────────────────────────────────────┐
│                    Statistics API                    │
│                                                      │
│  ┌─────────────┐  ┌─────────────────────────────┐  │
│  │ StatisticsKPI│  │ MonthlyVisitTrend[]        │  │
│  └─────────────┘  └─────────────────────────────┘  │
│                                                      │
│  ┌───────────────────┐  ┌─────────────────────┐    │
│  │ReportStatusDist.  │  │ DistrictVisit[]     │    │
│  └───────────────────┘  └─────────────────────┘    │
│                                                      │
│  ┌─────────────────┐  ┌───────────────────────┐    │
│  │ManagerRanking[] │  │RecipientStatusDist.   │    │
│  └─────────────────┘  └───────────────────────┘    │
└─────────────────────────────────────────────────────┘

ReportTemplate (static) ──> ReportGenerator ──> PDF Output
```

---

## State Transitions

### 1. 기간 선택 상태

```text
[초기 상태]
    │
    │ 페이지 로드
    ▼
[현재 월 선택됨] ──────> [데이터 로딩 중] ──────> [데이터 표시됨]
    │                          │
    │ 다른 월 선택              │ 로딩 실패
    ▼                          ▼
[새로운 월 선택됨] ────> [데이터 로딩 중] ──────> [에러 상태]
                                                    │
                                                    │ 재시도
                                                    ▼
                                            [데이터 로딩 중]
```

### 2. PDF 생성 상태

```text
[대기 상태]
    │
    │ "리포트 생성" 클릭
    ▼
[생성 중] ────────────> [생성 완료] ──────> [다운로드 완료] ──> [대기 상태]
    │
    │ 생성 실패
    ▼
[에러 상태] ──────────> [재시도] ──────────> [생성 중]
```

---

## Validation Rules

### Zod Schemas

```typescript
import { z } from 'zod';

// KPI 데이터 스키마
export const statisticsKPISchema = z.object({
  totalRecipients: z.number().min(0),
  monthlyVisits: z.number().min(0),
  processedReports: z.number().min(0),
  emergencyCases: z.number().min(0),
  activeManagers: z.number().min(0),
});

// 월별 방문 추이 스키마
export const monthlyVisitTrendSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  label: z.string().min(1),
  visits: z.number().min(0),
});

// 보고서 상태 분포 스키마
export const reportStatusDistributionSchema = z.object({
  approved: z.number().min(0),
  pending: z.number().min(0),
  urgent: z.number().min(0),
  rejected: z.number().min(0),
  total: z.number().min(0),
});

// 동별 방문 스키마
export const districtVisitSchema = z.object({
  district: z.string().min(1),
  visits: z.number().min(0),
  rank: z.number().min(1),
});

// 매니저 순위 스키마
export const managerRankingSchema = z.object({
  id: z.string().uuid(),
  rank: z.number().min(1),
  name: z.string().min(1),
  initials: z.string().min(1).max(2),
  avatarColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  visits: z.number().min(0),
  reports: z.number().min(0),
  approvalRate: z.number().min(0).max(100),
});

// 대상자 상태 분포 스키마
export const recipientStatusDistributionSchema = z.object({
  normal: z.number().min(0),
  caution: z.number().min(0),
  urgent: z.number().min(0),
  unvisited: z.number().min(0),
  total: z.number().min(0),
  trends: z.object({
    normalChange: z.number(),
    cautionChange: z.number(),
    urgentChange: z.number(),
    unvisitedChange: z.number(),
  }),
});

// 월 선택 옵션 스키마
export const monthOptionSchema = z.object({
  value: z.string().regex(/^\d{4}-\d{2}$/),
  label: z.string().min(1),
});

// API 응답 래퍼 스키마
export const statisticsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    kpi: statisticsKPISchema,
    visitTrend: z.array(monthlyVisitTrendSchema),
    reportStatus: reportStatusDistributionSchema,
    districtVisits: z.array(districtVisitSchema),
    managerRanking: z.array(managerRankingSchema),
    recipientStatus: recipientStatusDistributionSchema,
  }).optional(),
  error: z.string().optional(),
});
```

---

## Constants

```typescript
// 상태별 색상
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
```

---

## File Locations

| Entity | Location |
|--------|----------|
| TypeScript Types | `src/types/statistics.ts` |
| Zod Schemas | `src/lib/validations/statistics.ts` |
| Constants | `src/lib/constants/statistics.ts` |
| Mock Data | `src/lib/mock-data/statistics.ts` |
