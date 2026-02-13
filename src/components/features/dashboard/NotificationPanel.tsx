'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import type { Notification, NotificationIcon } from '@/types/dashboard';
import { formatRelativeTime } from '@/lib/utils/date';

// ============================================================
// NotificationPanel 컴포넌트
// T033: 알림 목록 패널
// ============================================================

interface NotificationPanelProps {
  notifications: Notification[];
  className?: string;
  isLoading?: boolean;
}

/**
 * 알림 아이콘 컴포넌트
 */
function NotifIcon({ type, isUrgent }: { type?: NotificationIcon; isUrgent: boolean }) {
  const baseClass = 'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0';

  if (isUrgent || type === 'warning') {
    return (
      <div className={`${baseClass} bg-red-100`}>
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
    );
  }

  switch (type) {
    case 'success':
      return (
        <div className={`${baseClass} bg-green-100`}>
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      );
    case 'report':
      return (
        <div className={`${baseClass} bg-blue-100`}>
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      );
    case 'info':
    default:
      return (
        <div className={`${baseClass} bg-neutral-100`}>
          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      );
  }
}

/**
 * 알림 항목 스켈레톤
 */
function NotificationSkeleton() {
  return (
    <div className="flex gap-3 p-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-neutral-200" />
      <div className="flex-1">
        <div className="h-4 w-32 bg-neutral-200 rounded mb-2" />
        <div className="h-3 w-full bg-neutral-200 rounded mb-2" />
        <div className="h-3 w-16 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}

/**
 * NotificationPanel 컴포넌트
 * 알림 목록 패널
 */
export const NotificationPanel = forwardRef<HTMLDivElement, NotificationPanelProps>(
  function NotificationPanel({ notifications, className = '', isLoading = false }, ref) {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl shadow-sm border border-neutral-200 ${className}`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">알림</h2>
          <button
            type="button"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            모두 읽음
          </button>
        </div>

        {/* 알림 목록 */}
        <div className="divide-y divide-neutral-100">
          {isLoading ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : notifications.length === 0 ? (
            <div className="px-5 py-8 text-center text-neutral-500">
              새로운 알림이 없습니다
            </div>
          ) : (
            notifications.map((notification) => {
              const content = (
                <div className="flex gap-3 p-4 hover:bg-neutral-50 transition-colors">
                  <NotifIcon type={notification.icon} isUrgent={notification.isUrgent} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-neutral-900">
                        {notification.title}
                      </h3>
                      {notification.isUrgent && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mt-0.5 line-clamp-2">
                      {notification.content}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              );

              return notification.link ? (
                <Link key={notification.id} href={notification.link}>
                  {content}
                </Link>
              ) : (
                <div key={notification.id}>{content}</div>
              );
            })
          )}
        </div>
      </div>
    );
  }
);

export default NotificationPanel;
