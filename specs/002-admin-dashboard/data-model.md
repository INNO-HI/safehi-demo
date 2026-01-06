# Data Model: 관리자 대시보드

**Feature Branch**: `002-admin-dashboard`
**Date**: 2026-01-07
**Source**: spec.md Key Entities

## Entity Definitions

### 1. DashboardKPI

대시보드 홈의 KPI 카드 데이터

```typescript
interface DashboardKPI {
  todayVisits: KPICard;        // 오늘 방문
  pendingReports: KPICard;     // 대기중 보고서
  approvedCount: KPICard;      // 승인 완료
  totalRecipients: KPICard;    // 담당 대상자
}

interface KPICard {
  title: string;               // 카드 제목
  value: number;               // 현재 값
  change: number;              // 증감 값 (+3, -2 등)
  changeDirection: 'up' | 'down' | 'none';  // 증감 방향
  progressColor: 'blue' | 'yellow' | 'purple' | 'green';  // 프로그레스 바 색상
  progressPercent?: number;    // 프로그레스 바 퍼센트 (선택)
}
```

---

### 2. CareLog (돌봄 일지/보고서)

돌봄 일지 목록의 보고서 데이터

```typescript
type CareLogStatus = 'pending' | 'urgent' | 'approved' | 'rejected';

interface CareLog {
  id: string;                  // 고유 ID
  recipientName: string;       // 대상자명
  managerName: string;         // 담당 종사자명
  centerName: string;          // 소속 센터명
  visitDate: Date;             // 방문 일시
  registeredAt: Date;          // 등록 시간
  status: CareLogStatus;       // 상태
}

// 상태별 한글 레이블
const careLogStatusLabels: Record<CareLogStatus, string> = {
  pending: '대기',
  urgent: '긴급',
  approved: '승인',
  rejected: '반려',
};
```

**상태 전이 규칙**:
- `pending` → `approved` (승인 처리)
- `pending` → `rejected` (반려 처리)
- `urgent` → `approved` (긴급 승인)
- `urgent` → `rejected` (긴급 반려)
- `approved`, `rejected`는 최종 상태 (변경 불가)

---

### 3. Recipient (돌봄 대상자)

대상자 관리 목록의 대상자 데이터

```typescript
type RecipientStatus = 'normal' | 'caution' | 'urgent' | 'unvisited';
type Gender = 'male' | 'female';

interface Recipient {
  id: string;                  // 고유 ID
  name: string;                // 이름
  age: number;                 // 나이 (만 나이)
  gender: Gender;              // 성별
  dong: string;                // 동 (예: 목동 5동)
  address: string;             // 상세 주소 (예: 목동아파트 103동)
  managerName: string;         // 담당 매니저명
  lastVisitDate: Date | null;  // 최근 방문일 (null이면 미방문)
  visitCount: number;          // 월별 방문 횟수
  status: RecipientStatus;     // 상태
}

// 상태별 한글 레이블
const recipientStatusLabels: Record<RecipientStatus, string> = {
  normal: '정상',
  caution: '주의',
  urgent: '긴급',
  unvisited: '미방문',
};
```

**상태 결정 로직**:
- `urgent`: 긴급 케이스로 표시된 대상자
- `caution`: 주의가 필요한 대상자 (건강 이상 징후 등)
- `unvisited`: 7일 이상 방문 기록 없음
- `normal`: 정상적으로 돌봄 서비스 제공 중

---

### 4. Notification (알림)

대시보드 홈의 알림 데이터

```typescript
interface Notification {
  id: string;                  // 고유 ID
  title: string;               // 알림 제목
  content: string;             // 알림 내용
  createdAt: Date;             // 생성 시간
  isUrgent: boolean;           // 긴급 여부
  link?: string;               // 클릭 시 이동 URL (선택)
  icon?: 'warning' | 'info' | 'success' | 'report';  // 아이콘 타입
}
```

---

### 5. RecentReport (최근 보고서)

대시보드 홈의 최근 보고서 요약 데이터

```typescript
interface RecentReport {
  id: string;                  // 보고서 ID (CareLog.id와 동일)
  recipientName: string;       // 대상자명
  managerName: string;         // 담당자명
  registeredAt: Date;          // 등록 시간
  status: CareLogStatus;       // 상태
  isUrgent: boolean;           // 긴급 여부 (status === 'urgent')
}
```

