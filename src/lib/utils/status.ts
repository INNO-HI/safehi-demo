// ============================================================
// 상태 색상/레이블 유틸리티
// T005: 돌봄 일지 및 대상자 상태 관련 유틸리티
// ============================================================

import type { CareLogStatus, RecipientStatus, ManagerStatus, ManagerVisitType, ReportStatus } from '@/types/dashboard';

// ============================================================
// 돌봄 일지 상태 유틸리티
// ============================================================

/** 돌봄 일지 상태별 한글 레이블 */
export const careLogStatusLabels: Record<CareLogStatus, string> = {
  pending: '대기',
  urgent: '긴급',
  approved: '승인',
  rejected: '반려',
};

/** 돌봄 일지 상태별 색상 클래스 */
export const careLogStatusColors: Record<CareLogStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  urgent: 'bg-red-100 text-red-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-gray-100 text-gray-800',
};

/** 돌봄 일지 상태별 Tailwind 배경색 */
export const careLogStatusBgColors: Record<CareLogStatus, string> = {
  pending: 'bg-yellow-500',
  urgent: 'bg-red-500',
  approved: 'bg-green-500',
  rejected: 'bg-gray-500',
};

/** 돌봄 일지 상태 레이블 반환 */
export function getCareLogStatusLabel(status: CareLogStatus): string {
  return careLogStatusLabels[status];
}

/** 돌봄 일지 상태 색상 클래스 반환 */
export function getCareLogStatusColor(status: CareLogStatus): string {
  return careLogStatusColors[status];
}

// ============================================================
// 대상자 상태 유틸리티
// ============================================================

/** 대상자 상태별 한글 레이블 */
export const recipientStatusLabels: Record<RecipientStatus, string> = {
  normal: '정상',
  caution: '주의',
  urgent: '긴급',
  unvisited: '미방문',
};

/** 대상자 상태별 색상 클래스 */
export const recipientStatusColors: Record<RecipientStatus, string> = {
  normal: 'bg-green-100 text-green-800',
  caution: 'bg-yellow-100 text-yellow-800',
  urgent: 'bg-red-100 text-red-800',
  unvisited: 'bg-gray-100 text-gray-800',
};

/** 대상자 상태별 Tailwind 배경색 */
export const recipientStatusBgColors: Record<RecipientStatus, string> = {
  normal: 'bg-green-500',
  caution: 'bg-yellow-500',
  urgent: 'bg-red-500',
  unvisited: 'bg-gray-500',
};

/** 대상자 상태 레이블 반환 */
export function getRecipientStatusLabel(status: RecipientStatus): string {
  return recipientStatusLabels[status];
}

/** 대상자 상태 색상 클래스 반환 */
export function getRecipientStatusColor(status: RecipientStatus): string {
  return recipientStatusColors[status];
}

// ============================================================
// 공통 Badge 변형 유틸리티
// ============================================================

/** Badge 변형 타입 */
export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

/** 상태를 Badge 변형으로 변환 (돌봄 일지) */
export function careLogStatusToBadgeVariant(status: CareLogStatus): BadgeVariant {
  const variantMap: Record<CareLogStatus, BadgeVariant> = {
    pending: 'warning',
    urgent: 'danger',
    approved: 'success',
    rejected: 'default',
  };
  return variantMap[status];
}

/** 상태를 Badge 변형으로 변환 (대상자) */
export function recipientStatusToBadgeVariant(status: RecipientStatus): BadgeVariant {
  const variantMap: Record<RecipientStatus, BadgeVariant> = {
    normal: 'success',
    caution: 'warning',
    urgent: 'danger',
    unvisited: 'default',
  };
  return variantMap[status];
}

// ============================================================
// 성별 유틸리티
// ============================================================

/** 성별 한글 레이블 */
export function getGenderLabel(gender: 'male' | 'female'): string {
  return gender === 'male' ? '남' : '여';
}

// ============================================================
// 탭 필터 옵션
// ============================================================

/** 돌봄 일지 상태 탭 옵션 */
export const careLogStatusTabOptions: Array<{ value: CareLogStatus | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기' },
  { value: 'urgent', label: '긴급' },
  { value: 'approved', label: '승인' },
  { value: 'rejected', label: '반려' },
];

/** 대상자 상태 탭 옵션 */
export const recipientStatusTabOptions: Array<{ value: RecipientStatus | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'normal', label: '정상' },
  { value: 'caution', label: '주의' },
  { value: 'urgent', label: '긴급' },
  { value: 'unvisited', label: '미방문' },
];

// ============================================================
// 매니저 상태 유틸리티
// ============================================================

/** 매니저 상태별 한글 레이블 */
export const managerStatusLabels: Record<ManagerStatus, string> = {
  active: '근무 중',
  leave: '휴무',
  retired: '퇴직',
};

/** 매니저 상태 레이블 반환 */
export function getManagerStatusLabel(status: ManagerStatus): string {
  return managerStatusLabels[status];
}

/** 매니저 상태를 Badge 변형으로 변환 */
export function managerStatusToBadgeVariant(status: ManagerStatus): BadgeVariant {
  const variantMap: Record<ManagerStatus, BadgeVariant> = {
    active: 'success',
    leave: 'warning',
    retired: 'default',
  };
  return variantMap[status];
}

/** 매니저 상태 탭 옵션 */
export const managerStatusTabOptions: Array<{ value: ManagerStatus | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '근무 중' },
  { value: 'leave', label: '휴무' },
  { value: 'retired', label: '퇴직' },
];

// ============================================================
// 매니저 방문 유형 유틸리티
// ============================================================

/** 매니저 방문 유형별 한글 레이블 */
export const managerVisitTypeLabels: Record<ManagerVisitType, string> = {
  regular: '정기 방문',
  emergency: '긴급 방문',
  call: '전화 상담',
};

/** 매니저 방문 유형 레이블 반환 */
export function getManagerVisitTypeLabel(type: ManagerVisitType): string {
  return managerVisitTypeLabels[type];
}

/** 매니저 방문 유형을 Badge 변형으로 변환 */
export function managerVisitTypeToBadgeVariant(type: ManagerVisitType): BadgeVariant {
  const variantMap: Record<ManagerVisitType, BadgeVariant> = {
    regular: 'info',
    emergency: 'danger',
    call: 'default',
  };
  return variantMap[type];
}

/** 매니저 방문 유형 탭 옵션 */
export const managerVisitTypeTabOptions: Array<{ value: ManagerVisitType | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'regular', label: '정기 방문' },
  { value: 'emergency', label: '긴급 방문' },
  { value: 'call', label: '전화 상담' },
];

// ============================================================
// 보고서 상태 유틸리티 (매니저 보고서용)
// ============================================================

/** 보고서 상태별 한글 레이블 */
export const reportStatusLabels: Record<ReportStatus, string> = {
  pending: '대기중',
  approved: '승인',
  rejected: '반려',
};

/** 보고서 상태 레이블 반환 */
export function getReportStatusLabel(status: ReportStatus): string {
  return reportStatusLabels[status];
}

/** 보고서 상태를 Badge 변형으로 변환 */
export function reportStatusToBadgeVariant(status: ReportStatus): BadgeVariant {
  const variantMap: Record<ReportStatus, BadgeVariant> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'default',
  };
  return variantMap[status];
}

/** 보고서 상태 탭 옵션 */
export const reportStatusTabOptions: Array<{ value: ReportStatus | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기중' },
  { value: 'approved', label: '승인' },
  { value: 'rejected', label: '반려' },
];
