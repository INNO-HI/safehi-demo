'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecipientDetail } from '@/hooks/useRecipientDetail';
import { VisitTimelineSkeleton } from '@/components/features/recipient/VisitTimelineSkeleton';
import { Alert } from '@/components/ui/Alert';
import type { ExtendedVisitType, VisitExtended, VisitStats } from '@/types/dashboard';

// ============================================================
// 방문 기록 전체 페이지 (피그마 디자인 기준)
// /recipients/[id]/visits
// ============================================================

// Mock 데이터 - 실제로는 API에서 조회
const mockVisitStats: VisitStats = {
  totalVisits: 64,
  monthlyVisits: 8,
  monthlyChange: 12,
  emergencyVisits: 3,
  avgDuration: 42,
};

const mockVisitsExtended: VisitExtended[] = [
  {
    id: 'visit-001',
    recipientId: 'rec-0001',
    careLogId: 'cl-001',
    visitDate: new Date(),
    visitType: 'emergency',
    managerName: '이영희',
    managerCenter: '목동종합사회복지관',
    summary: '혈압 상승 (160/100), 어지러움 증상 → 병원 진료 권유',
    duration: 45,
    startTime: '10:30',
    endTime: '11:15',
  },
  {
    id: 'visit-002',
    recipientId: 'rec-0001',
    careLogId: 'cl-002',
    visitDate: new Date(Date.now() - 86400000 * 13), // 01.01
    visitType: 'regular',
    managerName: '이영희',
    managerCenter: '목동종합사회복지관',
    summary: '새해 첫 방문, 건강 상태 양호, 약 복용 확인',
    duration: 45,
    startTime: '11:00',
    endTime: '11:45',
  },
  {
    id: 'visit-003',
    recipientId: 'rec-0001',
    careLogId: 'cl-003',
    visitDate: new Date(Date.now() - 86400000 * 17), // 12.28
    visitType: 'regular',
    managerName: '이영희',
    managerCenter: '목동종합사회복지관',
    summary: '연말 건강 체크, 혈압 정상, 가족 방문 예정 확인',
    duration: 40,
    startTime: '10:30',
    endTime: '11:10',
  },
  {
    id: 'visit-004',
    recipientId: 'rec-0001',
    careLogId: 'cl-004',
    visitDate: new Date(Date.now() - 86400000 * 24), // 12.21
    visitType: 'regular',
    managerName: '이영희',
    managerCenter: '목동종합사회복지관',
    summary: '정기 방문, 난방 상태 점검, 생활 환경 양호',
    duration: 45,
    startTime: '09:45',
    endTime: '10:30',
  },
];

// 방문 유형 라벨
const visitTypeLabels: Record<ExtendedVisitType, string> = {
  regular: '정기 방문',
  emergency: '긴급 방문',
  call: '전화 상담',
};

// 날짜를 그룹화 라벨로 변환
function getDateGroupLabel(date: Date): string {
  const today = new Date();
  const visitDate = new Date(date);

  // 오늘인지 확인
  if (
    visitDate.getFullYear() === today.getFullYear() &&
    visitDate.getMonth() === today.getMonth() &&
    visitDate.getDate() === today.getDate()
  ) {
    return '오늘';
  }

  // MM.DD 형식
  return `${String(visitDate.getMonth() + 1).padStart(2, '0')}.${String(visitDate.getDate()).padStart(2, '0')}`;
}

// 방문을 날짜별로 그룹화
function groupVisitsByDate(visits: VisitExtended[]): Map<string, VisitExtended[]> {
  const grouped = new Map<string, VisitExtended[]>();

  visits.forEach((visit) => {
    const label = getDateGroupLabel(visit.visitDate);
    const existing = grouped.get(label) || [];
    grouped.set(label, [...existing, visit]);
  });

  return grouped;
}

