# Tasks: 통계/리포트 페이지

**Input**: Design documents from `/specs/004-statistics-report/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/statistics-api.yaml, research.md

**Tests**: 테스트는 명시적으로 요청되지 않았으므로 포함하지 않습니다.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (frontend only)**: `src/` at repository root
- Structure follows Next.js App Router pattern per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 프로젝트 초기화 및 의존성 설치

- [x] T001 Install recharts dependency: `pnpm add recharts`
- [x] T002 [P] Create statistics types file in src/types/statistics.ts
- [x] T003 [P] Create statistics constants file in src/lib/constants/statistics.ts
- [x] T004 [P] Create Zod validation schemas in src/lib/validations/statistics.ts
- [x] T005 Create mock data for all statistics in src/lib/mock-data/statistics.ts
- [x] T006 Create Mock API functions in src/lib/api/statistics.ts (depends on T002, T005)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 User Story에서 공유하는 핵심 인프라

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create useStatistics hook in src/hooks/useStatistics.ts (depends on T006)
- [x] T008 [P] Create Modal UI component in src/components/ui/Modal.tsx
- [x] T009 Create statistics directory in src/components/features/statistics/
- [x] T010 Create base statistics page at src/app/(admin)/statistics/page.tsx (basic skeleton)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 핵심 KPI 현황 조회 (Priority: P1) 🎯 MVP

**Goal**: 관리자가 5개의 KPI 카드(전체 대상자, 이번 달 방문, 보고서 처리, 긴급 케이스, 활동 매니저)를 확인하고, 기간 선택 시 데이터가 갱신됨

**Independent Test**: 페이지 접속 시 5개의 KPI 카드가 모두 표시되고, 기간 선택 드롭다운에서 다른 월 선택 시 데이터가 갱신되는지 확인

### Implementation for User Story 1

- [x] T011 [P] [US1] Create KPICard component in src/components/features/statistics/KPICard.tsx
- [x] T012 [P] [US1] Create StatisticsHeader component with month selector and title in src/components/features/statistics/StatisticsHeader.tsx
- [x] T013 [US1] Create KPICardGrid component (arranges 5 cards horizontally) in src/components/features/statistics/KPICardGrid.tsx (depends on T011)
- [x] T014 [US1] Integrate KPICardGrid and StatisticsHeader into statistics page in src/app/(admin)/statistics/page.tsx (depends on T012, T013)
- [x] T015 [US1] Add emergency case red highlight styling when emergencyCases > 0 in KPICard.tsx

**Checkpoint**: User Story 1 완료 - 5개의 KPI 카드와 기간 선택 기능이 작동함

---

## Phase 4: User Story 2 - 방문 추이 분석 (Priority: P1)

**Goal**: 관리자가 월별 방문 추이 라인 차트를 통해 6개월/1년간의 방문 횟수 변화를 분석

**Independent Test**: 라인 차트가 올바르게 렌더링되고, 6개월/1년 탭 전환 시 기간별 데이터가 정확히 표시되는지 확인

### Implementation for User Story 2

- [x] T016 [US2] Create VisitTrendChart component with recharts AreaChart in src/components/features/statistics/VisitTrendChart.tsx
- [x] T017 [US2] Add 6-month/1-year tab switching functionality in VisitTrendChart.tsx
- [x] T018 [US2] Add hover tooltip showing exact visit count per month in VisitTrendChart.tsx
- [x] T019 [US2] Integrate VisitTrendChart into statistics page layout in src/app/(admin)/statistics/page.tsx

**Checkpoint**: User Story 2 완료 - 월별 방문 추이 차트가 탭 전환과 툴팁 기능과 함께 작동함

---

## Phase 5: User Story 3 - 보고서 처리 현황 분석 (Priority: P1)

**Goal**: 관리자가 도넛 차트를 통해 보고서 처리 상태별(승인/대기/긴급/반려) 분포를 파악

**Independent Test**: 도넛 차트가 4개 상태의 비율을 정확히 표시하고, 중앙에 총 건수가 표시되는지 확인

### Implementation for User Story 3

- [x] T020 [US3] Create ReportStatusChart component with recharts PieChart (donut style) in src/components/features/statistics/ReportStatusChart.tsx
- [x] T021 [US3] Add center label showing total report count in ReportStatusChart.tsx
- [x] T022 [US3] Add legend showing status-wise counts and percentages in ReportStatusChart.tsx
- [x] T023 [US3] Integrate ReportStatusChart into statistics page layout (next to VisitTrendChart) in src/app/(admin)/statistics/page.tsx

**Checkpoint**: User Story 3 완료 - 보고서 처리 현황 도넛 차트가 범례와 중앙 수치와 함께 작동함

---

## Phase 6: User Story 4 - 동별 방문 현황 분석 (Priority: P2)

**Goal**: 관리자가 관할 지역 내 동별 방문 횟수를 가로 막대 차트로 확인

**Independent Test**: 가로 막대 차트가 동별 방문 횟수를 내림차순으로 표시하고, 각 막대에 수치가 표시되는지 확인

### Implementation for User Story 4

- [x] T024 [US4] Create DistrictVisitChart component with recharts horizontal BarChart in src/components/features/statistics/DistrictVisitChart.tsx
- [x] T025 [US4] Add district name and visit count labels on each bar in DistrictVisitChart.tsx
- [x] T026 [P] [US4] Create DistrictVisitsModal component for "전체보기" in src/components/features/statistics/DistrictVisitsModal.tsx
- [x] T027 [US4] Add "전체보기" link connecting to DistrictVisitsModal in DistrictVisitChart.tsx (depends on T026)
- [x] T028 [US4] Integrate DistrictVisitChart into statistics page layout in src/app/(admin)/statistics/page.tsx

**Checkpoint**: User Story 4 완료 - 동별 방문 현황 막대 차트와 전체보기 모달이 작동함

---

## Phase 7: User Story 5 - 매니저 활동 순위 확인 (Priority: P2)

**Goal**: 관리자가 테이블 형태로 매니저별 활동 실적(방문 횟수, 보고서 건수, 승인률)을 순위별로 확인

**Independent Test**: 테이블에 상위 매니저 목록이 순위와 함께 표시되고, 1~3위에 메달 아이콘이 표시되는지 확인

### Implementation for User Story 5

- [x] T029 [US5] Create ManagerRankingTable component with ranking table in src/components/features/statistics/ManagerRankingTable.tsx
- [x] T030 [US5] Add gold/silver/bronze medal styling for ranks 1-3 in ManagerRankingTable.tsx
- [x] T031 [P] [US5] Create ManagerRankingModal component for "전체보기" in src/components/features/statistics/ManagerRankingModal.tsx
- [x] T032 [US5] Add "전체보기" link connecting to ManagerRankingModal in ManagerRankingTable.tsx (depends on T031)
- [x] T033 [US5] Integrate ManagerRankingTable into statistics page layout (next to DistrictVisitChart) in src/app/(admin)/statistics/page.tsx

**Checkpoint**: User Story 5 완료 - 매니저 활동 순위 테이블과 전체보기 모달이 작동함

---

## Phase 8: User Story 6 - 대상자 상태 분포 확인 (Priority: P2)

**Goal**: 관리자가 돌봄 대상자의 상태별(정상/주의/긴급/미방문) 분포와 전월 대비 변화 추이를 확인

**Independent Test**: 4가지 상태별 인원수, 비율, 전월 대비 변화가 모두 표시되는지 확인

### Implementation for User Story 6

- [x] T034 [US6] Create RecipientStatusCards component showing 4 status cards in src/components/features/statistics/RecipientStatusCards.tsx
- [x] T035 [US6] Add percentage display for each status in RecipientStatusCards.tsx
- [x] T036 [US6] Add month-over-month trend indicators (e.g., "+24명 정상 전환") in RecipientStatusCards.tsx
- [x] T037 [US6] Add red highlight for urgent status when count > 0 in RecipientStatusCards.tsx
- [x] T038 [US6] Integrate RecipientStatusCards into statistics page layout in src/app/(admin)/statistics/page.tsx

**Checkpoint**: User Story 6 완료 - 대상자 상태 분포 카드와 트렌드 표시가 작동함

---

## Phase 9: User Story 7 - PDF 리포트 생성 (Priority: P2)

**Goal**: 관리자가 선택한 월의 통계 데이터를 PDF 형식의 리포트로 생성하여 다운로드

**Independent Test**: "리포트 생성" 버튼 클릭 시 PDF 파일이 생성되고 다운로드되는지 확인

### Implementation for User Story 7

- [x] T039 [US7] Install PDF dependencies: `pnpm add @react-pdf/renderer html2canvas` (Mock 구현)
- [x] T040 [US7] Create PDF generation utility in src/lib/utils/pdf-generator.ts
- [x] T041 [US7] Create useReportGenerator hook in src/hooks/useReportGenerator.ts (depends on T040)
- [x] T042 [US7] Add "리포트 생성" button click handler in StatisticsHeader.tsx (depends on T041)
- [x] T043 [US7] Add PDF generation loading state indicator in StatisticsHeader.tsx

**Checkpoint**: User Story 7 완료 - 헤더의 리포트 생성 버튼으로 PDF 다운로드가 작동함

---

## Phase 10: User Story 8 - 빠른 리포트 생성 (Priority: P3)

**Goal**: 관리자가 4가지 사전 정의된 템플릿(월간 종합, 매니저 실적, 대상자 현황, 긴급 케이스) 중 선택하여 특정 목적의 리포트를 빠르게 생성

**Independent Test**: 4개의 템플릿 카드가 표시되고, 각 "생성" 버튼 클릭 시 해당 템플릿의 리포트가 생성되는지 확인

### Implementation for User Story 8

- [x] T044 [US8] Create QuickReportCards component with 4 template cards in src/components/features/statistics/QuickReportCards.tsx
- [x] T045 [US8] Add template-specific PDF generation for each card in QuickReportCards.tsx (depends on T041)
- [x] T046 [US8] Add loading state for each template card while generating in QuickReportCards.tsx
- [x] T047 [US8] Integrate QuickReportCards into statistics page layout (next to RecipientStatusCards) in src/app/(admin)/statistics/page.tsx

**Checkpoint**: User Story 8 완료 - 빠른 리포트 생성 카드로 템플릿별 PDF 다운로드가 작동함

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: 접근성, 에러 처리, 반응형 레이아웃 등 전체 품질 향상

- [x] T048 Add loading skeleton UI for each section in statistics page
- [x] T049 Add error state UI with retry button for data loading failures
- [x] T050 Add empty state UI with message when no data available for selected month
- [x] T051 [P] Accessibility audit: verify all text >= 12px, body >= 14px per Constitution
- [x] T052 [P] Accessibility audit: verify all clickable areas >= 44x44px per Constitution
- [ ] T053 [P] Add responsive layout adjustments for different screen sizes (TODO: 반응형 개선)
- [x] T054 Verify sidebar has "통계/리포트" menu item, add if missing
- [x] T055 Final integration test: verify all 8 user stories work together
- [ ] T056 Run quickstart.md validation steps (TODO: 수동 테스트 필요)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-10)**: All depend on Foundational phase completion
  - P1 stories (US1, US2, US3) should complete first
  - P2 stories (US4, US5, US6, US7) can start after Foundational
  - P3 story (US8) depends on US7 (PDF infrastructure)
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Priority | Dependencies | Can Start After |
|-------|----------|--------------|-----------------|
| US1 (KPI) | P1 | Foundational | Phase 2 |
| US2 (방문 추이) | P1 | Foundational | Phase 2 |
| US3 (보고서 현황) | P1 | Foundational | Phase 2 |
| US4 (동별 방문) | P2 | Foundational | Phase 2 |
| US5 (매니저 순위) | P2 | Foundational | Phase 2 |
| US6 (대상자 상태) | P2 | Foundational | Phase 2 |
| US7 (PDF 생성) | P2 | Foundational | Phase 2 |
| US8 (빠른 리포트) | P3 | US7 | Phase 9 |

### Within Each User Story

- Components before page integration
- Base components before derivative components
- Modal components can be created in parallel [P]

### Parallel Opportunities

- Setup tasks T002, T003, T004 can run in parallel
- US1 tasks T011, T012 can run in parallel
- US4 tasks T024-T025 parallel with T026 (modal)
- US5 tasks T029-T030 parallel with T031 (modal)
- Polish tasks T051, T052, T053 can run in parallel
- **After Phase 2**: US1, US2, US3 can run in parallel (different component files)
- **After Phase 2**: US4, US5, US6, US7 can run in parallel with P1 stories

---

## Parallel Example: P1 User Stories

```bash
# After Phase 2 (Foundational) completes, launch P1 stories in parallel:

