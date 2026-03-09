'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AccountManagementSectionProps {
  onLogout: () => void;
  onInquiry: () => void;
}

/**
 * 계정 관리 섹션
 * 로그아웃, 계정 문의 (좌측 빨간 보더, 가로 배치)
 */
export function AccountManagementSection({
  onLogout,
  onInquiry,
}: AccountManagementSectionProps) {
  return (
    <Card variant="default" padding="md" className="h-full border-l-4 border-l-status-danger">
      {/* 헤더 */}
      <h2 className="text-h3 font-semibold text-status-danger flex items-center gap-2 mb-5 whitespace-nowrap">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        계정 관리
      </h2>

      {/* 액션 가로 배치 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 로그아웃 */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-border bg-neutral-50">
          <div className="min-w-0 mr-3">
            <p className="text-body font-semibold text-status-danger whitespace-nowrap">로그아웃</p>
            <p className="text-caption text-neutral-text-sub whitespace-nowrap">현재 세션에서 로그아웃합니다</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={onLogout}
            className="flex-shrink-0 whitespace-nowrap"
          >
            실행
          </Button>
        </div>

        {/* 계정 문의 */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-border bg-neutral-50">
          <div className="min-w-0 mr-3">
            <p className="text-body font-semibold text-neutral-text whitespace-nowrap">계정 문의</p>
            <p className="text-caption text-neutral-text-sub whitespace-nowrap">관리자에게 계정 관련 문의하기</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onInquiry}
            className="flex-shrink-0 whitespace-nowrap"
          >
            문의
          </Button>
        </div>
      </div>
    </Card>
  );
}
