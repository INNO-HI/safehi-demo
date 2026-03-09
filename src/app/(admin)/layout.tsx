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
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