# Developer A: User Story 1
Task: T011 [P] [US1] Create KPICard component
Task: T012 [P] [US1] Create StatisticsHeader component

# Developer B: User Story 2
Task: T016 [US2] Create VisitTrendChart component

# Developer C: User Story 3
Task: T020 [US3] Create ReportStatusChart component
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T010) **CRITICAL**
3. Complete Phase 3: User Story 1 - KPI Cards (T011-T015)
4. Complete Phase 4: User Story 2 - Visit Trend Chart (T016-T019)
5. Complete Phase 5: User Story 3 - Report Status Chart (T020-T023)
6. **STOP and VALIDATE**: 핵심 KPI와 차트 2개가 작동하는지 확인
7. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (KPI) → Test → Demo (MVP!)
3. Add US2 (방문 추이) → Test → Demo
4. Add US3 (보고서 현황) → Test → Demo
5. Add US4-US6 (상세 통계) → Test → Demo
6. Add US7 (PDF) → Test → Demo
7. Add US8 (빠른 리포트) → Test → Demo (Full Feature)
8. Polish → Final validation

### Single Developer Strategy

Follow phases sequentially:
- Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → ...

### Parallel Team Strategy

With multiple developers after Foundational:
- Developer A: US1 → US4 → US7
- Developer B: US2 → US5 → Polish
- Developer C: US3 → US6 → US8

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- recharts requires 'use client' directive for SSR compatibility
- PDF generation uses html2canvas to capture charts as images
- Constitution requires: min 12px font, 14px body, 44px touch targets
