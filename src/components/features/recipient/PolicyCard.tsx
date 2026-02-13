'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { Policy } from '@/types/dashboard';
import { Badge } from '@/components/ui/Badge';

// ============================================================
// T047: PolicyCard 컴포넌트
// AI 정책 추천 카드 (아코디언 상세)
// ============================================================

interface PolicyCardProps {
  policy: Policy;
  isExpanded?: boolean;
}

/**
 * 매칭 점수에 따른 배지 variant
 */
function getScoreVariant(score: number): 'success' | 'warning' | 'default' {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'default';
}

/**
 * 매칭 점수에 따른 레이블
 */
function getScoreLabel(score: number): string {
  if (score >= 90) return '최적';
  if (score >= 80) return '높음';
  if (score >= 70) return '보통';
  return '참고';
}

/**
 * AI 정책 추천 카드 컴포넌트
 */
export function PolicyCard({ policy }: PolicyCardProps) {
  return (
    <AccordionPrimitive.Item
      value={policy.id}
      className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
    >
      {/* 헤더 (클릭 영역) */}
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className="
            w-full p-4 text-left
            flex items-start gap-4
            hover:bg-neutral-50
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
            min-h-[44px]
            group
          "
        >
          {/* 매칭 점수 */}
          <div className="shrink-0 text-center">
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                text-lg font-bold
                ${policy.matchScore >= 80
                  ? 'bg-green-100 text-green-700'
                  : policy.matchScore >= 60
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-neutral-100 text-neutral-600'
                }
              `}
            >
              {policy.matchScore}
            </div>
            <span className="text-xs text-neutral-500 mt-1 block">적합도</span>
          </div>

          {/* 정책 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-neutral-900">
                {policy.name}
              </h3>
              <Badge variant={getScoreVariant(policy.matchScore)} size="sm">
                {getScoreLabel(policy.matchScore)}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
              {policy.summary}
            </p>
          </div>

          {/* 펼침 아이콘 */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 text-neutral-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      {/* 상세 내용 */}
      <AccordionPrimitive.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
        <div className="px-4 pb-4 border-t border-neutral-100">
          <div className="pt-4 space-y-4">
            {/* 상세 설명 */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-2">
                상세 설명
              </h4>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {policy.details.description}
              </p>
            </div>

            {/* 신청 대상 */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-2">
                신청 대상
              </h4>
              <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                {policy.details.eligibility.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 지원 내용 */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-2">
                지원 내용
              </h4>
              <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                {policy.details.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 필요 서류 */}
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-2">
                필요 서류
              </h4>
              <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                {policy.details.documents.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 신청 방법 및 문의처 */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-neutral-100">
              <div>
                <span className="text-sm font-medium text-neutral-900">신청 방법: </span>
                <span className="text-sm text-neutral-600">{policy.applicationMethod}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-neutral-900">문의처: </span>
                <span className="text-sm text-primary-600 font-medium">
                  {policy.details.contactInfo}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
