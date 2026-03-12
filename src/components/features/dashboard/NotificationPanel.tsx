'use client';

import { forwardRef, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Notification } from '@/types/dashboard';

// ============================================================
// NotificationPanel 컴포넌트
// 롤링 알림 (한 개씩 자동 전환)
// ============================================================

interface NotificationPanelProps {
  notifications: Notification[];
  className?: string;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onMarkAllRead?: () => void;
}

/** 상대 시간 포맷 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

/**
 * NotificationPanel 컴포넌트
 * 한 개씩 롤링되는 알림
 */
export const NotificationPanel = forwardRef<HTMLDivElement, NotificationPanelProps>(
  function NotificationPanel({ notifications, className = '', isLoading = false }, ref) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (notifications.length <= 1) return;
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
      }, 3000);
      return () => clearInterval(timer);
    }, [notifications.length]);

    const urgentCount = notifications.filter((n) => n.isUrgent).length;
    const current = notifications[currentIndex];

    return (
      <div
        ref={ref}
        className={`bg-white rounded-2xl shadow-elevated border border-neutral-border/30 flex items-center px-4 h-[52px] gap-3 ${className}`}
      >
        {/* 라벨 */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-sm font-semibold text-neutral-text">알림</span>
          {notifications.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-medium bg-primary text-white">
              {notifications.length}
            </span>
          )}
          {urgentCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-medium bg-status-danger text-white animate-urgent-pulse">
              {urgentCount}
            </span>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-px h-5 bg-neutral-200 flex-shrink-0" />

        {/* 롤링 알림 */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {isLoading ? (
            <div className="h-4 w-32 bg-neutral-bg rounded animate-pulse" />
          ) : !current ? (
            <span className="text-xs text-neutral-text-sub">새로운 알림이 없습니다</span>
          ) : (
            (() => {
              const content = (
                <div className="flex items-center gap-2 animate-fade-in">
                  {current.isUrgent && (
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-status-danger animate-urgent-pulse" />
                  )}
                  <span className={`text-sm truncate ${current.isUrgent ? 'font-semibold text-neutral-text' : 'text-neutral-text'}`}>
                    {current.title}
                  </span>
                  <span className="text-[11px] text-neutral-text-tertiary flex-shrink-0">
                    {formatRelativeTime(current.createdAt)}
                  </span>
                </div>
              );

              return current.link ? (
                <Link href={current.link}>{content}</Link>
              ) : (
                content
              );
            })()
          )}
        </div>

        {/* 페이지 인디케이터 */}
        {notifications.length > 1 && (
          <span className="text-[11px] text-neutral-text-tertiary flex-shrink-0">
            {currentIndex + 1}/{notifications.length}
          </span>
        )}
      </div>
    );
  }
);

export default NotificationPanel;
