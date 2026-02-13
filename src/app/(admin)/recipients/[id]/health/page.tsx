'use client';

import { useParams, useRouter } from 'next/navigation';
import { useRecipientDetail } from '@/hooks/useRecipientDetail';
import { Alert } from '@/components/ui/Alert';

// ============================================================
// 건강 정보 상세 페이지
// /recipients/[id]/health
// ============================================================

// 건강 기록 히스토리 Mock 데이터
interface HealthRecord {
  id: string;
  date: Date;
  type: 'measurement' | 'symptom' | 'hospital' | 'medication';
  title: string;
  content: string;
  managerName: string;
}

const mockHealthRecords: HealthRecord[] = [
  {
    id: 'hr-001',
    date: new Date('2026-01-12'),
    type: 'measurement',
    title: '혈압 측정',
    content: '수축기 135mmHg / 이완기 85mmHg - 정상 범위 내',
    managerName: '김민수',
  },
  {
    id: 'hr-002',
    date: new Date('2026-01-10'),
    type: 'symptom',
    title: '증상 기록',
    content: '어지러움 증상 호소. 휴식 후 호전됨.',
    managerName: '김민수',
  },
  {
    id: 'hr-003',
    date: new Date('2026-01-08'),
    type: 'measurement',
    title: '혈압 측정',
    content: '수축기 140mmHg / 이완기 90mmHg - 약간 높음',
    managerName: '김민수',
  },
  {
    id: 'hr-004',
    date: new Date('2026-01-05'),
    type: 'hospital',
    title: '병원 진료',
    content: '양천구 보건소 정기 건강검진 완료. 특이사항 없음.',
    managerName: '김민수',
  },
  {
    id: 'hr-005',
    date: new Date('2025-12-28'),
    type: 'medication',
    title: '투약 변경',
    content: '혈압약 용량 조절 (5mg → 10mg). 의사 처방에 따라 변경.',
    managerName: '김민수',
  },
  {
    id: 'hr-006',
    date: new Date('2025-12-20'),
    type: 'symptom',
    title: '증상 기록',
    content: '계단 오르기 시 숨참 호소. 천천히 이동 권고.',
    managerName: '김민수',
  },
];

// 건강 기록 타입별 아이콘 및 색상
const healthRecordTypeConfig: Record<HealthRecord['type'], { icon: string; bgColor: string; textColor: string; label: string }> = {
  measurement: {
    icon: '📊',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    label: '측정',
  },
  symptom: {
    icon: '🩺',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    label: '증상',
  },
  hospital: {
    icon: '🏥',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    label: '진료',
  },
  medication: {
    icon: '💊',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    label: '투약',
  },
};

