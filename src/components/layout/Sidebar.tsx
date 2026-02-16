'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { SidebarUser, SidebarMenuItem } from '@/types/dashboard';
import { defaultSidebarUser, defaultSidebarMenuItems } from '@/lib/utils/sidebar-defaults';

// ============================================================
// Sidebar 컴포넌트
// 다크 배경 사이드바 (로고, 메뉴, 사용자 정보)
// ============================================================

interface SidebarProps {
  user?: SidebarUser;
  menuItems?: SidebarMenuItem[];
  className?: string;
}

/** 메뉴 아이콘 컴포넌트 */
function MenuIcon({ type }: { type: SidebarMenuItem['icon'] }) {
  const iconClass = 'w-5 h-5';

  switch (type) {
    case 'dashboard':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      );
    case 'document':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    case 'users':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      );
    case 'briefcase':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case 'settings':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      );
    case 'chart':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Sidebar 컴포넌트
 * 관리자 페이지의 사이드바 네비게이션
 */
export function Sidebar({
  user = defaultSidebarUser,
  menuItems = defaultSidebarMenuItems,
  className = '',
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        flex flex-col w-64 min-h-screen
        bg-neutral-900 text-white
        ${className}
      `}
    >
      {/* 로고 영역 */}
      <div className="flex items-center h-16 px-6 border-b border-neutral-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary-400">SafeHi</span>
          <span className="text-sm text-neutral-400">관리자</span>
        </Link>
      </div>

      {/* 사용자 정보 */}
      <div className="px-4 py-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          {/* 아바타 */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white font-semibold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-neutral-400 truncate">{user.roleLabel}</p>
          </div>
        </div>
        <div className="mt-3 text-xs text-neutral-500">
          <p>{user.organizationName}</p>
          <p>
            {user.jurisdiction.region} · {user.jurisdiction.dongCount}개 동 ·{' '}
            {user.jurisdiction.centerCount}개 센터
          </p>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="사이드바 네비게이션">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5
                    rounded-lg transition-colors duration-200
                    min-h-[44px]
                    ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <MenuIcon type={item.icon} />
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium bg-red-500 text-white">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 하단 영역 */}
      <div className="px-4 py-4 border-t border-neutral-800">
        <button
          type="button"
          className="
            flex items-center gap-3 w-full px-3 py-2.5
            rounded-lg text-neutral-400
            hover:bg-neutral-800 hover:text-white
            transition-colors duration-200
            min-h-[44px]
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-sm font-medium">로그아웃</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
