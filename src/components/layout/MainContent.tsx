'use client';

interface MainContentProps {
  children: React.ReactNode;
}

/**
 * 메인 콘텐츠 래퍼
 * 사이드바 옆 영역 (플로팅 카드 아님, 배경 위에 직접 배치)
 */
export function MainContent({ children }: MainContentProps) {
  return (
    <main
      className="
        fixed top-0 right-0 bottom-0 left-[320px]
        flex flex-col
        overflow-y-auto overflow-x-hidden
      "
    >
      {children}
    </main>
  );
}
