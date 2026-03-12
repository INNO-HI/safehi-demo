/**
 * 사이드바 기본 데이터 (UI 상수)
 *
 * 로그인 사용자 정보가 연동되기 전까지 사용하는 기본값.
 * 추후 로그인 사용자 정보로 대체 가능.
 */

import type { SidebarUser, SidebarMenuItem } from '@/types/dashboard';

export const defaultSidebarUser: SidebarUser = {
  name: '김담당',
  organizationName: '제주시청',
  role: 'admin',
  roleLabel: '구/군 관리자',
  jurisdiction: {
    region: '제주특별자치도 제주시',
    dongCount: 22,
    centerCount: 15,
  },
};

export const defaultSidebarMenuItems: SidebarMenuItem[] = [
  { id: 'dashboard', label: '대시보드', href: '/dashboard', icon: 'dashboard' },
  { id: 'care-logs', label: '돌봄 일지', href: '/care-logs', icon: 'document' },
  { id: 'recipients', label: '대상자 관리', href: '/recipients', icon: 'users' },
  { id: 'managers', label: '매니저 관리', href: '/managers', icon: 'briefcase' },
  { id: 'statistics', label: '통계/리포트', href: '/statistics', icon: 'chart' },
  { id: 'settings', label: '설정', href: '/settings', icon: 'settings' },
];
