# Tasks: 매니저 관리 페이지

**Input**: Design documents from `/specs/002-admin-dashboard/`
**Prerequisites**: plan-manager-pages.md, spec-manager-pages.md, research-manager-pages.md, data-model-manager-pages.md, contracts/manager-api.yaml

**Tests**: 테스트 태스크는 명시적 요청이 없어 제외됨

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `src/app/(admin)/managers/`
- **Components**: `src/components/features/dashboard/`
- **Hooks**: `src/hooks/`
- **Mock Data**: `src/lib/mock-data/`
- **Types**: `src/types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 타입 정의 및 Mock 데이터 구조 설정

- [x] T001 [P] 매니저 관련 타입 정의 추가 in src/types/dashboard.ts (ManagerStatus, ManagerVisitType, Manager, ManagerDetail, ManagerReport, ManagerVisit, ManagerFilters, ManagerKPIs, ManagerExportData)
- [x] T002 [P] 매니저 상태 레이블/배지 유틸 함수 추가 in src/lib/utils/status.ts (getManagerStatusLabel, managerStatusToBadgeVariant, managerVisitTypeLabels)
- [x] T003 매니저 Mock 데이터 파일 생성 in src/lib/mock-data/managers.ts (mockManagers 배열, managerKPIs, 필터/조회 함수들)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 사용자 스토리에서 공유하는 핵심 훅 및 컴포넌트

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 매니저 목록 관리 훅 생성 in src/hooks/useManagers.ts (usePagination 재사용, 필터링, 내보내기 기능 포함)
- [x] T005 매니저 상세 조회 훅 생성 in src/hooks/useManagerDetail.ts (매니저 ID로 상세 데이터 조회)
- [x] T006 [P] 매니저 Excel 내보내기 함수 추가 in src/lib/utils/export.ts (exportManagersToExcel 함수)
- [x] T007 [P] 사이드바 메뉴에 "매니저 관리" 항목 추가 in src/lib/mock-data/sidebar.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 매니저 목록 조회 및 필터링 (Priority: P1) 🎯 MVP

**Goal**: 관리자가 매니저 목록을 조회하고 상태/검색/드롭다운으로 필터링할 수 있음

**Independent Test**: /managers 페이지에 접속하면 KPI 카드, 상태 탭, 매니저 테이블이 표시되고, 필터링 및 Excel 내보내기가 동작함

### Implementation for User Story 1

- [x] T008 [P] [US1] 매니저 테이블 컴포넌트 생성 in src/components/features/dashboard/ManagerTable.tsx (RecipientTable 패턴 참고, 아바타/이름/소속센터/담당동/대상자수/방문수/상태 컬럼)
- [x] T009 [US1] 매니저 목록 페이지 생성 in src/app/(admin)/managers/page.tsx (KPI 카드, 상태 탭, ManagerTable, 필터링, 페이지네이션, Excel 내보내기)
- [x] T010 [US1] 매니저 목록 페이지 로딩 스켈레톤 추가 (ManagerTable 내 TableSkeleton 컴포넌트 활용)
- [x] T011 [US1] 빈 상태(empty state) UI 구현 - 매니저가 없거나 검색 결과가 없는 경우

**Checkpoint**: User Story 1 완료 - 매니저 목록 조회/필터링/내보내기 기능 동작

---

## Phase 4: User Story 2 - 매니저 상세 정보 조회 (Priority: P1)

**Goal**: 관리자가 개별 매니저의 프로필, 업무 통계, 최근 활동을 확인할 수 있음

**Independent Test**: /managers/[id] 페이지에 접속하면 매니저 프로필, 업무 통계, 최근 보고서 5건, 최근 방문 기록 5건이 표시됨

### Implementation for User Story 2

- [x] T012 [P] [US2] 매니저 상세 스켈레톤 컴포넌트 생성 in src/components/features/dashboard/ManagerDetailSkeleton.tsx
- [x] T013 [US2] 매니저 상세 페이지 생성 in src/app/(admin)/managers/[id]/page.tsx (헤더+뒤로가기, 2컬럼 레이아웃, 프로필 카드, 업무 통계, 최근 보고서, 최근 방문 기록)
- [x] T014 [P] [US2] 매니저 상세 로딩 UI 생성 in src/app/(admin)/managers/[id]/loading.tsx
- [x] T015 [US2] 성별 기반 아바타 색상 적용 (여성: pink, 남성: blue) - getAvatarBgColor 함수 재사용
- [x] T016 [US2] 보고서 전체보기/방문 기록 전체보기 버튼 링크 연결

**Checkpoint**: User Story 2 완료 - 매니저 상세 정보 조회 기능 동작

---

## Phase 5: User Story 3 - 매니저별 보고서 전체 목록 조회 (Priority: P2)

**Goal**: 관리자가 특정 매니저의 모든 보고서를 조회하고 상태/날짜별로 필터링할 수 있음

**Independent Test**: /managers/[id]/reports 페이지에 접속하면 "[매니저명]님의 보고서" 제목과 함께 보고서 테이블이 표시되고, 상태 탭/날짜 필터링이 동작함

### Implementation for User Story 3

- [x] T017 [P] [US3] 매니저 보고서 목록 조회 함수 추가 in src/lib/mock-data/managers.ts (getManagerReports)
- [x] T018 [US3] 매니저 보고서 전체 페이지 생성 in src/app/(admin)/managers/[id]/reports/page.tsx (헤더+뒤로가기, 상태 탭, 날짜 필터, 보고서 테이블, 페이지네이션)
- [x] T019 [US3] 보고서 행 클릭 시 /care-logs/[id] 상세 페이지로 이동 연결
- [x] T020 [US3] 빈 상태 UI - 보고서가 없는 경우 "작성된 보고서가 없습니다" 메시지

**Checkpoint**: User Story 3 완료 - 매니저별 보고서 전체 목록 조회 기능 동작

---

## Phase 6: User Story 4 - 매니저별 방문 기록 전체 조회 (Priority: P2)

**Goal**: 관리자가 특정 매니저의 모든 방문 기록을 조회하고 유형/날짜/대상자명으로 필터링할 수 있음

**Independent Test**: /managers/[id]/visits 페이지에 접속하면 "[매니저명]님의 방문 기록" 제목과 함께 방문 기록 테이블이 표시되고, 유형 탭/날짜/검색 필터링이 동작함

### Implementation for User Story 4

- [x] T021 [P] [US4] 매니저 방문 기록 목록 조회 함수 추가 in src/lib/mock-data/managers.ts (getManagerVisits)
- [x] T022 [US4] 매니저 방문 기록 전체 페이지 생성 in src/app/(admin)/managers/[id]/visits/page.tsx (헤더+뒤로가기, 방문 유형 탭, 날짜 필터, 검색, 방문 기록 테이블, 페이지네이션)
- [x] T023 [US4] 방문 유형별 아이콘/색상 적용 (정기 방문🏠 파랑, 긴급 방문🚨 빨강, 전화 상담📞 보라)
- [x] T024 [US4] 빈 상태 UI - 방문 기록이 없는 경우 "방문 기록이 없습니다" 메시지

**Checkpoint**: User Story 4 완료 - 매니저별 방문 기록 전체 조회 기능 동작

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 전체 기능 검증 및 개선

- [x] T025 [P] 모든 페이지 접근성 검증 (글자 크기 14px 이상, 클릭 영역 44x44px, WCAG AA 대비율)
- [x] T026 [P] 모든 페이지 반응형 레이아웃 확인 (lg:grid-cols-2 등)
- [x] T027 네비게이션 플로우 검증 (목록→상세→보고서전체/방문기록전체→뒤로가기)
- [x] T028 에러 상태 UI 검증 (데이터 로드 실패 시 Alert 표시)
- [x] T029 quickstart-manager-pages.md 시나리오 기반 전체 기능 테스트

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (타입 정의) - BLOCKS all user stories
- **User Stories (Phase 3~6)**: All depend on Foundational phase completion
  - US1 (목록)은 US2 (상세)의 진입점이지만, 독립적으로 테스트 가능
  - US3 (보고서 전체)와 US4 (방문 기록 전체)는 US2 (상세)에서 링크되지만 독립 테스트 가능
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 완료 후 시작 가능 - 다른 스토리에 의존 없음
- **User Story 2 (P1)**: Foundational 완료 후 시작 가능 - US1과 병렬 가능
- **User Story 3 (P2)**: Foundational 완료 후 시작 가능 - US2에서 링크되지만 독립 테스트 가능
- **User Story 4 (P2)**: Foundational 완료 후 시작 가능 - US2에서 링크되지만 독립 테스트 가능

### Parallel Opportunities

```text
Phase 1 병렬 실행:
  T001 타입 정의 || T002 유틸 함수

