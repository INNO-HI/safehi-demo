'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SettingsState,
  SettingsActions,
  NotificationSettings,
  UserProfile,
} from '@/types/settings';
import {
  getSettings,
  updateProfile as updateProfileApi,
  updateNotifications as updateNotificationsApi,
  updateSystemSettings as updateSystemSettingsApi,
} from '@/lib/mock-data/settings';

interface SettingsStore extends SettingsState, SettingsActions {}

/**
 * 설정 상태 관리 스토어
 * zustand + persist로 설정 유지
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      profile: null,
      notifications: {
        newReport: true,
        urgentCase: true,
        weeklyReport: true,
        emailNotification: false,
        mobilePush: true,
      },
      system: {
        language: 'ko',
        timezone: 'Asia/Seoul',
        darkMode: false,
        autoRefresh: true,
      },
      jurisdiction: null,
      isLoading: true,

      // 설정 데이터 로드
      loadSettings: async () => {
        set({ isLoading: true });
        try {
          const data = await getSettings();
          set({
            profile: data.profile,
            notifications: data.notifications,
            system: data.system,
            jurisdiction: data.jurisdiction,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      // 프로필 일괄 업데이트 (이름, 연락처 등 여러 필드)
      updateProfileBatch: async (data: Partial<UserProfile>) => {
        const prev = get().profile;
        if (!prev) return;

        // Optimistic update
        const optimistic = { ...prev, ...data };
        if (data.name) {
          optimistic.avatarInitials = data.name.slice(0, 2);
        }
        set({ profile: optimistic });

        try {
          const updated = await updateProfileApi(data);
          set({ profile: updated });
        } catch {
          set({ profile: prev });
        }
      },

      // 알림 토글 변경
      updateNotification: async (key: keyof NotificationSettings, value: boolean) => {
        const prev = get().notifications;

        // Optimistic update
        set({
          notifications: { ...prev, [key]: value },
        });

        try {
          const updated = await updateNotificationsApi(key, value);
          set({ notifications: updated });
        } catch {
          set({ notifications: prev });
        }
      },

      // 시스템 설정 변경
      updateSystemSetting: async (key: string, value: string | boolean) => {
        const prev = get().system;

        // Optimistic update
        set({
          system: { ...prev, [key]: value },
        });

        try {
          const updated = await updateSystemSettingsApi({ [key]: value });
          set({ system: updated });
        } catch {
          set({ system: prev });
        }
      },
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        system: state.system,
      }),
    }
  )
);

/**
 * 설정 상태 훅
 */
export function useSettings() {
  const store = useSettingsStore();
  return store;
}
