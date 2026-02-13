# Quickstart: 관리자 대시보드

**Feature Branch**: `002-admin-dashboard`
**Date**: 2026-01-07

이 문서는 관리자 대시보드 구현을 시작하기 위한 가이드입니다.

## 사전 요구사항

- Node.js 18+ 설치
- pnpm 설치
- 001-auth-system 브랜치의 코드가 main에 머지되어 있어야 함

## 1. 의존성 설치

```bash
# 새로운 의존성 추가
pnpm add xlsx react-to-print
```

## 2. 타입 정의 생성

`src/types/dashboard.ts` 파일 생성:

```typescript
// 돌봄 일지 상태
export type CareLogStatus = 'pending' | 'urgent' | 'approved' | 'rejected';

// 대상자 상태
export type RecipientStatus = 'normal' | 'caution' | 'urgent' | 'unvisited';

// 성별
export type Gender = 'male' | 'female';

// KPI 카드
export interface KPICard {
  title: string;
  value: number;
  change: number;
  changeDirection: 'up' | 'down' | 'none';
  progressColor: 'blue' | 'yellow' | 'purple' | 'green';
  progressPercent?: number;
}

// 대시보드 KPI
export interface DashboardKPI {
  todayVisits: KPICard;
  pendingReports: KPICard;
  approvedCount: KPICard;
  totalRecipients: KPICard;
  lastUpdated: Date;
}

// 돌봄 일지
export interface CareLog {
  id: string;
  recipientName: string;
  managerName: string;
  centerName: string;
  visitDate: Date;
  registeredAt: Date;
  status: CareLogStatus;
}

// 대상자
export interface Recipient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  dong: string;
  address: string;
  managerName: string;
  lastVisitDate: Date | null;
  visitCount: number;
  status: RecipientStatus;
}

// 알림
export interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isUrgent: boolean;
  link?: string;
  icon?: 'warning' | 'info' | 'success' | 'report';
}

// 최근 보고서 (대시보드용)
export interface RecentReport {
  id: string;
  recipientName: string;
  managerName: string;
  registeredAt: Date;
  status: CareLogStatus;
  isUrgent: boolean;
}

// 사이드바 사용자 정보
export interface SidebarUser {
  name: string;
  organizationName: string;
  role: 'admin' | 'manager';
  roleLabel: string;
  jurisdiction: {
    region: string;
    dongCount: number;
    centerCount: number;
  };
}

// 필터 상태
export interface CareLogFilters {
  status: CareLogStatus | 'all';
  search: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  dong: string;
}

export interface RecipientFilters {
  status: RecipientStatus | 'all';
  search: string;
  dong: string;
  manager: string;
}

// 페이지네이션 상태
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// 상태 레이블 맵
export const careLogStatusLabels: Record<CareLogStatus, string> = {
  pending: '대기',
  urgent: '긴급',
  approved: '승인',
  rejected: '반려',
};

export const recipientStatusLabels: Record<RecipientStatus, string> = {
  normal: '정상',
  caution: '주의',
  urgent: '긴급',
  unvisited: '미방문',
};
```

## 3. 폴더 구조 생성

```bash
# 관리자 페이지 라우트 그룹
mkdir -p src/app/\(admin\)/dashboard
mkdir -p src/app/\(admin\)/care-logs
mkdir -p src/app/\(admin\)/recipients

# 대시보드 관련 컴포넌트
mkdir -p src/components/features/dashboard

# 레이아웃 컴포넌트
mkdir -p src/components/layout

# Mock 데이터
mkdir -p src/lib/mock-data

# 커스텀 훅
# src/hooks/ 이미 존재
```

## 4. Mock 데이터 생성

`src/lib/mock-data/dashboard.ts`:

