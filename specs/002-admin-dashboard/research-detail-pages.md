# Research: 관리자 대시보드 상세 페이지

**Feature Branch**: `002-admin-dashboard`
**Date**: 2026-01-12

## 조사 항목

### 1. 이미지 라이트박스 라이브러리

**조사 질문**: 돌봄 일지 첨부 사진 확대 표시에 적합한 라이브러리는?

**Decision**: yet-another-react-lightbox

**Rationale**:
- 최신 React 18 완벽 지원
- TypeScript 타입 정의 내장
- 접근성(A11y) 지원 우수
- 번들 크기 작음 (~15kb gzipped)
- 터치/스와이프 제스처 지원 (모바일 대응)
- 키보드 네비게이션 지원

**Alternatives considered**:
- **react-image-lightbox**: 인기 있지만 React 18 지원 불완전, 유지보수 정체
- **Photoswipe**: 강력하지만 React 통합 복잡
- **직접 구현**: 시간 소요, 접근성 보장 어려움

**구현 패턴**:
```typescript
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

function PhotoGrid({ photos }: { photos: string[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            onClick={() => { setIndex(i); setOpen(true); }}
            className="cursor-pointer rounded-lg"
          />
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={photos.map(src => ({ src }))}
      />
    </>
  );
}
```

---

### 2. 모달 컴포넌트 (반려 사유 입력)

**조사 질문**: 반려 사유 입력 모달 구현 방법?

**Decision**: 커스텀 Modal 컴포넌트 + Radix UI Dialog Primitive

**Rationale**:
- 접근성(A11y) 완벽 지원 (포커스 트랩, aria 속성)
- 기존 디자인 시스템과 통합 가능
- 포탈 렌더링으로 z-index 이슈 방지
- ESC 키로 닫기, 배경 클릭 닫기 기본 지원

**Alternatives considered**:
- **Headless UI**: 좋은 대안, Tailwind와 잘 맞음
- **직접 구현**: 접근성 보장 어려움, 포커스 트랩 복잡
- **Material UI Modal**: 디자인 시스템 충돌

**구현 구조**:
```typescript
// components/ui/Modal.tsx
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  // Radix Dialog 기반 또는 직접 구현
  // 포커스 트랩, ESC 닫기, 배경 클릭 닫기 포함
}
```

---

### 3. 타임라인 UI 패턴

**조사 질문**: 방문 기록 타임라인 UI 구현 방법?

**Decision**: 커스텀 Timeline 컴포넌트

**Rationale**:
- 디자인 시스템 완벽 통합
- 방문 유형별 아이콘/색상 구분 가능
- Tailwind로 간단히 구현 가능
- 외부 의존성 불필요

**구현 패턴**:
```typescript
// components/features/recipient/VisitTimeline.tsx
interface TimelineItemProps {
  date: Date;
  type: 'visit' | 'call';
  manager: string;
  summary: string;
  careLogId: string;
}

function TimelineItem({ date, type, manager, summary, careLogId }: TimelineItemProps) {
  return (
    <div className="relative pl-8 pb-8 border-l-2 border-neutral-200 last:pb-0">
      {/* 타임라인 도트 */}
      <div className={`
        absolute left-[-9px] w-4 h-4 rounded-full
        ${type === 'visit' ? 'bg-primary-600' : 'bg-purple-600'}
      `} />

      {/* 내용 */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          {type === 'visit' ? '🏠' : '📞'}
          <span>{formatDate(date)}</span>
          <span>·</span>
          <span>{manager}</span>
        </div>
        <p className="mt-1 text-neutral-900">{summary}</p>
      </div>
    </div>
  );
}
```

---

### 4. 아코디언/확장 패널

**조사 질문**: AI 정책 추천 상세 정보 펼치기 UI 구현 방법?

**Decision**: Radix Accordion Primitive + 커스텀 스타일

**Rationale**:
- 접근성 완벽 지원 (aria-expanded, 키보드 네비게이션)
- 애니메이션 부드러움
- 여러 항목 동시 펼치기/한 개만 펼치기 옵션
- 기존 디자인 시스템과 통합

**구현 패턴**:
```typescript
import * as Accordion from '@radix-ui/react-accordion';

function PolicyList({ policies }: { policies: Policy[] }) {
  return (
    <Accordion.Root type="multiple" className="space-y-3">
      {policies.map((policy) => (
        <Accordion.Item key={policy.id} value={policy.id}>
          <Accordion.Trigger className="w-full p-4 bg-white rounded-lg">
            {/* 정책명, 적합도 표시 */}
          </Accordion.Trigger>
          <Accordion.Content className="p-4">
            {/* 상세 설명, 자격 요건, 신청 방법 */}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
```

---

