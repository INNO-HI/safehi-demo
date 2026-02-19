# Research: 통계/리포트 페이지

**Feature**: 004-statistics-report
**Date**: 2026-02-16
**Status**: Complete

## Research Summary

이 문서는 통계/리포트 페이지 구현을 위한 기술적 조사 결과를 정리합니다.

---

## 1. 차트 라이브러리 선택

### Decision: Recharts

### Rationale
- React 친화적 선언형 API로 컴포넌트 기반 개발에 적합
- D3.js 기반으로 강력한 시각화 기능 제공
- TypeScript 지원 우수
- 번들 사이즈가 적당 (Chart.js보다 작음)
- 영역 그라데이션, 도넛 차트, 가로 막대 차트 모두 지원
- 툴팁, 범례 커스터마이징 용이

### Alternatives Considered
| 라이브러리 | 장점 | 탈락 사유 |
|-----------|------|----------|
| Chart.js | 가볍고 빠름 | React와의 통합이 recharts보다 불편, 선언형 API 부족 |
| Nivo | 아름다운 기본 스타일 | 번들 사이즈가 큼, 커스터마이징이 복잡 |
| Victory | 애니메이션 우수 | 학습 곡선이 가파름, 문서가 상대적으로 부족 |
| D3.js 직접 사용 | 최대 유연성 | 구현 시간이 오래 걸림, 보일러플레이트가 많음 |

### Implementation Notes
```bash
pnpm add recharts
pnpm add -D @types/recharts  # TypeScript 지원
```

---

## 2. PDF 생성 라이브러리 선택

### Decision: @react-pdf/renderer + html2canvas 조합

### Rationale
- **@react-pdf/renderer**: React 컴포넌트를 PDF로 렌더링, 서버사이드 생성 가능
- **html2canvas**: 차트를 이미지로 캡처하여 PDF에 삽입
- 클라이언트 사이드에서 완전히 처리 가능 (백엔드 의존성 없음)
- 한글 폰트 지원 (Pretendard 등록 필요)

### Alternatives Considered
| 라이브러리 | 장점 | 탈락 사유 |
|-----------|------|----------|
| jsPDF | 가볍고 간단 | 복잡한 레이아웃 구현이 어려움, 차트 삽입 번거로움 |
| pdfmake | 테이블 지원 우수 | React 통합이 불편, 한글 폰트 설정 복잡 |
| puppeteer (서버) | 완벽한 렌더링 | 서버 필요, 프론트엔드 전용 프로젝트에 부적합 |
| react-to-print | 간단한 인쇄 | PDF 저장이 아닌 브라우저 인쇄 다이얼로그 의존 |

### Implementation Notes
```bash
pnpm add @react-pdf/renderer html2canvas
```

**PDF 생성 플로우**:
1. 차트 영역을 html2canvas로 이미지 캡처
2. @react-pdf/renderer로 PDF 문서 구조 생성
3. 캡처한 이미지와 텍스트 데이터 조합
4. Blob으로 변환 후 다운로드 트리거

---

## 3. 기존 코드베이스 패턴 분석

### 3.1 프로젝트 구조
```text
src/
├── app/
│   ├── (auth)/          # 인증 라우트 그룹 (구현 완료)
│   ├── (admin)/         # 관리자 라우트 그룹 (추가 필요)
│   └── dashboard/       # 임시 대시보드 (교체 예정)
├── components/
│   ├── ui/              # Button, Card, Input, Alert 등
│   └── features/        # 기능별 컴포넌트
├── hooks/               # useAuth 등 커스텀 훅
├── lib/
│   ├── api/             # Mock API
│   ├── utils/           # cn(), format 함수
│   └── validations/     # Zod 스키마
└── types/               # TypeScript 인터페이스
```

### 3.2 UI 컴포넌트 현황
- **Button**: 4가지 variant (primary, secondary, danger, soft)
- **Card**: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Input**: label, error, hint 지원
- **Alert**: 4가지 variant (info, success, warning, danger)
- **Select**: 네이티브 드롭다운

