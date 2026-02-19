# Tasks: 설정 페이지 (Admin Settings)

**Input**: Design documents from `/specs/005-admin-settings/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/settings-api.md, quickstart.md

**Tests**: 테스트는 spec에서 명시적으로 요청되지 않았으므로 생략. 필요 시 Polish 단계에서 추가.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 타입 정의, Mock 데이터, 공통 UI 컴포넌트 생성

- [x] T001 [P] Define settings type interfaces (UserProfile, NotificationSettings, SystemSettings, JurisdictionInfo, PasswordChangeRequest, SettingsState) in `src/types/settings.ts` — data-model.md 기반, Zod validation schemas 포함
- [x] T002 [P] Create mock data and API functions (getSettings, updateProfile, updateNotifications, updateSystemSettings, changePassword) with 300~500ms delay simulation in `src/lib/mock-data/settings.ts` — contracts/settings-api.md 기반
- [x] T003 [P] Create Toggle switch UI component with forwardRef, cn utility, role="switch" accessibility, ON(#3b82f6)/OFF(#e2e8f0) colors, label/description props, min 44x44px touch target in `src/components/ui/Toggle.tsx` — 기존 Input/Checkbox 패턴 참조

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Zustand 설정 상태 관리 훅, 사이드바 네비게이션 연결

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create useSettings Zustand store with persist middleware (loadSettings, updateProfile, updateNotification, updateSystemSetting, setEditingField actions) in `src/hooks/useSettings.ts` — useAuth.ts 패턴 참조
- [x] T005 Add statistics and settings menu items to `defaultSidebarMenuItems` array in `src/lib/utils/sidebar-defaults.ts` — `{ id: 'statistics', label: '통계/리포트', href: '/statistics', icon: 'chart' }` and `{ id: 'settings', label: '설정', href: '/settings', icon: 'settings' }`
- [x] T006 Add chart icon SVG case to MenuIcon component in `src/components/layout/Sidebar.tsx` — 통계/리포트 메뉴 아이콘 (settings icon already exists)

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — 내 프로필 및 계정 정보 확인 (Priority: P1) 🎯 MVP

**Goal**: 관리자가 설정 페이지에서 프로필(이니셜 아바타, 이름, 역할 배지, 이메일, 전화번호, 가입일)과 계정 정보(이름, 연락처, 이메일, 비밀번호 마스킹)를 확인하고, 개별 필드를 인라인 편집할 수 있다.

**Independent Test**: `/settings` 접근 시 프로필 카드와 계정 정보가 올바르게 표시되고, "변경" 버튼 클릭 시 해당 필드가 편집 모드로 전환되는지 확인

### Implementation for User Story 1

- [x] T007 [P] [US1] Create ProfileSection component (Card with avatar initials circle, name, Badge for role "구/군 관리자", email, phone, createdAt, "수정" button) in `src/components/features/settings/ProfileSection.tsx` — Card(padding='lg'), Badge(variant='info') 컴포넌트 사용
- [x] T008 [P] [US1] Create AccountInfoSection component (Card with 4 fields: name, phone, email, masked password "●●●●●●●●", each with individual "변경" Button, inline edit mode with Input + save/cancel using React Hook Form + Zod validation) in `src/components/features/settings/AccountInfoSection.tsx` — Input(rightElement), Button(variant='secondary', size='sm') 사용
- [x] T009 [US1] Create settings page scaffold with auth check, PageHeader("설정", "계정, 알림, 시스템 설정을 관리합니다"), grid layout, and integrate ProfileSection + AccountInfoSection in `src/app/(admin)/settings/page.tsx` — dashboard/page.tsx 패턴 참조 (useAuth, useRouter, loading state, flex-1 overflow-y-auto p-6, max-w-7xl mx-auto)

**Checkpoint**: User Story 1 완료 — 프로필/계정 정보 확인 및 인라인 편집 가능

---

## Phase 4: User Story 2 — 알림 설정 관리 (Priority: P1)

**Goal**: 관리자가 4개 알림 토글(새 보고서, 긴급 케이스, 주간 리포트, 이메일 알림)을 ON/OFF 전환하고, 모바일 푸시 알림 배너를 확인할 수 있다.

**Independent Test**: 알림 설정 섹션의 4개 토글이 기본값(ON/ON/ON/OFF)으로 표시되고, 클릭 시 상태가 즉시 전환되며, 푸시 알림 배너와 "앱 다운로드" 버튼이 표시되는지 확인

### Implementation for User Story 2

- [x] T010 [US2] Create NotificationSection component (full-width Card, 4 Toggle switches in horizontal grid with title+description each, mobile push notification banner with "safehi 앱에서 실시간 알림을 받으세요" message and "앱 다운로드" Button, optimistic toggle update via useSettings) in `src/components/features/settings/NotificationSection.tsx` — Toggle 컴포넌트 + Card 사용, grid-cols-4 레이아웃
- [x] T011 [US2] Integrate NotificationSection into settings page as full-width section below profile/account row in `src/app/(admin)/settings/page.tsx`

**Checkpoint**: User Stories 1 AND 2 완료 — 프로필 + 알림 설정 관리 가능

---

## Phase 5: User Story 3 — 시스템 설정 변경 (Priority: P2)

**Goal**: 관리자가 언어(드롭다운), 시간대(드롭다운), 다크 모드(토글), 자동 새로고침(토글, "대시보드 자동 갱신 (5분)") 설정을 변경할 수 있다.

**Independent Test**: 시스템 설정 섹션에서 드롭다운 기본값(한국어, (GMT+9) 서울)과 토글 기본값(다크모드 OFF, 자동 새로고침 ON)이 표시되고, 각 컨트롤 변경 시 상태가 반영되는지 확인

### Implementation for User Story 3

- [x] T012 [US3] Create SystemSettingsSection component (left-column Card, language Select with options [{value:'ko',label:'한국어'}], timezone Select with options [{value:'Asia/Seoul',label:'(GMT+9) 서울'}], dark mode Toggle, auto-refresh Toggle with description "대시보드 자동 갱신 (5분)", each setting as row with label+description+control) in `src/components/features/settings/SystemSettingsSection.tsx` — Select, Toggle, Card 컴포넌트 사용
- [x] T013 [US3] Integrate SystemSettingsSection into settings page as left column in new grid row in `src/app/(admin)/settings/page.tsx`

**Checkpoint**: User Story 3 완료 — 시스템 설정 변경 가능

---

## Phase 6: User Story 4 — 관할 구역 정보 확인 (Priority: P2)

**Goal**: 관리자가 소속 기관 정보, 3개 통계 카드(담당 동 18, 복지센터 12, 소속 매니저 156), 요약된 동 목록을 확인하고 "전체보기"로 전체 동 목록을 열람할 수 있다.

**Independent Test**: 관할 구역 섹션에서 기관명/부서, 3개 통계 카드 숫자, 동 목록 요약이 올바르게 표시되고 "전체보기" 클릭 시 전체 동 목록이 펼쳐지는지 확인

### Implementation for User Story 4

- [x] T014 [US4] Create JurisdictionSection component (right-column Card with "전체보기" Button in header, organization info with icon + name "서울특별시 양천구" + dept "어르신복지과 · 돌봄 서비스팀", 3 stat mini-cards with colored numbers and labels in grid-cols-3, dong list summary "목동1동, 목동2동, ... 외 N개 동" with expandable full list on "전체보기" click) in `src/components/features/settings/JurisdictionSection.tsx` — Card, Button 컴포넌트 사용
- [x] T015 [US4] Integrate JurisdictionSection into settings page as right column next to SystemSettingsSection in `src/app/(admin)/settings/page.tsx`

**Checkpoint**: User Stories 3 AND 4 완료 — 시스템 설정 + 관할 구역 정보 확인 가능

---

## Phase 7: User Story 5 — 계정 관리 (Priority: P3)

**Goal**: 관리자가 로그아웃(확인 대화상자 후 세션 종료), 비밀번호 변경(모달), 계정 문의(mailto 링크)를 수행할 수 있다. 빨간 테두리로 위험 영역 시각 표시.

**Independent Test**: 계정 관리 섹션이 빨간 테두리로 표시되고, 로그아웃 "실행" 클릭 시 확인 대화상자 표시, 비밀번호 "변경" 클릭 시 모달 오픈, 문의 "문의" 클릭 시 이메일 링크 동작 확인

### Implementation for User Story 5

- [x] T016 [P] [US5] Create PasswordChangeModal component (Modal with React Hook Form + Zod, 3 Input fields: currentPassword, newPassword, confirmPassword with validation rules from data-model.md, error states, submit/cancel buttons) in `src/components/features/settings/PasswordChangeModal.tsx` — Modal, Input, Button 컴포넌트 사용
- [x] T017 [P] [US5] Create AccountManagementSection component (full-width Card with red border `border-status-danger`, 3 action items in grid-cols-3: logout with danger "실행" Button + confirm dialog, password change with primary "변경" Button opening PasswordChangeModal, account inquiry with secondary outline "문의" Button as mailto link, each with title + description text) in `src/components/features/settings/AccountManagementSection.tsx` — Card, Button(variant='danger'|'primary'|'secondary') 사용
- [x] T018 [US5] Integrate AccountManagementSection into settings page as full-width section and add footer ("INNO-HI Inc. | 최종 업데이트: 2026.02.19 | © 2026 INNO-Hi. All rights reserved.") in `src/app/(admin)/settings/page.tsx`

**Checkpoint**: All user stories complete — 설정 페이지 전체 기능 동작

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: 접근성 검증, 빌드 확인, 코드 정리

- [x] T019 Verify all interactive elements meet WCAG AA accessibility requirements (min 44x44px touch targets, 4.5:1 contrast ratio, aria-labels on toggles/buttons, keyboard navigation) across all settings components
- [x] T020 Run `pnpm build` to verify no TypeScript errors and successful production build
- [x] T021 Run `pnpm lint` to verify ESLint compliance across all new files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001, T002, T003 모두 병렬 실행 가능
- **Foundational (Phase 2)**: T004는 T001(타입) + T002(Mock 데이터)에 의존, T005/T006은 독립적
- **User Stories (Phase 3~7)**: 모두 Phase 2 완료 후 시작 가능
- **Polish (Phase 8)**: 모든 User Story 완료 후 진행

### User Story Dependencies

- **US1 (P1)**: Phase 2 완료 후 바로 시작 — 다른 Story에 의존 없음
- **US2 (P1)**: Phase 2 완료 후 시작 가능 — Toggle 컴포넌트(T003)에 의존하지만 Setup에서 이미 생성
- **US3 (P2)**: Phase 2 완료 후 시작 가능 — US1/US2와 독립적
- **US4 (P2)**: Phase 2 완료 후 시작 가능 — US1/US2/US3와 독립적
- **US5 (P3)**: Phase 2 완료 후 시작 가능 — 로그아웃은 기존 useAuth 훅 재사용

### Within Each User Story

- 컴포넌트 생성([P]) → 페이지 통합 (순서 의존)
- 같은 Story의 [P] 태스크는 병렬 실행 가능 (서로 다른 파일)

### Parallel Opportunities

- **Phase 1**: T001 + T002 + T003 모두 병렬 (3 tasks)
- **Phase 2**: T005 + T006 병렬, T004는 T001/T002 완료 후
- **Phase 3**: T007 + T008 병렬 → T009 순차
- **Phase 5+6**: US3(T012) + US4(T014) 병렬 가능 (서로 다른 컴포넌트)
- **Phase 7**: T016 + T017 병렬 → T018 순차

---

## Parallel Example: Phase 1 Setup

```bash
# 3개 태스크 동시 실행 (서로 다른 파일):
Task: "Define settings types in src/types/settings.ts"
Task: "Create mock data in src/lib/mock-data/settings.ts"
Task: "Create Toggle component in src/components/ui/Toggle.tsx"
```

## Parallel Example: User Story 1

```bash
# 2개 컴포넌트 동시 생성:
Task: "Create ProfileSection in src/components/features/settings/ProfileSection.tsx"
Task: "Create AccountInfoSection in src/components/features/settings/AccountInfoSection.tsx"

# 완료 후 페이지 통합:
Task: "Create settings page scaffold in src/app/(admin)/settings/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (타입, Mock 데이터, Toggle)
2. Complete Phase 2: Foundational (useSettings 훅, 사이드바)
3. Complete Phase 3: User Story 1 (프로필 + 계정 정보)
4. **STOP and VALIDATE**: 설정 페이지에서 프로필/계정 정보 확인 및 편집 테스트
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → 기반 인프라 완료
2. US1 (프로필/계정) → 테스트 → MVP 배포
3. US2 (알림 설정) → 테스트 → 업데이트 배포
4. US3+US4 (시스템 설정 + 관할 구역, 병렬 가능) → 테스트 → 업데이트 배포
5. US5 (계정 관리) → 테스트 → 최종 배포
6. Polish → 접근성/빌드/린트 검증

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- 기존 UI 컴포넌트(Card, Button, Input, Select, Badge, Modal) 최대한 재활용
- 새 컴포넌트는 Toggle 1개만 생성 (components/ui/)
- Mock 데이터 기반이므로 백엔드 의존성 없음
- 접근성(WCAG AA) 준수는 각 컴포넌트 구현 시 반영하되, Phase 8에서 최종 검증
