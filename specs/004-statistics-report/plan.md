# Implementation Plan: 통계/리포트 페이지

**Branch**: `004-statistics-report` | **Date**: 2026-02-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-statistics-report/spec.md`

## Summary

관리자 대시보드의 통계/리포트 페이지를 구현합니다. KPI 카드(5개), 차트(라인/도넛/막대), 테이블(매니저 순위), 대상자 상태 분포, PDF 리포트 생성 기능을 포함합니다. Recharts로 차트를 구현하고, @react-pdf/renderer와 html2canvas로 PDF를 생성합니다.

## Technical Context

**Language/Version**: TypeScript 5.x + Next.js 14 (App Router)
**Primary Dependencies**:
- 기존: React 18, Tailwind CSS, Zustand, React Hook Form, Zod
- 신규: recharts (차트), @react-pdf/renderer + html2canvas (PDF)

**Storage**: N/A (프론트엔드 전용, Mock 데이터 사용)
**Testing**: Vitest + Testing Library
**Target Platform**: 웹 브라우저 (데스크탑 우선, 반응형)
**Project Type**: Web Application (프론트엔드 전용)
**Performance Goals**:
- 페이지 로딩 후 2초 이내 모든 컴포넌트 표시
- 기간 변경 후 1초 이내 데이터 갱신
- PDF 생성 10초 이내

**Constraints**:
- 40~60대 사용자 접근성 (최소 12px, 본문 14px+, 44x44px 클릭 영역)
- WCAG AA 대비율 준수

**Scale/Scope**: 단일 페이지, 약 10개 컴포넌트, 7개 데이터 엔티티

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. 접근성 최우선 | ✅ PASS | SC-006, SC-007에서 12px 최소, 44px 클릭 영역 명시 |
| II. 디자인 시스템 | ✅ PASS | Pretendard 폰트, 4px 간격, 기존 색상 팔레트 사용 |
| III. 돌봄 유형 구분 | ✅ PASS | 긴급(빨강), 정상(초록), 주의(노랑) 색상 구분 적용 |
| IV. 권한 체계 | ✅ PASS | 관리자 전용 페이지 (/admin/statistics) |
| V. 기술 스택 | ✅ PASS | Next.js 14, TypeScript strict, Tailwind CSS |
| VI. 코드 품질 | ✅ PASS | ESLint + Prettier, 한글 주석 |
| VII. 프로젝트 구조 | ✅ PASS | src/app/, components/, hooks/, lib/, types/ 구조 준수 |

**신규 의존성 추가**:
- `recharts`: 차트 시각화 (React 친화적, D3 기반)
- `@react-pdf/renderer`: PDF 생성
- `html2canvas`: 차트 이미지 캡처

## Project Structure

### Documentation (this feature)

```text
specs/004-statistics-report/
├── spec.md              # 기능 명세서
├── plan.md              # 이 파일 (구현 계획)
├── research.md          # 기술 조사 결과
├── data-model.md        # 데이터 모델
├── quickstart.md        # 빠른 시작 가이드
├── contracts/           # API 계약
│   └── statistics-api.yaml
└── checklists/
    └── requirements.md  # 품질 체크리스트
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (admin)/                    # 관리자 라우트 그룹
│       ├── layout.tsx              # 사이드바 포함 공통 레이아웃
│       └── statistics/
│           └── page.tsx            # 통계/리포트 페이지
│
├── components/
│   ├── ui/
│   │   ├── Modal.tsx               # 신규: 모달 컴포넌트
│   │   └── ... (기존 컴포넌트)
│   │
│   └── features/
│       └── statistics/
│           ├── StatisticsHeader.tsx    # 헤더 (제목, 기간 선택, 버튼)
│           ├── KPICard.tsx             # KPI 카드 컴포넌트
│           ├── KPICardGrid.tsx         # KPI 카드 5개 그리드
│           ├── VisitTrendChart.tsx     # 월별 방문 추이 (AreaChart)
│           ├── ReportStatusChart.tsx   # 보고서 처리 현황 (PieChart)
│           ├── DistrictVisitChart.tsx  # 동별 방문 현황 (BarChart)
│           ├── ManagerRankingTable.tsx # 매니저 활동 순위 테이블
│           ├── RecipientStatusCards.tsx # 대상자 상태 분포
│           ├── QuickReportCards.tsx    # 빠른 리포트 생성 카드
│           ├── DistrictVisitsModal.tsx # 동별 전체보기 모달
│           └── ManagerRankingModal.tsx # 매니저 전체보기 모달
│
├── hooks/
│   ├── useStatistics.ts            # 통계 데이터 fetch 훅
│   └── useReportGenerator.ts       # PDF 생성 훅
│
├── lib/
│   ├── api/
│   │   └── statistics.ts           # Mock API 함수
│   ├── mock-data/
│   │   └── statistics.ts           # Mock 데이터
│   ├── utils/
│   │   └── pdf-generator.ts        # PDF 생성 유틸리티
│   ├── validations/
│   │   └── statistics.ts           # Zod 스키마
│   └── constants/
│       └── statistics.ts           # 상수 (색상, 템플릿 등)
│
└── types/
    └── statistics.ts               # TypeScript 타입 정의
