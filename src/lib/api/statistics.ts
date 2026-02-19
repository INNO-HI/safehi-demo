/**
 * 통계/리포트 관련 Mock API 함수
 * 실제 백엔드 연동 전까지 사용
 */

import type {
  StatisticsKPI,
  MonthlyVisitTrend,
  ReportStatusDistribution,
  DistrictVisit,
  ManagerRanking,
  RecipientStatusDistribution,
  StatisticsOverview,
  StatisticsResponse,
  TrendPeriod,
} from '@/types/statistics';

import {
  getMockStatisticsOverview,
  getMockVisitTrend,
  getMockDistrictVisits,
  getMockManagerRanking,
  mockKPIData,
  mockReportStatusData,
  mockRecipientStatusData,
} from '@/lib/mock-data/statistics';

// 응답 지연 시뮬레이션 (네트워크 지연 모방)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 랜덤 지연 (300-800ms)
const randomDelay = () => delay(300 + Math.random() * 500);

/**
 * 전체 통계 데이터 조회 API
 * @param month 선택된 월 (YYYY-MM 형식)
 */
export async function fetchStatisticsOverview(
  month: string
): Promise<StatisticsResponse> {
  await randomDelay();

  try {
    const data = getMockStatisticsOverview(month);

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: '통계 데이터를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

/**
 * KPI 데이터 조회 API
 * @param month 선택된 월 (YYYY-MM 형식)
 */
export async function fetchKPI(
  month: string
): Promise<{ success: boolean; data?: StatisticsKPI; error?: string }> {
  await randomDelay();

  try {
    const data = mockKPIData[month];

    if (!data) {
      return {
        success: true,
        data: {
          totalRecipients: 0,
          monthlyVisits: 0,
          processedReports: 0,
          emergencyCases: 0,
          activeManagers: 0,
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: 'KPI 데이터를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 월별 방문 추이 데이터 조회 API
 * @param period 기간 (6개월 또는 12개월)
 */
export async function fetchVisitTrend(
  period: TrendPeriod
): Promise<{ success: boolean; data?: MonthlyVisitTrend[]; error?: string }> {
  await randomDelay();

  try {
    const data = getMockVisitTrend(period);

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: '방문 추이 데이터를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 보고서 처리 현황 데이터 조회 API
 * @param month 선택된 월 (YYYY-MM 형식)
 */
export async function fetchReportStatus(
  month: string
): Promise<{ success: boolean; data?: ReportStatusDistribution; error?: string }> {
  await randomDelay();

  try {
    const data = mockReportStatusData[month];

    if (!data) {
      return {
        success: true,
        data: {
          approved: 0,
          pending: 0,
          urgent: 0,
          rejected: 0,
          total: 0,
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: '보고서 현황 데이터를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 동별 방문 현황 데이터 조회 API
 * @param limit 상위 N개만 조회 (옵션)
 */
export async function fetchDistrictVisits(
  limit?: number
): Promise<{ success: boolean; data?: DistrictVisit[]; error?: string }> {
  await randomDelay();

  try {
    const data = getMockDistrictVisits(limit);

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: '동별 방문 데이터를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 매니저 활동 순위 데이터 조회 API
 * @param limit 상위 N명만 조회 (옵션)
 */
export async function fetchManagerRanking(
  limit?: number
): Promise<{ success: boolean; data?: ManagerRanking[]; error?: string }> {
  await randomDelay();

  try {
    const data = getMockManagerRanking(limit);

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: '매니저 순위 데이터를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 대상자 상태 분포 데이터 조회 API
 * @param month 선택된 월 (YYYY-MM 형식)
 */
export async function fetchRecipientStatus(
  month: string
): Promise<{ success: boolean; data?: RecipientStatusDistribution; error?: string }> {
  await randomDelay();

  try {
    const data = mockRecipientStatusData[month];

    if (!data) {
      return {
        success: true,
        data: {
          normal: 0,
          caution: 0,
          urgent: 0,
          unvisited: 0,
          total: 0,
          trends: {
            normalChange: 0,
            cautionChange: 0,
            urgentChange: 0,
            unvisitedChange: 0,
          },
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: '대상자 상태 데이터를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 전체 통계 데이터 새로고침 API
 * (모든 섹션 데이터를 병렬로 조회)
 * @param month 선택된 월 (YYYY-MM 형식)
 * @param trendPeriod 방문 추이 기간 (6개월 또는 12개월)
 */
export async function refreshAllStatistics(
  month: string,
  trendPeriod: TrendPeriod = 6
): Promise<StatisticsResponse> {
  try {
    // 모든 API를 병렬로 호출
    const [
      kpiResult,
      visitTrendResult,
      reportStatusResult,
      districtVisitsResult,
      managerRankingResult,
      recipientStatusResult,
    ] = await Promise.all([
      fetchKPI(month),
      fetchVisitTrend(trendPeriod),
      fetchReportStatus(month),
      fetchDistrictVisits(),
      fetchManagerRanking(),
      fetchRecipientStatus(month),
    ]);

    // 모든 결과 확인
    if (
      !kpiResult.success ||
      !visitTrendResult.success ||
      !reportStatusResult.success ||
      !districtVisitsResult.success ||
      !managerRankingResult.success ||
      !recipientStatusResult.success
    ) {
      return {
        success: false,
        error: '일부 데이터를 불러오는 중 오류가 발생했습니다.',
      };
    }

    const overview: StatisticsOverview = {
      kpi: kpiResult.data!,
      visitTrend: visitTrendResult.data!,
      reportStatus: reportStatusResult.data!,
      districtVisits: districtVisitsResult.data!,
      managerRanking: managerRankingResult.data!,
      recipientStatus: recipientStatusResult.data!,
    };

    return {
      success: true,
      data: overview,
    };
  } catch {
    return {
      success: false,
      error: '통계 데이터를 새로고침하는 중 오류가 발생했습니다.',
    };
  }
}
