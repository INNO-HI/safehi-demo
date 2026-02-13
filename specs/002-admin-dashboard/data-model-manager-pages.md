# Data Model: 매니저 관리 페이지

**Feature Branch**: `002-admin-dashboard`
**Date**: 2026-01-14
**Source**: spec-manager-pages.md, research-manager-pages.md

## Entity Definitions

### 1. Manager (매니저 목록용)

매니저 목록 페이지의 테이블 데이터

```typescript
/** 매니저 근무 상태 */
type ManagerStatus = 'active' | 'leave' | 'retired';

/** 매니저 데이터 (목록용) */
interface Manager {
  id: string;                    // 고유 ID (mgr-0001 형식)
  name: string;                  // 매니저명
  gender: Gender;                // 성별 (male/female)
  centerName: string;            // 소속 센터명
  phone: string;                 // 연락처
  assignedDongs: string[];       // 담당 동 목록
  recipientCount: number;        // 담당 대상자 수
  monthlyVisits: number;         // 이번 달 방문 횟수
  status: ManagerStatus;         // 근무 상태
}

/** 매니저 상태별 한글 레이블 */
const managerStatusLabels: Record<ManagerStatus, string> = {
  active: '근무 중',
  leave: '휴무',
  retired: '퇴직',
};

/** 매니저 필터 상태 */
interface ManagerFilters {
  status: ManagerStatus | 'all';
  search: string;                // 이름 검색
  dong: string | 'all';          // 담당 동 필터
  center: string | 'all';        // 소속 센터 필터
}
```

---

### 2. ManagerDetail (매니저 상세용)

매니저 상세 페이지의 전체 데이터

```typescript
/** 매니저 상세 데이터 */
interface ManagerDetail extends Manager {
  email: string;                 // 이메일
  startDate: Date;               // 근무 시작일

  // 업무 통계
  stats: {
    monthlyVisits: number;       // 이번 달 방문 횟수
    monthlyReports: number;      // 이번 달 보고서 수
    approvalRate: number;        // 승인률 (0-100)
    totalRecipients: number;     // 담당 대상자 수
  };

  // 최근 활동
  recentReports: ManagerReport[];  // 최근 5건 보고서
  recentVisits: ManagerVisit[];    // 최근 5건 방문 기록
}
```

---

### 3. ManagerReport (매니저 보고서)

매니저가 작성한 보고서 (돌봄 일지)

```typescript
/** 보고서 상태 (CareLogStatus 재사용) */
type ReportStatus = 'pending' | 'approved' | 'rejected';

/** 매니저 보고서 */
interface ManagerReport {
  id: string;                    // 보고서 ID (돌봄 일지 ID)
  recipientId: string;           // 대상자 ID
  recipientName: string;         // 대상자명
  visitDate: Date;               // 방문일
  registeredAt: Date;            // 등록일
  status: ReportStatus;          // 상태
}

/** 보고서 필터 */
interface ManagerReportFilters {
  status: ReportStatus | 'all';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}
```

---

### 4. ManagerVisit (매니저 방문 기록)

매니저의 방문 기록

```typescript
/** 방문 유형 */
type ManagerVisitType = 'regular' | 'emergency' | 'call';

/** 방문 유형별 한글 레이블 */
const managerVisitTypeLabels: Record<ManagerVisitType, string> = {
  regular: '정기 방문',
  emergency: '긴급 방문',
  call: '전화 상담',
};

/** 매니저 방문 기록 */
interface ManagerVisit {
  id: string;                    // 방문 기록 ID
  recipientId: string;           // 대상자 ID
  recipientName: string;         // 대상자명
  visitDate: Date;               // 방문일
  visitType: ManagerVisitType;   // 방문 유형
  result: string;                // 방문 결과 요약
}

/** 방문 기록 필터 */
interface ManagerVisitFilters {
  visitType: ManagerVisitType | 'all';
  search: string;                // 대상자명 검색
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}
```

---

### 5. ManagerExportData (Excel 내보내기)

매니저 목록 Excel 내보내기 데이터

```typescript
/** 매니저 Excel 내보내기 데이터 */
interface ManagerExportData {
  '매니저명': string;
  '소속 센터': string;
  '담당 동': string;
  '담당 대상자 수': number;
  '이번 달 방문': number;
  '상태': string;
}
```

---

## Entity Relationships

