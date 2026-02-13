'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useManagerDetail } from '@/hooks/useManagerDetail';
import { ManagerDetailSkeleton } from '@/components/features/dashboard/ManagerDetailSkeleton';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import {
  managerStatusToBadgeVariant,
  getManagerStatusLabel,
  reportStatusToBadgeVariant,
  getReportStatusLabel,
} from '@/lib/utils/status';
import { formatDate } from '@/lib/utils/date';
import type { ManagerMonthlyActivity } from '@/types/dashboard';

// ============================================================
// 매니저 상세 페이지 (피그마 디자인 기준)
// ============================================================

/** 성별에 따른 아바타 배경색 */
function getAvatarBgColor(gender: 'male' | 'female'): string {
  return gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700';
}

/** 입사일로부터 몇 개월째인지 계산 */
function getMonthsSince(date: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
}

/** 월별 활동 누적 막대 차트 컴포넌트 (최근 6개월 고정) */
function MonthlyActivityChart({ data }: { data: ManagerMonthlyActivity[] }) {
  // 최근 6개월 데이터만 표시
  const displayData = data.slice(-6);
  const maxTotal = Math.max(
    ...displayData.map((d) => d.regularVisits + d.emergencyVisits + d.callConsults),
    1
  );
  const chartHeight = 100; // 막대 최대 높이 (px)

  return (
    <div className="flex flex-col">
      {/* 범례 (순서: 정기 방문 → 전화 상담 → 긴급 방문) */}
      <div className="flex items-center gap-3 text-xs mb-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-[#2E6AB3]" />
          <span className="text-neutral-500">정기 방문</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-neutral-400" />
          <span className="text-neutral-500">전화 상담</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-[#C45A5A]" />
          <span className="text-neutral-500">긴급 방문</span>
        </div>
      </div>

      {/* 차트 영역 - 막대들이 아래에서 위로 자라도록 */}
      <div className="flex items-end gap-2">
        {displayData.map((item) => {
          const total = item.regularVisits + item.emergencyVisits + item.callConsults;
          const barHeight = Math.max((total / maxTotal) * chartHeight, 6);
          const regularHeight = total > 0 ? (item.regularVisits / total) * barHeight : 0;
          const callHeight = total > 0 ? (item.callConsults / total) * barHeight : 0;
          const emergencyHeight = total > 0 ? (item.emergencyVisits / total) * barHeight : 0;

          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center group relative"
            >
              {/* 총합 수치 */}
              <span className="text-[11px] font-medium text-neutral-600 mb-0.5">{total}</span>

              {/* 막대 그래프 */}
              <div
                className="w-full max-w-[32px] flex flex-col rounded-t overflow-hidden cursor-pointer"
                style={{ height: `${barHeight}px` }}
              >
                {/* 긴급 방문 (맨 위 - 빨강) */}
                <div className="w-full bg-[#C45A5A]" style={{ height: `${emergencyHeight}px` }} />
                {/* 전화 상담 (중간 - 회색) */}
                <div className="w-full bg-neutral-400" style={{ height: `${callHeight}px` }} />
                {/* 정기 방문 (맨 아래 - Primary 파랑) */}
                <div className="w-full bg-[#2E6AB3]" style={{ height: `${regularHeight}px` }} />
              </div>

              {/* 월 라벨 */}
              <span className="text-[11px] text-neutral-500 mt-1">{item.month}</span>

              {/* 툴팁 */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1.5 bg-neutral-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <div className="font-medium mb-0.5">{item.month}</div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#2E6AB3]" />
                  정기 {item.regularVisits}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-sm bg-neutral-400" />
                  전화 {item.callConsults}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#C45A5A]" />
                  긴급 {item.emergencyVisits}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ManagerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = useManagerDetail(id);

  const handleBack = () => {
    router.push('/managers');
  };

  const handleExportPDF = () => {
    window.print();
  };

  // 로딩 상태
  if (isLoading) {
    return <ManagerDetailSkeleton />;
  }

  // 에러 상태
  if (error || !data) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Alert variant="danger" className="mb-4">
          {error?.message || '매니저 정보를 불러올 수 없습니다.'}
        </Alert>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors min-h-[44px]"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const initials = data.name.slice(0, 2);
  const monthsSince = data.startDate ? getMonthsSince(data.startDate) : 0;
  const displayedRecipients = data.assignedRecipients.slice(0, 5);
  const remainingRecipientsCount = data.assignedRecipients.length - 5;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-neutral-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-11 h-11 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                aria-label="매니저 관리로 돌아가기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <p className="text-sm text-neutral-600 mb-0.5">매니저 관리</p>
                <h1 className="text-2xl font-bold text-neutral-900">매니저 상세</h1>
              </div>
            </div>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2E6AB3] bg-white border border-[#2E6AB3] rounded-lg hover:bg-[#2E6AB3]/5 transition-colors min-h-[44px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF 내보내기
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* 상단 섹션: 프로필 + 통계 카드 + 보고서 현황 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* 프로필 카드 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col">
            <div className="flex items-start gap-4 flex-1">
              {/* 아바타 */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 ${getAvatarBgColor(data.gender)}`}
              >
                {initials}
              </div>

              {/* 기본 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-neutral-900">{data.name}</h2>
                  <Badge variant={managerStatusToBadgeVariant(data.status)} size="sm">
                    {getManagerStatusLabel(data.status)}
                  </Badge>
                </div>
                <p className="text-base text-neutral-600 mb-3">{data.centerName}</p>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span aria-hidden="true">📞</span>
                    <span>{data.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span aria-hidden="true">✉️</span>
                    <span>{data.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span aria-hidden="true">📍</span>
                    <span>{data.assignedDongs.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 입사일 */}
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <span>입사일</span>
                <span className="font-medium text-neutral-900">{formatDate(data.startDate)}</span>
                {monthsSince > 0 && (
                  <span className="text-neutral-500">({monthsSince}개월)</span>
                )}
              </div>
            </div>
          </div>

          {/* 통계 카드 + 보고서 현황 */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* 상단 통계 카드 3개 */}
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">담당 대상자</p>
                  <p className="text-2xl font-bold text-neutral-900">{data.stats.totalRecipients}명</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">이번 달 방문</p>
                  <p className="text-2xl font-bold text-neutral-900">{data.stats.monthlyVisits}회</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">총 방문 기록</p>
                  <p className="text-2xl font-bold text-neutral-900">{data.totalVisits}회</p>
                </div>
              </div>
            </div>

            {/* 보고서 현황 카드 3개 */}
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div className="bg-[#E8F0F8] rounded-xl border border-[#2E6AB3]/20 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2E6AB3]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#2E6AB3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#2E6AB3]">승인 보고서</p>
                  <p className="text-2xl font-bold text-[#2E6AB3]">{data.reportCounts.approved}건</p>
                </div>
              </div>
              <div className="bg-[#FFF8E6] rounded-xl border border-[#C4940A]/20 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C4940A]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#C4940A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#C4940A]">대기 보고서</p>
                  <p className="text-2xl font-bold text-[#C4940A]">{data.reportCounts.pending}건</p>
                </div>
              </div>
              <div className="bg-[#FCEAEA] rounded-xl border border-[#C45A5A]/20 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C45A5A]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#C45A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#C45A5A]">반려 보고서</p>
                  <p className="text-2xl font-bold text-[#C45A5A]">{data.reportCounts.rejected}건</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 중단 섹션: 담당 대상자 + 최근 보고서 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 담당 대상자 박스 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-neutral-900">담당 대상자</h3>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm font-medium rounded">
                  총 {data.assignedRecipients.length}명
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {displayedRecipients.map((recipient) => (
                <Link
                  key={recipient.id}
                  href={`/recipients/${recipient.id}`}
                  className="flex items-center gap-3 p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {/* 아바타 */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${getAvatarBgColor(recipient.gender)}`}
                  >
                    {recipient.name.charAt(0)}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900 truncate">{recipient.name}</span>
                      {recipient.isUrgent && (
                        <Badge variant="danger" size="sm">긴급</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <span>{recipient.dong}</span>
                      <span>·</span>
                      <span>담당 {Math.floor((new Date().getTime() - recipient.careStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30))}개월</span>
                    </div>
                  </div>

                  {/* 최근 방문일 */}
                  <div className="text-right text-sm flex-shrink-0">
                    <p className="text-neutral-500">최근 방문</p>
                    <p className="text-neutral-900 font-medium">
                      {recipient.lastVisitDate ? formatDate(recipient.lastVisitDate) : '-'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {remainingRecipientsCount > 0 && (
              <Link
                href={`/managers/${id}/recipients`}
                className="mt-4 block text-center text-sm text-primary hover:underline font-medium"
              >
                + {remainingRecipientsCount}명 더보기
              </Link>
            )}
          </div>

          {/* 최근 보고서 박스 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">최근 보고서</h3>
              <Link
                href={`/managers/${id}/reports`}
                className="text-sm text-primary hover:underline"
              >
                전체보기 →
              </Link>
            </div>

            <div className="space-y-2">
              {data.recentReports.length > 0 ? (
                data.recentReports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/care-logs/${report.id}`}
                    className="flex items-center gap-3 p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    {/* 아이콘 */}
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg" aria-hidden="true">📋</span>
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">
                        {report.recipientName}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {formatDate(report.visitDate)} 방문
                      </p>
                    </div>

                    {/* 상태 뱃지 */}
                    <Badge
                      variant={reportStatusToBadgeVariant(report.status)}
                      size="sm"
                    >
                      {getReportStatusLabel(report.status)}
                    </Badge>
                  </Link>
                ))
              ) : (
                <p className="text-base text-neutral-500 text-center py-4">
                  작성된 보고서가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 하단 섹션: 월별 활동 현황 + 최근 돌봄 기록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 월별 활동 현황 차트 (최근 6개월 고정) */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-neutral-900">월별 활동 현황</h3>
              <span className="text-xs text-neutral-500">최근 6개월</span>
            </div>

            <MonthlyActivityChart data={data.monthlyActivities} />
          </div>

          {/* 최근 돌봄 기록 타임라인 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">최근 돌봄 기록</h3>
              <Link
                href={`/managers/${id}/visits`}
                className="text-sm text-primary hover:underline"
              >
                전체보기 →
              </Link>
            </div>

            <div className="space-y-4">
              {data.recentVisits.length > 0 ? (
                data.recentVisits.map((visit, index) => (
                  <div key={visit.id} className="flex items-start gap-3">
                    {/* 타임라인 아이콘 */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          visit.visitType === 'emergency'
                            ? 'bg-red-100 text-red-600'
                            : visit.visitType === 'call'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {visit.visitType === 'emergency' ? (
                          <span aria-hidden="true">🚨</span>
                        ) : visit.visitType === 'call' ? (
                          <span aria-hidden="true">📞</span>
                        ) : (
                          <span aria-hidden="true">🏠</span>
                        )}
                      </div>
                      {index < data.recentVisits.length - 1 && (
                        <div className="w-0.5 h-6 bg-neutral-200 mt-1" />
                      )}
                    </div>

                    {/* 돌봄 정보 */}
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-neutral-900">
                          {visit.recipientName}
                        </p>
                        <p className="text-sm text-neutral-500 flex-shrink-0">
                          {formatDate(visit.visitDate)}
                        </p>
                      </div>
                      <p className={`text-sm mt-1 ${
                        visit.visitType === 'emergency' ? 'text-red-600' : 'text-neutral-600'
                      }`}>
                        {visit.result}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-base text-neutral-500 text-center py-4">
                  돌봄 기록이 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
