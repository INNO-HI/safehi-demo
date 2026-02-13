// 사용자 역할 타입
export type UserRole = 'user' | 'manager' | 'admin';

// 기관 소속 상태 타입
export type MembershipStatus = 'pending' | 'approved' | 'rejected';

// 사용자 정보 타입
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lockedUntil?: Date;
}

// 기관 정보 타입
export interface Organization {
  id: string;
  name: string;
  regionId: string;
  districtId: string;
  address?: string;
}

// 기관 소속 정보 타입
export interface OrganizationMembership {
  id: string;
  userId: string;
  organizationId: string;
  status: MembershipStatus;
  documentUrl?: string;
  memo?: string;
  requestedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

// 지역(시/도) 타입
export interface Region {
  id: string;
  name: string;
  code?: string;
}

// 구/군 타입
export interface District {
  id: string;
  regionId: string;
  name: string;
  code?: string;
}

// 폼 데이터 타입은 src/lib/validations/auth.ts에서 Zod 스키마 기반으로 정의됨
// LoginFormData, RegisterFormData, ForgotPasswordFormData,
// ResetPasswordFormData, OrganizationVerifyFormData 는 validations/auth.ts에서 import

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  error?: string;
}

// 인증 상태 타입 (Zustand store용)
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
