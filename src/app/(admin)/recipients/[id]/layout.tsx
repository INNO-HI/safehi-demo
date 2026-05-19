/**
 * 대상자 상세 페이지 동적 라우트 정적 빌드.
 * mock-data/recipients.ts의 recipient-001 ~ recipient-048 전원 생성.
 */
import { mockRecipients } from '@/lib/mock-data/recipients';

export function generateStaticParams() {
  return mockRecipients.map((r) => ({ id: r.id }));
}

export default function RecipientDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
