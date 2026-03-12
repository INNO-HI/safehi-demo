'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecipientDetail } from '@/hooks/useRecipientDetail';
import { MemoSkeleton } from '@/components/features/recipient/MemoSkeleton';
import { Alert } from '@/components/ui/Alert';
import type { MemoType, MemoExtendedFull, MemoStats } from '@/types/dashboard';

// ============================================================
// 담당자 메모 페이지 (피그마 디자인 기준)
// /recipients/[id]/memos
// ============================================================

// Mock 데이터
const mockMemoStats: MemoStats = {
  totalMemos: 8,
  warningMemos: 2,
  normalMemos: 6,
  authorCount: 3,
};

const mockMemosExtended: MemoExtendedFull[] = [
  {
    id: 'memo-001',
    recipientId: 'rec-0001',
    authorId: 'manager-001',
    authorName: '김담당',
    authorCenter: '양천구청',
    title: '혼자 외출 시 낙상 위험 있음. 보행 보조 필요.',
    content: '어르신이 혼자 외출 시 균형을 잃는 경우가 종종 있으므로 외출 시에는 반드시 보행 보조기구 사용을 권장합니다. 가능하면 보호자나 매니저 동행이 필요합니다.',
    type: 'warning',
    createdAt: new Date('2024-12-15'),
  },
  {
    id: 'memo-002',
    recipientId: 'rec-0001',
    authorId: 'manager-002',
    authorName: '이영희',
    authorCenter: '목동종합사회복지관',
    title: '약 복용 시간 꼭 확인 필요',
    content: '아침, 저녁 식후 30분 약 복용 여부 반드시 확인. 가끔 잊어버리시는 경우가 있음.',
    type: 'warning',
    createdAt: new Date('2024-10-20'),
  },
  {
    id: 'memo-003',
    recipientId: 'rec-0001',
    authorId: 'manager-001',
    authorName: '김담당',
    authorCenter: '양천구청',
    title: '아들 이민호씨 연락 정보',
    content: '아들 이민호씨가 주 1회 방문 중. 주말 연락 가능. 급한 일이 있으면 직접 연락 가능.',
    type: 'normal',
    createdAt: new Date('2024-11-20'),
  },
  {
    id: 'memo-004',
    recipientId: 'rec-0001',
    authorId: 'manager-002',
    authorName: '이영희',
    authorCenter: '목동종합사회복지관',
    title: '어르신 취향 및 선호사항',
    content: '라디오 청취를 좋아하심 (KBS 1라디오). 달달한 음식보다 담백한 음식 선호. 오전 시간대 방문 선호.',
    type: 'normal',
    createdAt: new Date('2024-09-15'),
  },
  {
    id: 'memo-005',
    recipientId: 'rec-0001',
    authorId: 'manager-003',
    authorName: '박철수',
    authorCenter: '목동종합사회복지관',
    title: '주거 환경 점검 결과',
    content: '현관문 잠금장치 정상, 가스 밸브 정상. 거실 조명 교체 필요 (다음 방문 시 조치 예정).',
    type: 'normal',
    createdAt: new Date('2024-08-10'),
  },
];

// 메모 유형 라벨
const memoTypeLabels: Record<MemoType, string> = {
  warning: '주의사항',
  normal: '일반 메모',
};

