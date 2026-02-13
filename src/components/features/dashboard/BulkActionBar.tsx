'use client';

import { forwardRef } from 'react';
import { Button } from '@/components/ui/Button';

// ============================================================
// BulkActionBar 컴포넌트
// T040: 선택 개수, 일괄 승인/반려/PDF 버튼
// ============================================================

interface BulkActionBarProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
  onExportPDF?: () => void;
  onClear: () => void;
  isProcessing?: boolean;
  className?: string;
}

/**
 * BulkActionBar 컴포넌트
 * 일괄 처리 액션 바
 */
export const BulkActionBar = forwardRef<HTMLDivElement, BulkActionBarProps>(
  function BulkActionBar(
    {
      selectedCount,
      onApprove,
      onReject,
      onExportPDF,
      onClear,
      isProcessing = false,
      className = '',
    },
    ref
  ) {
    if (selectedCount === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={`
          flex flex-wrap items-center gap-3 p-4
          bg-primary-50 border border-primary-200 rounded-lg
          ${className}
        `}
      >
        {/* 선택 개수 */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-primary-600 text-white text-sm font-medium">
            {selectedCount}
          </span>
          <span className="text-sm font-medium text-primary-800">건 선택됨</span>
        </div>

        {/* 구분선 */}
        <div className="w-px h-6 bg-primary-200" aria-hidden="true" />

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={onApprove}
            disabled={isProcessing}
          >
            {isProcessing ? '처리 중...' : '일괄 승인'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onReject}
            disabled={isProcessing}
          >
            {isProcessing ? '처리 중...' : '일괄 반려'}
          </Button>

          {onExportPDF && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExportPDF}
              disabled={isProcessing}
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              PDF 내보내기
            </Button>
          )}
        </div>

        {/* 선택 해제 */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            선택 해제
          </button>
        </div>
      </div>
    );
  }
);

export default BulkActionBar;
