# 태스크 목록: 관리자 대시보드

**입력 문서**: `/specs/002-admin-dashboard/` 디렉토리의 설계 문서들
**사전 요구사항**: plan.md, spec.md, research.md, data-model.md, contracts/dashboard-api.yaml

**테스트**: 테스트 태스크 미포함 (별도 요청 없음)

**구성 방식**: 각 유저 스토리별로 독립적인 구현 및 테스트가 가능하도록 태스크를 그룹화했습니다.

## 태스크 형식: `[ID] [P?] [Story] 설명`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 해당 태스크가 속한 유저 스토리 (예: US1, US2, US3, US4, US5)
- 모든 태스크에 정확한 파일 경로 포함

## 경로 규칙

- **프로젝트 구조**: 저장소 루트의 `src/` (Next.js App Router)
- 컴포넌트 경로는 Constitution VII 구조를 따름

---

## Phase 1: 초기 설정 (공유 인프라)

**목적**: 새로운 의존성 설치 및 기본 구조 설정

- [ ] T001 새 의존성 설치: xlsx, react-to-print (package.json)
- [ ] T002 [P] 대시보드 관련 타입 정의 생성 (src/types/dashboard.ts)
- [ ] T003 폴더 구조 생성: src/app/(admin)/, src/components/layout/, src/components/features/dashboard/, src/lib/mock-data/

---

## Phase 2: 기반 구축 (필수 선행 작업)

**목적**: 모든 유저 스토리 구현 전에 반드시 완료해야 하는 핵심 인프라

**⚠️ 중요**: 이 단계가 완료되기 전에는 유저 스토리 작업을 시작할 수 없습니다

### 유틸리티 함수

- [ ] T004 [P] 날짜 포맷 유틸리티 생성 (상대 시간, 한국어 포맷) (src/lib/utils/date.ts)
- [ ] T005 [P] 상태 색상/레이블 유틸리티 생성 (src/lib/utils/status.ts)
- [ ] T006 [P] Excel 내보내기 유틸리티 생성 (SheetJS 사용) (src/lib/utils/export.ts)

### 기본 UI 컴포넌트

- [ ] T007 [P] Badge 컴포넌트 생성 (상태별 색상 변형) (src/components/ui/Badge.tsx)
- [ ] T008 [P] Tabs 컴포넌트 생성 (상태 탭용) (src/components/ui/Tabs.tsx)
- [ ] T009 [P] SearchInput 컴포넌트 생성 (검색창) (src/components/ui/SearchInput.tsx)
- [ ] T010 [P] DateRangePicker 컴포넌트 생성 (날짜 범위 선택) (src/components/ui/DateRangePicker.tsx)

### 테이블 컴포넌트

- [ ] T011 [P] Table 컴포넌트 생성 (테이블 컨테이너) (src/components/ui/Table/Table.tsx)
- [ ] T012 [P] TableHeader 컴포넌트 생성 (헤더 행) (src/components/ui/Table/TableHeader.tsx)
- [ ] T013 [P] TableRow 컴포넌트 생성 (데이터 행) (src/components/ui/Table/TableRow.tsx)
- [ ] T014 [P] TablePagination 컴포넌트 생성 (페이지네이션) (src/components/ui/Table/TablePagination.tsx)
- [ ] T015 Table 컴포넌트 index 파일 생성 (src/components/ui/Table/index.ts)

### 공통 커스텀 훅

- [ ] T016 [P] useFilters 훅 생성 (URL 쿼리 파라미터 기반 필터) (src/hooks/useFilters.ts)
- [ ] T017 [P] useSelection 훅 생성 (체크박스 선택 상태 관리) (src/hooks/useSelection.ts)
- [ ] T018 [P] usePagination 훅 생성 (페이지네이션 상태 관리) (src/hooks/usePagination.ts)

### UI 컴포넌트 index 업데이트

