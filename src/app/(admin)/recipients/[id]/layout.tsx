/**
 * 대상자 상세 페이지 동적 라우트 정적 빌드용 layout.
 * mock-data/recipients.ts의 ID 포맷(recipient-NNN) 따름.
 */

export function generateStaticParams() {
  return [
    { id: 'recipient-001' },
    { id: 'recipient-002' },
    { id: 'recipient-003' },
  ];
}

export default function RecipientDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
