# Implementation Plan: 매니저 관리 페이지

**Branch**: `002-admin-dashboard` | **Date**: 2026-01-14 | **Spec**: [spec-manager-pages.md](./spec-manager-pages.md)
**Input**: Feature specification from `/specs/002-admin-dashboard/spec-manager-pages.md`

## Summary

매니저 관리 기능은 관리자가 관할 지역의 돌봄 매니저를 조회하고 관리할 수 있는 4개의 페이지로 구성됩니다.
- 매니저 목록 페이지 (/managers)
- 매니저 상세 페이지 (/managers/[id])
- 매니저 보고서 전체 페이지 (/managers/[id]/reports)
- 매니저 방문 기록 전체 페이지 (/managers/[id]/visits)

기존 대상자 관리(recipients) 및 돌봄 일지(care-logs) 페이지의 패턴을 재사용하여 일관된 UX를 제공합니다.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 14 (App Router), React 18, Tailwind CSS
**Storage**: Mock 데이터 (src/lib/mock-data/)
**Testing**: Vitest + Testing Library
**Target Platform**: Web (Chrome, Safari, Firefox, Edge)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: 페이지 로드 2초 이내, 필터링 응답 200ms 이내
**Constraints**: 접근성 WCAG AA 준수, 최소 글자 12px, 클릭 영역 44x44px
**Scale/Scope**: 50명 이내 매니저 Mock 데이터, 4개 페이지

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Compliance |
|-----------|-------------|------------|
| I. 접근성 최우선 | 최소 글자 12px, 본문 14px, WCAG AA, 클릭 44x44px | ✅ FR-029~031에서 명시 |
| II. 디자인 시스템 | Pretendard 폰트, 4px 간격, 버튼 8px/카드 12px 모서리 | ✅ 기존 컴포넌트 재사용 |
| III. 돌봄 유형 구분 | 방문🏠(파랑), 전화📞(보라), 긴급🚨(빨강) | ✅ 방문 기록 페이지에 적용 |
| IV. 권한 체계 | 관리자 권한으로 전체 매니저 조회 | ✅ 관리자 전용 페이지 |
| V. 기술 스택 | Next.js 14+, TypeScript strict, Tailwind | ✅ 기존 스택 사용 |
| VI. 코드 품질 | ESLint + Prettier, 재사용 가능 컴포넌트 | ✅ 기존 패턴 준수 |
| VII. 프로젝트 구조 | src/app, components, hooks, lib, types | ✅ 기존 구조 유지 |

**Status**: ✅ 모든 원칙 준수

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-dashboard/
├── spec-manager-pages.md        # 매니저 관리 스펙
├── plan-manager-pages.md        # 이 파일 (구현 계획)
├── research-manager-pages.md    # Phase 0 리서치 결과
├── data-model-manager-pages.md  # Phase 1 데이터 모델
├── contracts/                   # Phase 1 API 계약
│   └── manager-api.yaml
└── tasks-manager-pages.md       # Phase 2 태스크 목록
```

### Source Code (repository root)

```text
src/
├── app/(admin)/
│   └── managers/                   # 매니저 관리 페이지 (신규)
│       ├── page.tsx                # 목록 페이지
│       └── [id]/
│           ├── page.tsx            # 상세 페이지
│           ├── loading.tsx         # 로딩 UI
│           ├── reports/
│           │   └── page.tsx        # 보고서 전체 페이지
│           └── visits/
│               └── page.tsx        # 방문 기록 전체 페이지
├── components/
│   └── features/
│       └── dashboard/
│           ├── ManagerTable.tsx    # 매니저 테이블 (신규)
│           └── ManagerDetailSkeleton.tsx # 스켈레톤 (신규)
├── hooks/
│   ├── useManagers.ts              # 매니저 목록 훅 (신규)
│   └── useManagerDetail.ts         # 매니저 상세 훅 (신규)
├── lib/
│   ├── mock-data/
│   │   └── managers.ts             # 매니저 Mock 데이터 (신규)
│   └── utils/
│       └── export.ts               # Excel 내보내기 (확장)
└── types/
    └── dashboard.ts                # 타입 확장 (Manager 관련)
```

**Structure Decision**: Next.js App Router 구조를 유지하며, 기존 대상자 관리(recipients) 및 돌봄 일지(care-logs) 페이지 패턴을 재사용합니다.

## Complexity Tracking

> No Constitution Check violations requiring justification.

## Reusable Patterns

### 기존 컴포넌트 재사용

| 컴포넌트 | 위치 | 재사용 방법 |
|----------|------|-------------|
| Table, TableHead, TableBody, etc. | components/ui/Table | 매니저 테이블에 직접 사용 |
| Badge | components/ui/Badge | 상태 배지 표시 |
| Tabs | components/ui/Tabs | 상태별 필터 탭 |
| Button | components/ui/Button | 내보내기, 뒤로가기 버튼 |
| TablePagination | components/ui/Table | 페이지네이션 |

### 기존 훅 재사용

| 훅 | 위치 | 재사용 방법 |
|----|------|-------------|
| usePagination | hooks/usePagination | 목록 페이지네이션 |
| useFilters | hooks/useFilters | 필터 상태 관리 |
| useSelection | hooks/useSelection | 체크박스 선택 (필요시) |

### 기존 Mock 데이터 패턴

| 파일 | 참고 패턴 |
|------|-----------|
| recipients.ts | 목록 데이터 생성, 필터링 함수 |
| recipient-details.ts | 상세 데이터 구조 |
| care-logs.ts | 보고서 목록 구조 |
| visits.ts | 방문 기록 목록 구조 |
