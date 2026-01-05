/**
 * 전화번호 자동 포맷팅 함수
 * 입력값을 010-0000-0000 형식으로 변환
 */
export function formatPhoneNumber(value: string): string {
  // 숫자만 추출
  const numbers = value.replace(/\D/g, '');

  // 최대 11자리로 제한
  const limited = numbers.slice(0, 11);

  // 포맷팅 적용
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 7) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  } else {
    return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
  }
}

/**
 * 전화번호에서 숫자만 추출
 */
export function extractPhoneNumbers(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * 한국 휴대폰 번호 유효성 검사
 */
export function isValidKoreanPhoneNumber(value: string): boolean {
  const pattern = /^010-\d{4}-\d{4}$/;
  return pattern.test(value);
}

/**
 * 날짜 포맷팅 함수 (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 날짜/시간 포맷팅 함수 (YYYY-MM-DD HH:mm)
 */
export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * 파일 크기 포맷팅 함수
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