Phase 2 병렬 실행:
  T006 Excel 내보내기 || T007 사이드바 메뉴

Phase 3~6 병렬 실행 (팀 작업 시):
  Developer A: US1 (목록) + US3 (보고서)
  Developer B: US2 (상세) + US4 (방문 기록)
```

---

## Parallel Example: User Story 1

```bash
# Launch models/types in parallel:
Task: "T001 매니저 관련 타입 정의 추가"
Task: "T002 매니저 상태 레이블/배지 유틸 함수 추가"

# Launch independent foundational tasks in parallel:
Task: "T006 매니저 Excel 내보내기 함수 추가"
Task: "T007 사이드바 메뉴에 매니저 관리 항목 추가"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (타입, 유틸)
2. Complete Phase 2: Foundational (훅, Mock 데이터)
3. Complete Phase 3: User Story 1 (목록 페이지)
4. Complete Phase 4: User Story 2 (상세 페이지)
5. **STOP and VALIDATE**: 목록→상세 플로우 테스트
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (목록) → Test independently → MVP 1
3. Add US2 (상세) → Test independently → MVP 2
4. Add US3 (보고서 전체) → Test independently
5. Add US4 (방문 기록 전체) → Test independently
6. Polish → Final release

---

## Summary

| Phase | Tasks | Parallel | Description |
|-------|-------|----------|-------------|
| 1. Setup | T001~T003 | 2 | 타입, 유틸, Mock 데이터 구조 |
| 2. Foundational | T004~T007 | 2 | 훅, 내보내기, 사이드바 |
| 3. US1 목록 | T008~T011 | 1 | 매니저 목록 페이지 |
| 4. US2 상세 | T012~T016 | 2 | 매니저 상세 페이지 |
| 5. US3 보고서 | T017~T020 | 1 | 보고서 전체 페이지 |
| 6. US4 방문 | T021~T024 | 1 | 방문 기록 전체 페이지 |
| 7. Polish | T025~T029 | 2 | 검증 및 최적화 |
| **Total** | **29 tasks** | **11 parallel** | |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- 기존 RecipientTable, recipients/[id]/page.tsx 패턴 적극 재사용
- 성별 기반 아바타 색상 규칙 (여성: pink, 남성: blue) 일관 적용
- 방문 유형별 색상 규칙 (정기🏠 파랑, 긴급🚨 빨강, 전화📞 보라) Constitution 준수
