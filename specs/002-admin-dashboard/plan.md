# Implementation Plan: 관리자 대시보드

**Branch**: `002-admin-dashboard` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-admin-dashboard/spec.md`

## Summary

관리자 대시보드 프론트엔드 구현: 대시보드 홈(/dashboard), 돌봄 일지 목록(/care-logs), 대상자 관리 목록(/recipients) 3개 페이지. Next.js 14 App Router + TypeScript + Tailwind CSS 기반으로 Mock 데이터 사용, 추후 백엔드 API 연동 대비 설계.

## Technical Context

**Language/Version**: TypeScript 5.x + Next.js 14 (App Router)
**Primary Dependencies**: React 18, Tailwind CSS, Zustand, React Hook Form, Zod, xlsx (SheetJS), react-to-print
**Storage**: N/A (프론트엔드 전용, Mock 데이터 사용)
**Testing**: Vitest + Testing Library
**Target Platform**: Web (데스크톱 우선, 반응형)
**Project Type**: Web Application (Next.js)
**Performance Goals**: 페이지 로드 2초 이내, 필터링 즉시 반응
**Constraints**: WCAG AA 접근성 준수, 최소 글자 12px, 터치 영역 44x44px
**Scale/Scope**: 3개 페이지, 약 15개 컴포넌트, 5개 커스텀 훅

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. 접근성 최우선 | ✅ PASS | 최소 글자 12px, 본문 14px, 터치 44x44px, WCAG AA 대비율 |
| II. 디자인 시스템 | ✅ PASS | Pretendard 폰트, 4px 간격 시스템, 색상 토큰 적용 |
| III. 돌봄 유형 구분 | ✅ PASS | 상태별 색상/아이콘 구분 (긴급 빨강, 대기 노랑 등) |
| IV. 권한 체계 | ✅ PASS | 관리자 전용 페이지, 인증 가드 적용 |
| V. 기술 스택 | ✅ PASS | Next.js 14, TypeScript strict, Tailwind, Zustand |
| VI. 코드 품질 | ✅ PASS | ESLint + Prettier, 재사용 컴포넌트, 한글 주석 |
| VII. 프로젝트 구조 | ✅ PASS | Constitution VII 폴더 구조 준수 |

**Gate Result**: ✅ PASS - 모든 원칙 준수, Phase 0 진행 가능

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-dashboard/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output - 기술 조사
├── data-model.md        # Phase 1 output - 데이터 모델
├── quickstart.md        # Phase 1 output - 빠른 시작 가이드
├── contracts/           # Phase 1 output - API 명세
│   └── dashboard-api.yaml
├── checklists/
│   └── requirements.md  # 요구사항 체크리스트
└── tasks.md             # Phase 2 output (별도 생성)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (admin)/                    # 관리자 Route Group
│   │   ├── layout.tsx              # 관리자 레이아웃 (사이드바)
│   │   ├── dashboard/
│   │   │   └── page.tsx            # 대시보드 홈
│   │   ├── care-logs/
│   │   │   └── page.tsx            # 돌봄 일지 목록
│   │   └── recipients/
│   │       └── page.tsx            # 대상자 관리 목록
│   └── (auth)/                     # 기존 인증 레이아웃
│
├── components/
│   ├── ui/
│   │   ├── Badge.tsx               # 상태 배지
│   │   ├── Table/                  # 테이블 컴포넌트
│   │   │   ├── Table.tsx
│   │   │   ├── TableHeader.tsx
│   │   │   ├── TableRow.tsx
│   │   │   └── TablePagination.tsx
│   │   ├── Tabs.tsx                # 상태 탭
│   │   ├── DateRangePicker.tsx     # 날짜 범위 선택
│   │   └── SearchInput.tsx         # 검색 입력
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx             # 사이드바 네비게이션
│   │   ├── PageHeader.tsx          # 페이지 헤더
│   │   └── ProfileButton.tsx       # 프로필 버튼
│   │
│   └── features/
│       └── dashboard/
│           ├── KPICard.tsx         # KPI 카드
│           ├── KPIGrid.tsx         # KPI 카드 그리드
│           ├── RecentReportList.tsx # 최근 보고서 목록
│           ├── NotificationPanel.tsx # 알림 패널
│           ├── CareLogTable.tsx     # 돌봄 일지 테이블
│           ├── CareLogFilters.tsx   # 돌봄 일지 필터
│           ├── RecipientTable.tsx   # 대상자 테이블
│           └── RecipientFilters.tsx # 대상자 필터
│
├── hooks/
│   ├── useDashboardKPI.ts          # 대시보드 KPI 훅
│   ├── useCareLogs.ts              # 돌봄 일지 훅
│   ├── useRecipients.ts            # 대상자 훅
│   ├── useFilters.ts               # URL 기반 필터 훅
│   └── useSelection.ts             # 체크박스 선택 훅
│
├── lib/
│   ├── mock-data/
│   │   ├── dashboard.ts            # 대시보드 Mock 데이터
│   │   ├── care-logs.ts            # 돌봄 일지 Mock 데이터
│   │   └── recipients.ts           # 대상자 Mock 데이터
│   │
│   └── utils/
│       ├── export.ts               # Excel/PDF 내보내기 유틸
│       ├── date.ts                 # 날짜 포맷 유틸
│       └── status.ts               # 상태 색상/레이블 유틸
│
└── types/
    └── dashboard.ts                # 대시보드 관련 타입
```

**Structure Decision**: Next.js App Router의 Route Group `(admin)` 사용. 기존 `(auth)` 그룹과 분리하여 관리자 전용 레이아웃(사이드바) 적용. Constitution VII 폴더 구조 준수.

## Complexity Tracking

> **No violations identified** - 모든 Constitution 원칙 준수

## Phase 0 Output

- [research.md](./research.md) - 완료
  - Excel 내보내기: SheetJS (xlsx)
  - PDF 내보내기: react-to-print
  - 테이블: 커스텀 구현
  - 필터 상태: URL 쿼리 파라미터
  - 레이아웃: Route Group + Layout

## Phase 1 Output

- [data-model.md](./data-model.md) - 완료
  - 9개 Entity 정의 (DashboardKPI, CareLog, Recipient 등)
  - 타입스크립트 인터페이스
  - 상태 전이 규칙
  - Excel Export 스키마

- [contracts/dashboard-api.yaml](./contracts/dashboard-api.yaml) - 완료
  - OpenAPI 3.0 명세
  - 13개 엔드포인트 정의
  - Mock 함수로 구현 예정

- [quickstart.md](./quickstart.md) - 완료
  - 의존성 설치 가이드
  - 초기 코드 템플릿
  - 폴더 구조 생성 스크립트

## 다음 단계

`/speckit.tasks` 명령으로 구현 태스크 목록 생성 필요:

1. Phase 1: 초기 설정 (의존성, 타입, 폴더 구조)
2. Phase 2: 기반 구축 (UI 컴포넌트, Mock 데이터, 훅)
3. Phase 3: 대시보드 홈 구현
4. Phase 4: 돌봄 일지 목록 구현
5. Phase 5: 대상자 관리 목록 구현
6. Phase 6: 마무리 (접근성, 반응형, 빌드 검증)
