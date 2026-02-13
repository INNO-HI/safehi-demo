'use client';

import { useMemo } from 'react';
import { ProfileButton } from './ProfileButton';

// ============================================================
// PageHeader 컴포넌트
// T022: 페이지 상단 헤더 (날짜, 알림, 프로필)
// ============================================================

interface PageHeaderProps {
  /** 페이지 제목 */
  title?: string;
  /** 페이지 설명 */
  description?: string;
  /** 알림 개수 */
  notificationCount?: number;
  /** 알림 클릭 핸들러 */
  onNotificationClick?: () => void;
  /** 프로필 클릭 핸들러 */
  onProfileClick?: () => void;
  /** 사용자 이름 */
  userName?: string;
  /** 추가 액션 버튼 */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * 오늘 날짜 포맷
 */
function formatTodayKorean(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];

  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}

/**
 * PageHeader 컴포넌트
 * 페이지 상단 헤더 영역
 */
export function PageHeader({
  title,
  description,
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,
  userName = '김담당',
  actions,
  className = '',
}: PageHeaderProps) {
  const todayDate = useMemo(() => formatTodayKorean(), []);

  return (
    <header
      className={`
        flex flex-wrap items-center justify-between gap-4
        px-6 py-4 bg-white border-b border-neutral-200
        ${className}
      `}
    >
      {/* 왼쪽: 제목 및 날짜 */}
      <div className="flex-1 min-w-0">
        {title && (
          <h1 className="text-2xl font-bold text-neutral-900 truncate">{title}</h1>
        )}
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
        {!title && !description && (
          <p className="text-base text-neutral-600">{todayDate}</p>
        )}
      </div>

      {/* 오른쪽: 액션, 알림, 프로필 */}
      <div className="flex items-center gap-3">
        {/* 추가 액션 */}
        {actions}

        {/* 알림 버튼 */}
        <button
          type="button"
          onClick={onNotificationClick}
          aria-label={`알림 ${notificationCount}개`}
          className="
            relative flex items-center justify-center
            w-10 h-10 rounded-lg
            text-neutral-600 hover:bg-neutral-100
            transition-colors duration-200
          "
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-medium bg-red-500 text-white">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>

        {/* 프로필 버튼 */}
        <ProfileButton name={userName} onClick={onProfileClick} />
      </div>
    </header>
  );
}

export default PageHeader;
