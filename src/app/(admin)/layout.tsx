import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { MainContent } from '@/components/layout/MainContent';

// ============================================================
// 관리자 레이아웃
// 사이드바 + 메인 영역 (네비바는 메인 내부)
// ============================================================

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 (사이드바 오른쪽) */}
      <MainContent>
        <TopNavBar />
        {children}
      </MainContent>
    </div>
  );
}
