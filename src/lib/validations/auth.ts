import { z } from 'zod';

// 로그인 스키마
export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean(),
});

// 회원가입 스키마
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, '이름은 2자 이상이어야 합니다')
      .max(50, '이름은 50자 이하여야 합니다'),
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다')
      .regex(/\d/, '숫자를 포함해야 합니다'),
    passwordConfirm: z.string(),
    phone: z
      .string()
      .regex(/^010-\d{4}-\d{4}$/, '올바른 연락처 형식이 아닙니다 (010-0000-0000)'),
    agreements: z.object({
      terms: z.boolean(),
      privacy: z.boolean(),
      marketing: z.boolean(),
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  })
  .refine((data) => data.agreements.terms === true, {
    message: '이용약관에 동의해야 합니다',
    path: ['agreements', 'terms'],
  })
  .refine((data) => data.agreements.privacy === true, {
    message: '개인정보 처리방침에 동의해야 합니다',
    path: ['agreements', 'privacy'],
  });

// 비밀번호 찾기 스키마
export const forgotPasswordSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
});

// 비밀번호 재설정 스키마
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다')
      .regex(/\d/, '숫자를 포함해야 합니다'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

// 기관 인증 스키마
export const organizationVerifySchema = z.object({
  regionId: z.string().min(1, '시/도를 선택해주세요'),
  districtId: z.string().min(1, '구/군을 선택해주세요'),
  organizationId: z.string().min(1, '기관을 선택해주세요'),
  memo: z.string().max(500, '메모는 500자 이하여야 합니다').optional(),
  document: z.any().optional().refine(
    (val) => val === undefined || (typeof File !== 'undefined' && val instanceof File),
    { message: '올바른 파일을 업로드해주세요' }
  ),
});

// 이메일 인증 코드 스키마
export const emailVerificationSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  code: z.string().regex(/^\d{6}$/, '6자리 숫자를 입력해주세요'),
});

// 타입 추론 (output 타입 사용 - default 값 반영)
export type LoginFormData = z.output<typeof loginSchema>;
export type RegisterFormData = z.output<typeof registerSchema>;
export type ForgotPasswordFormData = z.output<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.output<typeof resetPasswordSchema>;
export type OrganizationVerifyFormData = z.output<typeof organizationVerifySchema>;
export type EmailVerificationFormData = z.output<typeof emailVerificationSchema>;

// 비밀번호 강도 검사 유틸리티
export function passwordStrengthChecks(password: string) {
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  const checks = passwordStrengthChecks(password);
  const passedCount = [checks.minLength, checks.hasNumber, checks.hasSpecialChar].filter(Boolean).length;

  if (passedCount <= 1) return 'weak';
  if (passedCount === 2) return 'medium';
  return 'strong';
}
