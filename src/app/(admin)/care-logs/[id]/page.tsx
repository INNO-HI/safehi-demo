'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCareLogDetail } from '@/hooks/useCareLogDetail';
import { CareLogDetailSkeleton } from '@/components/features/care-log/CareLogDetailSkeleton';
import { RejectModal } from '@/components/features/care-log/RejectModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { formatDateTimeKorean, formatRelativeTime } from '@/lib/utils/date';
import { getCareLogStatusLabel, careLogStatusToBadgeVariant } from '@/lib/utils/status';
import type { ActionPriority } from '@/types/dashboard';

/**
 * 돌봄 일지 상세 페이지
 * /care-logs/[id]
 * Figma 디자인 기준 2컬럼 레이아웃
 * UI/UX 개선: 30~50대 구/군 관리자 타겟
 */
export default function CareLogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data,
    isLoading,
    error,
    approve,
    reject,
    requestRevision,
    addFeedback,
    isProcessing,
  } = useCareLogDetail(id);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // 뒤로가기
  const handleBack = () => {
    router.push('/care-logs');
  };

  // 승인 처리
  const handleApprove = async () => {
    try {
      setActionError(null);
      await approve();
      router.push('/care-logs');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '승인 처리 중 오류가 발생했습니다.');
    }
  };

  // 반려 처리
  const handleReject = async (reason: string) => {
    try {
      setActionError(null);
      await reject(reason);
      router.push('/care-logs');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '반려 처리 중 오류가 발생했습니다.');
    }
  };

  // 수정 요청 처리
  const handleRequestRevision = async (reason: string) => {
    try {
      setActionError(null);
      await requestRevision(reason);
      setIsRevisionModalOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '수정 요청 중 오류가 발생했습니다.');
    }
  };

  // 피드백 추가
  const handleAddFeedback = async () => {
    if (!feedbackText.trim()) return;
    try {
      setActionError(null);
      await addFeedback(feedbackText);
      setFeedbackText('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '피드백 추가 중 오류가 발생했습니다.');
    }
  };

  // 빠른 피드백 추가
  const handleQuickFeedback = async (text: string) => {
    try {
      setActionError(null);
      await addFeedback(text);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '피드백 추가 중 오류가 발생했습니다.');
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <CareLogDetailSkeleton />
      </div>
    );
  }

  // 에러 상태
  if (error || !data) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Alert variant="danger" className="mb-4">
          {error?.message || '돌봄 일지를 불러올 수 없습니다.'}
        </Alert>
        <Button variant="secondary" onClick={handleBack} className="min-h-[44px]">
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  // 승인/반려 가능 여부
  const canProcess = data.status === 'pending' || data.status === 'urgent';

  // 우선순위별 스타일
  const getPriorityStyle = (priority: ActionPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-400';
      case 'normal':
        return 'bg-blue-500';
      default:
        return 'bg-neutral-400';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-neutral-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-11 h-11 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                aria-label="목록으로 돌아가기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <p className="text-sm text-neutral-600 mb-0.5">돌봄 일지</p>
                <h1 className="text-2xl font-bold text-neutral-900">보고서 상세</h1>
              </div>
            </div>
            <Badge variant={careLogStatusToBadgeVariant(data.status)} size="lg">
              {getCareLogStatusLabel(data.status)}
            </Badge>
          </div>

          {/* 시간 정보 - 보고서 상세 텍스트와 정렬 (버튼 너비 44px + gap 16px = 60px) */}
          <div className="flex flex-wrap items-center gap-6 text-base text-neutral-700 ml-[60px]">
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">📅</span>
              <span className="font-medium">방문:</span>
              <span>{data.visitInfo ? formatDateTimeKorean(data.visitInfo.visitDate) : '-'}</span>
              <span className="text-neutral-500">
                ({data.visitInfo ? formatRelativeTime(data.visitInfo.visitDate) : '-'})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">📤</span>
              <span className="font-medium">등록:</span>
              <span>{formatDateTimeKorean(data.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 에러 메시지 */}
      {actionError && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <Alert variant="danger">{actionError}</Alert>
        </div>
      )}

      {/* 메인 콘텐츠 - 2컬럼 레이아웃 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 컬럼 (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 기본 정보 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-5">기본 정보</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <p className="text-sm text-neutral-600 mb-1.5">대상자</p>
                  <p className="text-lg font-bold text-neutral-900">{data.recipientName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1.5">담당 종사자</p>
                  <p className="text-lg font-bold text-neutral-900">
                    {data.visitInfo?.managerName || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1.5">소속 센터</p>
                  <p className="text-base font-medium text-neutral-800">
                    {data.visitInfo?.centerName || '-'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-5 pt-5 border-t border-neutral-100">
                <div>
                  <p className="text-sm text-neutral-600 mb-1.5 flex items-center gap-1.5">
                    <span className="text-base" aria-hidden="true">📅</span>
                    방문 일시
                  </p>
                  <p className="text-base font-medium text-neutral-800">
                    {data.visitInfo ? formatDateTimeKorean(data.visitInfo.visitDate) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1.5 flex items-center gap-1.5">
                    <span className="text-base" aria-hidden="true">📍</span>
                    방문 위치
                  </p>
                  <p className="text-base font-medium text-neutral-800">
                    {data.visitLocation || data.visitInfo?.centerName || '-'}
                  </p>
                </div>
              </div>
            </Card>

            {/* 돌봄 내용 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-5">돌봄 내용</h2>
              <div className="space-y-6">
                {data.careContentBlocks && data.careContentBlocks.length > 0 ? (
                  data.careContentBlocks.map((block, index) => (
                    <div key={index}>
                      <h3 className="text-sm font-semibold text-neutral-700 mb-2">{block.title}</h3>
                      <p className="text-base text-primary-700 whitespace-pre-wrap leading-relaxed">
                        {block.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-700 mb-2">건강 상태</h3>
                      <p className="text-base text-primary-700">
                        {data.careContent.healthStatus.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-700 mb-2">식사 상태</h3>
                      <p className="text-base text-primary-700">
                        {data.careContent.mealStatus.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-700 mb-2">정서 상태</h3>
                      <p className="text-base text-primary-700">
                        {data.careContent.emotionalStatus.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-700 mb-2">생활 환경</h3>
                      <p className="text-base text-primary-700">
                        {data.careContent.livingEnvironment.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* 필요 조치사항 */}
            {data.requiredActions && data.requiredActions.length > 0 && (
              <Card className="p-6 border-l-4 border-l-red-500 bg-red-50">
                <h2 className="text-lg font-semibold text-red-700 mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  필요 조치사항
                </h2>
                <ul className="space-y-4">
                  {data.requiredActions.map((action) => (
                    <li key={action.id} className="flex items-start gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${getPriorityStyle(action.priority)}`}
                      />
                      <span className="text-base text-neutral-800">{action.content}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* 복지 정책 추천 */}
            {data.recommendedPolicies && data.recommendedPolicies.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xl" aria-hidden="true">🏛️</span>
                  <h2 className="text-lg font-semibold text-neutral-900">복지 정책 추천</h2>
                  <Badge variant="success" size="sm">
                    AI 추천
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.recommendedPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className="border border-neutral-200 rounded-lg p-5 bg-white hover:shadow-sm transition-shadow"
                    >
                      <h3 className="text-base font-semibold text-neutral-900 mb-2">{policy.name}</h3>
                      <p className="text-sm text-neutral-700 mb-1">{policy.organization}</p>
                      <p className="text-sm text-neutral-600">{policy.schedule}</p>
                      <Button variant="primary" size="sm" className="mt-4 min-h-[44px]">
                        상세보기
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* 오른쪽 컬럼 (1/3) */}
          <div className="space-y-8">
            {/* 보고서 처리 */}
            {canProcess && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-5">보고서 처리</h2>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full min-h-[52px] text-base font-semibold"
                    onClick={handleApprove}
                    disabled={isProcessing}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isProcessing ? '처리 중...' : '승인하기'}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="secondary"
                      className="w-full min-h-[44px] border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => setIsRejectModalOpen(true)}
                      disabled={isProcessing}
                    >
                      반려
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full min-h-[44px] border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => setIsRevisionModalOpen(true)}
                      disabled={isProcessing}
                    >
                      수정요청
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* 반려된 경우 반려 정보 표시 */}
            {data.status === 'rejected' && data.rejectionReason && (
              <Alert variant="warning">
                <div>
                  <strong className="block mb-1 text-base">반려 사유</strong>
                  <p className="text-base">{data.rejectionReason}</p>
                  {data.rejectedAt && data.rejectedBy && (
                    <p className="text-sm mt-2 text-neutral-600">
                      {data.rejectedBy} · {new Date(data.rejectedAt).toLocaleString('ko-KR')}
                    </p>
                  )}
                </div>
              </Alert>
            )}

            {/* 피드백 작성 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-5">피드백 작성</h2>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="피드백 내용을 입력하세요...&#10;승인/반려/수정요청 시 종사자에게 전달됩니다."
                className="w-full h-28 p-4 border border-neutral-300 rounded-lg text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="mt-4">
                <p className="text-sm text-neutral-600 mb-2">빠른 피드백</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickFeedback('확인완료')}
                    className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-100 min-h-[44px] transition-colors"
                    disabled={isProcessing}
                  >
                    확인완료
                  </button>
                  <button
                    onClick={() => handleQuickFeedback('추가확인필요')}
                    className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-100 min-h-[44px] transition-colors"
                    disabled={isProcessing}
                  >
                    추가확인필요
                  </button>
                  <button
                    onClick={() => handleQuickFeedback('수고했어요')}
                    className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-100 min-h-[44px] transition-colors"
                    disabled={isProcessing}
                  >
                    수고했어요
                  </button>
                </div>
              </div>
              {feedbackText.trim() && (
                <Button
                  variant="primary"
                  className="mt-4 min-h-[44px]"
                  onClick={handleAddFeedback}
                  disabled={isProcessing}
                >
                  피드백 전송
                </Button>
              )}
            </Card>

            {/* 피드백 이력 */}
            {data.feedbacks && data.feedbacks.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-neutral-900">피드백 이력</h2>
                  <Badge variant="default" size="md">
                    {data.feedbacks.length}건
                  </Badge>
                </div>
                <div className="space-y-4">
                  {data.feedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className={`p-4 rounded-lg ${
                        feedback.isReply ? 'bg-primary-50 border border-primary-200' : 'bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-base font-semibold text-primary-700">
                          {feedback.authorName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-medium text-neutral-900">
                            {feedback.authorName}{' '}
                            <span className="text-neutral-600 font-normal">({feedback.authorRole})</span>
                          </p>
                          <p className="text-sm text-neutral-600">
                            {new Date(feedback.createdAt).toLocaleString('ko-KR')}
                          </p>
                        </div>
                        {feedback.isReply && (
                          <Badge variant="info" size="sm">
                            답변
                          </Badge>
                        )}
                      </div>
                      <p className="text-base text-neutral-800">{feedback.content}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 반려 사유 입력 모달 */}
      <RejectModal
        open={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={handleReject}
        isProcessing={isProcessing}
      />

      {/* 수정 요청 모달 */}
      <RejectModal
        open={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onReject={handleRequestRevision}
        isProcessing={isProcessing}
        title="수정 요청"
        placeholder="수정이 필요한 내용을 입력해주세요 (5자 이상)"
        submitText="수정 요청"
        minLength={5}
      />
    </div>
  );
}
