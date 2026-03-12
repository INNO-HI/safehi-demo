/**
 * 인증 관련 Mock API 함수
 * 실제 백엔드 연동 전까지 사용
 */

import type { User } from '@/types/auth';
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  OrganizationVerifyFormData,
} from '@/lib/validations/auth';

// 응답 지연 시뮬레이션
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock 사용자 데이터
const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@safehi.kr',
    name: '김테스트',
    phone: '010-1234-5678',
    role: 'manager',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
  },
];

// 로그인 실패 횟수 추적 (메모리 기반)
const loginAttempts: Record<string, { count: number; lockedUntil?: Date }> = {};

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 로그인 API
 */
export async function login(
  data: LoginFormData
): Promise<ApiResponse<{ user: User; token: string }>> {
  await delay(800);

  const email = data.email.toLowerCase();

  // 계정 잠금 확인
  const attempts = loginAttempts[email];
  if (attempts?.lockedUntil && attempts.lockedUntil > new Date()) {
    return {
      success: false,
      error: '계정이 일시적으로 잠겼습니다. 잠시 후 다시 시도해주세요.',
    };
  }

  // 사용자 찾기
  const user = mockUsers.find((u) => u.email === email);

  // 관리자 계정: kms4024@gmail.com / kh01082254024
  if (email === 'kms4024@gmail.com' && data.password === 'kh01082254024') {
    delete loginAttempts[email];

    return {
      success: true,
      data: {
        user: {
          id: '0',
          email: 'kms4024@gmail.com',
          name: '관리자',
          phone: '010-0000-0000',
          role: 'manager',
          emailVerified: true,
          createdAt: new Date('2024-01-01'),
        },
        token: 'mock-jwt-token-' + Date.now(),
      },
    };
  }

  // 테스트 계정: test@safehi.kr / Test1234!
  if (email === 'test@safehi.kr' && data.password === 'Test1234!') {
    delete loginAttempts[email];

    return {
      success: true,
      data: {
        user: user!,
        token: 'mock-jwt-token-' + Date.now(),
      },
    };
  }

  // 로그인 실패 - 시도 횟수 증가
  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 0 };
  }
  loginAttempts[email].count++;

  // 5회 실패 시 계정 잠금 (5분)
  if (loginAttempts[email].count >= 5) {
    loginAttempts[email].lockedUntil = new Date(Date.now() + 5 * 60 * 1000);
    return {
      success: false,
      error: '로그인 시도가 5회 초과되어 계정이 5분간 잠겼습니다.',
    };
  }

  return {
    success: false,
    error: '이메일 또는 비밀번호가 올바르지 않습니다.',
  };
}

/**
 * 회원가입 API
 */
export async function register(
  data: RegisterFormData
): Promise<ApiResponse<{ user: User }>> {
  await delay(1000);

  const email = data.email.toLowerCase();

  // 이메일 중복 확인
  if (mockUsers.some((u) => u.email === email)) {
    return {
      success: false,
      error: '이미 사용 중인 이메일입니다.',
    };
  }

  // 새 사용자 생성
  const newUser: User = {
    id: String(mockUsers.length + 1),
    email,
    name: data.name,
    phone: data.phone,
    role: 'user',
    emailVerified: false,
    createdAt: new Date(),
  };

  mockUsers.push(newUser);

  return {
    success: true,
    data: { user: newUser },
  };
}

/**
 * 이메일 인증 코드 발송 API
 * [메일 인증 기능 비활성화됨]
 */
// export async function sendEmailVerification(
//   email: string
// ): Promise<ApiResponse<{ code: string }>> {
//   return wrap(() =>
//     apiPost<{ code: string }>('/auth/send-verification', { email })
//   );
// }

/**
 * 이메일 인증 코드 확인 API
 * [메일 인증 기능 비활성화됨]
 */
// export async function verifyEmailCode(
//   email: string,
//   code: string
// ): Promise<ApiResponse> {
//   return wrap(() =>
//     apiPost('/auth/verify-code', { email, code })
//   );
// }

/**
 * 비밀번호 재설정 링크 발송 API
 */
export async function sendPasswordResetLink(
  _data: ForgotPasswordFormData
): Promise<ApiResponse> {
  await delay(800);

  // 보안: 이메일 존재 여부와 관계없이 동일한 응답
  return {
    success: true,
  };
}

/**
 * 비밀번호 재설정 API
 */
export async function resetPassword(
  data: ResetPasswordFormData & { token: string }
): Promise<ApiResponse> {
  await delay(800);

  // 토큰 유효성 검사 (mock)
  if (!data.token || data.token.length < 10) {
    return {
      success: false,
      error: '유효하지 않거나 만료된 링크입니다. 다시 요청해주세요.',
    };
  }

  return { success: true };
}

/**
 * 기관 인증 요청 API
 */
export async function requestOrganizationVerification(
  _data: OrganizationVerifyFormData
): Promise<ApiResponse<{ requestId: string }>> {
  await delay(1000);

  return {
    success: true,
    data: {
      requestId: 'req-' + Date.now(),
    },
  };
}

/**
 * 로그아웃 API
 */
export async function logout(): Promise<ApiResponse> {
  await delay(200);
  return { success: true };
}
