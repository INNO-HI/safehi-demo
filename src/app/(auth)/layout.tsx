import { type ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * 인증 페이지 공통 레이아웃
 * 상단 헤더 + 중앙 카드 + 하단 푸터
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#EEF2F9] flex flex-col">
      {/* 상단 헤더바 */}
      <header className="bg-white border-b border-neutral-border px-6 py-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="안심하이 로고" width={32} height={32} />
          <h1 className="text-h2 text-primary font-bold">안심하이</h1>
        </div>
      </header>

      {/* 메인: 카드 중앙 정렬 */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="py-6 text-center">
        <p className="text-caption text-neutral-text-tertiary">
          © 2026 안심하이. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