```typescript
import type {
  DashboardKPI,
  RecentReport,
  Notification,
  CareLog,
  Recipient,
  SidebarUser,
} from '@/types/dashboard';

// 대시보드 KPI
export const mockDashboardKPI: DashboardKPI = {
  todayVisits: {
    title: '오늘 방문',
    value: 24,
    change: 3,
    changeDirection: 'up',
    progressColor: 'blue',
    progressPercent: 80,
  },
  pendingReports: {
    title: '대기중 보고서',
    value: 8,
    change: -2,
    changeDirection: 'down',
    progressColor: 'yellow',
    progressPercent: 20,
  },
  approvedCount: {
    title: '승인 완료',
    value: 156,
    change: 12,
    changeDirection: 'up',
    progressColor: 'purple',
    progressPercent: 90,
  },
  totalRecipients: {
    title: '담당 대상자',
    value: 89,
    change: 0,
    changeDirection: 'none',
    progressColor: 'green',
    progressPercent: 100,
  },
  lastUpdated: new Date(),
};

// 최근 보고서
export const mockRecentReports: RecentReport[] = [
  {
    id: '1',
    recipientName: '박순자 어르신',
    managerName: '김민수',
    registeredAt: new Date(Date.now() - 10 * 60 * 1000), // 10분 전
    status: 'pending',
    isUrgent: false,
  },
  {
    id: '2',
    recipientName: '이복동 어르신',
    managerName: '이영희',
    registeredAt: new Date(Date.now() - 25 * 60 * 1000), // 25분 전
    status: 'urgent',
    isUrgent: true,
  },
  // ... 더 추가
];

// 알림
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: '긴급: 이복동 어르신 건강 이상 징후',
    content: '보고',
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    isUrgent: true,
    link: '/care-logs/2',
    icon: 'warning',
  },
  // ... 더 추가
];

// 사이드바 사용자 정보
export const mockSidebarUser: SidebarUser = {
  name: '김담당',
  organizationName: '양천구청',
  role: 'admin',
  roleLabel: '구/군 관리자',
  jurisdiction: {
    region: '서울특별시 양천구',
    dongCount: 18,
    centerCount: 12,
  },
};
```

## 5. 기본 레이아웃 컴포넌트 생성

`src/components/layout/Sidebar.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import type { SidebarUser } from '@/types/dashboard';

interface SidebarProps {
  user: SidebarUser;
}

const menuItems = [
  { href: '/dashboard', label: '대시보드', icon: '📊' },
  { href: '/care-logs', label: '돌봄 일지', icon: '📋' },
  { href: '/managers', label: '매니저 관리', icon: '👥' },
  { href: '/recipients', label: '대상자 관리', icon: '🏠' },
  { href: '/statistics', label: '통계/리포트', icon: '📈' },
  { href: '/settings', label: '설정', icon: '⚙️' },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#1E293B] text-white flex flex-col">
      {/* 로고 */}
      <div className="p-6">
        <h1 className="text-xl font-bold">safehi 🤝</h1>
        <p className="text-sm text-gray-400">돌봄 관리 시스템</p>
      </div>

      {/* 소속 정보 */}
      <div className="px-6 py-4 border-b border-gray-700">
        <p className="font-medium">{user.organizationName}</p>
        <p className="text-sm text-gray-400">
          {user.roleLabel} · {user.name}
        </p>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-6 py-3 text-sm transition-colors',
              pathname === item.href
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-gray-700'
            )}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* 관할 구역 */}
      <div className="p-4 m-4 bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-400">관할 구역</p>
        <p className="text-sm font-medium">{user.jurisdiction.region}</p>
        <p className="text-xs text-gray-400">
          {user.jurisdiction.dongCount}개 동 · {user.jurisdiction.centerCount}개 센터
        </p>
      </div>
    </aside>
  );
}
```

## 6. 관리자 레이아웃 생성

`src/app/(admin)/layout.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { mockSidebarUser } from '@/lib/mock-data/dashboard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={mockSidebarUser} />
      <main className="flex-1 bg-neutral-bg">{children}</main>
    </div>
  );
}
```

## 7. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000/login`으로 접속 후 테스트 계정으로 로그인:
- 이메일: `test@safehi.kr`
- 비밀번호: `Test1234!`

로그인 후 `/dashboard`로 이동하여 사이드바 레이아웃 확인

## 다음 단계

1. KPI 카드 컴포넌트 구현
2. 최근 보고서 섹션 구현
3. 알림 섹션 구현
4. 돌봄 일지 목록 페이지 구현
5. 대상자 관리 목록 페이지 구현

## 참고 문서

- [spec.md](./spec.md) - 기능 명세
- [data-model.md](./data-model.md) - 데이터 모델
- [contracts/dashboard-api.yaml](./contracts/dashboard-api.yaml) - API 명세
- [research.md](./research.md) - 기술 조사 결과
