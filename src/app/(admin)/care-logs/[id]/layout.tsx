/**
 * 돌봄 일지 상세 페이지 동적 라우트 정적 빌드용 layout.
 */

export function generateStaticParams() {
  return [{ id: 'cl-1' }, { id: 'cl-2' }, { id: 'cl-3' }];
}

export default function CareLogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
