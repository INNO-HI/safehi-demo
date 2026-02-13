# Implementation Plan: 관리자 대시보드 상세 페이지

**Branch**: `002-admin-dashboard` | **Date**: 2026-01-12 | **Spec**: [spec-detail-pages.md](./spec-detail-pages.md)
**Input**: 돌봄 일지 상세, 대상자 상세, 담당자 메모, 방문 기록, AI 정책 추천 페이지

## Summary

기존 002-admin-dashboard의 목록 페이지에서 상세 페이지로 진입하는 5개 페이지를 추가 구현합니다.
- 돌봄 일지 상세 (`/care-logs/[id]`): 승인/반려 처리 포함
- 대상자 상세 (`/recipients/[id]`): 기본 정보, 건강 정보, 최근 방문 요약
- 담당자 메모 (`/recipients/[id]/memos`): 메모 CRUD
- 방문 기록 (`/recipients/[id]/visits`): 타임라인 형식
- AI 정책 추천 (`/recipients/[id]/policies`): 아코디언 UI

## Technical Context

**Language/Version**: TypeScript 5.x + Next.js 14 (App Router)
**Primary Dependencies**: React 18, Tailwind CSS, react-hook-form, zod
**Additional Dependencies**: yet-another-react-lightbox, @radix-ui/react-dialog, @radix-ui/react-accordion
**Storage**: Mock 데이터 (클라이언트 사이드)
**Testing**: Vitest + Testing Library
**Target Platform**: Web (Desktop 우선, 반응형)
**Project Type**: Web Application
**Performance Goals**: 페이지 로드 2초 이내
**Constraints**: 접근성 (44x44px 터치 영역, WCAG AA 대비율)
**Scale/Scope**: 5개 페이지, 5개 커스텀 훅, 10+ 컴포넌트

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. 접근성 최우선 | ✅ PASS | 44x44px 터치 영역, 14px 이상 본문, WCAG AA |
| II. 디자인 시스템 | ✅ PASS | Pretendard 폰트, 4px 간격, 8/12/16px 모서리 |
| III. 돌봄 유형 구분 | ✅ PASS | 방문/전화 아이콘+색상 구분 |
| IV. 권한 체계 | ✅ PASS | 관리자만 승인/반려 가능 |
| V. 기술 스택 | ✅ PASS | Next.js 14, TypeScript, Tailwind, RHF+Zod |
| VI. 코드 품질 | ✅ PASS | ESLint, Prettier, 한글 주석 |
| VII. 프로젝트 구조 | ✅ PASS | app/(admin), components/features |

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-dashboard/
├── plan.md                         # 목록 페이지 계획 (기존)
├── plan-detail-pages.md            # 상세 페이지 계획 (이 파일)
├── research.md                     # 목록 페이지 연구 (기존)
├── research-detail-pages.md        # 상세 페이지 연구
├── data-model.md                   # 목록 페이지 데이터 모델 (기존)
├── data-model-detail-pages.md      # 상세 페이지 데이터 모델
├── quickstart.md                   # 목록 페이지 시작 가이드 (기존)
├── quickstart-detail-pages.md      # 상세 페이지 시작 가이드
├── contracts/
│   ├── dashboard-api.yaml          # 목록 API (기존)
│   └── detail-pages-api.yaml       # 상세 페이지 API
├── checklists/
│   ├── requirements.md             # 목록 요구사항 (기존)
│   └── requirements-detail-pages.md # 상세 요구사항
├── spec.md                         # 목록 기능 명세 (기존)
├── spec-detail-pages.md            # 상세 기능 명세
└── tasks.md                        # 전체 작업 목록 (갱신 필요)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (admin)/
│       ├── layout.tsx                    # 관리자 레이아웃 (기존)
│       ├── dashboard/page.tsx            # 대시보드 홈 (기존)
│       ├── care-logs/
│       │   ├── page.tsx                  # 돌봄 일지 목록 (기존)
│       │   └── [id]/
│       │       ├── page.tsx              # 돌봄 일지 상세 (신규)
│       │       ├── loading.tsx           # 로딩 UI (신규)
│       │       └── error.tsx             # 에러 UI (신규)
│       └── recipients/
│           ├── page.tsx                  # 대상자 목록 (기존)
│           └── [id]/
│               ├── page.tsx              # 대상자 상세 (신규)
│               ├── loading.tsx
│               ├── memos/
│               │   └── page.tsx          # 담당자 메모 (신규)
│               ├── visits/
│               │   └── page.tsx          # 방문 기록 (신규)
│               └── policies/
│                   └── page.tsx          # AI 정책 추천 (신규)
├── components/
│   ├── ui/
│   │   ├── Modal.tsx                     # 모달 컴포넌트 (신규)
│   │   ├── Skeleton.tsx                  # 스켈레톤 컴포넌트 (신규)
│   │   ├── Accordion.tsx                 # 아코디언 컴포넌트 (신규)
│   │   └── ... (기존)
│   └── features/
│       ├── care-log/                     # 돌봄 일지 관련 (신규)
│       │   ├── CareLogDetailHeader.tsx
│       │   ├── VisitInfoCard.tsx
│       │   ├── CareContentCards.tsx
│       │   ├── PhotoGrid.tsx
│       │   └── RejectModal.tsx
│       └── recipient/                    # 대상자 관련 (신규)
│           ├── RecipientDetailHeader.tsx
│           ├── BasicInfoCard.tsx
│           ├── HealthInfoCard.tsx
│           ├── RecentVisitsSummary.tsx
│           ├── MemoList.tsx
│           ├── MemoForm.tsx
│           ├── VisitTimeline.tsx
│           └── PolicyCard.tsx
├── hooks/
│   ├── useCareLogDetail.ts               # (신규)
│   ├── useRecipientDetail.ts             # (신규)
│   ├── useMemos.ts                       # (신규)
│   ├── useVisits.ts                      # (신규)
│   ├── usePolicies.ts                    # (신규)
│   └── ... (기존)
├── lib/
│   └── mock-data/
│       ├── care-log-details.ts           # (신규)
│       ├── recipient-details.ts          # (신규)
│       ├── memos.ts                      # (신규)
│       ├── visits.ts                     # (신규)
│       ├── policies.ts                   # (신규)
│       └── ... (기존)
└── types/
    └── dashboard.ts                      # 타입 추가 (확장)
