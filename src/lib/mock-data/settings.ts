/**
 * 설정 페이지 Mock 데이터
 * contracts/settings-api.md 기반
 * 추후 src/lib/api/settings.ts로 교체 예정
 */

import type {
  SettingsData,
  UserProfile,
  NotificationSettings,
  SystemSettings,
  PasswordChangeRequest,
} from '@/types/settings';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock 설정 데이터
const mockSettings: SettingsData = {
  profile: {
    id: 'admin-001',
    name: '김담당',
    email: 'kimdamdang@yangcheon.go.kr',
    phone: '02-2620-1234',
    role: 'district_admin',
    roleLabel: '구/군 관리자',
    createdAt: '2024-03-15T00:00:00Z',
    avatarInitials: '김담',
  },
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
  jurisdiction: {
    organizationName: '서울특별시 양천구',
    department: '어르신복지과 · 돌봄 서비스팀',
    dongCount: 18,
    centerCount: 12,
    managerCount: 156,
    dongList: [
      '목동1동', '목동2동', '목동3동', '목동4동', '목동5동',
      '목동6동', '목동7동', '신월1동', '신월2동', '신월3동',
      '신월4동', '신월5동', '신월6동', '신월7동', '신정1동',
      '신정2동', '신정3동', '신정4동',
    ],
  },
};

// 설정 전체 조회
export async function getSettings(): Promise<SettingsData> {
  await delay(400);
  return { ...mockSettings };
}

// 프로필 수정
export async function updateProfile(
  data: Partial<UserProfile>
): Promise<UserProfile> {
  await delay(300);

  // 이름 변경 시 이니셜 자동 갱신
  if (data.name) {
    mockSettings.profile.avatarInitials = data.name.slice(0, 2);
  }

  Object.assign(mockSettings.profile, data);
  return { ...mockSettings.profile };
}

// 알림 설정 변경
export async function updateNotifications(
  key: keyof NotificationSettings,
  value: boolean
): Promise<NotificationSettings> {
  await delay(300);
  mockSettings.notifications[key] = value;
  return { ...mockSettings.notifications };
}

// 시스템 설정 변경
export async function updateSystemSettings(
  data: Partial<SystemSettings>
): Promise<SystemSettings> {
  await delay(300);
  Object.assign(mockSettings.system, data);
  return { ...mockSettings.system };
}

// 비밀번호 변경
export async function changePassword(
  data: PasswordChangeRequest
): Promise<{ success: boolean }> {
  await delay(500);

  // Mock: 현재 비밀번호가 'password123'이 아니면 실패
  if (data.currentPassword !== 'password123') {
    throw new Error('현재 비밀번호가 올바르지 않습니다.');
  }

  if (data.newPassword !== data.confirmPassword) {
    throw new Error('새 비밀번호가 일치하지 않습니다.');
  }

  return { success: true };
}
