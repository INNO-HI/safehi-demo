'use client';

import { useState, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { REPORT_TEMPLATES } from '@/lib/constants/statistics';
import type { ReportType } from '@/types/statistics';

export interface QuickReportCardsProps extends HTMLAttributes<HTMLDivElement> {
  onGenerateReport?: (type: ReportType) => Promise<boolean | void>;
}

/**
 * 빠른 리포트 생성 카드 컴포넌트
 * 4가지 사전 정의된 리포트 템플릿을 카드 형태로 표시
 */
export function QuickReportCards({
  onGenerateReport,
  className,
  ...props
}: QuickReportCardsProps) {
  const [generatingType, setGeneratingType] = useState<ReportType | null>(null);

  const handleGenerate = async (type: ReportType) => {
    if (generatingType || !onGenerateReport) return;

    setGeneratingType(type);
    try {
      await onGenerateReport(type);
    } finally {
      setGeneratingType(null);
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg p-6 border border-neutral-border',
        className
      )}
      {...props}
    >
      {/* 헤더 */}
      <h2 className="text-h3 text-neutral-text mb-4">빠른 리포트 생성</h2>

      {/* 템플릿 카드 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {REPORT_TEMPLATES.map((template) => {
          const isGenerating = generatingType === template.type;

          return (
            <div
              key={template.id}
              className="p-4 rounded-lg border border-neutral-border hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                {/* 아이콘 */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: `${template.iconBgColor}20` }}
                >
                  {template.icon}
                </div>

                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-body font-medium text-neutral-text truncate">
                    {template.title}
                  </h3>
                  <p className="text-caption text-neutral-text-sub truncate">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* 생성 버튼 */}
              <button
                onClick={() => handleGenerate(template.type)}
                disabled={!!generatingType}
                className={cn(
                  'w-full mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  'min-h-[40px]',
                  isGenerating
                    ? 'bg-neutral-200 text-neutral-text-sub cursor-not-allowed'
                    : generatingType
                    ? 'bg-neutral-100 text-neutral-text-tertiary cursor-not-allowed'
                    : 'bg-neutral-bg text-neutral-text hover:bg-neutral-200'
                )}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="2" x2="12" y2="6" />
                      <line x1="12" y1="18" x2="12" y2="22" />
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                      <line x1="2" y1="12" x2="6" y2="12" />
                      <line x1="18" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                    </svg>
                    생성 중...
                  </span>
                ) : (
                  '생성'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