export default function VisitsPage() {
  const params = useParams();
  const router = useRouter();
  const recipientId = params.id as string;

  // 필터 상태
  const [dateRange] = useState<{ start: string; end: string }>({
    start: '2024.05',
    end: '2025.01',
  });
  const [selectedManager, setSelectedManager] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<ExtendedVisitType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 대상자 정보 조회
  const { data: recipient, isLoading, error } = useRecipientDetail(recipientId);

  // 뒤로가기
  const handleBack = () => {
    router.push(`/recipients/${recipientId}`);
  };

  // 내보내기
  const handleExport = () => {
    // TODO: 내보내기 기능 구현
    alert('내보내기 기능은 준비 중입니다.');
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="px-8 pb-8 pt-4">
        <VisitTimelineSkeleton />
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

  const groupedVisits = groupVisitsByDate(mockVisitsExtended);
  const totalItems = mockVisitStats.totalVisits;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
      {/* 헤더 */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 mx-3 lg:mx-6 mt-4 px-4 lg:px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                <h1 className="text-2xl font-bold text-neutral-900">방문 기록 전체</h1>
              </div>
            </div>

            {/* 대상자 태그 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#EBF2FF] rounded-full">
                <span className="text-sm font-medium text-[#448CFF]">
                  {recipient.basicInfo.dong}
                </span>
                <span className="text-sm font-medium text-[#C45A5A]">
                  {recipient.name}
                </span>
              </div>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                내보내기
              </button>
            </div>
          </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-3 lg:px-8 pb-8 pt-4 space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">총 방문 횟수</p>
            <p className="text-3xl font-bold text-neutral-900">{mockVisitStats.totalVisits}회</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">이번 달 방문</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-neutral-900">{mockVisitStats.monthlyVisits}회</p>
              {mockVisitStats.monthlyChange > 0 && (
                <span className="text-sm text-green-600">(+{mockVisitStats.monthlyChange}%)</span>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">긴급 방문</p>
            <p className="text-3xl font-bold text-[#C45A5A]">{mockVisitStats.emergencyVisits}회</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">평균 방문 시간</p>
            <p className="text-3xl font-bold text-neutral-900">{mockVisitStats.avgDuration}분</p>
          </div>
        </div>

        {/* 필터 영역 */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* 기간 선택 */}
            <div className="flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-lg">
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-neutral-700">{dateRange.start} - {dateRange.end}</span>
            </div>

            {/* 매니저 선택 */}
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 min-h-[44px]"
            >
              <option value="all">매니저: 전체</option>
              <option value="이영희">이영희 매니저</option>
              <option value="김민수">김민수 매니저</option>
            </select>

            {/* 유형 선택 */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ExtendedVisitType | 'all')}
              className="px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 min-h-[44px]"
            >
              <option value="all">유형: 전체</option>
              <option value="regular">정기 방문</option>
              <option value="emergency">긴급 방문</option>
              <option value="call">전화 상담</option>
            </select>

            <button className="ml-auto px-6 py-2 bg-[#448CFF] text-white font-medium rounded-lg hover:bg-[#2B6AD9] transition-colors min-h-[44px]">
              검색
            </button>
          </div>
        </div>

        {/* 타임라인 리스트 */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30">
          {Array.from(groupedVisits.entries()).map(([dateLabel, visits]) => (
            <div key={dateLabel}>
              {/* 날짜 헤더 */}
              <div className="px-6 py-3">
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                  dateLabel === '오늘'
                    ? 'bg-[#448CFF] text-white'
                    : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {dateLabel}
                </span>
              </div>

              {/* 방문 카드들 */}
              {visits.map((visit, index) => (
                <div
                  key={visit.id}
                  className={`px-6 py-4 flex items-start gap-4 ${
                    visit.visitType === 'emergency'
                      ? 'bg-red-50 border-l-4 border-l-[#C45A5A]'
                      : 'hover:bg-neutral-50'
                  } ${index < visits.length - 1 ? 'border-b border-neutral-100' : ''}`}
                >
                  {/* 아이콘 */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    visit.visitType === 'emergency'
                      ? 'bg-[#C45A5A] text-white'
                      : visit.visitType === 'call'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-[#448CFF] text-white'
                  }`}>
                    {visit.visitType === 'emergency' ? (
                      <span className="text-lg font-bold">!</span>
                    ) : visit.visitType === 'call' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    )}
                  </div>

                  {/* 콘텐츠 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-neutral-900">
                        {visitTypeLabels[visit.visitType]}
                      </span>
                      {visit.visitType === 'emergency' && (
                        <span className="px-2 py-0.5 bg-[#C45A5A] text-white text-xs font-medium rounded">
                          긴급
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-neutral-500 mb-2">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {visit.startTime} - {visit.endTime} ({visit.duration}분)
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {visit.managerName} 매니저
                      </span>
                    </div>

                    <p className={`text-sm ${
                      visit.visitType === 'emergency' ? 'text-[#C45A5A]' : 'text-neutral-600'
                    }`}>
                      {visit.summary}
                    </p>
                  </div>

                  {/* 보고서 버튼 */}
                  <Link
                    href={`/care-logs/${visit.careLogId}`}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors min-h-[44px]"
                  >
                    보고서
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">페이지당</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 border border-neutral-200 rounded text-sm"
            >
              <option value={10}>10건</option>
              <option value={20}>20건</option>
              <option value={50}>50건</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">
              {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} / {totalItems}건
            </span>

            <div className="flex items-center gap-1 ml-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center border border-neutral-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'bg-[#448CFF] text-white'
                      : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              {totalPages > 4 && (
                <>
                  <span className="text-neutral-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-9 h-9 flex items-center justify-center border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center border border-neutral-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