### 3.3 상태 관리 패턴
- **Zustand**: localStorage persistence 패턴 (useAuth 참고)
- **React Hook Form + Zod**: 폼 유효성 검사

### 3.4 Mock API 패턴
```typescript
// 기존 패턴 (src/lib/api/auth.ts)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function someApi(): Promise<ApiResponse<T>> {
  await delay(500);
  return { success: true, data: mockData };
}
```

---

## 4. 관리자 대시보드 라우트 구조

### Decision: (admin) 라우트 그룹 사용

### 구조
```text
src/app/(admin)/
├── layout.tsx           # 사이드바 + 헤더 공통 레이아웃
├── dashboard/           # 대시보드 홈
├── care-logs/           # 돌봄 일지
├── recipients/          # 대상자 관리
├── managers/            # 매니저 관리
├── statistics/          # 통계/리포트 (이번 기능)
│   └── page.tsx
└── settings/            # 설정
```

### Rationale
- 기존 `(auth)` 그룹과 동일한 패턴 유지
- 공통 레이아웃(사이드바, 헤더)을 layout.tsx에서 처리
- URL에 `(admin)` 표시 안됨 (라우트 그룹 특성)

---

## 5. 사이드바 구현 확인

### 현재 상태
기존 코드베이스에 사이드바가 구현되어 있지 않음. `(admin)` 라우트 그룹과 함께 새로 구현 필요.

### Decision: AdminLayout 컴포넌트에서 사이드바 포함

### 메뉴 항목 (Figma 기준)
| 아이콘 | 메뉴명 | 경로 |
|--------|--------|------|
| 📊 | 대시보드 | /dashboard |
| 📝 | 돌봄 일지 | /care-logs |
| 👥 | 매니저 관리 | /managers |
| 🏠 | 대상자 관리 | /recipients |
| 📈 | 통계/리포트 | /statistics |
| ⚙️ | 설정 | /settings |

---

## 6. 접근성 요구사항 확인

Constitution에서 정의된 NON-NEGOTIABLE 요구사항:

| 항목 | 요구사항 | 적용 방안 |
|------|----------|----------|
| 최소 글자 크기 | 12px | Tailwind text-caption (12px) 최소 |
| 본문 글자 크기 | 14px 이상 | text-body (14px) 기본 사용 |
| 폰트 가중치 | Regular(400) 이상 | font-normal 이상 사용 |
| 대비율 | WCAG AA (4.5:1) | 기존 색상 팔레트 준수 |
| 줄간격 | 1.5배 이상 | leading-relaxed (160%) |
| 클릭 영역 | 44x44px | min-h-[44px] min-w-[44px] |

---

## 7. 디자인 토큰 확인

### 색상 (Figma 기준)
| 용도 | 색상 코드 | Tailwind 클래스 |
|------|----------|-----------------|
| Primary | #2E6AB3 | text-primary / bg-primary |
| 정상 | #3D8B6E | text-status-success |
| 주의 | #C4940A | text-status-warning |
| 긴급 | #C45A5A | text-status-danger |
| 보라 (매니저) | #7C6B9E | 커스텀 정의 필요 |

