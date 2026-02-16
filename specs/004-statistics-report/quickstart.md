# Quickstart: 통계/리포트 페이지

**Feature**: 004-statistics-report
**Date**: 2026-02-16

## Prerequisites

- Node.js 18+ 설치
- pnpm 패키지 매니저 설치
- SafeHi 프로젝트 클론 완료

## 1. 의존성 설치

```bash
# 프로젝트 루트에서 실행
cd /Users/aboutime/Desktop/developer/safehi

# 기존 의존성 설치
pnpm install

# 새 의존성 추가 (차트, PDF)
pnpm add recharts @react-pdf/renderer html2canvas
```

## 2. 프로젝트 구조 확인

이 기능을 구현하기 전에 다음 구조가 필요합니다:

```text
src/
├── app/
│   └── (admin)/                    # 관리자 라우트 그룹 (필요 시 생성)
│       ├── layout.tsx              # 사이드바 포함 레이아웃
│       └── statistics/             # 통계/리포트 페이지
│           └── page.tsx
├── components/
│   ├── ui/                         # 기존 UI 컴포넌트
│   │   └── Modal.tsx               # 신규 모달 컴포넌트 (필요 시)
│   └── features/
│       └── statistics/             # 통계 관련 컴포넌트
│           ├── KPICard.tsx
│           ├── VisitTrendChart.tsx
│           ├── ReportStatusChart.tsx
│           ├── DistrictVisitChart.tsx
│           ├── ManagerRankingTable.tsx
│           ├── RecipientStatusCards.tsx
│           ├── QuickReportCards.tsx
│           └── StatisticsHeader.tsx
├── hooks/
│   ├── useStatistics.ts            # 통계 데이터 훅
│   └── useReportGenerator.ts       # PDF 생성 훅
├── lib/
│   ├── mock-data/
│   │   └── statistics.ts           # Mock 데이터
│   ├── utils/
│   │   └── pdf-generator.ts        # PDF 생성 유틸리티
│   └── validations/
│       └── statistics.ts           # Zod 스키마
└── types/
    └── statistics.ts               # TypeScript 타입
```

## 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000/statistics` 접속하여 확인합니다.

## 4. 구현 순서 (권장)

### Phase 1: 기본 구조
1. TypeScript 타입 정의 (`src/types/statistics.ts`)
2. Mock 데이터 생성 (`src/lib/mock-data/statistics.ts`)
3. Zod 스키마 정의 (`src/lib/validations/statistics.ts`)
4. useStatistics 훅 구현 (`src/hooks/useStatistics.ts`)

### Phase 2: UI 컴포넌트
5. KPICard 컴포넌트
6. StatisticsHeader 컴포넌트 (기간 선택 포함)
7. VisitTrendChart 컴포넌트 (recharts AreaChart)
8. ReportStatusChart 컴포넌트 (recharts PieChart)
9. DistrictVisitChart 컴포넌트 (recharts BarChart)
10. ManagerRankingTable 컴포넌트
11. RecipientStatusCards 컴포넌트
12. QuickReportCards 컴포넌트

### Phase 3: 페이지 조립
13. 통계/리포트 페이지 (`src/app/(admin)/statistics/page.tsx`)
14. 사이드바에 메뉴 추가 (필요 시)

### Phase 4: PDF 생성
15. PDF 생성 유틸리티 구현
16. useReportGenerator 훅 구현
17. 리포트 생성 버튼 연결

## 5. 테스트 확인

```bash
# 린트 검사
pnpm lint

# 타입 검사
pnpm build

# 테스트 실행 (테스트 작성 후)
pnpm test
```

## 6. 주요 파일 경로

| 파일 | 설명 |
|------|------|
| `specs/004-statistics-report/spec.md` | 기능 명세서 |
| `specs/004-statistics-report/plan.md` | 구현 계획 |
| `specs/004-statistics-report/data-model.md` | 데이터 모델 |
| `specs/004-statistics-report/contracts/` | API 계약 |

## 7. 참고 자료

- [Recharts 문서](https://recharts.org/en-US/)
- [@react-pdf/renderer 문서](https://react-pdf.org/)
- [html2canvas 문서](https://html2canvas.hertzen.com/)

## 8. 트러블슈팅

### recharts 서버 사이드 렌더링 오류
```tsx
// 클라이언트 사이드에서만 렌더링
'use client';

import dynamic from 'next/dynamic';

const AreaChart = dynamic(
  () => import('recharts').then(mod => mod.AreaChart),
  { ssr: false }
);
```

### PDF 한글 폰트 깨짐
```tsx
import { Font } from '@react-pdf/renderer';

// Pretendard 폰트 등록
Font.register({
  family: 'Pretendard',
  src: '/fonts/Pretendard-Regular.woff',
});
```

### Tailwind CSS 색상 적용 안됨
```ts
// tailwind.config.ts에 커스텀 색상 추가
colors: {
  purple: {
    DEFAULT: '#7C6B9E', // 활동 매니저 아이콘용
  },
}
```
