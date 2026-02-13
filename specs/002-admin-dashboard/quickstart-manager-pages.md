# Quickstart: 매니저 관리 페이지

**Feature Branch**: `002-admin-dashboard`
**Date**: 2026-01-14

## 개요

매니저 관리 기능은 4개의 페이지로 구성됩니다:
1. **매니저 목록** (`/managers`) - 전체 매니저 조회/필터링
2. **매니저 상세** (`/managers/[id]`) - 개별 매니저 정보
3. **보고서 전체** (`/managers/[id]/reports`) - 매니저별 보고서 목록
4. **방문 기록 전체** (`/managers/[id]/visits`) - 매니저별 방문 기록

## 빠른 시작

### 1. 타입 정의 추가

`src/types/dashboard.ts`에 매니저 관련 타입 추가:

```typescript
// 매니저 상태
export type ManagerStatus = 'active' | 'leave' | 'retired';
export type ManagerVisitType = 'regular' | 'emergency' | 'call';

// 매니저 데이터
export interface Manager { ... }
export interface ManagerDetail extends Manager { ... }
export interface ManagerReport { ... }
export interface ManagerVisit { ... }
export interface ManagerFilters { ... }
```

### 2. Mock 데이터 생성

`src/lib/mock-data/managers.ts` 생성:

```typescript
// 매니저 목록 데이터
export const mockManagers: Manager[] = [...];

// KPI 데이터
export const managerKPIs = { total: 23, active: 18, leave: 3, retired: 2 };

// 조회 함수들
export function getManagers(filters: ManagerFilters): Promise<...>;
export function getManagerDetail(id: string): Promise<...>;
export function getManagerReports(managerId: string, filters: ...): Promise<...>;
export function getManagerVisits(managerId: string, filters: ...): Promise<...>;
```

### 3. 커스텀 훅 생성

```typescript
// src/hooks/useManagers.ts
export function useManagers(options?: UseManagersOptions): UseManagersReturn;

// src/hooks/useManagerDetail.ts
export function useManagerDetail(id: string): UseManagerDetailReturn;
```

### 4. 페이지 컴포넌트 생성

```text
src/app/(admin)/managers/
├── page.tsx                    # 목록 페이지
└── [id]/
    ├── page.tsx                # 상세 페이지
    ├── loading.tsx             # 로딩 스켈레톤
    ├── reports/page.tsx        # 보고서 전체
    └── visits/page.tsx         # 방문 기록 전체
```

## 재사용 패턴

### 목록 페이지 패턴 (recipients/page.tsx 참고)

```tsx
export default function ManagersPage() {
  const {
    managers,
    filters,
    setStatus,
    setSearch,
    // ...페이지네이션, 내보내기
  } = useManagers();

  return (
    <div className="p-6 space-y-6">
      {/* KPI 카드 */}
      {/* 필터/검색 */}
      {/* ManagerTable */}
      {/* 페이지네이션 */}
    </div>
  );
}
```

### 상세 페이지 패턴 (recipients/[id]/page.tsx 참고)

```tsx
export default function ManagerDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading, error } = useManagerDetail(params.id);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 (뒤로가기 + 제목) */}
      {/* 2컬럼 레이아웃 */}
      {/* 좌측: 프로필, 업무 통계 */}
      {/* 우측: 최근 보고서, 최근 방문 기록 */}
    </div>
  );
}
```

## 주요 컴포넌트

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| ManagerTable | components/features/dashboard/ | 매니저 테이블 (RecipientTable 패턴) |
| ManagerDetailSkeleton | components/features/dashboard/ | 상세 로딩 스켈레톤 |

## 아바타 색상 규칙

성별 기반 아바타 색상 (기존 규칙 유지):
- 여성: `bg-pink-100 text-pink-700`
- 남성: `bg-blue-100 text-blue-700`

## 접근성 체크리스트

- [ ] 최소 글자 크기 12px, 본문 14px 이상
- [ ] 클릭/터치 영역 최소 44x44px
- [ ] 텍스트 대비율 WCAG AA (4.5:1)
- [ ] 테이블 행 호버/포커스 상태 명확

## 테스트 시나리오

1. **목록 페이지**
   - KPI 카드 표시 확인
   - 상태 탭 필터링 동작
   - 검색/드롭다운 필터링
   - 행 클릭 → 상세 페이지 이동
   - Excel 내보내기

2. **상세 페이지**
   - 프로필 정보 표시
   - 업무 통계 표시
   - 최근 보고서 5건 표시
   - 최근 방문 기록 5건 표시
   - "전체보기" 버튼 동작

3. **보고서/방문 기록 전체**
   - 테이블 표시
   - 필터링 동작
   - 행 클릭 → 상세 페이지 이동
   - 뒤로가기 → 매니저 상세로 복귀
