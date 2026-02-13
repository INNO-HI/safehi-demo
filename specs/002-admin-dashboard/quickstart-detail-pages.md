# Quickstart: 관리자 대시보드 상세 페이지

**Feature Branch**: `002-admin-dashboard`
**Date**: 2026-01-12

이 문서는 관리자 대시보드 상세 페이지 구현을 시작하기 위한 가이드입니다.

## 사전 요구사항

- 002-admin-dashboard 목록 페이지 구현 완료
- 기존 UI 컴포넌트 (Button, Badge, Card 등) 사용 가능

## 1. 추가 의존성 설치

```bash
# 상세 페이지용 추가 의존성
pnpm add yet-another-react-lightbox @radix-ui/react-dialog @radix-ui/react-accordion
```

## 2. 타입 정의 추가

`src/types/dashboard.ts`에 추가:

```typescript
// ============================================================
// 상세 페이지 타입 정의
// ============================================================

export type VisitType = 'visit' | 'call';
export type CareConditionStatus = 'good' | 'normal' | 'warning' | 'bad';

// 돌봄 상태
export interface CareCondition {
  status: CareConditionStatus;
  label: string;
  description?: string;
}

// 돌봄 일지 상세
export interface CareLogDetail {
  id: string;
  recipientId: string;
  recipientName: string;
  status: CareLogStatus;
  createdAt: Date;
  visitInfo: {
    visitDate: Date;
    visitType: VisitType;
    managerName: string;
    centerName: string;
  };
  careContent: {
    healthStatus: CareCondition;
    mealStatus: CareCondition;
    emotionalStatus: CareCondition;
    livingEnvironment: CareCondition;
  };
  notes: string;
  photos: string[];
  rejectionReason?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
}

// 대상자 상세
export interface RecipientDetail {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  status: RecipientStatus;
  basicInfo: {
    address: string;
    dong: string;
    phone: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  manager: {
    id: string;
    name: string;
    phone: string;
    centerName: string;
  };
  healthInfo: {
    diseases: string[];
    medications: string[];
    notes: string;
  };
  recentVisits: VisitSummary[];
}

// 방문 요약
export interface VisitSummary {
  id: string;
  careLogId: string;
  visitDate: Date;
  visitType: VisitType;
  managerName: string;
  summary: string;
}

// 담당자 메모
export interface Memo {
  id: string;
  recipientId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

// 방문 기록
export interface Visit {
  id: string;
  recipientId: string;
  careLogId: string;
  visitDate: Date;
  visitType: VisitType;
  managerName: string;
  summary: string;
}

// 복지 정책
export interface Policy {
  id: string;
  name: string;
  summary: string;
  matchScore: number;
  applicationMethod: string;
  details: {
    description: string;
    eligibility: string[];
    benefits: string[];
    documents: string[];
    contactInfo: string;
  };
}

// 상태 레이블
export const careConditionLabels: Record<CareConditionStatus, string> = {
  good: '양호',
  normal: '보통',
  warning: '주의 필요',
  bad: '위험',
};

export const visitTypeLabels: Record<VisitType, string> = {
  visit: '방문',
  call: '전화',
};
```

## 3. 폴더 구조 생성

```bash
# 돌봄 일지 상세 페이지
mkdir -p src/app/\(admin\)/care-logs/\[id\]

# 대상자 상세 페이지 및 서브 페이지
mkdir -p src/app/\(admin\)/recipients/\[id\]
mkdir -p src/app/\(admin\)/recipients/\[id\]/memos
mkdir -p src/app/\(admin\)/recipients/\[id\]/visits
mkdir -p src/app/\(admin\)/recipients/\[id\]/policies

# 상세 페이지 컴포넌트
mkdir -p src/components/features/care-log
mkdir -p src/components/features/recipient

# 추가 Mock 데이터
# src/lib/mock-data/ 이미 존재
```

## 4. Mock 데이터 생성

`src/lib/mock-data/care-log-details.ts`:

