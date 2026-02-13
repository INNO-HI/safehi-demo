# Data Model: 관리자 대시보드 상세 페이지

**Feature Branch**: `002-admin-dashboard`
**Date**: 2026-01-12
**Source**: spec-detail-pages.md Key Entities

## Entity Definitions

### 1. CareLogDetail (돌봄 일지 상세)

돌봄 일지 상세 페이지의 전체 데이터

```typescript
type CareLogStatus = 'pending' | 'urgent' | 'approved' | 'rejected';
type VisitType = 'visit' | 'call';

interface CareLogDetail {
  id: string;                    // 고유 ID
  recipientId: string;           // 대상자 ID
  recipientName: string;         // 대상자명
  status: CareLogStatus;         // 상태
  createdAt: Date;               // 작성일시

  // 방문 정보
  visitInfo: {
    visitDate: Date;             // 방문 일시
    visitType: VisitType;        // 방문 유형 (방문/전화)
    managerName: string;         // 담당 매니저명
    centerName: string;          // 소속 센터명
  };

  // 돌봄 내용
  careContent: {
    healthStatus: CareCondition;   // 건강 상태
    mealStatus: CareCondition;     // 식사 상태
    emotionalStatus: CareCondition;// 정서 상태
    livingEnvironment: CareCondition; // 생활 환경
  };

  // 특이사항
  notes: string;                 // 담당자 메모/특이사항

  // 첨부 사진
  photos: string[];              // 사진 URL 배열

  // 반려 정보 (반려 시에만)
  rejectionReason?: string;      // 반려 사유
  rejectedAt?: Date;             // 반려 일시
  rejectedBy?: string;           // 반려자명
}

interface CareCondition {
  status: 'good' | 'normal' | 'warning' | 'bad';  // 상태 레벨
  label: string;                 // 상태 레이블 (예: 양호, 보통, 주의 필요)
  description?: string;          // 상세 설명 (선택)
}

// 상태별 레이블
const careConditionLabels: Record<CareCondition['status'], string> = {
  good: '양호',
  normal: '보통',
  warning: '주의 필요',
  bad: '위험',
};
```

**상태 전이 규칙**:
- `pending` → `approved` (승인)
- `pending` → `rejected` (반려 + 사유 입력)
- `urgent` → `approved` (긴급 승인)
- `urgent` → `rejected` (긴급 반려 + 사유 입력)
- `approved`, `rejected`는 최종 상태

---

### 2. RecipientDetail (대상자 상세)

대상자 상세 페이지의 전체 데이터

```typescript
type RecipientStatus = 'normal' | 'caution' | 'urgent' | 'unvisited';
type Gender = 'male' | 'female';

interface RecipientDetail {
  id: string;                    // 고유 ID
  name: string;                  // 이름
  age: number;                   // 나이
  gender: Gender;                // 성별
  status: RecipientStatus;       // 상태

  // 기본 정보
  basicInfo: {
    address: string;             // 전체 주소
    dong: string;                // 동
    phone: string;               // 연락처
    emergencyContact: {          // 비상 연락처
      name: string;
      relationship: string;      // 관계 (예: 아들, 딸, 보호자)
      phone: string;
    };
  };

  // 담당 매니저 정보
  manager: {
    id: string;
    name: string;
    phone: string;
    centerName: string;          // 소속 센터
  };

  // 건강 정보
  healthInfo: {
    diseases: string[];          // 주요 질환 목록
    medications: string[];       // 복용 약물 목록
    notes: string;               // 건강 특이사항
  };

  // 최근 방문 요약 (최근 3건)
  recentVisits: VisitSummary[];
}

interface VisitSummary {
  id: string;                    // 방문 기록 ID
  careLogId: string;             // 돌봄 일지 ID
  visitDate: Date;               // 방문 일시
  visitType: VisitType;          // 방문 유형
  managerName: string;           // 담당자명
  summary: string;               // 간략 요약
}
```

---

### 3. Memo (담당자 메모)

대상자에 대한 담당자 메모

```typescript
interface Memo {
  id: string;                    // 고유 ID
  recipientId: string;           // 대상자 ID
  authorId: string;              // 작성자 ID
  authorName: string;            // 작성자명
  content: string;               // 메모 내용
  createdAt: Date;               // 작성일시
}

// 메모 작성 요청
interface CreateMemoRequest {
  recipientId: string;
  content: string;
}

// 메모 목록 응답
interface MemosResponse {
  memos: Memo[];
  totalCount: number;
}
```

---

### 4. Visit (방문 기록)

대상자의 전체 방문 기록

```typescript
interface Visit {
  id: string;                    // 방문 기록 ID
  recipientId: string;           // 대상자 ID
  careLogId: string;             // 관련 돌봄 일지 ID
  visitDate: Date;               // 방문 일시
  visitType: VisitType;          // 방문 유형
  managerName: string;           // 담당자명
  summary: string;               // 간략 요약
}

// 방문 기록 필터
interface VisitFilters {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

// 방문 기록 목록 응답
interface VisitsResponse {
  visits: Visit[];
  totalCount: number;
}
```

