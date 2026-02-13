'use client';

import { Card } from '@/components/ui/Card';
import type { RecipientDetail } from '@/types/dashboard';

interface BasicInfoCardProps {
  basicInfo: RecipientDetail['basicInfo'];
  manager: RecipientDetail['manager'];
}

/**
 * 기본 정보 카드 컴포넌트
 * 주소, 연락처, 비상 연락처, 담당 매니저 정보를 표시합니다.
 */
export function BasicInfoCard({ basicInfo, manager }: BasicInfoCardProps) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">기본 정보</h2>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 주소 */}
        <div className="sm:col-span-2">
          <dt className="text-sm text-neutral-500 mb-1">주소</dt>
          <dd className="text-base font-medium text-neutral-900">
            {basicInfo.address}
          </dd>
        </div>

        {/* 연락처 */}
        <div>
          <dt className="text-sm text-neutral-500 mb-1">연락처</dt>
          <dd className="text-base font-medium text-neutral-900">
            <a
              href={`tel:${basicInfo.phone}`}
              className="text-primary-600 hover:underline"
            >
              {basicInfo.phone}
            </a>
          </dd>
        </div>

        {/* 동 */}
        <div>
          <dt className="text-sm text-neutral-500 mb-1">동</dt>
          <dd className="text-base font-medium text-neutral-900">
            {basicInfo.dong}
          </dd>
        </div>

        {/* 비상 연락처 */}
        <div className="sm:col-span-2 pt-4 border-t border-neutral-200">
          <dt className="text-sm text-neutral-500 mb-2">비상 연락처</dt>
          <dd className="bg-neutral-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-neutral-900">
                {basicInfo.emergencyContact.name}
              </span>
              <span className="text-sm text-neutral-500">
                {basicInfo.emergencyContact.relationship}
              </span>
            </div>
            <a
              href={`tel:${basicInfo.emergencyContact.phone}`}
              className="text-sm text-primary-600 hover:underline mt-1 block"
            >
              {basicInfo.emergencyContact.phone}
            </a>
          </dd>
        </div>

        {/* 담당 매니저 */}
        <div className="sm:col-span-2 pt-4 border-t border-neutral-200">
          <dt className="text-sm text-neutral-500 mb-2">담당 매니저</dt>
          <dd className="bg-neutral-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-neutral-900">
                {manager.name}
              </span>
              <span className="text-sm text-neutral-500">{manager.centerName}</span>
            </div>
            <a
              href={`tel:${manager.phone}`}
              className="text-sm text-primary-600 hover:underline mt-1 block"
            >
              {manager.phone}
            </a>
          </dd>
        </div>
      </dl>
    </Card>
  );
}