---

### 6. SidebarUser (사이드바 사용자 정보)

사이드바에 표시되는 현재 사용자 정보

```typescript
interface SidebarUser {
  name: string;                // 사용자 이름 (예: 김담당)
  organizationName: string;    // 소속 기관명 (예: 양천구청)
  role: 'admin' | 'manager';   // 역할
  roleLabel: string;           // 역할 레이블 (예: 구/군 관리자)
  jurisdiction: {              // 관할 구역
    region: string;            // 지역명 (예: 서울특별시 양천구)
    dongCount: number;         // 동 개수 (예: 18)
    centerCount: number;       // 센터 개수 (예: 12)
  };
}
```

---

### 7. FilterState (필터 상태)

목록 페이지의 필터 상태

```typescript
// 돌봄 일지 필터
interface CareLogFilters {
  status: CareLogStatus | 'all';   // 상태 탭
  search: string;                   // 검색어 (대상자, 종사자, 센터)
  dateRange: {                      // 날짜 범위
    start: Date | null;
    end: Date | null;
  };
  dong: string | 'all';             // 동 필터
}

// 대상자 필터
interface RecipientFilters {
  status: RecipientStatus | 'all'; // 상태 탭
  search: string;                   // 검색어 (이름, 주소)
  dong: string | 'all';             // 동 필터
  manager: string | 'all';          // 담당 매니저 필터
}
```

---

### 8. PaginationState (페이지네이션 상태)

목록 페이지의 페이지네이션 상태

```typescript
interface PaginationState {
  currentPage: number;         // 현재 페이지 (1부터 시작)
  pageSize: number;            // 페이지당 항목 수 (기본: 10)
  totalItems: number;          // 전체 항목 수
  totalPages: number;          // 전체 페이지 수
}

// 페이지당 옵션
const pageSizeOptions = [10, 20, 50, 100];
```

---

### 9. SelectionState (선택 상태)

돌봄 일지 목록의 체크박스 선택 상태

```typescript
interface SelectionState {
  selectedIds: Set<string>;    // 선택된 항목 ID 집합
  isAllSelected: boolean;      // 전체 선택 여부 (현재 페이지 기준)
}
```

---

## Entity Relationships

```text
┌─────────────────┐      ┌─────────────────┐
│   DashboardKPI  │      │   SidebarUser   │
│   (대시보드 KPI) │      │  (사용자 정보)   │
└─────────────────┘      └─────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│  RecentReport   │      │    Sidebar      │
│  (최근 보고서)   │◄────│    (레이아웃)    │
└─────────────────┘      └─────────────────┘
         │                        │
         │ id 참조                │
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│    CareLog      │      │  Notification   │
│  (돌봄 일지)     │      │     (알림)      │
└─────────────────┘      └─────────────────┘
         │
         │ recipientName 참조
         ▼
┌─────────────────┐
│   Recipient     │
│   (대상자)       │
└─────────────────┘
```

---

## Validation Rules

### CareLog
- `id`: UUID 형식
- `recipientName`: 1~50자
- `managerName`: 1~50자
- `centerName`: 1~100자
- `visitDate`: 현재 날짜 이전
- `registeredAt`: 자동 생성
- `status`: enum 값만 허용

### Recipient
- `id`: UUID 형식
- `name`: 1~50자
- `age`: 0~150 정수
- `gender`: 'male' | 'female'
- `dong`: 1~50자
- `address`: 1~200자
- `managerName`: 1~50자
- `visitCount`: 0 이상 정수

### Notification
- `id`: UUID 형식
- `title`: 1~100자
- `content`: 1~500자
- `createdAt`: 자동 생성
- `link`: 유효한 URL 형식 (선택)

---

## Excel Export Schema

대상자 내보내기 시 생성되는 Excel 컬럼 구조:

| 컬럼명 | 필드 | 타입 | 예시 |
|--------|------|------|------|
| 대상자 이름 | name | string | 이복동 어르신 |
| 주소 | `${dong} ${address}` | string | 목동 5동 목동아파트 103동 |
| 담당 매니저 | managerName | string | 이영희 |
| 최근 방문 | lastVisitDate (formatted) | string | 2025-01-04 |
| 방문 횟수 | visitCount | number | 24 |
| 상태 | status (label) | string | 긴급 |