```typescript
import type { CareLogDetail } from '@/types/dashboard';

export const mockCareLogDetails: CareLogDetail[] = [
  {
    id: '1',
    recipientId: 'r1',
    recipientName: '박순자 어르신',
    status: 'pending',
    createdAt: new Date('2026-01-12T10:30:00'),
    visitInfo: {
      visitDate: new Date('2026-01-12T09:00:00'),
      visitType: 'visit',
      managerName: '김민수',
      centerName: '양천구 노인복지센터',
    },
    careContent: {
      healthStatus: { status: 'good', label: '양호', description: '혈압 정상, 컨디션 좋음' },
      mealStatus: { status: 'normal', label: '보통', description: '식사량 평소의 80%' },
      emotionalStatus: { status: 'good', label: '양호', description: '밝은 표정, 대화 적극적' },
      livingEnvironment: { status: 'good', label: '양호', description: '청결 상태 양호' },
    },
    notes: '다음 방문 시 손자 결혼 이야기 들어드리기로 함. 혈압약 복용 여부 재확인 필요.',
    photos: [
      '/mock-images/care-log-1-1.jpg',
      '/mock-images/care-log-1-2.jpg',
    ],
  },
  {
    id: '2',
    recipientId: 'r2',
    recipientName: '이복동 어르신',
    status: 'urgent',
    createdAt: new Date('2026-01-12T11:00:00'),
    visitInfo: {
      visitDate: new Date('2026-01-12T10:30:00'),
      visitType: 'visit',
      managerName: '이영희',
      centerName: '양천구 노인복지센터',
    },
    careContent: {
      healthStatus: { status: 'warning', label: '주의 필요', description: '가슴 통증 호소, 병원 방문 권유' },
      mealStatus: { status: 'bad', label: '위험', description: '3일간 식사 거의 못함' },
      emotionalStatus: { status: 'warning', label: '주의 필요', description: '우울감 호소' },
      livingEnvironment: { status: 'normal', label: '보통', description: '정리 필요' },
    },
    notes: '긴급: 보호자에게 연락 완료. 내일 병원 동행 예정. 우울감 지속 시 정신건강 상담 연계 고려.',
    photos: [],
  },
];

export function getCareLogDetailById(id: string): CareLogDetail | undefined {
  return mockCareLogDetails.find(log => log.id === id);
}
```

`src/lib/mock-data/recipient-details.ts`:

```typescript
import type { RecipientDetail } from '@/types/dashboard';

export const mockRecipientDetails: RecipientDetail[] = [
  {
    id: 'r1',
    name: '박순자',
    age: 78,
    gender: 'female',
    status: 'normal',
    basicInfo: {
      address: '서울시 양천구 목동 5동 목동아파트 103동 502호',
      dong: '목동 5동',
      phone: '010-1234-5678',
      emergencyContact: {
        name: '박철수',
        relationship: '아들',
        phone: '010-9876-5432',
      },
    },
    manager: {
      id: 'm1',
      name: '김민수',
      phone: '010-1111-2222',
      centerName: '양천구 노인복지센터',
    },
    healthInfo: {
      diseases: ['고혈압', '당뇨'],
      medications: ['혈압약 (아침)', '당뇨약 (아침, 저녁)'],
      notes: '계단 이동 시 숨이 차다고 호소. 무리한 활동 자제 권고.',
    },
    recentVisits: [
      {
        id: 'v1',
        careLogId: '1',
        visitDate: new Date('2026-01-12T09:00:00'),
        visitType: 'visit',
        managerName: '김민수',
        summary: '건강 상태 양호, 식사량 보통',
      },
      {
        id: 'v2',
        careLogId: '5',
        visitDate: new Date('2026-01-10T10:00:00'),
        visitType: 'call',
        managerName: '김민수',
        summary: '안부 전화, 특이사항 없음',
      },
      {
        id: 'v3',
        careLogId: '8',
        visitDate: new Date('2026-01-08T09:30:00'),
        visitType: 'visit',
        managerName: '김민수',
        summary: '정기 방문, 혈압 측정 완료',
      },
    ],
  },
];

export function getRecipientDetailById(id: string): RecipientDetail | undefined {
  return mockRecipientDetails.find(r => r.id === id);
}
```

