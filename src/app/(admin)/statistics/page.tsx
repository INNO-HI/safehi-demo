'use client';

import { useStatistics } from '@/hooks/useStatistics';
import { useReportGenerator } from '@/hooks/useReportGenerator';
import {
  StatisticsHeader,
  KPICardGrid,
  VisitTrendChart,
  ReportStatusChart,
  DistrictVisitChart,
  RecipientStatusCards,
  QuickReportCards,
} from '@/components/features/statistics';

/**
 * 통계/리포트 페이지
 * 중간관리자용: 위험/문제 → 업무 처리 → 매니저 성과 → 지역 운영 → 통계
 */
export default function StatisticsPage() {
  const {
    data,
    isLoading,
    error,
    selectedMonth,
    setSelectedMonth,
    trendPeriod,
    setTrendPeriod,
    refetch,
    visitTrendData,
    isVisitTrendLoading,
  } = useStatistics();

  const { generateReport } = useReportGenerator(selectedMonth, data);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-neutral-bg rounded" />
            <div className="h-11 w-40 bg-neutral-bg rounded-lg" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-neutral-bg rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-80 bg-neutral-bg rounded-lg" />
            <div className="h-80 bg-neutral-bg rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-neutral-bg rounded-lg" />
            <div className="h-64 bg-neutral-bg rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-status-error/10 border border-status-error rounded-lg p-8 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-status-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-status-error">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-h3 text-neutral-text mb-2">데이터를 불러올 수 없습니다</h2>
          <p className="text-body text-neutral-text-sub mb-6">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-status-error text-white rounded-lg hover:bg-status-error/90 transition-colors min-h-[44px] font-medium"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!data) {
    return (
      <div className="p-6">
        <div className="bg-neutral-bg border border-neutral-border rounded-lg p-8 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-neutral-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-text-sub">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <h2 className="text-h3 text-neutral-text mb-2">데이터가 없습니다</h2>
          <p className="text-body text-neutral-text-sub">
            선택한 기간에 대한 통계 데이터가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* 헤더 */}
      <StatisticsHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      {/* PDF 캡처 영역 */}
      <div id="statistics-content" className="space-y-8">
        {/* 1. KPI 카드 + 빠른 리포트 생성 */}
        <section className="grid grid-cols-2 gap-6">
          <KPICardGrid
            className="bg-status-success-light rounded-2xl p-6"
            recipientStatus={data.recipientStatus}
            reportStatus={data.reportStatus}
          />
          <QuickReportCards
            className="bg-status-success-light rounded-2xl p-6"
            onGenerateReport={generateReport}
          />
        </section>

        {/* 3. 보고서 현황 + 대상자 상태 분포 */}
        <section className="grid grid-cols-5 gap-6">
          <ReportStatusChart className="col-span-2" data={data.reportStatus} />
          <RecipientStatusCards className="col-span-3" data={data.recipientStatus} />
        </section>

        {/* 4. 동별 방문(좁게) + 월별 추이(넓게) */}
        <section className="grid grid-cols-5 gap-6">
          <DistrictVisitChart className="col-span-2" data={data.districtVisits} displayLimit={7} />
          <VisitTrendChart
            className="col-span-3"
            data={visitTrendData}
            period={trendPeriod}
            onPeriodChange={setTrendPeriod}
            isLoading={isVisitTrendLoading}
          />
        </section>
      </div>
    </div>
  );
}