```text
┌─────────────────────┐
│   ManagerDetail     │
│   (매니저 상세)      │
└─────────────────────┘
         │
         │ 1:N
         ├────────────────────────────────────┐
         │                                    │
         ▼                                    ▼
┌─────────────────────┐            ┌─────────────────────┐
│   ManagerReport     │            │    ManagerVisit     │
│   (보고서 목록)      │            │   (방문 기록 목록)   │
└─────────────────────┘            └─────────────────────┘
         │                                    │
         │ 참조                                │ 참조
         ▼                                    ▼
┌─────────────────────┐            ┌─────────────────────┐
│   CareLogDetail     │            │   RecipientDetail   │
│   (돌봄 일지 상세)   │            │   (대상자 상세)      │
└─────────────────────┘            └─────────────────────┘
```

---

## Validation Rules

### Manager
- `id`: `mgr-` 접두사 + 4자리 숫자 (예: mgr-0001)
- `name`: 1~20자
- `phone`: 010-XXXX-XXXX 형식
- `assignedDongs`: 최소 1개 이상
- `recipientCount`: 0 이상 정수
- `monthlyVisits`: 0 이상 정수

### ManagerDetail
- `email`: 유효한 이메일 형식
- `startDate`: 유효한 과거 날짜
- `stats.approvalRate`: 0~100 정수

### ManagerReport
- `id`: 기존 CareLog ID와 동일 형식
- `visitDate`: 유효한 날짜
- `registeredAt`: visitDate 이후

### ManagerVisit
- `id`: `visit-` 접두사 + UUID
- `visitDate`: 유효한 날짜
- `result`: 1~200자

---

## State Management

### 훅 구조

```typescript
// hooks/useManagers.ts
interface UseManagersReturn {
  // 데이터
  managers: Manager[];
  allManagers: Manager[];
  totalCount: number;
  statusCounts: Record<ManagerStatus | 'all', number>;
  kpis: ManagerKPIs;

  // 필터
  filters: ManagerFilters;
  setStatus: (status: ManagerStatus | 'all') => void;
  setSearch: (search: string) => void;
  setDong: (dong: string | 'all') => void;
  setCenter: (center: string | 'all') => void;
  resetFilters: () => void;

  // 페이지네이션
  currentPage: number;
  pageSize: PageSize;
  totalPages: number;
  goToPage: (page: number) => void;
  setPageSize: (size: PageSize) => void;

  // 로딩/에러
  isLoading: boolean;
  error: Error | null;

  // 액션
  exportToExcel: () => void;
  refetch: () => void;
}

// hooks/useManagerDetail.ts
interface UseManagerDetailReturn {
  data: ManagerDetail | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

---

## Mock Data Structure

### Mock 데이터 파일

```text
src/lib/mock-data/
└── managers.ts                 # 매니저 Mock 데이터 (신규)
    ├── mockManagers[]          # 목록용 매니저 데이터
    ├── managerKPIs             # KPI 데이터
    ├── getManagers()           # 목록 조회 함수
    ├── getManagerDetail()      # 상세 조회 함수
    ├── getManagerReports()     # 보고서 목록 함수
    ├── getManagerVisits()      # 방문 기록 목록 함수
    ├── managerDongOptions[]    # 담당 동 옵션
    └── centerOptions[]         # 소속 센터 옵션
```

### ID 연결 규칙

- `Manager.id`와 `ManagerDetail.id` 동일
- `ManagerReport.id`는 기존 `CareLog.id` 참조
- `ManagerReport.recipientId`는 `Recipient.id` 참조
- `ManagerVisit.recipientId`는 `Recipient.id` 참조

---

## Types File Update

`src/types/dashboard.ts`에 추가할 타입:

```typescript
// ============================================================
// 매니저(Manager) 관련 타입
// specs/002-admin-dashboard/data-model-manager-pages.md 기반
// ============================================================

/** 매니저 근무 상태 */
export type ManagerStatus = 'active' | 'leave' | 'retired';

/** 매니저 방문 유형 */
export type ManagerVisitType = 'regular' | 'emergency' | 'call';

/** 매니저 데이터 (목록용) */
export interface Manager { ... }

/** 매니저 상세 데이터 */
export interface ManagerDetail extends Manager { ... }

/** 매니저 보고서 */
export interface ManagerReport { ... }

/** 매니저 방문 기록 */
export interface ManagerVisit { ... }

/** 매니저 필터 상태 */
export interface ManagerFilters { ... }

/** 매니저 KPI */
export interface ManagerKPIs { ... }

/** 매니저 Excel 내보내기 데이터 */
export interface ManagerExportData { ... }
```
