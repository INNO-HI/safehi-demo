'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRecipientDetail } from '@/hooks/useRecipientDetail';
import { PolicySkeleton } from '@/components/features/recipient/PolicySkeleton';
import { Alert } from '@/components/ui/Alert';
import type { PolicyExtended, AIAnalysisResult, PolicyIconType } from '@/types/dashboard';

// ============================================================
// AI 복지 정책 추천 페이지 (피그마 디자인 기준)
// /recipients/[id]/policies
// ============================================================

// Mock 데이터 - AI 분석 결과
const mockAnalysisResult: AIAnalysisResult = {
  condition: {
    age: 82,
    gender: 'male',
    livingStatus: '독거',
    healthConditions: ['고혈압', '당뇨', '긴급 상태'],
  },
  healthSummary: '고혈압, 당뇨, 긴급 상태',
  policyCount: 5,
  lastAnalyzedAt: new Date(),
};

// Mock 데이터 - 추천 정책
const mockPoliciesExtended: PolicyExtended[] = [
  {
    id: 'policy-001',
    name: '노인 만성질환 관리 지원',
    summary: '고혈압, 당뇨 등 만성질환 어르신 대상 의료비 및 건강관리 지원',
    matchScore: 95,
    badge: 'best',
    icon: 'health',
    benefits: [
      { icon: '💰', text: '월 최대 10만원 의료비 지원' },
      { icon: '📅', text: '분기별 건강검진' },
      { icon: '📞', text: '24시간 상담' },
    ],
    organization: '양천구청 복지정책과',
    applicationPeriod: '상시',
    applicationMethod: '주민센터 또는 복지로 온라인 신청',
    details: {
      description: '만성질환을 가진 어르신들의 의료비 부담을 줄이고 건강관리를 지원합니다.',
      eligibility: ['만 65세 이상', '고혈압, 당뇨 등 만성질환 보유자', '소득 기준 충족'],
      documents: ['신분증', '건강보험증', '소득증빙서류'],
      contactInfo: '양천구청 복지정책과 02-2620-3000',
    },
  },
  {
    id: 'policy-002',
    name: '독거노인 응급안전서비스',
    summary: '독거노인 가정에 응급 호출 시스템 설치 및 24시간 모니터링',
    matchScore: 88,
    badge: 'recommended',
    icon: 'safety',
    benefits: [
      { icon: '🔔', text: '응급 호출기 설치' },
      { icon: '👀', text: '24시간 모니터링' },
      { icon: '🚑', text: '긴급 출동' },
    ],
    organization: '서울시 어르신돌봄과',
    applicationPeriod: '상시',
    applicationMethod: '주민센터 방문 신청',
    details: {
      description: '독거노인의 안전을 위해 응급 호출 시스템을 설치하고 24시간 모니터링합니다.',
      eligibility: ['만 65세 이상 독거노인', '응급상황 대응이 필요한 자'],
      documents: ['신분증', '독거 확인서류'],
      contactInfo: '서울시 어르신돌봄과 02-2133-7500',
    },
  },
  {
    id: 'policy-003',
    name: '어르신 영양관리 지원',
    summary: '독거노인 및 저소득 어르신 대상 도시락 배달 및 영양 상담',
    matchScore: 75,
    badge: 'recommended',
    icon: 'nutrition',
    benefits: [
      { icon: '🍱', text: '주 5일 도시락 배달' },
      { icon: '👩‍⚕️', text: '월 1회 영양 상담' },
      { icon: '📊', text: '건강 모니터링' },
    ],
    organization: '양천구청 어르신복지과',
    applicationPeriod: '상시',
    applicationMethod: '주민센터 방문 신청',
    details: {
      description: '혼자 식사 준비가 어려운 어르신에게 균형 잡힌 식사를 제공합니다.',
      eligibility: ['만 65세 이상', '독거 또는 저소득 가구', '식사 준비 곤란자'],
      documents: ['신분증', '소득증빙서류'],
      contactInfo: '양천구청 어르신복지과 02-2620-3500',
    },
  },
  {
    id: 'policy-004',
    name: '노인 건강증진 프로그램',
    summary: '주 2회 체조 프로그램, 건강 강좌',
    matchScore: 68,
    badge: null,
    icon: 'exercise',
    benefits: [
      { icon: '🏃', text: '주 2회 체조' },
      { icon: '📚', text: '건강 강좌' },
    ],
    organization: '양천구 체육회',
    applicationPeriod: '상시',
    applicationMethod: '체육회 방문 신청',
    details: {
      description: '어르신들의 건강한 생활을 위한 운동 프로그램입니다.',
      eligibility: ['만 60세 이상'],
      documents: ['신분증'],
      contactInfo: '양천구 체육회 02-2643-9900',
    },
  },
  {
    id: 'policy-005',
    name: '가사·간병 방문지원',
    summary: '주 3회 가사 도우미 파견',
    matchScore: 62,
    badge: null,
    icon: 'care',
    benefits: [
      { icon: '🏠', text: '주 3회 가사 도우미' },
      { icon: '🧹', text: '청소, 빨래 지원' },
    ],
    organization: '목동종합사회복지관',
    applicationPeriod: '상시',
    applicationMethod: '복지관 방문 신청',
    details: {
      description: '일상생활에 도움이 필요한 어르신에게 가사 도우미를 파견합니다.',
      eligibility: ['만 65세 이상', '일상생활 지원 필요자'],
      documents: ['신분증', '장기요양등급확인서'],
      contactInfo: '목동종합사회복지관 02-2649-9100',
    },
  },
];

