'use client';

import { Card } from '@/components/ui/Card';
import type { RecipientDetail } from '@/types/dashboard';

interface HealthInfoCardProps {
  healthInfo: RecipientDetail['healthInfo'];
}

/**
 * 건강 정보 카드 컴포넌트
 * 주요 질환, 복용 약물, 특이사항을 표시합니다.
 */
export function HealthInfoCard({ healthInfo }: HealthInfoCardProps) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">건강 정보</h2>

      <dl className="space-y-4">
        {/* 주요 질환 */}
        <div>
          <dt className="text-sm text-neutral-500 mb-2">주요 질환</dt>
          <dd>
            {healthInfo.diseases.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {healthInfo.diseases.map((disease, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium"
                  >
                    {disease}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-neutral-500 text-sm">등록된 질환 없음</span>
            )}
          </dd>
        </div>

        {/* 복용 약물 */}
        <div className="pt-4 border-t border-neutral-200">
          <dt className="text-sm text-neutral-500 mb-2">복용 약물</dt>
          <dd>
            {healthInfo.medications.length > 0 ? (
              <ul className="space-y-2">
                {healthInfo.medications.map((medication, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary-600 mt-0.5 shrink-0"
                    >
                      <path
                        d="M3.33337 8H12.6667"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8 3.33333V12.6667"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-sm text-neutral-900">{medication}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-neutral-500 text-sm">등록된 약물 없음</span>
            )}
          </dd>
        </div>

        {/* 특이사항 */}
        <div className="pt-4 border-t border-neutral-200">
          <dt className="text-sm text-neutral-500 mb-2">특이사항</dt>
          <dd className="text-sm text-neutral-900 bg-neutral-50 rounded-lg p-3 whitespace-pre-wrap">
            {healthInfo.notes || '등록된 특이사항 없음'}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