- [ ] T019 ui/index.ts 업데이트하여 새 컴포넌트 export (src/components/ui/index.ts)

**체크포인트**: 기반 구축 완료 - 유저 스토리 구현 시작 가능

---

## Phase 3: 유저 스토리 5 - 공통 사이드바 네비게이션 (우선순위: P1) 🎯 MVP 기반

**목표**: 모든 관리자 페이지에서 사이드바를 통해 다른 페이지로 쉽게 이동

**독립 테스트**: 어떤 관리자 페이지에서든 사이드바의 메뉴 항목을 클릭하면 해당 페이지로 이동하고, 현재 페이지 메뉴가 활성화 상태로 표시됨

### 유저 스토리 5 공유 컴포넌트

- [ ] T020 [P] [US5] Mock 사이드바 사용자 데이터 생성 (src/lib/mock-data/sidebar.ts)

### 유저 스토리 5 구현

- [ ] T021 [US5] Sidebar 컴포넌트 생성 (다크 배경, 로고, 메뉴) (src/components/layout/Sidebar.tsx)
- [ ] T022 [US5] PageHeader 컴포넌트 생성 (날짜, 알림, 프로필) (src/components/layout/PageHeader.tsx)
- [ ] T023 [US5] ProfileButton 컴포넌트 생성 (이니셜 아바타) (src/components/layout/ProfileButton.tsx)
- [ ] T024 [US5] 관리자 레이아웃 생성 (사이드바 + 메인 영역) (src/app/(admin)/layout.tsx)
- [ ] T025 [US5] 기존 대시보드 페이지를 (admin) 그룹으로 이동 (src/app/(admin)/dashboard/page.tsx)

**체크포인트**: 유저 스토리 5 완료 - 사이드바 네비게이션 독립적으로 테스트 가능

---

## Phase 4: 유저 스토리 1 - 대시보드 홈에서 현황 파악 (우선순위: P1)

**목표**: 관리자가 대시보드 홈에서 KPI, 최근 보고서, 알림을 한눈에 파악

**독립 테스트**: 로그인 후 /dashboard에 접속하면 4개의 KPI 카드, 최근 보고서 5건, 알림 4건이 표시됨

### 유저 스토리 1 Mock 데이터

- [ ] T026 [P] [US1] Mock 대시보드 KPI 데이터 생성 (src/lib/mock-data/dashboard.ts)
- [ ] T027 [P] [US1] Mock 최근 보고서 데이터 생성 (src/lib/mock-data/dashboard.ts에 추가)
- [ ] T028 [P] [US1] Mock 알림 데이터 생성 (src/lib/mock-data/dashboard.ts에 추가)

### 유저 스토리 1 커스텀 훅

- [ ] T029 [US1] useDashboardKPI 훅 생성 (KPI 데이터 fetching) (src/hooks/useDashboardKPI.ts)

### 유저 스토리 1 컴포넌트

- [ ] T030 [P] [US1] KPICard 컴포넌트 생성 (값, 증감, 프로그레스 바) (src/components/features/dashboard/KPICard.tsx)
- [ ] T031 [US1] KPIGrid 컴포넌트 생성 (4개 카드 가로 배열) (src/components/features/dashboard/KPIGrid.tsx)
- [ ] T032 [US1] RecentReportList 컴포넌트 생성 (최근 보고서 5건) (src/components/features/dashboard/RecentReportList.tsx)
- [ ] T033 [US1] NotificationPanel 컴포넌트 생성 (알림 목록) (src/components/features/dashboard/NotificationPanel.tsx)

### 유저 스토리 1 페이지 구현

- [ ] T034 [US1] 대시보드 홈 페이지 구현 (KPI + 보고서 + 알림 조합) (src/app/(admin)/dashboard/page.tsx 업데이트)

**체크포인트**: 유저 스토리 1 완료 - 대시보드 홈 독립적으로 테스트 가능

---

