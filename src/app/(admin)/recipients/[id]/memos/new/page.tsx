'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRecipientDetail } from '@/hooks/useRecipientDetail';
import { Alert } from '@/components/ui/Alert';
import type { MemoType } from '@/types/dashboard';

// ============================================================
// 메모 추가 페이지
// /recipients/[id]/memos/new
// ============================================================

export default function NewMemoPage() {
  const params = useParams();
  const router = useRouter();
  const recipientId = params.id as string;

  // 메모 작성 상태
  const [memoType, setMemoType] = useState<MemoType>('normal');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 대상자 정보 조회
  const { data: recipient, isLoading, error } = useRecipientDetail(recipientId);

  // 뒤로가기
  const handleBack = () => {
    router.push(`/recipients/${recipientId}/memos`);
  };

  // 메모 저장
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: 실제 API 호출
      console.log('Creating memo:', {
        recipientId,
        type: memoType,
        title: title.trim(),
        content: content.trim(),
      });

      // 성공 시 메모 목록으로 이동
      router.push(`/recipients/${recipientId}/memos`);
    } catch (err) {
      console.error('Failed to create memo:', err);
      setIsSubmitting(false);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-3xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-200 rounded w-1/4" />
            <div className="h-12 bg-neutral-200 rounded" />
            <div className="h-48 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !recipient) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-3xl mx-auto p-6">
          <Alert variant="danger" className="mb-4">
            {error?.message || '대상자 정보를 불러올 수 없습니다.'}
          </Alert>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors min-h-[44px]"
          >
            메모 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-neutral-200 px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-11 h-11 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                aria-label="메모 목록으로 돌아가기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <p className="text-sm text-neutral-500 mb-0.5">
                  대상자 관리 &gt; {recipient.name} &gt; 담당자 메모
                </p>
                <h1 className="text-2xl font-bold text-neutral-900">메모 추가</h1>
              </div>
            </div>

            {/* 대상자 태그 */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#E8F0F8] rounded-full">
              <span className="text-sm font-medium text-[#2E6AB3]">
                {recipient.basicInfo.dong}
              </span>
              <span className="text-sm font-medium text-[#C45A5A]">
                {recipient.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
          {/* 메모 유형 선택 */}
          <div>
            <label className="block text-base font-semibold text-neutral-900 mb-3">
              메모 유형
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMemoType('normal')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  memoType === 'normal'
                    ? 'border-[#2E6AB3] bg-[#E8F0F8]'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  memoType === 'normal' ? 'bg-[#2E6AB3]/20' : 'bg-neutral-100'
                }`}>
                  <svg className={`w-6 h-6 ${memoType === 'normal' ? 'text-[#2E6AB3]' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${memoType === 'normal' ? 'text-[#2E6AB3]' : 'text-neutral-900'}`}>
                    일반 메모
                  </p>
                  <p className="text-sm text-neutral-500">일반적인 기록 사항</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMemoType('warning')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  memoType === 'warning'
                    ? 'border-[#C4940A] bg-[#FFF8E6]'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  memoType === 'warning' ? 'bg-[#C4940A]/20' : 'bg-neutral-100'
                }`}>
                  <svg className={`w-6 h-6 ${memoType === 'warning' ? 'text-[#C4940A]' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${memoType === 'warning' ? 'text-[#C4940A]' : 'text-neutral-900'}`}>
                    주의사항
                  </p>
                  <p className="text-sm text-neutral-500">중요한 주의 사항</p>
                </div>
              </button>
            </div>
          </div>

          {/* 제목 입력 */}
          <div>
            <label htmlFor="memo-title" className="block text-base font-semibold text-neutral-900 mb-3">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="memo-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="메모 제목을 입력하세요"
              className="w-full px-4 py-3 text-base border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E6AB3]/20 focus:border-[#2E6AB3] transition-colors min-h-[48px]"
              maxLength={100}
            />
            <p className="mt-2 text-sm text-neutral-500 text-right">
              {title.length}/100
            </p>
          </div>

          {/* 내용 입력 */}
          <div>
            <label htmlFor="memo-content" className="block text-base font-semibold text-neutral-900 mb-3">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="memo-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="메모 내용을 입력하세요. 다른 담당자들도 확인할 수 있습니다."
              rows={8}
              className="w-full px-4 py-3 text-base border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E6AB3]/20 focus:border-[#2E6AB3] transition-colors resize-none"
              maxLength={1000}
            />
            <p className="mt-2 text-sm text-neutral-500 text-right">
              {content.length}/1000
            </p>
          </div>

          {/* 안내 메시지 */}
          <div className={`p-4 rounded-xl ${memoType === 'warning' ? 'bg-[#FFF8E6] border border-[#C4940A]/30' : 'bg-[#E8F0F8] border border-[#2E6AB3]/30'}`}>
            <div className="flex items-start gap-3">
              <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${memoType === 'warning' ? 'text-[#C4940A]' : 'text-[#2E6AB3]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className={`text-sm font-medium ${memoType === 'warning' ? 'text-[#C4940A]' : 'text-[#2E6AB3]'}`}>
                  {memoType === 'warning' ? '주의사항 메모 안내' : '일반 메모 안내'}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  {memoType === 'warning'
                    ? '주의사항으로 등록된 메모는 대상자 상세 페이지에서 강조 표시되어 다른 담당자들이 쉽게 확인할 수 있습니다.'
                    : '작성된 메모는 해당 대상자를 담당하는 모든 매니저가 확인할 수 있습니다.'}
                </p>
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-6 text-base font-medium text-neutral-700 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors min-h-[52px]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`flex-1 py-3 px-6 text-base font-medium text-white rounded-xl transition-colors min-h-[52px] ${
                memoType === 'warning'
                  ? 'bg-[#C4940A] hover:bg-[#a67d08] disabled:bg-[#C4940A]/50'
                  : 'bg-[#2E6AB3] hover:bg-[#245a96] disabled:bg-[#2E6AB3]/50'
              } disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  저장 중...
                </span>
              ) : (
                '메모 저장'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
