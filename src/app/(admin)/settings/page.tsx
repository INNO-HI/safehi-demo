'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProfileSection } from '@/components/features/settings/ProfileSection';
import { NotificationSection } from '@/components/features/settings/NotificationSection';
import { SystemSettingsSection } from '@/components/features/settings/SystemSettingsSection';
import { JurisdictionSection } from '@/components/features/settings/JurisdictionSection';
import { AccountManagementSection } from '@/components/features/settings/AccountManagementSection';
import { PasswordChangeModal } from '@/components/features/settings/PasswordChangeModal';
import { logout as logoutApi } from '@/lib/api/auth';

/**
 * 설정 페이지
 * 행1: 내 프로필 | 관할 구역
 * 행2: 알림 설정 (전체 폭)
 * 행3: 시스템 설정 | 계정 관리
 * 행4: 푸터
 */
export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const {
    profile,
    notifications,
    system,
    jurisdiction,
    isLoading,
    loadSettings,
    updateProfileBatch,
    updateNotification,
    updateSystemSetting,
  } = useSettings();

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // 설정 데이터 로드
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // 인증 안 된 경우 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // 로그아웃 처리
  const handleLogout = async () => {
    if (!window.confirm('로그아웃하시겠습니까?')) return;
    await logoutApi();
    logout();
    router.push('/login');
  };

  // 계정 문의
  const handleInquiry = () => {
    window.location.href = 'mailto:safeinnohi@gmail.com?subject=[안심하이] 계정 문의';
  };

  // 로딩 상태
  if (isLoading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-text-sub">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        title="설정"
        description="계정, 알림, 시스템 설정을 관리합니다"
        userName={user?.name}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2">
        <div className="space-y-6">
          {/* 행1: 내 프로필 (좁게) + 관할 구역 + 알림 설정 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <ProfileSection
              profile={profile}
              onSave={updateProfileBatch}
              onPasswordChange={() => setPasswordModalOpen(true)}
            />
            {jurisdiction && (
              <JurisdictionSection jurisdiction={jurisdiction} />
            )}
            <NotificationSection
              notifications={notifications}
              onToggle={updateNotification}
            />
          </div>

          {/* 행3: 시스템 설정 + 계정 관리 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemSettingsSection
              system={system}
              onUpdate={updateSystemSetting}
            />
            <AccountManagementSection
              onLogout={handleLogout}
              onInquiry={handleInquiry}
            />
          </div>

          {/* 푸터 */}
          <footer className="text-center text-caption text-neutral-text-tertiary py-4">
            INNO-HI Inc. | 최종 업데이트: 2026.02.19 | © 2026 INNO-Hi. All rights reserved.
          </footer>
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      <PasswordChangeModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </>
  );
}
