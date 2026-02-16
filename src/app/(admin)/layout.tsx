import { Sidebar } from '@/components/layout/Sidebar';

// ============================================================
// 관리자 레이아웃
// 사이드바 + 메인 영역 레이아웃
// ============================================================

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* 사이드바 - 고정 너비 */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 - 사이드바 제외 나머지 공간 */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
