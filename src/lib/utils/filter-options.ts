/**
 * 필터 드롭다운 옵션 (UI 상수)
 *
 * 원래 mock-data 파일에 있던 상수들을 분리.
 * 백엔드 API에서 동적으로 가져올 필요가 없는 고정 옵션 목록.
 */

// 돌봄 일지 - 동 필터 옵션
export const dongOptions = [
  { value: 'all', label: '전체' },
  { value: '목동', label: '목동' },
  { value: '신정동', label: '신정동' },
  { value: '신월동', label: '신월동' },
];

// 매니저 - 담당 동 필터 옵션
export const managerDongOptions = [
  { value: 'all', label: '전체' },
  { value: '목동 1동', label: '목동 1동' },
  { value: '목동 2동', label: '목동 2동' },
  { value: '목동 3동', label: '목동 3동' },
  { value: '목동 4동', label: '목동 4동' },
  { value: '목동 5동', label: '목동 5동' },
  { value: '신정동', label: '신정동' },
  { value: '신월동', label: '신월동' },
];

// 매니저 - 소속 센터 필터 옵션
export const centerOptions = [
  { value: 'all', label: '전체' },
  { value: '목동종합사회복지관', label: '목동종합사회복지관' },
  { value: '신정사회복지관', label: '신정사회복지관' },
  { value: '신월복지센터', label: '신월복지센터' },
  { value: '양천구노인복지관', label: '양천구노인복지관' },
  { value: '양천구종합사회복지관', label: '양천구종합사회복지관' },
];

// 대상자 - 동 필터 옵션
export const recipientDongOptions = [
  { value: 'all', label: '전체' },
  { value: '목동 1동', label: '목동 1동' },
  { value: '목동 2동', label: '목동 2동' },
  { value: '목동 3동', label: '목동 3동' },
  { value: '목동 4동', label: '목동 4동' },
  { value: '목동 5동', label: '목동 5동' },
  { value: '목동 7동', label: '목동 7동' },
  { value: '신정동', label: '신정동' },
  { value: '신월동', label: '신월동' },
];

// 대상자 - 담당 매니저 필터 옵션
export const managerOptions = [
  { value: 'all', label: '전체' },
  { value: '김민수', label: '김민수' },
  { value: '이영희', label: '이영희' },
  { value: '박지민', label: '박지민' },
  { value: '최서윤', label: '최서윤' },
];