## Phase 5: 유저 스토리 2 - 돌봄 일지 목록 조회 및 필터링 (우선순위: P1)

**목표**: 관리자가 돌봄 일지 목록을 조회하고 상태/날짜/검색어로 필터링

**독립 테스트**: /care-logs에 접속하면 테이블과 상태 탭, 필터를 통해 원하는 보고서 조회 가능

### 유저 스토리 2 Mock 데이터

- [ ] T035 [P] [US2] Mock 돌봄 일지 데이터 생성 (42건) (src/lib/mock-data/care-logs.ts)

### 유저 스토리 2 커스텀 훅

- [ ] T036 [US2] useCareLogs 훅 생성 (필터링, 페이지네이션 포함) (src/hooks/useCareLogs.ts)

### 유저 스토리 2 컴포넌트

- [ ] T037 [P] [US2] CareLogFilters 컴포넌트 생성 (검색, 날짜, 드롭다운) (src/components/features/dashboard/CareLogFilters.tsx)
- [ ] T038 [US2] CareLogTable 컴포넌트 생성 (테이블 + 상태 탭) (src/components/features/dashboard/CareLogTable.tsx)

### 유저 스토리 2 페이지 구현

- [ ] T039 [US2] 돌봄 일지 목록 페이지 생성 (src/app/(admin)/care-logs/page.tsx)

**체크포인트**: 유저 스토리 2 완료 - 돌봄 일지 조회/필터링 독립적으로 테스트 가능

---

## Phase 6: 유저 스토리 3 - 돌봄 일지 일괄 처리 (우선순위: P2)

**목표**: 관리자가 여러 보고서를 선택하여 일괄 승인/반려/PDF 내보내기

**독립 테스트**: 3건 선택 시 "3건 선택됨" 배지 표시, 일괄 버튼 활성화

### 유저 스토리 3 컴포넌트

- [ ] T040 [P] [US3] BulkActionBar 컴포넌트 생성 (선택 개수, 일괄 버튼) (src/components/features/dashboard/BulkActionBar.tsx)

### 유저 스토리 3 기능 구현

- [ ] T041 [US3] CareLogTable에 체크박스 선택 기능 추가 (src/components/features/dashboard/CareLogTable.tsx 업데이트)
- [ ] T042 [US3] 일괄 승인/반려 상태 변경 로직 구현 (src/hooks/useCareLogs.ts 업데이트)
- [ ] T043 [US3] PDF 내보내기 기능 구현 (react-to-print 연동) (src/lib/utils/export.ts 업데이트)
- [ ] T044 [US3] 돌봄 일지 페이지에 BulkActionBar 통합 (src/app/(admin)/care-logs/page.tsx 업데이트)

**체크포인트**: 유저 스토리 3 완료 - 일괄 처리 기능 독립적으로 테스트 가능

---

## Phase 7: 유저 스토리 4 - 대상자 관리 목록 조회 (우선순위: P1)

**목표**: 관리자가 대상자 현황 파악 및 상태별 필터링, Excel 내보내기

**독립 테스트**: /recipients에 접속하면 892명의 대상자 목록과 KPI 표시, Excel 내보내기 가능

### 유저 스토리 4 Mock 데이터

- [ ] T045 [P] [US4] Mock 대상자 데이터 생성 (892명 중 샘플) (src/lib/mock-data/recipients.ts)

### 유저 스토리 4 커스텀 훅

- [ ] T046 [US4] useRecipients 훅 생성 (필터링, 페이지네이션, 내보내기) (src/hooks/useRecipients.ts)

### 유저 스토리 4 컴포넌트

- [ ] T047 [P] [US4] RecipientKPIGrid 컴포넌트 생성 (5개 KPI 카드) (src/components/features/dashboard/RecipientKPIGrid.tsx)
- [ ] T048 [P] [US4] RecipientFilters 컴포넌트 생성 (검색, 동, 매니저) (src/components/features/dashboard/RecipientFilters.tsx)
- [ ] T049 [US4] RecipientTable 컴포넌트 생성 (아바타, 상태 탭) (src/components/features/dashboard/RecipientTable.tsx)