```

**Structure Decision**: 프론트엔드 전용 프로젝트로, Next.js App Router 구조를 사용합니다. `(admin)` 라우트 그룹으로 관리자 페이지를 그룹화하고, 사이드바는 공통 layout.tsx에서 처리합니다.

## Complexity Tracking

> 모든 Constitution 원칙을 준수하며, 복잡도 위반 사항이 없습니다.

| 항목 | 결정 | 근거 |
|------|------|------|
| 차트 라이브러리 | recharts | React 친화적, 선언형 API, 필요한 차트 유형 모두 지원 |
| PDF 라이브러리 | @react-pdf/renderer + html2canvas | 클라이언트 사이드 생성, 한글 지원, 차트 이미지 삽입 가능 |
| 상태 관리 | 로컬 useState + useStatistics 훅 | 단순한 데이터 흐름, 전역 상태 불필요 |
| 모달 방식 | 신규 Modal 컴포넌트 | 기존에 없음, 전체보기 기능에 필요 |

## Implementation Phases

### Phase 1: Foundation (데이터 레이어)

1. TypeScript 타입 정의 (`src/types/statistics.ts`)
2. Zod 스키마 정의 (`src/lib/validations/statistics.ts`)
3. 상수 정의 (`src/lib/constants/statistics.ts`)
4. Mock 데이터 생성 (`src/lib/mock-data/statistics.ts`)
5. Mock API 함수 (`src/lib/api/statistics.ts`)
6. useStatistics 훅 구현 (`src/hooks/useStatistics.ts`)

### Phase 2: UI Components (차트 제외)

7. Modal 컴포넌트 (`src/components/ui/Modal.tsx`)
8. KPICard 컴포넌트
9. StatisticsHeader 컴포넌트
10. ManagerRankingTable 컴포넌트
11. RecipientStatusCards 컴포넌트
12. QuickReportCards 컴포넌트

### Phase 3: Charts (recharts)

13. 의존성 설치 (`pnpm add recharts`)
14. VisitTrendChart 컴포넌트 (AreaChart)
15. ReportStatusChart 컴포넌트 (PieChart/DonutChart)
16. DistrictVisitChart 컴포넌트 (BarChart - 가로)

### Phase 4: Page Assembly

17. KPICardGrid 컴포넌트 (5개 카드 배열)
18. 통계/리포트 페이지 조립 (`src/app/(admin)/statistics/page.tsx`)
19. 사이드바 메뉴 추가 (기존 AdminLayout에)

### Phase 5: Modals & Navigation

20. DistrictVisitsModal 컴포넌트
21. ManagerRankingModal 컴포넌트
22. 전체보기 링크 연결

### Phase 6: PDF Generation

23. 의존성 설치 (`pnpm add @react-pdf/renderer html2canvas`)
24. PDF 생성 유틸리티 (`src/lib/utils/pdf-generator.ts`)
25. useReportGenerator 훅 구현
26. 리포트 생성 버튼 연결 (헤더 + 빠른 리포트)

### Phase 7: Polish & Accessibility

27. 로딩 상태 UI 구현
28. 에러 상태 UI 구현
29. 빈 상태 UI 구현
30. 접근성 검토 및 수정
31. 반응형 레이아웃 조정

## Dependencies

### 신규 패키지

```bash
pnpm add recharts @react-pdf/renderer html2canvas
pnpm add -D @types/html2canvas
```

### 내부 의존성

- `(admin)` 라우트 그룹 레이아웃 (사이드바 포함) - 이미 존재하거나 별도 구현 필요
- 기존 UI 컴포넌트: Button, Card, Select, Alert
- 기존 훅: useAuth (로그인 상태 확인)

## Artifacts Generated

| 파일 | 설명 |
|------|------|
| [research.md](./research.md) | 기술 조사 및 결정 사항 |
| [data-model.md](./data-model.md) | 데이터 모델 및 Zod 스키마 |
| [contracts/statistics-api.yaml](./contracts/statistics-api.yaml) | OpenAPI 3.0 API 계약 |
| [quickstart.md](./quickstart.md) | 빠른 시작 가이드 |

## Next Steps

1. **`/speckit.tasks`** 실행하여 상세 작업 목록 생성
2. 각 작업별 구현 진행
3. PR 생성 및 코드 리뷰

---

*Plan created by `/speckit.plan` command*
