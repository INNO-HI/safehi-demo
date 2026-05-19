/**
 * 매니저 상세 페이지 동적 라우트 정적 빌드.
 * mock-data/managers.ts의 m-1 ~ m-8 모두 생성.
 */
import { mockManagers } from '@/lib/mock-data/managers';

export function generateStaticParams() {
  return mockManagers.map((m) => ({ id: m.id }));
}

export default function ManagerDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
