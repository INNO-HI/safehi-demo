/**
 * 설정 페이지 타입 정의
 * data-model.md 기반
 */

// 사용자 역할
export type UserRole = 'district_admin' | 'manager';

// 관리자 프로필 정보
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roleLabel: string;
  createdAt: string;
  avatarInitials: string;
}

// 알림 환경설정
export interface NotificationSettings {
  newReport: boolean;
  urgentCase: boolean;
  weeklyReport: boolean;
  emailNotification: boolean;
  mobilePush: boolean;
}

// 알림 항목 메타데이터
export interface NotificationItem {
  key: keyof NotificationSettings;
  title: string;
  description: string;
}

// 시스템 환경설정
export interface SystemSettings {
  language: string;
  timezone: string;
  darkMode: boolean;
  autoRefresh: boolean;
}

// 관할 구역 정보 (읽기 전용)
export interface JurisdictionInfo {
  organizationName: string;
  department: string;
  dongCount: number;
  centerCount: number;
  managerCount: number;
  dongList: string[];
}

// 비밀번호 변경 요청
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 설정 전체 데이터 (API 응답)
export interface SettingsData {
  profile: UserProfile;
  notifications: NotificationSettings;
  system: SystemSettings;
  jurisdiction: JurisdictionInfo;
}

// Zustand 설정 상태
export interface SettingsState {
  profile: UserProfile | null;
  notifications: NotificationSettings;
  system: SystemSettings;
  jurisdiction: JurisdictionInfo | null;
  isLoading: boolean;
}

// Zustand 설정 액션
export interface SettingsActions {
  loadSettings: () => Promise<void>;
  updateProfileBatch: (data: Partial<UserProfile>) => Promise<void>;
  updateNotification: (key: keyof NotificationSettings, value: boolean) => Promise<void>;
  updateSystemSetting: (key: string, value: string | boolean) => Promise<void>;
}