### 유저 스토리 4 페이지 구현

- [ ] T050 [US4] 대상자 관리 목록 페이지 생성 (src/app/(admin)/recipients/page.tsx)
- [ ] T051 [US4] Excel 내보내기 버튼 및 로직 연동 (src/app/(admin)/recipients/page.tsx 업데이트)

**체크포인트**: 유저 스토리 4 완료 - 대상자 관리 및 Excel 내보내기 독립적으로 테스트 가능

---

## Phase 8: 마무리 및 공통 관심사

**목적**: 여러 유저 스토리에 영향을 미치는 개선 사항

- [ ] T052 [P] 모든 컴포넌트에 로딩 상태 추가 (스켈레톤/스피너)
- [ ] T053 [P] 빈 상태(Empty State) UI 추가 (검색 결과 없음 등)
- [ ] T054 [P] 에러 상태 UI 추가 (네트워크 오류 등)
- [ ] T055 [P] 모바일 기기를 위한 반응형 디자인 적용
- [ ] T056 [P] WCAG AA 준수 확인 (대비율, 최소 글자 크기, 클릭 영역)
- [ ] T057 [P] 키보드 네비게이션 지원 추가 (포커스 관리, 탭 순서)
- [ ] T058 코드 정리: 미사용 import 제거, 한글 주석 추가
- [ ] T059 npm run build로 빌드 검증 실행 완료

---

## 의존성 및 실행 순서

### Phase 의존성

- **초기 설정 (Phase 1)**: 의존성 없음 - 즉시 시작 가능
- **기반 구축 (Phase 2)**: 초기 설정 완료 후 진행 - 모든 유저 스토리를 차단
- **유저 스토리 5 (Phase 3)**: 기반 구축 후 시작 - 다른 스토리의 레이아웃 기반
- **유저 스토리 1 (Phase 4)**: Phase 3 완료 후 시작 (레이아웃 필요)
- **유저 스토리 2 (Phase 5)**: Phase 3 완료 후 시작 (레이아웃 필요)
- **유저 스토리 3 (Phase 6)**: Phase 5 완료 후 시작 (CareLogTable 필요)
- **유저 스토리 4 (Phase 7)**: Phase 3 완료 후 시작 (레이아웃 필요)
- **마무리 (Phase 8)**: 모든 유저 스토리 완료 후 진행

### 유저 스토리 간 의존성

```text
Phase 1: 초기 설정
    ↓
Phase 2: 기반 구축
    ↓
Phase 3: US5 사이드바 (레이아웃)
    ↓
    ├── Phase 4: US1 대시보드 홈 (병렬 가능)
    ├── Phase 5: US2 돌봄 일지 조회 (병렬 가능)
    │       ↓
    │   Phase 6: US3 돌봄 일지 일괄 처리
    └── Phase 7: US4 대상자 관리 (병렬 가능)
            ↓
        Phase 8: 마무리
```

### 각 유저 스토리 내 순서

- Mock 데이터 먼저
- 커스텀 훅 그 다음
- 컴포넌트 (병렬 가능한 것 먼저)
- 페이지 통합 마지막

### 병렬 실행 기회

- [P] 표시된 모든 기반 구축 태스크는 병렬 실행 가능 (Phase 2 내에서)
- Phase 3 완료 후, US1, US2, US4는 병렬 시작 가능
- 스토리 내 [P] 표시된 Mock 데이터/컴포넌트 태스크는 병렬 실행 가능

---

## 병렬 실행 예시: 기반 구축 Phase

