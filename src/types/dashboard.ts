// ============================================================
// 관리자 대시보드 타입 정의
// dashboard-web에서 가져온 사이드바 관련 타입
// ============================================================

// ============================================================
// 사이드바 사용자 정보 타입
// ============================================================

/** 사용자 역할 */
export type AdminRole = 'admin' | 'manager';

/** 관할 구역 정보 */
export interface Jurisdiction {
  region: string;
  dongCount: number;
  centerCount: number;
}

/** 사이드바 사용자 정보 */
export interface SidebarUser {
  name: string;
  organizationName: string;
  role: AdminRole;
  roleLabel: string;
  jurisdiction: Jurisdiction;
}

// ============================================================
// 사이드바 네비게이션 타입
// ============================================================

/** 사이드바 메뉴 아이템 */
export interface SidebarMenuItem {
  id: string;
  label: string;
  href: string;
  icon: 'dashboard' | 'document' | 'users' | 'briefcase' | 'settings' | 'chart';
  badge?: number;
}

/** 사이드바 메뉴 그룹 */
export interface SidebarMenuGroup {
  title?: string;
  items: SidebarMenuItem[];
}
