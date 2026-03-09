'use client';

// 메일 인증 기능 비활성화됨

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  disabled?: boolean;
}

/**
 * 이메일 인증 컴포넌트 [메일 인증 기능 비활성화됨]
 */
export function EmailVerification({
  email,
  onVerified,
  disabled = false,
}: EmailVerificationProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void email;
  void onVerified;
  void disabled;
  
  // 메일 인증 기능이 비활성화되어 있습니다.
  return null;
}
