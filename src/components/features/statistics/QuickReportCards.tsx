'use client';

import { useState, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { REPORT_TEMPLATES } from '@/lib/constants/statistics';
import type { ReportType } from '@/types/statistics';

export interface QuickReportCardsProps extends HTMLAttributes<HTMLDivElement> {
  onGenerateReport?: (type: ReportType) => Promise<boolean | void>;
}

/**
 * 빠른 리포트 생성 컴포넌트
 * 정사각형 카드 형태 + 생성 버튼
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
      className={cn('flex flex-col gap-4', className)}
      {...props}
    >
      <h2 className="text-base font-semibold text-neutral-text">빠른 리포트 생성</h2>
      <div className="grid grid-cols-2 gap-3">
        {REPORT_TEMPLATES.map((template) => {
          const isGenerating = generatingType === template.type;

          return (
            <div
              key={template.id}
              className="h-[160px] bg-white rounded-xl p-5 border border-neutral-border flex flex-col justify-between transition-all hover:shadow-md"
            >
              {/* 상단: 아이콘 + 제목 */}
              <div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${template.iconBgColor}15` }}
                >
                  <span style={{ color: template.iconBgColor }}>{template.icon}</span>
                </div>
                <p className="text-xs font-medium text-neutral-text leading-tight">{template.title}</p>
                <p className="text-[11px] text-neutral-text-sub mt-0.5">{template.description}</p>
              </div>

              {/* 하단: 생성 버튼 */}
              <button
                onClick={() => handleGenerate(template.type)}
                disabled={!!generatingType}
                className={cn(
                  'w-full py-1.5 rounded-lg text-xs font-medium transition-all min-h-[32px] flex items-center justify-center gap-1',
                  isGenerating
                    ? 'opacity-70 cursor-not-allowed'
                    : generatingType
                    ? 'opacity-40 cursor-not-allowed bg-neutral-bg text-neutral-text-sub'
                    : 'text-white hover:opacity-90'
                )}
                style={
                  !generatingType || isGenerating
                    ? { backgroundColor: template.iconBgColor }
                    : undefined
                }
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10" strokeDasharray="50" strokeDashoffset="15" />
                    </svg>
                    생성 중...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    생성하기
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