### 신규 색상 추가 필요
- **보라색 (#7C6B9E)**: 활동 매니저 KPI 카드 아이콘
- Tailwind config에 `purple: { DEFAULT: '#7C6B9E' }` 추가

---

## 8. 데이터 구조 설계

### 8.1 KPI 데이터
```typescript
interface StatisticsKPI {
  totalRecipients: number;      // 전체 대상자
  monthlyVisits: number;        // 이번 달 방문
  processedReports: number;     // 보고서 처리
  emergencyCases: number;       // 긴급 케이스
  activeManagers: number;       // 활동 매니저
}
```

### 8.2 월별 방문 추이
```typescript
interface MonthlyVisitTrend {
  month: string;      // "2025-01" 형식
  visits: number;     // 방문 횟수
}
```

### 8.3 보고서 처리 현황
```typescript
interface ReportStatusDistribution {
  approved: number;   // 승인
  pending: number;    // 대기
  urgent: number;     // 긴급
  rejected: number;   // 반려
}
```

### 8.4 동별 방문 현황
```typescript
interface DistrictVisit {
  district: string;   // 동 이름
  visits: number;     // 방문 횟수
}
```

### 8.5 매니저 활동 순위
```typescript
interface ManagerRanking {
  rank: number;
  name: string;
  avatar?: string;    // 이니셜 또는 프로필
  visits: number;
  reports: number;
  approvalRate: number; // 0-100%
}
```

### 8.6 대상자 상태 분포
```typescript
interface RecipientStatusDistribution {
  normal: number;
  caution: number;
  urgent: number;
  unvisited: number;
  trends: {
    normalChange: number;   // +24
    urgentChange: number;   // -2
  };
}
```

---

## 9. "전체보기" 링크 동작 결정

### Decision: 모달 사용

### Rationale
- 기존 페이지 컨텍스트 유지
- 별도 페이지 구현보다 간단
- 사용자가 빠르게 확인 후 돌아올 수 있음

### 구현 방안
1. `DistrictVisitsModal` - 동별 방문 현황 전체 목록
2. `ManagerRankingModal` - 매니저 활동 순위 전체 목록
3. 기존 Dialog 패턴이 없으므로 신규 Modal 컴포넌트 필요

---

## 10. 기간 선택 드롭다운 구현

### Decision: 네이티브 Select 컴포넌트 재활용

### 구현 방안
- 기존 `Select` 컴포넌트 사용
- 옵션: 최근 12개월 (예: "2025년 1월" ~ "2024년 2월")
- 기본값: 현재 월
- onChange 시 모든 데이터 fetch 트리거

---

## 11. 리포트 생성 UX 결정

### Decision: 클라이언트 사이드 PDF 생성 + 로딩 모달

### 플로우
1. "리포트 생성" 버튼 클릭
2. 로딩 모달 표시 ("리포트를 생성하고 있습니다...")
3. html2canvas로 차트 영역 캡처
4. @react-pdf/renderer로 PDF 생성
5. Blob 다운로드 트리거
6. 로딩 모달 닫기

### 에러 처리
- 생성 실패 시 Alert 컴포넌트로 오류 메시지 표시
- 재시도 버튼 제공

---

## 12. Mock 데이터 전략

### 파일 구조
```text
src/lib/mock-data/
└── statistics.ts    # 모든 통계 Mock 데이터
```

### 데이터 규모 (Figma 기준)
- 전체 대상자: 892명
- 이번 달 방문: 2,847회
- 보고서 처리: 2,654건
- 긴급 케이스: 12건
- 활동 매니저: 156명
- 동 목록: 7개 (목동 5동, 목동 7동, 신월 3동, 신정 2동, 목동 2동, 신월 1동, 기타)
- 매니저 순위: 상위 10명

---

## 13. 커스텀 훅 설계

### useStatistics 훅
```typescript
interface UseStatisticsReturn {
  kpi: StatisticsKPI | null;
  visitTrend: MonthlyVisitTrend[];
  reportStatus: ReportStatusDistribution | null;
  districtVisits: DistrictVisit[];
  managerRanking: ManagerRanking[];
  recipientStatus: RecipientStatusDistribution | null;
  isLoading: boolean;
  error: string | null;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  refetch: () => void;
}
```

### useReportGenerator 훅
```typescript
interface UseReportGeneratorReturn {
  generateReport: (type: ReportType) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
}

type ReportType = 'full' | 'monthly' | 'manager' | 'recipient' | 'emergency';
```

---

## 14. 결론

모든 기술적 불확실성이 해소되었습니다. 다음 단계로 진행 가능합니다:

1. **데이터 모델 정의** (data-model.md)
2. **API 계약 정의** (contracts/)
3. **빠른 시작 가이드** (quickstart.md)
