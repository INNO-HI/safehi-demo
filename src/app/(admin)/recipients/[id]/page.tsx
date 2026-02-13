'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecipientDetail } from '@/hooks/useRecipientDetail';
import { RecipientDetailSkeleton } from '@/components/features/recipient/RecipientDetailSkeleton';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { getGenderLabel } from '@/lib/utils/status';
import { formatDate } from '@/lib/utils/date';

// ============================================================
// 유틸리티 함수
// ============================================================

/** 돌봄 시작일로부터 몇 개월째인지 계산 */
function getMonthsSince(input: Date | string): number {
  const date = new Date(input);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
}

/** 성별에 따른 아바타 배경색 */
function getAvatarBgColor(gender: 'male' | 'female'): string {
  return gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700';
}

/** 방문 날짜 포맷 (오늘이면 "오늘", 아니면 "MM.DD") */
function formatVisitDate(input: Date | string): string {
  const date = new Date(input);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `오늘 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// ============================================================
// 월별 활동 현황 타입 및 컴포넌트
// ============================================================

/** 월별 활동 데이터 타입 */
interface MonthlyActivity {
  month: string;
  regularVisits: number;
  emergencyVisits: number;
  callConsults: number;
}

/** 월별 활동 누적 막대 차트 컴포넌트 (최근 6개월 고정) */
function MonthlyActivityChart({ data }: { data: MonthlyActivity[] }) {
  const displayData = data.slice(-6);
  const maxTotal = Math.max(
    ...displayData.map((d) => d.regularVisits + d.emergencyVisits + d.callConsults),
    1
  );
  const chartHeight = 100;

  return (
    <div className="flex flex-col">
      {/* 범례 */}
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

      {/* 차트 영역 */}
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

// Mock 데이터: 대상자의 월별 활동 현황
const mockMonthlyActivities: MonthlyActivity[] = [
  { month: '8월', regularVisits: 4, emergencyVisits: 0, callConsults: 2 },
  { month: '9월', regularVisits: 5, emergencyVisits: 1, callConsults: 3 },
  { month: '10월', regularVisits: 4, emergencyVisits: 0, callConsults: 2 },
  { month: '11월', regularVisits: 6, emergencyVisits: 1, callConsults: 4 },
  { month: '12월', regularVisits: 5, emergencyVisits: 0, callConsults: 3 },
  { month: '1월', regularVisits: 3, emergencyVisits: 1, callConsults: 2 },
];

/**
 * 대상자 상세 페이지 (데스크톱 레이아웃)
 * /recipients/[id]
 */
export default function RecipientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = useRecipientDetail(id);

  const handleBack = () => {
    router.push('/recipients');
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <RecipientDetailSkeleton />
      </div>
    );
  }

  // 에러 상태
  if (error || !data) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Alert variant="danger" className="mb-4">
          {error?.message || '대상자 정보를 불러올 수 없습니다.'}
        </Alert>
        <Button variant="secondary" onClick={handleBack} className="min-h-[44px]">
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const initials = data.name.slice(0, 2);
  const monthsSince = data.careStartDate ? getMonthsSince(data.careStartDate) : 0;

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
                aria-label="대상자 관리로 돌아가기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <p className="text-sm text-neutral-600 mb-0.5">대상자 관리</p>
                <h1 className="text-2xl font-bold text-neutral-900">대상자 상세</h1>
              </div>
            </div>
            <button
              onClick={() => window.print()}
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

      {/* 메인 콘텐츠 - 2컬럼 레이아웃 */}
      <div className="max-w-7xl mx-auto p-6">
        {/* 2컬럼 그리드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* 좌측 컬럼 */}
        <div className="flex flex-col gap-8">
          {/* 프로필 카드 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-start gap-5">
              {/* 아바타 */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 ${getAvatarBgColor(data.gender)}`}
              >
                {initials}
              </div>

              {/* 기본 정보 */}
              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <h2 className="text-2xl font-bold text-neutral-900">{data.name}</h2>
                  <p className="text-lg text-neutral-600">
                    만 {data.age}세 · {getGenderLabel(data.gender)}성
                  </p>
                </div>

                <div className="space-y-1 text-base">
                  <div className="flex items-center gap-2 text-neutral-700">
                    <span aria-hidden="true">📞</span>
                    <span>{data.basicInfo.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-neutral-700">
                    <span aria-hidden="true">📍</span>
                    <span>{data.basicInfo.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 비상연락처 */}
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-base flex-wrap">
                <span className="text-red-600 font-medium">🚨 비상연락처</span>
                <span className="text-neutral-600">
                  {data.basicInfo.emergencyContact.relationship}{' '}
                  {data.basicInfo.emergencyContact.name}
                </span>
                <span className="text-neutral-900 font-medium">
                  {data.basicInfo.emergencyContact.phone}
                </span>
              </div>
            </div>
          </div>

          {/* 건강 상태 및 특이사항 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">건강 상태 및 특이사항</h3>

            {/* 긴급 알림 (긴급 상태일 때만) */}
            {data.urgentAlert && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 text-lg" aria-hidden="true">⚠️</span>
                  <div>
                    <p className="font-semibold text-red-700">{data.urgentAlert.message}</p>
                    <p className="text-sm text-red-600 mt-1">{data.urgentAlert.detail}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">💊</span>
                <div>
                  <p className="text-sm text-neutral-500">기저질환</p>
                  <p className="text-base text-neutral-900">
                    {data.healthInfo.diseases.length > 0
                      ? data.healthInfo.diseases.join(', ')
                      : '없음'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">💊</span>
                <div>
                  <p className="text-sm text-neutral-500">복용 약물</p>
                  <p className="text-base text-neutral-900">
                    {data.healthInfo.medications.length > 0
                      ? data.healthInfo.medications.join(', ')
                      : '없음'}
                  </p>
                </div>
              </div>

              {data.healthInfo.notes && (
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-700">{data.healthInfo.notes}</p>
                </div>
              )}
            </div>

            <Link
              href={`/recipients/${id}/health`}
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              + 건강 정보 더보기
            </Link>
          </div>

          {/* AI 복지 정책 추천 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">🏠</span>
                <h3 className="text-xl font-semibold text-neutral-900">AI 복지 정책 추천</h3>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                  자동 분석
                </span>
              </div>
              <Link
                href={`/recipients/${id}/policies`}
                className="text-base text-primary hover:underline"
              >
                더보기 →
              </Link>
            </div>

            {data.policyRecommendations && data.policyRecommendations.length > 0 ? (
              <div className="space-y-2">
                {data.policyRecommendations.slice(0, 2).map((policy) => (
                  <div
                    key={policy.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      policy.badge === '적합'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        {policy.icon === 'health' && <span>🏥</span>}
                        {policy.icon === 'safety' && <span>🛡️</span>}
                        {policy.icon === 'welfare' && <span>🏠</span>}
                        {policy.icon === 'support' && <span>🤝</span>}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-base text-neutral-900">{policy.name}</p>
                        <p className="text-sm text-neutral-600">{policy.description}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded flex-shrink-0 ${
                        policy.badge === '적합'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {policy.badge}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 text-center py-2">추천 정책이 없습니다.</p>
            )}
          </div>

          {/* 월별 활동 현황 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-neutral-900">월별 활동 현황</h3>
              <span className="text-xs text-neutral-500">최근 6개월</span>
            </div>

            <MonthlyActivityChart data={mockMonthlyActivities} />
          </div>
        </div>

        {/* 우측 컬럼 */}
        <div className="flex flex-col gap-8">
          {/* 돌봄 정보 카드 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">돌봄 정보</h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-500 w-20">담당 매니저</span>
                <span className="px-2 py-0.5 bg-primary text-white text-sm font-medium rounded">
                  {data.manager.name} 매니저
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-500 w-20">소속 센터</span>
                <span className="text-base text-neutral-900">{data.manager.centerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-500 w-20">돌봄 시작일</span>
                <span className="text-base text-neutral-900">
                  {data.careStartDate ? formatDate(data.careStartDate) : '-'}{' '}
                  {monthsSince > 0 && (
                    <span className="text-neutral-500">({monthsSince}개월)</span>
                  )}
                </span>
              </div>
            </div>

            {/* KPI 그리드 */}
            {data.kpi && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-500">이번 달 방문</p>
                  <p className="text-xl font-bold text-neutral-900">{data.kpi.monthlyVisits}회</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-500">총 방문</p>
                  <p className="text-xl font-bold text-neutral-900">{data.kpi.totalVisits}회</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-500">보고서</p>
                  <p className="text-xl font-bold text-neutral-900">{data.kpi.totalReports}건</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-500">긴급 이력</p>
                  <p className="text-xl font-bold text-red-600">{data.kpi.urgentHistory}회</p>
                </div>
              </div>
            )}
          </div>

          {/* 최근 방문 기록 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-neutral-900">최근 방문 기록</h3>
              <Link
                href={`/recipients/${id}/visits`}
                className="text-base text-primary hover:underline"
              >
                전체보기 →
              </Link>
            </div>

            <div className="space-y-4">
              {data.recentVisits.length > 0 ? (
                data.recentVisits.slice(0, 3).map((visit, index) => (
                  <div key={visit.id} className="flex items-start gap-3">
                    {/* 타임라인 아이콘 */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          visit.summary.includes('긴급')
                            ? 'bg-red-100 text-red-600'
                            : visit.visitType === 'call'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {visit.visitType === 'call' ? (
                          <span aria-hidden="true">📞</span>
                        ) : (
                          <span aria-hidden="true">🏠</span>
                        )}
                      </div>
                      {index < data.recentVisits.slice(0, 3).length - 1 && (
                        <div className="w-0.5 h-8 bg-neutral-200 mt-1" />
                      )}
                    </div>

                    {/* 방문 정보 */}
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-base text-neutral-900">
                            {formatVisitDate(visit.visitDate)}
                          </p>
                          <p className="text-sm text-neutral-500">{visit.managerName} 매니저</p>
                        </div>
                        <Link href={`/care-logs/${visit.careLogId}`} className="flex-shrink-0">
                          <Button variant="secondary" size="sm">
                            보고서
                          </Button>
                        </Link>
                      </div>
                      <p
                        className={`text-sm mt-1.5 ${
                          visit.summary.includes('긴급') ? 'text-red-600' : 'text-neutral-600'
                        }`}
                      >
                        {visit.summary}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-base text-neutral-500 text-center py-2">방문 기록이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 담당자 메모 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-neutral-900">담당자 메모</h3>
              <Link href={`/recipients/${id}/memos`}>
                <Button variant="secondary" size="sm">
                  + 메모 추가
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              {data.memos && data.memos.length > 0 ? (
                data.memos.slice(0, 2).map((memo) => (
                  <div
                    key={memo.id}
                    className={`p-3 rounded-lg ${
                      memo.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-neutral-50 border border-neutral-200'
                    }`}
                  >
                    {memo.type === 'warning' && (
                      <p className="text-xs font-medium text-yellow-700 mb-1">⚠️ 주의사항</p>
                    )}
                    {memo.type === 'normal' && (
                      <p className="text-xs font-medium text-neutral-600 mb-1">📝 일반 메모</p>
                    )}
                    <p className="text-sm text-neutral-700">{memo.content}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {formatDate(memo.createdAt)} {memo.authorName}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500 text-center py-2">등록된 메모가 없습니다.</p>
              )}
            </div>

            {data.memos && data.memos.length > 2 && (
              <Link
                href={`/recipients/${id}/memos`}
                className="mt-3 inline-block text-sm text-primary hover:underline"
              >
                전체 메모 보기 →
              </Link>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
