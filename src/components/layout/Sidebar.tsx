'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import logoImg from '../../../public/logo.png';
import type { SidebarUser, SidebarMenuItem } from '@/types/dashboard';
import { defaultSidebarUser, defaultSidebarMenuItems } from '@/lib/utils/sidebar-defaults';
// ============================================================
// Sidebar 컴포넌트
// 플로팅 사이드바
// ============================================================

interface SidebarProps {
  user?: SidebarUser;
  menuItems?: SidebarMenuItem[];
  className?: string;
}

/** 메뉴 아이콘 컴포넌트 */
function MenuIcon({ type }: { type: SidebarMenuItem['icon'] }) {
  const iconClass = 'w-5 h-5 shrink-0';

  switch (type) {
    case 'dashboard':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case 'document':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'users':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'settings':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Sidebar 컴포넌트
 * 플로팅 오버레이 사이드바 (레퍼런스 스타일)
 */
export function Sidebar({
  user = defaultSidebarUser,
  menuItems = defaultSidebarMenuItems,
  className = '',
}: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 라우트 변경 시 자동으로 모바일 메뉴 닫기
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 모바일 햄버거 트리거 (lg 미만에서만 표시) */}
      <button
        type="button"
        aria-label="메뉴 열기"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 w-10 h-10 rounded-lg bg-white shadow-md border border-neutral-border flex items-center justify-center"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* 모바일 오버레이 */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 플로팅 사이드바 (lg 이상 항상 표시, 미만은 mobileOpen 시 슬라이드인) */}
      <aside
        className={`
          fixed left-4 top-4 bottom-4 z-50
          w-72 flex flex-col
          bg-white text-[#2B2F36]
          rounded-2xl shadow-2xl
          border border-neutral-border
          overflow-hidden
          transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'}
          ${className}
        `}
      >
        {/* 로고 */}
        <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
          <Image src={logoImg} alt="안심하이 로고" width={32} height={32} />
          <span className="text-lg font-bold text-primary">안심하이</span>
        </div>

        {/* 메뉴 목록 */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto" aria-label="사이드바 네비게이션">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => {}}
                    className={`
                      flex items-center gap-3 px-3 py-2.5
                      rounded-lg transition-colors duration-200
                      min-h-[44px]
                      ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-neutral-text-sub hover:bg-neutral-bg hover:text-[#2B2F36]'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <MenuIcon type={item.icon} />
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium bg-primary text-white">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 하단: 사용자 정보 + 로그아웃 */}
        <div className="border-t border-neutral-border">
          <div className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2B2F36] truncate">{user.name}</p>
                <p className="text-xs text-neutral-text-sub truncate mt-0.5">{user.roleLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
