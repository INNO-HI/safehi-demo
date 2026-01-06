# Research: 관리자 대시보드

**Feature Branch**: `002-admin-dashboard`
**Date**: 2026-01-07

## 조사 항목

### 1. Excel 내보내기 라이브러리

**조사 질문**: 클라이언트 사이드 Excel 내보내기에 적합한 라이브러리는?

**Decision**: SheetJS (xlsx)

**Rationale**:
- 가장 널리 사용되는 브라우저 기반 Excel 생성 라이브러리
- .xlsx 형식 지원 (요구사항 충족)
- MIT 라이센스로 상용 프로젝트에 적합
- TypeScript 타입 정의 제공
- 파일 크기 최적화 가능 (필요한 모듈만 번들링)

**Alternatives considered**:
- **ExcelJS**: 더 많은 기능 제공하지만 번들 크기가 큼
- **json2csv + CSV**: 간단하지만 .xlsx 형식 미지원
- **서버 사이드 생성**: 백엔드 필요, 현재는 Mock 단계

**구현 패턴**:
```typescript
import * as XLSX from 'xlsx';

export function exportToExcel<T>(data: T[], filename: string, columns: string[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
```

---

### 2. PDF 내보내기 접근 방식

**조사 질문**: 선택된 보고서를 PDF로 내보내는 최적의 방법은?

**Decision**: react-to-print + 브라우저 인쇄 기능

**Rationale**:
- 추가 의존성 최소화
- 브라우저 네이티브 인쇄 기능 활용
- 사용자가 익숙한 인쇄 다이얼로그
- 클라이언트 사이드 처리로 서버 부하 없음

**Alternatives considered**:
- **jsPDF + html2canvas**: 더 정교한 PDF 생성 가능하지만 복잡도 증가
- **서버 사이드 PDF 생성**: 백엔드 필요, 현재 범위 초과
- **Puppeteer**: 서버 사이드 전용

**구현 패턴**:
```typescript
import { useReactToPrint } from 'react-to-print';

// 인쇄용 컴포넌트 렌더링 후 브라우저 인쇄 다이얼로그 호출
const handlePrint = useReactToPrint({
  content: () => printRef.current,
});
```

---

### 3. 테이블 컴포넌트 접근 방식

**조사 질문**: 체크박스 선택, 필터링, 페이지네이션이 필요한 데이터 테이블 구현 방법?

**Decision**: 커스텀 Table 컴포넌트 구현

**Rationale**:
- 디자인 시스템과 완벽한 통합
- 접근성 요구사항(44x44px 터치 영역) 직접 제어
- 기존 UI 컴포넌트(Button, Checkbox)와 일관성 유지
- 외부 라이브러리 의존성 최소화

**Alternatives considered**:
- **TanStack Table (react-table)**: 강력하지만 학습 곡선 높음, 스타일링 복잡
- **Material UI Table**: 디자인 시스템 충돌, 번들 크기 증가
- **AG Grid**: 과도한 기능, 라이센스 비용

**구현 구조**:
```text
components/ui/
├── Table/
│   ├── Table.tsx           # 테이블 컨테이너
│   ├── TableHeader.tsx     # 헤더 행 (전체 선택 체크박스 포함)
│   ├── TableRow.tsx        # 데이터 행 (개별 체크박스 포함)
│   └── TablePagination.tsx # 페이지네이션 컨트롤
```

---

### 4. 필터 상태 관리

**조사 질문**: 여러 필터(검색어, 날짜, 상태, 드롭다운)의 상태 관리 방법?

**Decision**: URL 쿼리 파라미터 + useSearchParams

**Rationale**:
- 필터 상태가 URL에 반영되어 공유/북마크 가능
- 브라우저 뒤로가기/앞으로가기 지원
- Next.js App Router와 자연스러운 통합
- 새로고침 시에도 필터 유지

**Alternatives considered**:
- **React useState**: 간단하지만 URL 동기화 안 됨, 새로고침 시 초기화
- **Zustand 전역 상태**: 과도한 복잡도
- **React Query의 쿼리 키**: API 연동 시 추가 고려

**구현 패턴**:
```typescript
'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    status: searchParams.get('status') || 'all',
    search: searchParams.get('q') || '',
    setFilter,
  };
}
```

---

### 5. 상태 배지 색상 시스템

