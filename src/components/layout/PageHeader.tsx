'use client';

import { useMemo } from 'react';

// ============================================================
// PageHeader 컴포넌트
// 페이지 상단 헤더 (제목 + 날짜 + 액션)
// ============================================================

interface PageHeaderProps {
  title?: string;
  description?: string;
  userName?: string;
  notificationCount?: number;
  actions?: React.ReactNode;
  className?: string;
}

function formatTodayKorean(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}

export function PageHeader({
  title,
  description,
  actions,
  className = '',
}: PageHeaderProps) {
  const todayDate = useMemo(() => formatTodayKorean(), []);

  return (
    <header
      className={`
        flex flex-wrap items-center justify-between gap-4
        px-3 lg:px-8 pt-6 lg:pt-8 pb-4
        ${className}
      `}
    >
      {/* 왼쪽: 제목 및 설명 */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
          {title && (
            <h1 className="text-xl lg:text-2xl font-bold text-neutral-text shrink-0">{title}</h1>
          )}
          {description && (
            <p className="text-xs lg:text-sm text-neutral-text-sub truncate sm:ml-1">{description}</p>
          )}
        </div>
        {!title && !description && (
          <p className="text-base text-neutral-text-sub">{todayDate}</p>
        )}
      </div>

      {/* 오른쪽: 액션 */}
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}

export default PageHeader;
