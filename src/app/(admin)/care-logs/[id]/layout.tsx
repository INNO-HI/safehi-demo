/**
 * 돌봄 일지 상세 페이지 동적 라우트 정적 빌드.
 * mock-data/care-logs.ts의 cl-001 ~ cl-012 모두 생성.
 */
import { mockCareLogs } from '@/lib/mock-data/care-logs';

export function generateStaticParams() {
  return mockCareLogs.map((log) => ({ id: log.id }));
}

export default function CareLogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
