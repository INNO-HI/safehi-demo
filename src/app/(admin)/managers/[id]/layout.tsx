/**
 * 매니저 상세 페이지 동적 라우트 정적 빌드용 layout.
 * generateStaticParams로 빌드 타임에 페이지를 미리 생성.
 */

export function generateStaticParams() {
  return [{ id: 'm-1' }, { id: 'm-2' }, { id: 'm-3' }];
}

export default function ManagerDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