**조사 질문**: 상태별 배지 색상을 일관되게 관리하는 방법?

**Decision**: 상태별 색상 맵 + 재사용 가능한 Badge 컴포넌트

**Rationale**:
- Constitution의 색상 시스템과 일관성 유지
- 타입 안전성으로 잘못된 상태 방지
- 한 곳에서 색상 정의 관리

**색상 정의** (Constitution 기반):
```typescript
// 보고서 상태
export const careLogStatusColors = {
  pending: { bg: 'bg-warning-light', text: 'text-warning', border: 'border-warning' },
  urgent: { bg: 'bg-danger', text: 'text-white', border: 'border-danger' },
  approved: { bg: 'bg-success-light', text: 'text-success', border: 'border-success' },
  rejected: { bg: 'bg-neutral-200', text: 'text-neutral-600', border: 'border-neutral-400' },
};

// 대상자 상태
export const recipientStatusColors = {
  normal: { bg: 'bg-success-light', text: 'text-success', border: 'border-success' },
  caution: { bg: 'bg-warning-light', text: 'text-warning', border: 'border-warning' },
  urgent: { bg: 'bg-danger', text: 'text-white', border: 'border-danger' },
  unvisited: { bg: 'bg-neutral-200', text: 'text-neutral-600', border: 'border-neutral-400' },
};
```

---

### 6. 사이드바 레이아웃 패턴

**조사 질문**: 관리자 페이지 전용 레이아웃 구성 방법?

**Decision**: Next.js App Router의 Route Group + Layout 패턴

**Rationale**:
- 관리자 페이지만을 위한 별도 레이아웃
- URL 구조에 영향 없음 (Route Group)
- 사이드바 상태(현재 활성 메뉴) 자동 관리
- 인증 가드 통합 용이

**구조**:
```text
src/app/
├── (admin)/                    # Route Group - URL에 영향 없음
│   ├── layout.tsx              # 관리자 레이아웃 (사이드바 포함)
│   ├── dashboard/page.tsx      # /dashboard
│   ├── care-logs/page.tsx      # /care-logs
│   └── recipients/page.tsx     # /recipients
└── (auth)/                     # 기존 인증 레이아웃
    └── ...
```

---

### 7. KPI 카드 데이터 갱신

**조사 질문**: KPI 데이터를 효율적으로 표시하고 갱신하는 방법?

**Decision**: React Query + 폴링 (추후) / 현재는 Mock 훅

**Rationale**:
- Mock 단계에서는 커스텀 훅으로 시작
- 추후 React Query 통합으로 캐싱/갱신 최적화 가능
- "마지막 업데이트: 방금 전" 표시를 위한 타임스탬프 관리

**구현 패턴 (Mock 단계)**:
```typescript
// hooks/useDashboardKPI.ts
export function useDashboardKPI() {
  const [data, setData] = useState<DashboardKPI | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Mock 데이터 로드
    setData(mockDashboardKPI);
    setLastUpdated(new Date());
  }, []);

  return { data, lastUpdated, isLoading: !data };
}
```

---

## 기술 결정 요약

| 영역 | 결정 | 이유 |
|------|------|------|
| Excel 내보내기 | SheetJS (xlsx) | 브라우저 지원, MIT 라이센스 |
| PDF 내보내기 | react-to-print | 네이티브 인쇄, 낮은 복잡도 |
| 테이블 | 커스텀 구현 | 디자인 시스템 통합, 접근성 제어 |
| 필터 상태 | URL 쿼리 파라미터 | 공유/북마크 가능, Next.js 통합 |
| 상태 배지 | 색상 맵 + Badge 컴포넌트 | 일관성, 타입 안전성 |
| 레이아웃 | Route Group + Layout | 관리자 전용, URL 영향 없음 |
| KPI 갱신 | 커스텀 훅 (Mock) → React Query | 점진적 마이그레이션 가능 |

---

## 추가 의존성

```json
{
  "dependencies": {
    "xlsx": "^0.18.5",
    "react-to-print": "^2.15.1"
  }
}
```

---

## 참고 자료

- [SheetJS Documentation](https://docs.sheetjs.com/)
- [react-to-print GitHub](https://github.com/MatthewHerb662/react-to-print)
- [Next.js App Router Layouts](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates)
