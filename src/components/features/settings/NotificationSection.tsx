'use client';

import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import type { NotificationSettings, NotificationItem } from '@/types/settings';

interface NotificationSectionProps {
  notifications: NotificationSettings;
  onToggle: (key: keyof NotificationSettings, value: boolean) => void;
}

// 알림 항목 메타데이터 (5개)
const notificationItems: NotificationItem[] = [
  { key: 'newReport', title: '새 보고서 알림', description: '매니저가 새 보고서 제출 시' },
  { key: 'urgentCase', title: '긴급 케이스 알림', description: '긴급 상태 발생 시 즉시' },
  { key: 'weeklyReport', title: '주간 리포트 알림', description: '매주 월요일 요약 발송' },
  { key: 'emailNotification', title: '이메일 알림', description: '중요 알림 이메일 수신' },
  { key: 'mobilePush', title: '모바일 푸시 알림', description: 'safehi 앱 실시간 알림' },
];

/**
 * 알림 설정 섹션
 * 5개 토글 스위치 (3+2 그리드 배치)
 */
export function NotificationSection({ notifications, onToggle }: NotificationSectionProps) {
  return (
    <Card variant="default" padding="md">
      {/* 헤더 */}
      <h2 className="text-h3 font-semibold text-neutral-text flex items-center gap-2 mb-5 whitespace-nowrap">
        <svg className="w-5 h-5 flex-shrink-0 text-neutral-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        알림 설정
      </h2>

      {/* 토글 그리드: 1행 3개 + 2행 2개 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notificationItems.map((item) => (
          <div key={item.key} className="p-3 rounded-lg border border-neutral-border bg-neutral-50">
            <Toggle
              label={item.title}
              description={item.description}
              checked={notifications[item.key]}
              onCheckedChange={(checked) => onToggle(item.key, checked)}
              name={`notification-${item.key}`}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