---

### 5. Policy (복지 정책 추천)

AI 추천 복지 정책

```typescript
interface Policy {
  id: string;                    // 정책 ID
  name: string;                  // 정책명
  summary: string;               // 지원 내용 요약
  matchScore: number;            // 적합도 (0-100%)
  applicationMethod: string;     // 신청 방법

  // 상세 정보 (아코디언 펼침 시)
  details: {
    description: string;         // 상세 설명
    eligibility: string[];       // 자격 요건 목록
    benefits: string[];          // 혜택 목록
    documents: string[];         // 필요 서류 목록
    contactInfo: string;         // 문의처
  };
}

// 정책 추천 응답
interface PolicyRecommendationsResponse {
  recipientId: string;
  recommendations: Policy[];
  generatedAt: Date;             // 추천 생성 시간
}
```

---

### 6. ApprovalAction (승인/반려 액션)

돌봄 일지 승인/반려 처리

```typescript
// 승인 요청
interface ApproveRequest {
  careLogId: string;
}

// 반려 요청
interface RejectRequest {
  careLogId: string;
  reason: string;                // 반려 사유 (필수)
}

// 처리 응답
interface ApprovalResponse {
  success: boolean;
  careLogId: string;
  newStatus: CareLogStatus;
  processedAt: Date;
  processedBy: string;
}
```

---

## Entity Relationships

```text
┌─────────────────────┐
│  RecipientDetail    │
│  (대상자 상세)       │
└─────────────────────┘
         │
         │ 1:N
         ├────────────────────────────────────┐
         │                                    │
         ▼                                    ▼
┌─────────────────────┐            ┌─────────────────────┐
│      Memo           │            │      Visit          │
│  (담당자 메모)       │            │   (방문 기록)        │
└─────────────────────┘            └─────────────────────┘
                                             │
                                             │ careLogId 참조
                                             ▼
                                   ┌─────────────────────┐
                                   │   CareLogDetail     │
                                   │   (돌봄 일지 상세)   │
                                   └─────────────────────┘

┌─────────────────────┐
│      Policy         │
│  (복지 정책)         │◄─── AI 추천 알고리즘
└─────────────────────┘
         │
         │ 추천 관계
         ▼
┌─────────────────────┐
│  RecipientDetail    │
└─────────────────────┘
```

---

## Validation Rules

### CareLogDetail
- `id`: UUID 형식
- `recipientName`: 1~50자
- `notes`: 최대 2000자
- `photos`: 최대 10장, 각 URL 유효성 검증
- `rejectionReason`: 반려 시 필수, 10~500자

### Memo
- `id`: UUID 형식
- `content`: 1~1000자
- `authorName`: 1~50자

### Visit
- `id`: UUID 형식
- `visitDate`: 유효한 날짜
- `summary`: 1~500자

### Policy
- `id`: UUID 형식
- `name`: 1~100자
- `matchScore`: 0~100 정수
- `summary`: 1~300자

---

## State Management

### 상세 페이지 훅 구조

```typescript
// hooks/useCareLogDetail.ts
interface UseCareLogDetailReturn {
  data: CareLogDetail | null;
  isLoading: boolean;
  error: Error | null;
  approve: () => Promise<void>;
  reject: (reason: string) => Promise<void>;
}

// hooks/useRecipientDetail.ts
interface UseRecipientDetailReturn {
  data: RecipientDetail | null;
  isLoading: boolean;
  error: Error | null;
}

// hooks/useMemos.ts
interface UseMemosReturn {
  memos: Memo[];
  isLoading: boolean;
  error: Error | null;
  addMemo: (content: string) => Promise<void>;
  isAdding: boolean;
}

// hooks/useVisits.ts
interface UseVisitsReturn {
  visits: Visit[];
  isLoading: boolean;
  error: Error | null;
  filters: VisitFilters;
  setDateRange: (start: Date | null, end: Date | null) => void;
}

// hooks/usePolicies.ts
interface UsePoliciesReturn {
  policies: Policy[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
  generatedAt: Date | null;
}
```

---

## Mock Data Structure

### Mock 데이터 파일 구조

```text
src/lib/mock-data/
├── care-logs.ts          # 기존 목록용
├── care-log-details.ts   # 상세 데이터 (신규)
├── recipients.ts         # 기존 목록용
├── recipient-details.ts  # 상세 데이터 (신규)
├── memos.ts              # 담당자 메모 (신규)
├── visits.ts             # 방문 기록 (신규)
└── policies.ts           # 복지 정책 (신규)
```

### ID 연결 규칙
- CareLog.id와 CareLogDetail.id 동일
- Recipient.id와 RecipientDetail.id 동일
- Visit.careLogId는 CareLogDetail.id 참조
- Memo.recipientId는 RecipientDetail.id 참조
