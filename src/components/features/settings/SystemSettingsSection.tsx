'use client';

import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import type { SystemSettings } from '@/types/settings';

interface SystemSettingsSectionProps {
  system: SystemSettings;
  onUpdate: (key: string, value: string | boolean) => void;
}

// 언어 옵션
const languageOptions = [
  { value: 'ko', label: '한국어' },
];

// 시간대 옵션
const timezoneOptions = [
  { value: 'Asia/Seoul', label: '(GMT+9) 서울' },
];

/**
 * 시스템 설정 섹션
 * 언어, 시간대 드롭다운 + 다크 모드, 자동 새로고침 토글
 */
export function SystemSettingsSection({ system, onUpdate }: SystemSettingsSectionProps) {
  return (
    <Card variant="default" padding="md" className="h-full">
      {/* 헤더 */}
      <h2 className="text-h3 font-semibold text-neutral-text flex items-center gap-2 mb-5 whitespace-nowrap">
        <svg className="w-5 h-5 flex-shrink-0 text-neutral-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        시스템 설정
      </h2>

      <div className="space-y-4">
        {/* 언어 */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-border bg-neutral-50">
          <div>
            <span className="block text-body font-medium text-neutral-text">언어</span>
            <span className="block text-caption text-neutral-text-sub">시스템 표시 언어</span>
          </div>
          <div className="w-36">
            <Select
              options={languageOptions}
              value={system.language}
              onChange={(e) => onUpdate('language', e.target.value)}
              name="language"
              className="!min-h-[44px] !py-2 !text-body-sm"
            />
          </div>
        </div>

        {/* 시간대 */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-border bg-neutral-50">
          <div>
            <span className="block text-body font-medium text-neutral-text">시간대</span>
            <span className="block text-caption text-neutral-text-sub">날짜/시간 표시 기준</span>
          </div>
          <div className="w-40">
            <Select
              options={timezoneOptions}
              value={system.timezone}
              onChange={(e) => onUpdate('timezone', e.target.value)}
              name="timezone"
              className="!min-h-[44px] !py-2 !text-body-sm"
            />
          </div>
        </div>

        {/* 다크 모드 + 자동 새로고침 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-neutral-border bg-neutral-50">
            <Toggle
              label="다크 모드"
              description="어두운 테마 사용"
              checked={system.darkMode}
              onCheckedChange={(checked) => onUpdate('darkMode', checked)}
              name="darkMode"
            />
          </div>
          <div className="p-3 rounded-lg border border-neutral-border bg-neutral-50">
            <Toggle
              label="자동 새로고침"
              description="대시보드 자동 갱신 (5분)"
              checked={system.autoRefresh}
              onCheckedChange={(checked) => onUpdate('autoRefresh', checked)}
              name="autoRefresh"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
