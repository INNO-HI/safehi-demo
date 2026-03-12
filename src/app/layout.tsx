import type { Metadata } from 'next';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import './globals.css';

export const metadata: Metadata = {
  title: '안심하이 - 돌봄 관리 시스템',
  description: '지자체 돌봄 매니저를 위한 웹 대시보드',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
