/**
 * 인증 관련 API 함수
 * core-backend /core/dashboard/auth/* 엔드포인트와 통신
 */

import type { User } from '@/types/auth';
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  OrganizationVerifyFormData,
} from '@/lib/validations/auth';
import { apiPost, ApiError } from './client';

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 백엔드 응답을 프론트 ApiResponse 형태로 변환하는 헬퍼
 */
async function wrap<T>(fn: () => Promise<T>): Promise<ApiResponse<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: err.message };
    }
    return { success: false, error: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.' };
  }
}

/**
 * 로그인 API
 */
export async function login(
  data: LoginFormData
): Promise<ApiResponse<{ user: User; token: string }>> {
  return wrap(() =>
    apiPost<{ user: User; token: string }>('/auth/login', {
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    })
  );
}

/**
 * 회원가입 API
 */
export async function register(
  data: RegisterFormData
): Promise<ApiResponse<{ user: User }>> {
  return wrap(() =>
    apiPost<{ user: User }>('/auth/register', data)
  );
}

/**
 * 이메일 인증 코드 발송 API
 */
export async function sendEmailVerification(
  email: string
): Promise<ApiResponse<{ code: string }>> {
  return wrap(() =>
    apiPost<{ code: string }>('/auth/send-verification', { email })
  );
}

/**
 * 이메일 인증 코드 확인 API
 */
export async function verifyEmailCode(
  email: string,
  code: string
): Promise<ApiResponse> {
  return wrap(() =>
    apiPost('/auth/verify-code', { email, code })
  );
}

/**
 * 비밀번호 재설정 링크 발송 API
 */
export async function sendPasswordResetLink(
  data: ForgotPasswordFormData
): Promise<ApiResponse> {
  return wrap(() =>
    apiPost('/auth/forgot-password', data)
  );
}

/**
 * 비밀번호 재설정 API
 */
export async function resetPassword(
  data: ResetPasswordFormData & { token: string }
): Promise<ApiResponse> {
  return wrap(() =>
    apiPost('/auth/reset-password', data)
  );
}

/**
 * 기관 인증 요청 API
 */
export async function requestOrganizationVerification(
  data: OrganizationVerifyFormData
): Promise<ApiResponse<{ requestId: string }>> {
  return wrap(() =>
    apiPost<{ requestId: string }>('/auth/organization-verify', data)
  );
}

/**
 * 로그아웃 API
 */
export async function logout(): Promise<ApiResponse> {
  return wrap(() => apiPost('/auth/logout'));
}