// 날짜 포맷
function formatMemoDate(date: Date): string {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default function MemosPage() {
  const params = useParams();
  const router = useRouter();
  const recipientId = params.id as string;

  // 필터 상태
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<MemoType | 'all'>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<MemoType | 'all'>('all');
  const [displayCount, setDisplayCount] = useState(5);

  // 대상자 정보 조회
  const { data: recipient, isLoading, error } = useRecipientDetail(recipientId);

  // 뒤로가기
  const handleBack = () => {
    router.push(`/recipients/${recipientId}`);
  };

  // 더보기
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

  // 필터링된 메모
  const filteredMemos = mockMemosExtended.filter((memo) => {
    if (activeTab !== 'all' && memo.type !== activeTab) return false;
    if (selectedType !== 'all' && memo.type !== selectedType) return false;
    if (selectedAuthor !== 'all' && memo.authorName !== selectedAuthor) return false;
    if (search && !memo.title.includes(search) && !memo.content.includes(search)) return false;
    return true;
  });

  const displayedMemos = filteredMemos.slice(0, displayCount);
  const remainingCount = filteredMemos.length - displayCount;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="px-8 pb-8 pt-4">
        <MemoSkeleton />
      </div>
    );
  }

  // 에러 상태
  if (error || !recipient) {
    return (
      <div className="px-8 pb-8 pt-4">
        <Alert variant="danger" className="mb-4">
          {error?.message || '대상자 정보를 불러올 수 없습니다.'}
        </Alert>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors min-h-[44px]"
        >
          대상자 정보로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 헤더 */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 mx-6 mt-4 px-6 py-5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-11 h-11 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                aria-label="대상자 관리로 돌아가기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <p className="text-sm text-neutral-500 mb-0.5">
                  대상자 관리 &gt; {recipient.name}
                </p>
                <h1 className="text-2xl font-bold text-neutral-900">담당자 메모</h1>
              </div>
            </div>

            {/* 대상자 태그 + 메모 추가 버튼 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#EBF2FF] rounded-full">
                <span className="text-sm font-medium text-[#448CFF]">
                  {recipient.basicInfo.dong}
                </span>
                <span className="text-sm font-medium text-[#C45A5A]">
                  {recipient.name}
                </span>
              </div>

              <Link
                href={`/recipients/${recipientId}/memos/new`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#448CFF] rounded-lg hover:bg-[#2B6AD9] transition-colors min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                메모 추가
              </Link>
            </div>
          </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-8 pb-8 pt-4 space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">전체 메모</p>
            <p className="text-3xl font-bold text-neutral-900">{mockMemoStats.totalMemos}개</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">주의사항</p>
            <p className="text-3xl font-bold text-[#C4940A]">{mockMemoStats.warningMemos}개</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">일반 메모</p>
            <p className="text-3xl font-bold text-neutral-900">{mockMemoStats.normalMemos}개</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">작성자</p>
            <p className="text-3xl font-bold text-neutral-900">{mockMemoStats.authorCount}명</p>
          </div>
        </div>

        {/* 필터 영역 */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-4">
          <div className="flex items-center gap-4">
            {/* 검색창 */}
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="메모 내용 검색..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm min-h-[44px]"
              />
            </div>

            {/* 유형 선택 */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as MemoType | 'all')}
              className="px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 min-h-[44px]"
            >
              <option value="all">유형: 전체</option>
              <option value="warning">주의사항</option>
              <option value="normal">일반 메모</option>
            </select>

            {/* 작성자 선택 */}
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 min-h-[44px]"
            >
              <option value="all">작성자: 전체</option>
              <option value="김담당">김담당</option>
              <option value="이영희">이영희</option>
              <option value="박철수">박철수</option>
            </select>

            <button className="px-6 py-2 bg-[#448CFF] text-white font-medium rounded-lg hover:bg-[#2B6AD9] transition-colors min-h-[44px]">
              검색
            </button>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
              activeTab === 'all'
                ? 'bg-[#448CFF] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            전체 <span className={activeTab === 'all' ? 'bg-white/20 px-1.5 py-0.5 rounded ml-1' : 'text-neutral-400 ml-1'}>{mockMemoStats.totalMemos}</span>
          </button>
          <button
            onClick={() => setActiveTab('warning')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
              activeTab === 'warning'
                ? 'bg-[#C4940A] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            주의사항 <span className={activeTab === 'warning' ? 'ml-1' : 'text-[#C4940A] ml-1'}>{mockMemoStats.warningMemos}</span>
          </button>
          <button
            onClick={() => setActiveTab('normal')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
              activeTab === 'normal'
                ? 'bg-[#448CFF] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            일반 메모 <span className="ml-1">{mockMemoStats.normalMemos}</span>
          </button>
        </div>

        {/* 메모 카드 리스트 */}
        <div className="space-y-4">
          {displayedMemos.map((memo) => (
            <div
              key={memo.id}
              className={`bg-white rounded-xl border p-5 ${
                memo.type === 'warning'
                  ? 'border-[#C4940A]/30 bg-[#FFF8E6]'
                  : 'border-neutral-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* 아이콘 */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  memo.type === 'warning'
                    ? 'bg-[#C4940A]/20'
                    : 'bg-green-100'
                }`}>
                  {memo.type === 'warning' ? (
                    <svg className="w-6 h-6 text-[#C4940A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>

                {/* 콘텐츠 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      memo.type === 'warning'
                        ? 'bg-[#C4940A] text-white'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      {memoTypeLabels[memo.type]}
                    </span>
                    <span className="font-semibold text-neutral-900">{memo.title}</span>
                  </div>

                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {memo.content}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatMemoDate(memo.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {memo.authorName} ({memo.authorCenter})
                    </span>
                  </div>
                </div>

                {/* 수정 버튼 */}
                <button className="flex items-center gap-1 px-3 py-2 text-sm text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors min-h-[44px]">
                  수정
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        {remainingCount > 0 && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="text-[#448CFF] text-sm font-medium hover:underline"
            >
              + {remainingCount}개 메모 더 불러오기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