### 5. 동적 라우팅 패턴 (Next.js App Router)

**조사 질문**: [id] 동적 라우트에서 데이터 로딩 및 에러 처리 방법?

**Decision**: Client Component + 커스텀 훅 + loading.tsx/error.tsx

**Rationale**:
- Mock 데이터 단계에서 Client Component가 적합
- 커스텀 훅으로 데이터 로딩 로직 캡슐화
- Next.js 파일 기반 에러/로딩 UI 활용
- 추후 Server Component + React Query로 마이그레이션 가능

**구현 구조**:
```text
src/app/(admin)/
├── care-logs/
│   ├── page.tsx              # 목록 페이지
│   └── [id]/
│       ├── page.tsx          # 상세 페이지
│       ├── loading.tsx       # 로딩 UI (스켈레톤)
│       └── error.tsx         # 에러 UI
├── recipients/
│   ├── page.tsx              # 목록 페이지
│   └── [id]/
│       ├── page.tsx          # 대상자 상세
│       ├── memos/
│       │   └── page.tsx      # 담당자 메모
│       ├── visits/
│       │   └── page.tsx      # 방문 기록
│       └── policies/
│           └── page.tsx      # AI 정책 추천
```

**훅 패턴**:
```typescript
// hooks/useCareLogDetail.ts
export function useCareLogDetail(id: string) {
  const [data, setData] = useState<CareLogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const careLog = mockCareLogDetails.find(log => log.id === id);
    if (careLog) {
      setData(careLog);
    } else {
      setError(new Error('돌봄 일지를 찾을 수 없습니다'));
    }
    setIsLoading(false);
  }, [id]);

  return { data, isLoading, error };
}
```

---

### 6. 폼 상태 관리 (메모 작성)

**조사 질문**: 담당자 메모 작성 폼 상태 관리 방법?

**Decision**: React Hook Form + 인라인 폼

**Rationale**:
- 프로젝트 기술 스택에 이미 포함됨
- 간단한 폼에 적합
- 유효성 검사 쉬움
- 컨트롤드 컴포넌트 불필요

**구현 패턴**:
```typescript
import { useForm } from 'react-hook-form';

interface MemoFormData {
  content: string;
}

function MemoForm({ onSubmit }: { onSubmit: (data: MemoFormData) => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MemoFormData>();

  const onSubmitHandler = (data: MemoFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Textarea
        {...register('content', { required: '메모 내용을 입력해주세요' })}
        placeholder="메모를 입력하세요..."
      />
      {errors.content && <p className="text-red-500">{errors.content.message}</p>}
      <Button type="submit">저장</Button>
    </form>
  );
}
```

---

### 7. 스켈레톤 UI 패턴

**조사 질문**: 데이터 로딩 중 스켈레톤 UI 구현 방법?

**Decision**: 커스텀 Skeleton 컴포넌트 + Tailwind animate-pulse

**Rationale**:
- Tailwind의 animate-pulse로 간단히 구현
- 컴포넌트별 맞춤 스켈레톤 가능
- 외부 라이브러리 불필요
- 접근성 고려 (aria-busy)

**구현 패턴**:
```typescript
// components/ui/Skeleton.tsx
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={`bg-neutral-200 rounded animate-pulse ${className}`}
      style={{ width, height }}
      aria-busy="true"
    />
  );
}

// 사용 예시
function CareLogDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height="32px" width="200px" /> {/* 제목 */}
      <Skeleton height="120px" />               {/* 방문 정보 카드 */}
      <Skeleton height="200px" />               {/* 돌봄 내용 */}
    </div>
  );
}
```

---

## 기술 결정 요약

| 영역 | 결정 | 이유 |
|------|------|------|
| 이미지 라이트박스 | yet-another-react-lightbox | React 18 지원, A11y, 가벼움 |
| 모달 | Radix Dialog + 커스텀 스타일 | 접근성 완벽, 포커스 트랩 |
| 타임라인 | 커스텀 구현 | 디자인 시스템 통합, 간단 |
| 아코디언 | Radix Accordion | 접근성, 애니메이션 |
| 동적 라우팅 | Client Component + 훅 | Mock 단계 적합, 점진적 마이그레이션 |
| 폼 관리 | React Hook Form | 기존 스택, 간단한 폼 |
| 스켈레톤 | Tailwind animate-pulse | 간단, 커스터마이징 용이 |

---

## 추가 의존성

```json
{
  "dependencies": {
    "yet-another-react-lightbox": "^3.17.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-accordion": "^1.1.2"
  }
}
```

---

## 참고 자료

- [yet-another-react-lightbox](https://yet-another-react-lightbox.com/)
- [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [Radix UI Accordion](https://www.radix-ui.com/primitives/docs/components/accordion)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
