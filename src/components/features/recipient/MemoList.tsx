'use client';

import type { Memo } from '@/types/dashboard';
import { formatDate } from '@/lib/utils/date';

// ============================================================
// T034: MemoList 컴포넌트
// 담당자 메모 카드 목록
// ============================================================

interface MemoListProps {
  memos: Memo[];
  className?: string;
}

/**
 * 개별 메모 카드 컴포넌트
 */
function MemoCard({ memo }: { memo: Memo }) {
  return (
    <article
      className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3"
      aria-label={`${memo.authorName}님의 메모`}
    >
      {/* 헤더: 작성자 및 날짜 */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 아바타 */}
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-primary-700">
              {memo.authorName.charAt(0)}
            </span>
          </div>
          <span className="text-sm font-medium text-neutral-900">
            {memo.authorName}
          </span>
        </div>
        <time
          dateTime={memo.createdAt.toISOString()}
          className="text-sm text-neutral-500"
        >
          {formatDate(memo.createdAt)}
        </time>
      </header>

      {/* 메모 내용 */}
      <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
        {memo.content}
      </p>
    </article>
  );
}

/**
 * 메모 목록 컴포넌트
 */
export function MemoList({ memos, className = '' }: MemoListProps) {
  if (memos.length === 0) {
    return (
      <div
        className={`text-center py-12 bg-neutral-50 rounded-xl ${className}`}
        role="status"
        aria-label="메모 없음"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-4 text-neutral-300"
          aria-hidden="true"
        >
          <path
            d="M36 8H12C9.79086 8 8 9.79086 8 12V40C8 42.2091 9.79086 44 12 44H36C38.2091 44 40 42.2091 40 40V12C40 9.79086 38.2091 8 36 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 16H32"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 24H32"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 32H24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-neutral-500">작성된 메모가 없습니다</p>
        <p className="text-sm text-neutral-400 mt-1">
          위의 입력란에서 새 메모를 작성해 주세요
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} role="feed" aria-label="담당자 메모 목록">
      {memos.map((memo) => (
        <MemoCard key={memo.id} memo={memo} />
      ))}
    </div>
  );
}