## 5. 커스텀 훅 생성

`src/hooks/useCareLogDetail.ts`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import type { CareLogDetail } from '@/types/dashboard';
import { getCareLogDetailById } from '@/lib/mock-data/care-log-details';

export function useCareLogDetail(id: string) {
  const [data, setData] = useState<CareLogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    // 실제 API 호출 시뮬레이션
    const timer = setTimeout(() => {
      const careLog = getCareLogDetailById(id);
      if (careLog) {
        setData(careLog);
        setError(null);
      } else {
        setError(new Error('돌봄 일지를 찾을 수 없습니다'));
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  const approve = async () => {
    if (!data) return;
    // Mock 승인 처리
    setData({ ...data, status: 'approved' });
  };

  const reject = async (reason: string) => {
    if (!data) return;
    // Mock 반려 처리
    setData({
      ...data,
      status: 'rejected',
      rejectionReason: reason,
      rejectedAt: new Date(),
      rejectedBy: '김담당',
    });
  };

  return { data, isLoading, error, approve, reject };
}
```

`src/hooks/useRecipientDetail.ts`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import type { RecipientDetail } from '@/types/dashboard';
import { getRecipientDetailById } from '@/lib/mock-data/recipient-details';

export function useRecipientDetail(id: string) {
  const [data, setData] = useState<RecipientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const recipient = getRecipientDetailById(id);
      if (recipient) {
        setData(recipient);
        setError(null);
      } else {
        setError(new Error('대상자를 찾을 수 없습니다'));
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  return { data, isLoading, error };
}
```

## 6. 기본 상세 페이지 컴포넌트

`src/app/(admin)/care-logs/[id]/page.tsx`:

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCareLogDetail } from '@/hooks/useCareLogDetail';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
// ... 기타 컴포넌트 import

export default function CareLogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading, error, approve, reject } = useCareLogDetail(id);

  if (isLoading) {
    return <CareLogDetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error?.message || '데이터를 불러올 수 없습니다'}</p>
        <Button onClick={() => router.back()}>돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 헤더 */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{data.recipientName}</h1>
          <p className="text-neutral-500">
            {data.createdAt.toLocaleDateString('ko-KR')} 작성
          </p>
        </div>
        <Badge variant={getStatusVariant(data.status)}>
          {careLogStatusLabels[data.status]}
        </Badge>
      </header>

      {/* 방문 정보 */}
      {/* 돌봄 내용 */}
      {/* 특이사항 */}
      {/* 첨부 사진 */}
      {/* 승인/반려 버튼 */}
    </div>
  );
}
```

## 7. 라이트박스 컴포넌트

`src/components/features/care-log/PhotoGrid.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface PhotoGridProps {
  photos: string[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">첨부 사진</h3>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`첨부 사진 ${i + 1}`}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
          />
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={photos.map(src => ({ src }))}
      />
    </div>
  );
}
```

## 8. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000/care-logs/1`로 접속하여 상세 페이지 확인

## 다음 단계

1. 돌봄 일지 상세 페이지 완성 (방문 정보, 돌봄 내용 카드)
2. 반려 사유 입력 모달 구현
3. 대상자 상세 페이지 구현
4. 담당자 메모 페이지 구현
5. 방문 기록 타임라인 구현
6. AI 정책 추천 페이지 구현

## 참고 문서

- [spec-detail-pages.md](./spec-detail-pages.md) - 상세 페이지 기능 명세
- [data-model-detail-pages.md](./data-model-detail-pages.md) - 상세 페이지 데이터 모델
- [contracts/detail-pages-api.yaml](./contracts/detail-pages-api.yaml) - 상세 페이지 API 명세
- [research-detail-pages.md](./research-detail-pages.md) - 기술 조사 결과