// 날짜 포맷
function formatDate(date: Date): string {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default function HealthPage() {
  const params = useParams();
  const router = useRouter();
  const recipientId = params.id as string;

  const { data: recipient, isLoading, error } = useRecipientDetail(recipientId);

  // 뒤로가기
  const handleBack = () => {
    router.push(`/recipients/${recipientId}`);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-1/4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-neutral-200 rounded-xl" />
              <div className="h-32 bg-neutral-200 rounded-xl" />
            </div>
            <div className="h-64 bg-neutral-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !recipient) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto p-6">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-neutral-200 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-11 h-11 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                aria-label="대상자 상세로 돌아가기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <p className="text-sm text-neutral-500 mb-0.5">
                  대상자 관리 &gt; {recipient.name}
                </p>
                <h1 className="text-2xl font-bold text-neutral-900">건강 정보</h1>
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
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* 긴급 알림 */}
        {recipient.urgentAlert && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden="true">⚠️</span>
              <div>
                <p className="font-semibold text-red-700 text-lg">{recipient.urgentAlert.message}</p>
                <p className="text-red-600 mt-1">{recipient.urgentAlert.detail}</p>
              </div>
            </div>
          </div>
        )}

        {/* 기본 건강 정보 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 기저질환 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl" aria-hidden="true">🏥</span>
              <h2 className="text-lg font-semibold text-neutral-900">기저질환</h2>
            </div>
            {recipient.healthInfo.diseases.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recipient.healthInfo.diseases.map((disease, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-base font-medium"
                  >
                    {disease}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500">등록된 기저질환이 없습니다.</p>
            )}
          </div>

          {/* 복용 약물 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl" aria-hidden="true">💊</span>
              <h2 className="text-lg font-semibold text-neutral-900">복용 약물</h2>
            </div>
            {recipient.healthInfo.medications.length > 0 ? (
              <ul className="space-y-2">
                {recipient.healthInfo.medications.map((medication, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                    <span className="text-base text-neutral-900">{medication}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-500">등록된 복용 약물이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 특이사항 */}
        {recipient.healthInfo.notes && (
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl" aria-hidden="true">📝</span>
              <h2 className="text-lg font-semibold text-neutral-900">건강 관련 특이사항</h2>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-base text-neutral-800 leading-relaxed">{recipient.healthInfo.notes}</p>
            </div>
          </div>
        )}

        {/* 건강 기록 히스토리 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">📋</span>
              <h2 className="text-lg font-semibold text-neutral-900">건강 기록 히스토리</h2>
            </div>
            <span className="text-sm text-neutral-500">최근 기록</span>
          </div>

          {/* 필터 태그 */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-neutral-100">
            {Object.entries(healthRecordTypeConfig).map(([type, config]) => (
              <span
                key={type}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${config.bgColor} ${config.textColor}`}
              >
                <span>{config.icon}</span>
                {config.label}
              </span>
            ))}
          </div>

          {/* 기록 리스트 */}
          <div className="space-y-3">
            {mockHealthRecords.map((record, index) => {
              const config = healthRecordTypeConfig[record.type];
              return (
                <div
                  key={record.id}
                  className="flex items-start gap-4"
                >
                  {/* 타임라인 */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}>
                      <span className="text-lg">{config.icon}</span>
                    </div>
                    {index < mockHealthRecords.length - 1 && (
                      <div className="w-0.5 h-full min-h-[24px] bg-neutral-200 mt-1" />
                    )}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                        {config.label}
                      </span>
                      <span className="text-sm text-neutral-500">{formatDate(record.date)}</span>
                    </div>
                    <p className="font-semibold text-neutral-900 mb-1">{record.title}</p>
                    <p className="text-sm text-neutral-600">{record.content}</p>
                    <p className="text-xs text-neutral-400 mt-1">기록자: {record.managerName} 매니저</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 더보기 */}
          <div className="text-center mt-4 pt-4 border-t border-neutral-100">
            <button className="text-[#2E6AB3] text-sm font-medium hover:underline">
              + 이전 기록 더보기
            </button>
          </div>
        </div>

        {/* 건강 관리 요약 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl" aria-hidden="true">📊</span>
            <h2 className="text-lg font-semibold text-neutral-900">건강 관리 요약</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-sm text-blue-600 mb-1">최근 혈압 측정</p>
              <p className="text-2xl font-bold text-blue-700">135/85</p>
              <p className="text-xs text-blue-500 mt-1">mmHg</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <p className="text-sm text-green-600 mb-1">이번 달 방문</p>
              <p className="text-2xl font-bold text-green-700">{recipient.kpi?.monthlyVisits || 0}</p>
              <p className="text-xs text-green-500 mt-1">회</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl text-center">
              <p className="text-sm text-purple-600 mb-1">복용 약물</p>
              <p className="text-2xl font-bold text-purple-700">{recipient.healthInfo.medications.length}</p>
              <p className="text-xs text-purple-500 mt-1">종</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl text-center">
              <p className="text-sm text-red-600 mb-1">긴급 이력</p>
              <p className="text-2xl font-bold text-red-700">{recipient.kpi?.urgentHistory || 0}</p>
              <p className="text-xs text-red-500 mt-1">회</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
