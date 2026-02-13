'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';

// ============================================================
// T035: MemoForm 컴포넌트
// 담당자 메모 작성 폼 (React Hook Form + Zod)
// ============================================================

// 메모 폼 스키마
const memoSchema = z.object({
  content: z
    .string()
    .min(1, '메모 내용을 입력해 주세요')
    .max(1000, '메모는 1000자 이내로 작성해 주세요'),
});

type MemoFormValues = z.infer<typeof memoSchema>;

interface MemoFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

/**
 * 담당자 메모 작성 폼 컴포넌트
 */
export function MemoForm({
  onSubmit,
  isSubmitting = false,
  className = '',
}: MemoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<MemoFormValues>({
    resolver: zodResolver(memoSchema),
    defaultValues: {
      content: '',
    },
  });

  const contentValue = watch('content');
  const charCount = contentValue?.length || 0;

  const handleFormSubmit = async (data: MemoFormValues) => {
    try {
      await onSubmit(data.content);
      reset(); // 제출 성공 시 폼 초기화
    } catch {
      // 에러는 상위 컴포넌트에서 처리
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`bg-white border border-neutral-200 rounded-xl p-4 ${className}`}
    >
      <label htmlFor="memo-content" className="block text-sm font-medium text-neutral-700 mb-2">
        새 메모 작성
      </label>

      <div className="space-y-3">
        <div>
          <textarea
            id="memo-content"
            {...register('content')}
            placeholder="대상자에 대한 메모를 입력하세요..."
            rows={4}
            disabled={isSubmitting}
            aria-invalid={errors.content ? 'true' : 'false'}
            aria-describedby={errors.content ? 'memo-error' : 'memo-char-count'}
            className={`
              w-full px-4 py-3 text-sm
              border rounded-lg
              placeholder:text-neutral-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:bg-neutral-50 disabled:text-neutral-400
              resize-none
              ${errors.content
                ? 'border-red-500 focus:ring-red-500'
                : 'border-neutral-300'
              }
            `}
          />

          {/* 글자 수 카운터 및 에러 메시지 */}
          <div className="flex items-center justify-between mt-1.5">
            {errors.content ? (
              <p id="memo-error" className="text-sm text-red-600" role="alert">
                {errors.content.message}
              </p>
            ) : (
              <span className="text-sm text-neutral-400" />
            )}
            <span
              id="memo-char-count"
              className={`text-sm ${charCount > 900 ? 'text-amber-600' : 'text-neutral-400'}`}
            >
              {charCount} / 1000
            </span>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || charCount === 0}
            className="min-w-[100px] min-h-[44px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                저장 중...
              </span>
            ) : (
              '메모 저장'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
