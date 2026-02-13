// ============================================================
// Mock 사이드바 사용자 데이터
// T020: 사이드바용 Mock 데이터
// ============================================================

import type { SidebarUser, SidebarMenuItem, SidebarMenuGroup } from '@/types/dashboard';

/** 현재 로그인한 사용자 정보 */
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

/** 사이드바 메뉴 항목 */
export const mockSidebarMenuItems: SidebarMenuItem[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    href: '/dashboard',
    icon: 'dashboard',
  },
  {
    id: 'care-logs',
    label: '돌봄 일지',
    href: '/care-logs',
    icon: 'document',
    badge: 5, // 대기 중인 보고서 수
  },
  {
    id: 'recipients',
    label: '대상자 관리',
    href: '/recipients',
    icon: 'users',
  },
  {
    id: 'managers',
    label: '매니저 관리',
    href: '/managers',
    icon: 'briefcase',
  },
];

/** 사이드바 메뉴 그룹 */
export const mockSidebarMenuGroups: SidebarMenuGroup[] = [
  {
    title: '업무 관리',
    items: mockSidebarMenuItems,
  },
  {
    title: '설정',
    items: [
      {
        id: 'settings',
        label: '설정',
        href: '/settings',
        icon: 'settings',
      },
    ],
  },
];

/** 사용자 정보 가져오기 (Mock API 시뮬레이션) */
export function getSidebarUser(): Promise<SidebarUser> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSidebarUser);
    }, 100);
  });
}

/** 메뉴 항목 가져오기 (Mock API 시뮬레이션) */
export function getSidebarMenuItems(): Promise<SidebarMenuItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSidebarMenuItems);
    }, 100);
  });
}
