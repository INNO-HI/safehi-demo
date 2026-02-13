'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

interface CareLogDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 돌봄 일지 상세 페이지 에러 UI
 */
export default function CareLogDetailError({
  error,
  reset,
}: CareLogDetailErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // 에러 로깅 (실제 환경에서는 에러 트래킹 서비스로 전송)
    console.error('돌봄 일지 상세 페이지 에러:', error);
  }, [error]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Alert variant="danger" className="mb-6">
        <div>
          <strong className="block mb-1">오류가 발생했습니다</strong>
          <p className="text-sm">
            {error.message || '돌봄 일지를 불러오는 중 문제가 발생했습니다.'}
          </p>
        </div>
      </Alert>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => router.push('/care-logs')}>
          목록으로 돌아가기
        </Button>
        <Button variant="primary" onClick={reset}>
          다시 시도
        </Button>
      </div>
    </div>
  );
}
