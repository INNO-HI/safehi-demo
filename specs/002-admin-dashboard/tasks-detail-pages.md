# Tasks: 관리자 대시보드 상세 페이지

**Input**: Design documents from `/specs/002-admin-dashboard/`
**Prerequisites**: plan-detail-pages.md, spec-detail-pages.md, research-detail-pages.md, data-model-detail-pages.md, contracts/detail-pages-api.yaml

**Tests**: OPTIONAL - 이 기능에서는 테스트가 명시적으로 요청되지 않았으므로 테스트 작업은 포함되지 않습니다.

**Organization**: 작업은 사용자 스토리별로 그룹화되어 각 스토리를 독립적으로 구현하고 테스트할 수 있습니다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 작업이 속한 사용자 스토리 (예: US6, US7, US8)
- 설명에 정확한 파일 경로 포함

## Path Conventions

- **src/**: 소스 코드 루트
- **src/app/(admin)/**: 관리자 페이지
- **src/components/**: 컴포넌트
- **src/hooks/**: 커스텀 훅
- **src/lib/mock-data/**: Mock 데이터
- **src/types/**: 타입 정의

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 프로젝트 초기화 및 기본 구조 설정

- [x] T001 추가 의존성 설치 (yet-another-react-lightbox, @radix-ui/react-dialog, @radix-ui/react-accordion)
- [x] T002 [P] 상세 페이지 타입 정의 추가 in src/types/dashboard.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 사용자 스토리 구현 전에 완료해야 하는 핵심 인프라

**⚠️ CRITICAL**: 이 단계가 완료될 때까지 사용자 스토리 작업을 시작할 수 없습니다

- [x] T003 [P] Skeleton 컴포넌트 생성 in src/components/ui/Skeleton.tsx
- [x] T004 [P] Modal 컴포넌트 생성 (Radix Dialog 기반) in src/components/ui/Modal.tsx
- [x] T005 [P] Accordion 컴포넌트 생성 (Radix Accordion 기반) in src/components/ui/Accordion.tsx
- [x] T006 [P] 돌봄 일지 상세 폴더 구조 생성 src/app/(admin)/care-logs/[id]/
- [x] T007 [P] 대상자 상세 폴더 구조 생성 src/app/(admin)/recipients/[id]/ (memos, visits, policies 포함)
- [x] T008 [P] 돌봄 일지 상세 컴포넌트 폴더 생성 src/components/features/care-log/
- [x] T009 [P] 대상자 상세 컴포넌트 폴더 생성 src/components/features/recipient/

**Checkpoint**: 기반 준비 완료 - 사용자 스토리 구현 시작 가능

---

## Phase 3: User Story 6 - 돌봄 일지 상세 조회 (Priority: P1) 🎯 MVP

**Goal**: 관리자가 돌봄 일지 상세를 조회하고 승인/반려 처리를 수행

**Independent Test**: 돌봄 일지 목록(/care-logs)에서 특정 일지 행을 클릭하면 상세 페이지(/care-logs/[id])로 이동하고, 방문 정보, 돌봄 내용, 특이사항, 사진 등을 확인할 수 있습니다.

### Mock Data & Hook

- [x] T010 [P] [US6] CareLogDetail Mock 데이터 생성 in src/lib/mock-data/care-log-details.ts
- [x] T011 [US6] useCareLogDetail 훅 구현 (approve, reject 포함) in src/hooks/useCareLogDetail.ts

### Components

- [x] T012 [P] [US6] CareLogDetailHeader 컴포넌트 구현 (대상자명, 상태 배지, 작성일시) in src/components/features/care-log/CareLogDetailHeader.tsx
- [x] T013 [P] [US6] VisitInfoCard 컴포넌트 구현 (방문 일시, 유형, 매니저, 센터) in src/components/features/care-log/VisitInfoCard.tsx
- [x] T014 [P] [US6] CareContentCards 컴포넌트 구현 (건강/식사/정서/생활환경) in src/components/features/care-log/CareContentCards.tsx
- [x] T015 [P] [US6] PhotoGrid 컴포넌트 구현 (라이트박스 포함) in src/components/features/care-log/PhotoGrid.tsx
- [x] T016 [US6] RejectModal 컴포넌트 구현 (반려 사유 입력) in src/components/features/care-log/RejectModal.tsx
- [x] T017 [P] [US6] CareLogDetailSkeleton 컴포넌트 구현 in src/components/features/care-log/CareLogDetailSkeleton.tsx

### Page

- [x] T018 [US6] 돌봄 일지 상세 페이지 구현 in src/app/(admin)/care-logs/[id]/page.tsx
- [x] T019 [P] [US6] 돌봄 일지 상세 로딩 UI 구현 in src/app/(admin)/care-logs/[id]/loading.tsx
- [x] T020 [P] [US6] 돌봄 일지 상세 에러 UI 구현 in src/app/(admin)/care-logs/[id]/error.tsx

### Integration

- [x] T021 [US6] 돌봄 일지 목록에서 상세 페이지 링크 연결 in src/app/(admin)/care-logs/page.tsx

**Checkpoint**: 돌봄 일지 상세 조회 및 승인/반려 기능 완료, 독립적으로 테스트 가능

---

## Phase 4: User Story 7 - 대상자 상세 정보 조회 (Priority: P1)

**Goal**: 관리자가 대상자의 기본 정보, 건강 정보, 최근 방문 기록을 조회

**Independent Test**: 대상자 관리 목록(/recipients)에서 특정 대상자 행을 클릭하면 상세 페이지(/recipients/[id])로 이동하고, 기본 정보, 건강 정보, 최근 방문 기록 요약을 확인할 수 있습니다.

### Mock Data & Hook

- [x] T022 [P] [US7] RecipientDetail Mock 데이터 생성 in src/lib/mock-data/recipient-details.ts
- [x] T023 [US7] useRecipientDetail 훅 구현 in src/hooks/useRecipientDetail.ts

### Components

- [x] T024 [P] [US7] RecipientDetailHeader 컴포넌트 구현 (이름, 나이, 성별, 상태, 아바타) in src/components/features/recipient/RecipientDetailHeader.tsx
- [x] T025 [P] [US7] BasicInfoCard 컴포넌트 구현 (주소, 연락처, 비상연락처, 담당자) in src/components/features/recipient/BasicInfoCard.tsx
- [x] T026 [P] [US7] HealthInfoCard 컴포넌트 구현 (질환, 약물, 특이사항) in src/components/features/recipient/HealthInfoCard.tsx
- [x] T027 [P] [US7] RecentVisitsSummary 컴포넌트 구현 (최근 3건) in src/components/features/recipient/RecentVisitsSummary.tsx
- [x] T028 [P] [US7] RecipientDetailSkeleton 컴포넌트 구현 in src/components/features/recipient/RecipientDetailSkeleton.tsx

### Page

- [x] T029 [US7] 대상자 상세 페이지 구현 (네비게이션 버튼 포함) in src/app/(admin)/recipients/[id]/page.tsx
- [x] T030 [P] [US7] 대상자 상세 로딩 UI 구현 in src/app/(admin)/recipients/[id]/loading.tsx

### Integration

- [x] T031 [US7] 대상자 목록에서 상세 페이지 링크 연결 in src/app/(admin)/recipients/page.tsx

**Checkpoint**: 대상자 상세 조회 기능 완료, 독립적으로 테스트 가능

---

## Phase 5: User Story 8 - 담당자 메모 관리 (Priority: P2)

**Goal**: 관리자가 대상자에 대한 담당자 메모를 조회하고 새 메모를 작성

**Independent Test**: 대상자 상세에서 담당자 메모 페이지로 이동하면 기존 메모 목록이 시간순으로 표시되고, 새 메모를 작성할 수 있습니다.

### Mock Data & Hook

- [x] T032 [P] [US8] Memo Mock 데이터 생성 in src/lib/mock-data/memos.ts
- [x] T033 [US8] useMemos 훅 구현 (addMemo 포함) in src/hooks/useMemos.ts

### Components

- [x] T034 [P] [US8] MemoList 컴포넌트 구현 (메모 카드 목록) in src/components/features/recipient/MemoList.tsx
- [x] T035 [P] [US8] MemoForm 컴포넌트 구현 (React Hook Form) in src/components/features/recipient/MemoForm.tsx
- [x] T036 [P] [US8] MemoSkeleton 컴포넌트 구현 in src/components/features/recipient/MemoSkeleton.tsx

### Page

- [x] T037 [US8] 담당자 메모 페이지 구현 in src/app/(admin)/recipients/[id]/memos/page.tsx

**Checkpoint**: 담당자 메모 조회 및 작성 기능 완료, 독립적으로 테스트 가능

---

## Phase 6: User Story 9 - 방문 기록 전체 조회 (Priority: P2)

**Goal**: 관리자가 대상자의 전체 방문 기록을 타임라인 형식으로 조회

**Independent Test**: 대상자 상세에서 방문 기록 페이지로 이동하면 모든 방문 기록이 타임라인 형식으로 표시됩니다.

### Mock Data & Hook

- [x] T038 [P] [US9] Visit Mock 데이터 생성 in src/lib/mock-data/visits.ts
- [x] T039 [US9] useVisits 훅 구현 (날짜 필터 포함) in src/hooks/useVisits.ts

### Components

- [x] T040 [P] [US9] VisitTimeline 컴포넌트 구현 in src/components/features/recipient/VisitTimeline.tsx
- [x] T041 [P] [US9] VisitTimelineItem 컴포넌트 구현 in src/components/features/recipient/VisitTimelineItem.tsx
- [x] T042 [P] [US9] DateRangeFilter 컴포넌트 구현 in src/components/features/recipient/DateRangeFilter.tsx
- [x] T043 [P] [US9] VisitTimelineSkeleton 컴포넌트 구현 in src/components/features/recipient/VisitTimelineSkeleton.tsx

### Page

- [x] T044 [US9] 방문 기록 페이지 구현 in src/app/(admin)/recipients/[id]/visits/page.tsx

**Checkpoint**: 방문 기록 타임라인 조회 기능 완료, 독립적으로 테스트 가능

---

## Phase 7: User Story 10 - AI 복지 정책 추천 조회 (Priority: P3)

**Goal**: 관리자가 대상자에게 적합한 AI 추천 복지 정책을 조회

**Independent Test**: 대상자 상세에서 AI 정책 추천 페이지로 이동하면 대상자 상황에 맞는 복지 정책 목록이 표시됩니다.

### Mock Data & Hook

- [x] T045 [P] [US10] Policy Mock 데이터 생성 in src/lib/mock-data/policies.ts
- [x] T046 [US10] usePolicies 훅 구현 (refresh 포함) in src/hooks/usePolicies.ts

### Components

- [x] T047 [P] [US10] PolicyCard 컴포넌트 구현 (아코디언 상세) in src/components/features/recipient/PolicyCard.tsx
- [x] T048 [P] [US10] PolicyList 컴포넌트 구현 in src/components/features/recipient/PolicyList.tsx
- [x] T049 [P] [US10] PolicySkeleton 컴포넌트 구현 in src/components/features/recipient/PolicySkeleton.tsx

### Page

- [x] T050 [US10] AI 정책 추천 페이지 구현 in src/app/(admin)/recipients/[id]/policies/page.tsx

**Checkpoint**: AI 정책 추천 조회 기능 완료, 독립적으로 테스트 가능

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: 여러 사용자 스토리에 영향을 미치는 개선 사항

- [x] T051 [P] 접근성 검증 (44x44px 터치 영역, WCAG AA 대비율)
- [x] T052 [P] 반응형 디자인 검증 (모바일/태블릿/데스크톱)
- [x] T053 ESLint 및 TypeScript 오류 수정
- [x] T054 빌드 확인 (npm run build)
- [x] T055 [P] 빈 상태 UI 검증 (사진 없음, 메모 없음, 방문 기록 없음, 정책 없음)
- [x] T056 quickstart-detail-pages.md 검증

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 의존성 없음 - 즉시 시작 가능
- **Foundational (Phase 2)**: Setup 완료 후 - 모든 사용자 스토리를 차단
- **User Stories (Phase 3-7)**: Foundational 완료 후 시작 가능
  - P1 스토리 (US6, US7)를 우선 완료
  - P2 스토리 (US8, US9)는 P1 이후 또는 병렬
  - P3 스토리 (US10)는 마지막
- **Polish (Phase 8)**: 모든 사용자 스토리 완료 후

### User Story Dependencies

| Story | Priority | Dependencies | Independent Test |
|-------|----------|--------------|------------------|
| US6 | P1 | Foundational | 돌봄 일지 상세 조회/승인/반려 |
| US7 | P1 | Foundational | 대상자 상세 조회 |
| US8 | P2 | US7 (대상자 상세 페이지에서 진입) | 메모 조회/작성 |
| US9 | P2 | US7 (대상자 상세 페이지에서 진입) | 방문 기록 타임라인 |
| US10 | P3 | US7 (대상자 상세 페이지에서 진입) | AI 정책 추천 조회 |

### Within Each User Story

- Mock 데이터 → 훅 → 컴포넌트 → 페이지 → 통합
- [P] 표시된 작업은 병렬 실행 가능

### Parallel Opportunities

**Phase 2 (Foundational):**
```
Task: T003 Skeleton 컴포넌트
Task: T004 Modal 컴포넌트
Task: T005 Accordion 컴포넌트
Task: T006 돌봄 일지 폴더 구조
Task: T007 대상자 폴더 구조
Task: T008 돌봄 일지 컴포넌트 폴더
Task: T009 대상자 컴포넌트 폴더
```

**Phase 3 (US6 Components):**
```
Task: T012 CareLogDetailHeader
Task: T013 VisitInfoCard
Task: T014 CareContentCards
Task: T015 PhotoGrid
Task: T017 CareLogDetailSkeleton
```

**Phase 4 (US7 Components):**
```
Task: T024 RecipientDetailHeader
Task: T025 BasicInfoCard
Task: T026 HealthInfoCard
Task: T027 RecentVisitsSummary
Task: T028 RecipientDetailSkeleton
```

---

## Implementation Strategy

### MVP First (User Story 6 Only)

1. Phase 1: Setup 완료
2. Phase 2: Foundational 완료 (CRITICAL)
3. Phase 3: User Story 6 완료
4. **STOP and VALIDATE**: 돌봄 일지 상세 독립 테스트
5. 데모/배포 가능

### Incremental Delivery

1. Setup + Foundational → 기반 준비
2. User Story 6 → 돌봄 일지 상세 (MVP!)
3. User Story 7 → 대상자 상세
4. User Story 8, 9 → 메모, 방문 기록
5. User Story 10 → AI 정책 추천
6. Polish → 최종 검증

### Suggested MVP Scope

**MVP = User Story 6 (돌봄 일지 상세)**
- 관리자의 핵심 업무인 돌봄 일지 승인/반려 가능
- 총 작업: Setup(2) + Foundational(7) + US6(12) = 21개

**Phase 2 MVP = US6 + US7**
- 돌봄 일지 상세 + 대상자 상세
- 총 작업: 21 + 10 = 31개

---

## Task Summary

| Phase | Story | Task Count | Parallel Tasks |
|-------|-------|------------|----------------|
| Phase 1: Setup | - | 2 | 1 |
| Phase 2: Foundational | - | 7 | 7 |
| Phase 3: US6 | P1 | 12 | 8 |
| Phase 4: US7 | P1 | 10 | 6 |
| Phase 5: US8 | P2 | 6 | 4 |
| Phase 6: US9 | P2 | 7 | 5 |
| Phase 7: US10 | P3 | 6 | 4 |
| Phase 8: Polish | - | 6 | 4 |
| **Total** | | **56** | **39** |

---

## Notes

- [P] 작업 = 다른 파일, 의존성 없음
- [Story] 레이블은 특정 사용자 스토리에 대한 추적성 제공
- 각 사용자 스토리는 독립적으로 완료 및 테스트 가능해야 함
- 작업 또는 논리적 그룹 완료 후 커밋
- 모든 체크포인트에서 스토리를 독립적으로 검증 가능
- 피해야 할 것: 모호한 작업, 동일 파일 충돌, 독립성을 깨는 스토리 간 의존성