// 정책 아이콘 컴포넌트
function PolicyIcon({ type, className }: { type: PolicyIconType; className?: string }) {
  const iconConfig: Record<PolicyIconType, { bg: string; emoji: string }> = {
    health: { bg: 'bg-orange-100', emoji: '🏥' },
    safety: { bg: 'bg-blue-100', emoji: '🏠' },
    nutrition: { bg: 'bg-yellow-100', emoji: '🍽️' },
    exercise: { bg: 'bg-green-100', emoji: '💪' },
    care: { bg: 'bg-purple-100', emoji: '🔧' },
  };

  const config = iconConfig[type];

  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.bg} ${className}`}>
      <span className="text-2xl">{config.emoji}</span>
    </div>
  );
}

// 마지막 분석 시간 포맷
function formatLastAnalyzed(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return '방금 전';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;

  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `오늘 ${hours}:${String(minutes).padStart(2, '0')}`;
}

export default function PoliciesPage() {
  const params = useParams();
  const router = useRouter();
  const recipientId = params.id as string;

  const [isRefreshing, setIsRefreshing] = useState(false);

  // 대상자 정보 조회
  const { data: recipient, isLoading, error } = useRecipientDetail(recipientId);

  // 뒤로가기
  const handleBack = () => {
    router.push(`/recipients/${recipientId}`);
  };

  // 재분석
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: AI 재분석 API 호출
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="px-8 pb-8 pt-4">
        <PolicySkeleton />
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

  const topPolicies = mockPoliciesExtended.slice(0, 3);
  const bottomPolicies = mockPoliciesExtended.slice(3);

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
                <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                  <span>🔍</span> AI 복지 정책 추천
                </h1>
              </div>
            </div>

            {/* 대상자 태그 */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#EBF2FF] rounded-full">
              <span className="text-sm font-medium text-[#448CFF]">
                {recipient.basicInfo.dong}
              </span>
              <span className="text-sm font-medium text-[#C45A5A]">
                {recipient.name}
              </span>
            </div>
          </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-8 pb-8 pt-4 space-y-6">
        {/* AI 분석 결과 박스 */}
        <div className="bg-gradient-to-r from-[#448CFF] to-[#6BA3FF] rounded-xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h2 className="text-lg font-semibold mb-1">AI 분석 결과</h2>
                <p className="text-white/80 text-sm">
                  대상자 정보, 건강 상태, 가구 환경을 종합 분석하여 맞춤 복지 정책을 추천합니다.
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors min-h-[44px] disabled:opacity-50"
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  분석 중...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  재분석
                </>
              )}
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">분석 기반 조건</p>
            <p className="text-lg font-semibold text-neutral-900">
              만 {mockAnalysisResult.condition.age}세, {mockAnalysisResult.condition.gender === 'male' ? '남성' : '여성'}, {mockAnalysisResult.condition.livingStatus}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">건강 상태</p>
            <p className="text-lg font-semibold text-neutral-900">{mockAnalysisResult.healthSummary}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">추천 정책 수</p>
            <p className="text-3xl font-bold text-[#448CFF]">{mockAnalysisResult.policyCount}개</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5">
            <p className="text-sm text-neutral-500 mb-1">마지막 분석</p>
            <p className="text-lg font-semibold text-neutral-900">{formatLastAnalyzed(mockAnalysisResult.lastAnalyzedAt)}</p>
          </div>
        </div>

        {/* 추천 정책 목록 제목 */}
        <h2 className="text-xl font-bold text-neutral-900">추천 정책 목록</h2>

        {/* 상위 3개 정책 카드 (큰 카드) */}
        <div className="space-y-4">
          {topPolicies.map((policy) => (
            <div
              key={policy.id}
              className={`bg-white rounded-xl border p-6 ${
                policy.badge === 'best'
                  ? 'border-[#3D8B6E] bg-green-50/30'
                  : 'border-neutral-200'
              }`}
            >
              <div className="flex items-start gap-5">
                {/* 아이콘 */}
                <PolicyIcon type={policy.icon} />

                {/* 콘텐츠 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-[#448CFF]">{policy.name}</span>
                    {policy.badge === 'best' && (
                      <span className="px-2 py-0.5 bg-[#3D8B6E] text-white text-xs font-medium rounded">
                        최적합
                      </span>
                    )}
                    {policy.badge === 'recommended' && (
                      <span className="px-2 py-0.5 bg-[#448CFF] text-white text-xs font-medium rounded">
                        추천
                      </span>
                    )}
                    <span className="text-sm text-neutral-500">적합도 {policy.matchScore}%</span>
                  </div>

                  <p className="text-sm text-neutral-600 mb-3">{policy.summary}</p>

                  {/* 혜택 */}
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    {policy.benefits.map((benefit, index) => (
                      <span key={index} className="flex items-center gap-1">
                        <span>{benefit.icon}</span>
                        <span className="text-neutral-600">{benefit.text}</span>
                      </span>
                    ))}
                  </div>

                  {/* 관할 및 신청기간 */}
                  <p className="text-xs text-neutral-500">
                    관할: {policy.organization} | 신청기간: {policy.applicationPeriod}
                  </p>
                </div>

                {/* 신청 안내 버튼 */}
                <button className="flex-shrink-0 px-5 py-2.5 bg-[#448CFF] text-white font-medium rounded-lg hover:bg-[#2B6AD9] transition-colors min-h-[44px]">
                  신청 안내
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 하위 정책 카드 (작은 카드 2열) */}
        <div className="grid grid-cols-2 gap-4">
          {bottomPolicies.map((policy) => (
            <div
              key={policy.id}
              className="bg-white rounded-2xl shadow-sm border border-neutral-border/30 p-5"
            >
              <div className="flex items-start gap-4">
                {/* 아이콘 */}
                <PolicyIcon type={policy.icon} className="w-10 h-10" />

                {/* 콘텐츠 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900">{policy.name}</span>
                    <span className="text-xs text-neutral-500">적합도 {policy.matchScore}%</span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">{policy.summary}</p>
                  <p className="text-xs text-neutral-500">{policy.organization}</p>
                </div>

                {/* 상세 버튼 */}
                <button className="flex items-center gap-1 px-3 py-2 text-sm text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors min-h-[44px]">
                  상세
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 면책 문구 */}
        <div className="text-center py-4">
          <p className="text-sm text-neutral-500 flex items-center justify-center gap-1">
            <span>ℹ️</span>
            AI 추천 결과는 참고용이며, 실제 수혜 자격은 해당 기관에서 확인해 주세요.
          </p>
        </div>
      </div>
    </>
  );
}