```

**Structure Decision**: 기존 002-admin-dashboard 구조를 확장하여 동적 라우트 `[id]` 페이지와 관련 컴포넌트/훅을 추가합니다.

## Implementation Phases

### Phase 1: Foundation (Types, Mock Data, Hooks)
1. 타입 정의 확장 (`src/types/dashboard.ts`)
2. Mock 데이터 생성 (5개 파일)
3. 커스텀 훅 구현 (5개)

### Phase 2: UI Components
1. 공통 UI (Modal, Skeleton, Accordion)
2. 돌봄 일지 상세 컴포넌트
3. 대상자 상세 컴포넌트

### Phase 3: Pages
1. 돌봄 일지 상세 페이지 (`/care-logs/[id]`)
2. 대상자 상세 페이지 (`/recipients/[id]`)
3. 담당자 메모 페이지 (`/recipients/[id]/memos`)
4. 방문 기록 페이지 (`/recipients/[id]/visits`)
5. AI 정책 추천 페이지 (`/recipients/[id]/policies`)

### Phase 4: Integration & Polish
1. 목록 페이지에서 상세 페이지 링크 연결
2. 로딩/에러 UI 완성
3. 접근성 검증
4. 빌드 및 린트 확인

## Complexity Tracking

> No violations requiring justification

## Next Steps

1. `/speckit.tasks` 명령으로 상세 작업 목록 생성
2. 타입 정의부터 순차적으로 구현
3. 각 페이지별 구현 후 테스트
