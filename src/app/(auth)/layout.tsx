import { type ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * 인증 페이지 공통 레이아웃
 * 중앙 정렬, 최소 높이 보장
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[440px]">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <h1 className="text-display text-primary font-bold">SafeHi</h1>
          <p className="text-body text-neutral-text-sub mt-2">
            돌봄 관리 시스템
          </p>
        </div>

        {/* 콘텐츠 영역 */}
        {children}
      </div>

      {/* 푸터 */}
      <footer className="mt-8 text-center">
        <p className="text-caption text-neutral-text-tertiary">
          © 2026 SafeHi. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
