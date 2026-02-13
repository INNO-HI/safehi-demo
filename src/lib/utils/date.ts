// ============================================================
// 날짜 포맷 유틸리티
// T004: 상대 시간, 한국어 포맷 지원
// ============================================================

export type DateInput = Date | string | number | null | undefined;

/**
 * 입력값을 Date 객체로 변환
 */
function toDate(input: DateInput): Date | null {
  if (!input) return null;
  const date = new Date(input);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * 날짜를 한국어 형식으로 포맷 (YYYY년 MM월 DD일)
 */
export function formatDateKorean(input: DateInput): string {
  const date = toDate(input);
  if (!date) return '-';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 날짜를 간단한 형식으로 포맷 (YYYY-MM-DD)
 */
export function formatDate(input: DateInput): string {
  const date = toDate(input);
  if (!date) return '-';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 날짜와 시간을 함께 포맷 (YYYY-MM-DD HH:mm)
 */
export function formatDateTime(input: DateInput): string {
  const date = toDate(input);
  if (!date) return '-';

  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * 날짜와 시간을 한국어 형식으로 포맷 (YYYY년 M월 D일 오전/오후 H:mm)
 */
export function formatDateTimeKorean(input: DateInput): string {
  const date = toDate(input);
  if (!date) return '-';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${year}년 ${month}월 ${day}일 ${period} ${displayHours}:${minutes}`;
}

/**
 * 상대 시간 포맷 (예: 방금 전, 5분 전, 1시간 전, 어제)
 */
export function formatRelativeTime(input: DateInput): string {
  const date = toDate(input);
  if (!date) return '-';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return '방금 전';
  }

  if (diffMin < 60) {
    return `${diffMin}분 전`;
  }

  if (diffHour < 24) {
    return `${diffHour}시간 전`;
  }

  if (diffDay === 1) {
    return '어제';
  }

  if (diffDay < 7) {
    return `${diffDay}일 전`;
  }

  if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7);
    return `${weeks}주 전`;
  }

  if (diffDay < 365) {
    const months = Math.floor(diffDay / 30);
    return `${months}개월 전`;
  }

  const years = Math.floor(diffDay / 365);
  return `${years}년 전`;
}

/**
 * 시간만 포맷 (HH:mm)
 */
export function formatTime(input: DateInput): string {
  const date = toDate(input);
  if (!date) return '-';

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * 오늘 날짜인지 확인
 */
export function isToday(input: DateInput): boolean {
  const date = toDate(input);
  if (!date) return false;

  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 어제 날짜인지 확인
 */
export function isYesterday(input: DateInput): boolean {
  const date = toDate(input);
  if (!date) return false;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

/**
 * 날짜 범위가 유효한지 확인
 */
export function isValidDateRange(startInput: DateInput, endInput: DateInput): boolean {
  const start = toDate(startInput);
  const end = toDate(endInput);
  if (!start || !end) return true;
  return start.getTime() <= end.getTime();
}

/**
 * 두 날짜 사이의 일수 계산
 */
export function getDaysDifference(startInput: DateInput, endInput: DateInput): number {
  const start = toDate(startInput);
  const end = toDate(endInput);
  if (!start || !end) return 0;
  
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * n일 전 날짜 반환
 */
export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * 이번 달 시작일 반환
 */
export function getMonthStart(): Date {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * 이번 주 시작일 반환 (월요일 기준)
 */
export function getWeekStart(): Date {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
