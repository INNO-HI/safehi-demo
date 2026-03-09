# Research: 설정 페이지 (Admin Settings)

**Feature**: 005-admin-settings
**Date**: 2026-02-19

## 연구 항목

### 1. Toggle 컴포넌트 구현 방식

**Decision**: 커스텀 Toggle 컴포넌트를 `src/components/ui/Toggle.tsx`에 생성한다.

**Rationale**:
- 기존 UI 컴포넌트에 토글 스위치가 없음 (Checkbox만 존재)
- 피그마 시안에서 ON/OFF 토글 스위치가 6개 사용됨 (알림 4개 + 시스템 2개)
- 기존 컴포넌트 패턴(forwardRef, cn 유틸, 접근성 레이블)과 동일하게 구현
- `<input type="checkbox" role="switch">` 패턴으로 접근성 확보

**Alternatives considered**:
- Headless UI Toggle: 추가 의존성 불필요, 프로젝트에서 사용하지 않음
- 외부 토글 라이브러리(react-toggle 등): 번들 크기 증가, 스타일 커스텀 어려움
- Checkbox 컴포넌트 변형: 시안의 토글 UI와 시각적으로 다름

### 2. 설정 상태 관리 방식

**Decision**: Zustand store with persist middleware를 사용한다 (`useSettings` 훅).

**Rationale**:
- 기존 프로젝트에서 useAuth가 Zustand + persist 패턴을 사용 중
- 설정 데이터는 세션 간 유지가 필요 (알림 토글, 시스템 설정)
- Mock 데이터에서 시작하여 추후 API 교체 시 store 액션만 변경하면 됨
- 토글 변경 시 즉시 반영(optimistic update) 패턴에 적합

**Alternatives considered**:
- React Query: 백엔드 API 미구현 상태에서 과도, 캐싱 불필요
- React Context: Zustand보다 보일러플레이트 많음, 기존 패턴과 불일치
- localStorage 직접 사용: 반응성 없음, 컴포넌트 리렌더 미지원

### 3. 계정 정보 인라인 편집 패턴

**Decision**: 각 필드별 "변경" 버튼 클릭 시 해당 필드만 인라인 편집 모드로 전환한다.

**Rationale**:
- 피그마 시안에서 각 필드에 개별 "변경" 버튼 존재
- 한 번에 하나의 필드만 편집 가능하게 하여 실수 방지 (40~60대 사용자 배려)
- 편집 모드: 값 텍스트 → Input 컴포넌트로 교체 + "저장"/"취소" 버튼
- React Hook Form + Zod로 개별 필드 유효성 검사

**Alternatives considered**:
- 모달 기반 편집: 시안과 불일치, 사용자 흐름 끊김
- 전체 폼 편집: 시안에서 개별 "변경" 버튼으로 디자인됨
- 별도 편집 페이지: 과도한 네비게이션, 사용자 혼란 가능

### 4. 비밀번호 변경 UI 패턴

**Decision**: 모달 다이얼로그를 사용한다 (`PasswordChangeModal`).

**Rationale**:
- 비밀번호 변경은 3단계(현재 비밀번호, 새 비밀번호, 확인)로 별도 폼 필요
- 기존 Modal 컴포넌트(`src/components/ui/Modal.tsx`) 재활용
- 인라인 편집으로는 3개 입력 필드를 배치하기 어려움
- React Hook Form + Zod로 유효성 검사 (비밀번호 일치, 강도 등)

**Alternatives considered**:
- 인라인 확장: 레이아웃 깨짐, 공간 부족
- 별도 페이지: 과도한 네비게이션
- 브라우저 기본 prompt: 접근성/UX 불량

### 5. 관할 구역 "전체보기" 구현 방식

**Decision**: 모달 또는 드롭다운 확장으로 전체 동 목록을 표시한다.

**Rationale**:
- 18개 동 목록은 요약 형태(7개 + 외 11개)로 표시하고 전체보기 시 확장
- 간단한 정보 표시이므로 모달보다 아코디언/드롭다운 확장이 적절
- 읽기 전용 데이터이므로 복잡한 인터랙션 불필요

**Alternatives considered**:
- 별도 페이지: 단순 목록에 과도
- 항상 전체 표시: 공간 낭비, 시안과 불일치

### 6. 사이드바 설정 메뉴 추가

**Decision**: `sidebar-defaults.ts`의 `defaultSidebarMenuItems` 배열에 설정 항목을 추가한다.

**Rationale**:
- 기존 사이드바에 `icon: 'settings'` 타입이 이미 SidebarMenuItem 타입에 정의됨
- 피그마 시안에서 "설정" 메뉴가 사이드바 하단에 위치
- 경로: `/settings` (기존 `(admin)` 레이아웃 그룹 활용)

**Alternatives considered**:
- 별도 사이드바 수정: 불필요, 기존 데이터 배열에 추가로 충분
- 설정 아이콘만 헤더에: 시안과 불일치

### 7. 사이드바 설정 메뉴 경로

**Decision**: `/settings` 경로를 사용한다 (spec의 `/admin/settings`가 아닌).

**Rationale**:
- 기존 페이지들의 라우팅 패턴 확인: `/dashboard`, `/care-logs`, `/recipients`, `/managers`
- 모두 `src/app/(admin)/` 라우트 그룹 아래에 있지만 URL에 `admin`이 포함되지 않음
- `(admin)`은 Next.js 라우트 그룹(괄호)으로 URL에 영향 없음
- 따라서 실제 URL은 `/settings`이며, spec의 `/admin/settings`는 라우트 그룹을 의미

**Alternatives considered**:
- `/admin/settings`: 기존 패턴과 불일치 (다른 페이지도 `/admin/` 접두사 없음)

### 8. 통계/리포트 페이지 사이드바 항목

**Decision**: 사이드바에 통계/리포트 메뉴 항목도 함께 추가한다.

**Rationale**:
- 현재 sidebar-defaults.ts에 통계/리포트(`/statistics`) 항목이 누락되어 있음
- 기존 구현된 페이지이므로 설정 추가 시 함께 반영
- 피그마 시안의 사이드바에 "통계/리포트"와 "설정" 모두 표시됨

**Alternatives considered**:
- 설정만 추가: 기존 누락 항목 방치
