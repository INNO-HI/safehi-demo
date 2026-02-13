'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { Policy } from '@/types/dashboard';
import { PolicyCard } from './PolicyCard';

// ============================================================
// T048: PolicyList 컴포넌트
// AI 정책 추천 목록
// ============================================================

interface PolicyListProps {
  policies: Policy[];
  className?: string;
}

/**
 * AI 정책 추천 목록 컴포넌트
 */
export function PolicyList({ policies, className = '' }: PolicyListProps) {
  if (policies.length === 0) {
    return (
      <div
        className={`text-center py-12 bg-neutral-50 rounded-xl ${className}`}
        role="status"
        aria-label="추천 정책 없음"
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
            d="M24 4L29.15 16.47L42.72 18.05L32.36 27.63L35.15 41.02L24 34.62L12.85 41.02L15.64 27.63L5.28 18.05L18.85 16.47L24 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-neutral-500">추천할 수 있는 정책이 없습니다</p>
        <p className="text-sm text-neutral-400 mt-1">
          대상자 정보가 업데이트되면 새로운 추천이 제공될 수 있습니다
        </p>
      </div>
    );
  }

  return (
    <AccordionPrimitive.Root
      type="multiple"
      className={`space-y-3 ${className}`}
      aria-label="AI 추천 정책 목록"
    >
      {policies.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} />
      ))}
    </AccordionPrimitive.Root>
  );
}
