/**
 * 지역 및 기관 Mock 데이터
 * 기관 인증 페이지에서 사용
 */

import type { Region, District, Organization } from '@/types/auth';

// 시/도 목록
export const regions: Region[] = [
  { id: 'seoul', name: '서울특별시' },
  { id: 'busan', name: '부산광역시' },
  { id: 'daegu', name: '대구광역시' },
  { id: 'incheon', name: '인천광역시' },
  { id: 'gwangju', name: '광주광역시' },
  { id: 'daejeon', name: '대전광역시' },
  { id: 'ulsan', name: '울산광역시' },
  { id: 'sejong', name: '세종특별자치시' },
  { id: 'gyeonggi', name: '경기도' },
  { id: 'gangwon', name: '강원도' },
  { id: 'chungbuk', name: '충청북도' },
  { id: 'chungnam', name: '충청남도' },
  { id: 'jeonbuk', name: '전라북도' },
  { id: 'jeonnam', name: '전라남도' },
  { id: 'gyeongbuk', name: '경상북도' },
  { id: 'gyeongnam', name: '경상남도' },
  { id: 'jeju', name: '제주특별자치도' },
];

// 구/군 목록 (시/도별)
export const districts: Record<string, District[]> = {
  seoul: [
    { id: 'gangnam', name: '강남구', regionId: 'seoul' },
    { id: 'gangdong', name: '강동구', regionId: 'seoul' },
    { id: 'gangbuk', name: '강북구', regionId: 'seoul' },
    { id: 'gangseo', name: '강서구', regionId: 'seoul' },
    { id: 'gwanak', name: '관악구', regionId: 'seoul' },
    { id: 'gwangjin', name: '광진구', regionId: 'seoul' },
    { id: 'guro', name: '구로구', regionId: 'seoul' },
    { id: 'geumcheon', name: '금천구', regionId: 'seoul' },
    { id: 'nowon', name: '노원구', regionId: 'seoul' },
    { id: 'dobong', name: '도봉구', regionId: 'seoul' },
    { id: 'dongdaemun', name: '동대문구', regionId: 'seoul' },
    { id: 'dongjak', name: '동작구', regionId: 'seoul' },
    { id: 'mapo', name: '마포구', regionId: 'seoul' },
    { id: 'seodaemun', name: '서대문구', regionId: 'seoul' },
    { id: 'seocho', name: '서초구', regionId: 'seoul' },
    { id: 'seongdong', name: '성동구', regionId: 'seoul' },
    { id: 'seongbuk', name: '성북구', regionId: 'seoul' },
    { id: 'songpa', name: '송파구', regionId: 'seoul' },
    { id: 'yangcheon', name: '양천구', regionId: 'seoul' },
    { id: 'yeongdeungpo', name: '영등포구', regionId: 'seoul' },
    { id: 'yongsan', name: '용산구', regionId: 'seoul' },
    { id: 'eunpyeong', name: '은평구', regionId: 'seoul' },
    { id: 'jongno', name: '종로구', regionId: 'seoul' },
    { id: 'jung', name: '중구', regionId: 'seoul' },
    { id: 'jungnang', name: '중랑구', regionId: 'seoul' },
  ],
  busan: [
    { id: 'gangseo-busan', name: '강서구', regionId: 'busan' },
    { id: 'geumjeong', name: '금정구', regionId: 'busan' },
    { id: 'gijang', name: '기장군', regionId: 'busan' },
    { id: 'nam', name: '남구', regionId: 'busan' },
    { id: 'dong', name: '동구', regionId: 'busan' },
    { id: 'dongnae', name: '동래구', regionId: 'busan' },
    { id: 'busanjin', name: '부산진구', regionId: 'busan' },
    { id: 'buk', name: '북구', regionId: 'busan' },
    { id: 'sasang', name: '사상구', regionId: 'busan' },
    { id: 'saha', name: '사하구', regionId: 'busan' },
    { id: 'seo', name: '서구', regionId: 'busan' },
    { id: 'suyeong', name: '수영구', regionId: 'busan' },
    { id: 'yeonje', name: '연제구', regionId: 'busan' },
    { id: 'yeongdo', name: '영도구', regionId: 'busan' },
    { id: 'jung-busan', name: '중구', regionId: 'busan' },
    { id: 'haeundae', name: '해운대구', regionId: 'busan' },
  ],
  gyeonggi: [
    { id: 'suwon', name: '수원시', regionId: 'gyeonggi' },
    { id: 'seongnam', name: '성남시', regionId: 'gyeonggi' },
    { id: 'goyang', name: '고양시', regionId: 'gyeonggi' },
    { id: 'yongin', name: '용인시', regionId: 'gyeonggi' },
    { id: 'bucheon', name: '부천시', regionId: 'gyeonggi' },
    { id: 'ansan', name: '안산시', regionId: 'gyeonggi' },
    { id: 'anyang', name: '안양시', regionId: 'gyeonggi' },
    { id: 'namyangju', name: '남양주시', regionId: 'gyeonggi' },
    { id: 'hwaseong', name: '화성시', regionId: 'gyeonggi' },
    { id: 'uijeongbu', name: '의정부시', regionId: 'gyeonggi' },
    { id: 'siheung', name: '시흥시', regionId: 'gyeonggi' },
    { id: 'pyeongtaek', name: '평택시', regionId: 'gyeonggi' },
    { id: 'gwangmyeong', name: '광명시', regionId: 'gyeonggi' },
    { id: 'paju', name: '파주시', regionId: 'gyeonggi' },
    { id: 'gunpo', name: '군포시', regionId: 'gyeonggi' },
  ],
  // 다른 지역은 필요시 추가
};