```bash
# 모든 유틸리티 함수를 동시에 실행:
태스크: "날짜 포맷 유틸리티 생성 (src/lib/utils/date.ts)"
태스크: "상태 색상/레이블 유틸리티 생성 (src/lib/utils/status.ts)"
태스크: "Excel 내보내기 유틸리티 생성 (src/lib/utils/export.ts)"

# 모든 기본 UI 컴포넌트를 동시에 실행:
태스크: "Badge 컴포넌트 생성 (src/components/ui/Badge.tsx)"
태스크: "Tabs 컴포넌트 생성 (src/components/ui/Tabs.tsx)"
태스크: "SearchInput 컴포넌트 생성 (src/components/ui/SearchInput.tsx)"
태스크: "DateRangePicker 컴포넌트 생성 (src/components/ui/DateRangePicker.tsx)"

# 모든 테이블 컴포넌트를 동시에 실행:
태스크: "Table 컴포넌트 생성 (src/components/ui/Table/Table.tsx)"
태스크: "TableHeader 컴포넌트 생성 (src/components/ui/Table/TableHeader.tsx)"
태스크: "TableRow 컴포넌트 생성 (src/components/ui/Table/TableRow.tsx)"
태스크: "TablePagination 컴포넌트 생성 (src/components/ui/Table/TablePagination.tsx)"
```

## 병렬 실행 예시: 레이아웃 완료 후

```bash
# Phase 3 (사이드바) 완료 후, 세 개의 유저 스토리를 병렬로 시작 가능:
개발자 A: "유저 스토리 1 - 대시보드 홈"
개발자 B: "유저 스토리 2 - 돌봄 일지 조회"
개발자 C: "유저 스토리 4 - 대상자 관리"
```

---

## 구현 전략

### MVP 우선 (유저 스토리 5 + 1만)

1. Phase 1: 초기 설정 완료
2. Phase 2: 기반 구축 완료 (중요 - 모든 스토리 차단)
3. Phase 3: 유저 스토리 5 (사이드바) 완료
4. Phase 4: 유저 스토리 1 (대시보드 홈) 완료
5. **중단 및 검증**: 로그인 후 대시보드 접속 테스트
6. 준비되면 배포/데모

### 점진적 전달

1. 초기 설정 + 기반 구축 완료 → 기반 준비 완료
2. 유저 스토리 5 (사이드바) → 레이아웃 기반 완료
3. 유저 스토리 1 (대시보드 홈) 추가 → 테스트 → 배포/데모 (MVP!)
4. 유저 스토리 2 (돌봄 일지 조회) 추가 → 테스트 → 배포/데모
5. 유저 스토리 3 (일괄 처리) 추가 → 테스트 → 배포/데모
6. 유저 스토리 4 (대상자 관리) 추가 → 테스트 → 배포/데모
7. 각 스토리는 이전 스토리를 깨뜨리지 않으면서 가치를 추가

### 병렬 팀 전략

여러 개발자가 있는 경우:

1. 팀이 함께 초기 설정 + 기반 구축 완료
2. 한 명이 유저 스토리 5 (사이드바) 완료
3. 사이드바 완료 후:
   - 개발자 A: 유저 스토리 1 (대시보드 홈)
   - 개발자 B: 유저 스토리 2 (돌봄 일지 조회)
   - 개발자 C: 유저 스토리 4 (대상자 관리)
4. US2 완료 후 개발자 B가 유저 스토리 3 (일괄 처리) 진행
5. 각 스토리는 독립적으로 완료 및 통합

---

## 참고 사항

- [P] 태스크 = 다른 파일, 의존성 없음
- [Story] 라벨은 추적을 위해 태스크를 특정 유저 스토리에 매핑
- 각 유저 스토리는 독립적으로 완료 및 테스트 가능해야 함
- 각 태스크 또는 논리적 그룹 완료 후 커밋
- 스토리를 독립적으로 검증하기 위해 체크포인트에서 중단 가능
- 피해야 할 것: 모호한 태스크, 같은 파일 충돌, 독립성을 깨뜨리는 스토리 간 의존성