// 기관 목록 (구/군별)
export const organizations: Record<string, Organization[]> = {
  gangnam: [
    { id: 'org-gangnam-1', name: '강남구 종합사회복지관', regionId: 'seoul', districtId: 'gangnam' },
    { id: 'org-gangnam-2', name: '강남구 노인복지센터', regionId: 'seoul', districtId: 'gangnam' },
    { id: 'org-gangnam-3', name: '강남구 돌봄지원센터', regionId: 'seoul', districtId: 'gangnam' },
  ],
  gangdong: [
    { id: 'org-gangdong-1', name: '강동구 종합사회복지관', regionId: 'seoul', districtId: 'gangdong' },
    { id: 'org-gangdong-2', name: '강동구 노인복지관', regionId: 'seoul', districtId: 'gangdong' },
  ],
  mapo: [
    { id: 'org-mapo-1', name: '마포구 종합사회복지관', regionId: 'seoul', districtId: 'mapo' },
    { id: 'org-mapo-2', name: '마포구 돌봄센터', regionId: 'seoul', districtId: 'mapo' },
    { id: 'org-mapo-3', name: '마포구 시니어케어센터', regionId: 'seoul', districtId: 'mapo' },
  ],
  suwon: [
    { id: 'org-suwon-1', name: '수원시 종합복지관', regionId: 'gyeonggi', districtId: 'suwon' },
    { id: 'org-suwon-2', name: '수원시 노인돌봄센터', regionId: 'gyeonggi', districtId: 'suwon' },
  ],
  seongnam: [
    { id: 'org-seongnam-1', name: '성남시 복지센터', regionId: 'gyeonggi', districtId: 'seongnam' },
    { id: 'org-seongnam-2', name: '성남시 돌봄지원센터', regionId: 'gyeonggi', districtId: 'seongnam' },
  ],
  haeundae: [
    { id: 'org-haeundae-1', name: '해운대구 종합복지관', regionId: 'busan', districtId: 'haeundae' },
    { id: 'org-haeundae-2', name: '해운대구 노인복지센터', regionId: 'busan', districtId: 'haeundae' },
  ],
  // 다른 구/군은 필요시 추가
};

// API 함수들

/**
 * 전체 시/도 목록 조회
 */
export function getRegions(): Region[] {
  return regions;
}

/**
 * 특정 시/도의 구/군 목록 조회
 */
export function getDistrictsByRegion(regionId: string): District[] {
  return districts[regionId] || [];
}

/**
 * 특정 구/군의 기관 목록 조회
 */
export function getOrganizationsByDistrict(districtId: string): Organization[] {
  return organizations[districtId] || [];
}

/**
 * 기관 ID로 기관 정보 조회
 */
export function getOrganizationById(organizationId: string): Organization | undefined {
  for (const orgList of Object.values(organizations)) {
    const found = orgList.find((org) => org.id === organizationId);
    if (found) return found;
  }
  return undefined;
}
