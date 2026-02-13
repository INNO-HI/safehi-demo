// ============================================================
// Mock 매니저 데이터
// specs/002-admin-dashboard/data-model-manager-pages.md 기반
// ============================================================

import type {
  Manager,
  ManagerDetailExtended,
  ManagerReport,
  ManagerVisit,
  ManagerStatus,
  ManagerVisitType,
  ReportStatus,
  ManagerFilters,
  ManagerKPIs,
  ManagerAssignedRecipient,
  ManagerMonthlyActivity,
  ManagerReportCounts,
  Gender,
} from '@/types/dashboard';

// ============================================================
// 기본 데이터 풀
// ============================================================

const managerNames = [
  { name: '김민수', gender: 'male' as Gender },
  { name: '이영희', gender: 'female' as Gender },
  { name: '박지민', gender: 'female' as Gender },
  { name: '최서윤', gender: 'female' as Gender },
  { name: '정수진', gender: 'female' as Gender },
  { name: '강동훈', gender: 'male' as Gender },
  { name: '조미영', gender: 'female' as Gender },
  { name: '윤성호', gender: 'male' as Gender },
  { name: '장현주', gender: 'female' as Gender },
  { name: '임재현', gender: 'male' as Gender },
];

const centers = [
  '목동종합사회복지관',
  '신정사회복지관',
  '신월복지센터',
  '양천구노인복지관',
  '양천구종합사회복지관',
];

const dongs = ['목동 1동', '목동 2동', '목동 3동', '목동 4동', '목동 5동', '신정동', '신월동'];

const recipientNames = [
  '김복동 어르신',
  '이순자 어르신',
  '박영희 어르신',
  '최철수 어르신',
  '정만복 어르신',
  '강순희 어르신',
  '조말순 어르신',
  '윤점순 어르신',
  '장복녀 어르신',
  '임영자 어르신',
];

// ============================================================
// 고정 매니저 데이터 (처음 5명)
// ============================================================

const fixedManagers: Manager[] = [
  {
    id: 'mgr-0001',
    name: '김민수',
    gender: 'male',
    centerName: '목동종합사회복지관',
    phone: '010-1234-5678',
    assignedDongs: ['목동 1동', '목동 2동'],
    recipientCount: 18,
    monthlyVisits: 45,
    status: 'active',
  },
  {
    id: 'mgr-0002',
    name: '이영희',
    gender: 'female',
    centerName: '신정사회복지관',
    phone: '010-2345-6789',
    assignedDongs: ['신정동'],
    recipientCount: 15,
    monthlyVisits: 38,
    status: 'active',
  },
  {
    id: 'mgr-0003',
    name: '박지민',
    gender: 'female',
    centerName: '목동종합사회복지관',
    phone: '010-3456-7890',
    assignedDongs: ['목동 3동', '목동 4동'],
    recipientCount: 20,
    monthlyVisits: 52,
    status: 'active',
  },
  {
    id: 'mgr-0004',
    name: '최서윤',
    gender: 'female',
    centerName: '신월복지센터',
    phone: '010-4567-8901',
    assignedDongs: ['신월동'],
    recipientCount: 12,
    monthlyVisits: 30,
    status: 'leave',
  },
  {
    id: 'mgr-0005',
    name: '정수진',
    gender: 'female',
    centerName: '양천구노인복지관',
    phone: '010-5678-9012',
    assignedDongs: ['목동 5동'],
    recipientCount: 0,
    monthlyVisits: 0,
    status: 'retired',
  },
];

// ============================================================
// 랜덤 매니저 생성 (6번째부터)
// ============================================================

function generateManager(id: number): Manager {
  const managerInfo = managerNames[id % managerNames.length];
  const statuses: ManagerStatus[] = ['active', 'active', 'active', 'leave', 'retired'];
  const status = statuses[id % statuses.length];

  const assignedDongCount = 1 + (id % 3);
  const assignedDongs = dongs.slice(0, assignedDongCount);

  return {
    id: `mgr-${String(id).padStart(4, '0')}`,
    name: managerInfo.name,
    gender: managerInfo.gender,
    centerName: centers[id % centers.length],
    phone: `010-${String(1000 + id).slice(-4)}-${String(5000 + id).slice(-4)}`,
    assignedDongs,
    recipientCount: status === 'retired' ? 0 : 5 + Math.floor(Math.random() * 20),
    monthlyVisits: status === 'retired' ? 0 : Math.floor(Math.random() * 50) + 10,
    status,
  };
}

// 전체 매니저 데이터 생성 (고정 5명 + 랜덤 18명 = 23명)
export const mockManagers: Manager[] = [
  ...fixedManagers,
  ...Array.from({ length: 18 }, (_, i) => generateManager(i + 6)),
];

// ============================================================
// KPI 데이터
// ============================================================

export const managerKPIs: ManagerKPIs = {
  total: 23,
  active: 18,
  leave: 3,
  retired: 2,
};

// ============================================================
// 동 옵션
// ============================================================

export const managerDongOptions = [
  { value: 'all', label: '전체' },
  ...dongs.map((dong) => ({ value: dong, label: dong })),
];

// ============================================================
// 센터 옵션
// ============================================================

export const centerOptions = [
  { value: 'all', label: '전체' },
  ...centers.map((center) => ({ value: center, label: center })),
];

// ============================================================
// 필터링 함수
// ============================================================

export function filterManagers(managers: Manager[], filters: ManagerFilters): Manager[] {
  return managers.filter((manager) => {
    // 상태 필터
    if (filters.status !== 'all' && manager.status !== filters.status) {
      return false;
    }

    // 검색어 필터 (이름)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!manager.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // 담당 동 필터
    if (filters.dong !== 'all' && !manager.assignedDongs.includes(filters.dong)) {
      return false;
    }

    // 소속 센터 필터
    if (filters.center !== 'all' && manager.centerName !== filters.center) {
      return false;
    }

    return true;
  });
}

// ============================================================
// 상태별 카운트 계산
// ============================================================

export function getManagerStatusCounts(
  managers: Manager[]
): Record<ManagerStatus | 'all', number> {
  const counts: Record<ManagerStatus | 'all', number> = {
    all: managers.length,
    active: 0,
    leave: 0,
    retired: 0,
  };

  for (const manager of managers) {
    counts[manager.status]++;
  }

  return counts;
}

// ============================================================
// 매니저 목록 가져오기 (Mock API)
// ============================================================

export function getManagers(filters: ManagerFilters): Promise<{
  managers: Manager[];
  totalCount: number;
  statusCounts: Record<ManagerStatus | 'all', number>;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredManagers = filterManagers(mockManagers, filters);
      const statusCounts = getManagerStatusCounts(mockManagers);

      resolve({
        managers: filteredManagers,
        totalCount: filteredManagers.length,
        statusCounts,
      });
    }, 200);
  });
}

// ============================================================
// 매니저 KPI 가져오기 (Mock API)
// ============================================================

export function getManagerKPIs(): Promise<ManagerKPIs> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(managerKPIs);
    }, 100);
  });
}

// ============================================================
// 매니저 상세 데이터 생성 (확장 버전)
// ============================================================

function generateManagerDetailExtended(manager: Manager): ManagerDetailExtended {
  const recentReports: ManagerReport[] = Array.from({ length: 5 }, (_, i) => {
    const statuses: ReportStatus[] = ['pending', 'approved', 'approved', 'approved', 'rejected'];
    const daysAgo = i * 2;
    return {
      id: `report-${manager.id}-${i + 1}`,
      recipientId: `rec-${String(i + 1).padStart(4, '0')}`,
      recipientName: recipientNames[i % recipientNames.length],
      visitDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo),
      registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo + 1000 * 60 * 30),
      status: statuses[i],
    };
  });

  const recentVisits: ManagerVisit[] = Array.from({ length: 5 }, (_, i) => {
    const types: ManagerVisitType[] = ['regular', 'regular', 'emergency', 'call', 'regular'];
    const daysAgo = i * 2;
    return {
      id: `visit-${manager.id}-${i + 1}`,
      recipientId: `rec-${String(i + 1).padStart(4, '0')}`,
      recipientName: recipientNames[i % recipientNames.length],
      visitDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo),
      visitType: types[i],
      result: i === 2 ? '긴급 상황 발생으로 응급 조치 완료' : '정상 방문 완료, 특이사항 없음',
    };
  });

  // 담당 대상자 목록 생성
  const assignedRecipients: ManagerAssignedRecipient[] = Array.from(
    { length: manager.recipientCount },
    (_, i) => {
      const genders: Gender[] = ['female', 'female', 'male', 'female', 'female'];
      const monthsAgo = 3 + (i % 12);
      const careStartDate = new Date();
      careStartDate.setMonth(careStartDate.getMonth() - monthsAgo);

      return {
        id: `rec-${manager.id}-${String(i + 1).padStart(4, '0')}`,
        name: recipientNames[i % recipientNames.length].replace(' 어르신', ''),
        gender: genders[i % genders.length],
        dong: manager.assignedDongs[i % manager.assignedDongs.length],
        careStartDate,
        lastVisitDate: i < 5 ? new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 1)) : null,
        isUrgent: i === 2,
      };
    }
  );

  // 월별 활동 데이터 생성 (최근 12개월) - 누적 막대 차트용
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const now = new Date();
  const monthlyActivities: ManagerMonthlyActivity[] = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (now.getMonth() - 11 + i + 12) % 12;
    // 정기 방문 (가장 많음)
    const regularVisits = i === 11
      ? Math.floor(manager.monthlyVisits * 0.7)
      : 20 + Math.floor(Math.random() * 15);
    // 긴급 방문 (적음)
    const emergencyVisits = i === 11
      ? Math.floor(manager.monthlyVisits * 0.1)
      : 2 + Math.floor(Math.random() * 4);
    // 전화 상담
    const callConsults = i === 11
      ? Math.floor(manager.monthlyVisits * 0.2)
      : 8 + Math.floor(Math.random() * 8);

    return {
      month: monthNames[monthIndex],
      regularVisits,
      emergencyVisits,
      callConsults,
    };
  });

  // 보고서 현황 카운트
  const reportCounts: ManagerReportCounts = {
    approved: 42,
    pending: 3,
    rejected: 2,
  };

  return {
    ...manager,
    email: `${manager.name.replace(/\s/g, '').toLowerCase()}@safehi.kr`,
    startDate: new Date('2023-03-15'),
    stats: {
      monthlyVisits: manager.monthlyVisits,
      monthlyReports: Math.floor(manager.monthlyVisits * 0.9),
      approvalRate: 85 + Math.floor(Math.random() * 15),
      totalRecipients: manager.recipientCount,
    },
    recentReports,
    recentVisits,
    totalVisits: 245 + Math.floor(Math.random() * 100),
    reportCounts,
    assignedRecipients,
    monthlyActivities,
  };
}

// ============================================================
// 매니저 상세 가져오기 (Mock API) - 확장 버전
// ============================================================

export function getManagerDetail(id: string): Promise<ManagerDetailExtended | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const manager = mockManagers.find((m) => m.id === id);
      if (manager) {
        resolve(generateManagerDetailExtended(manager));
      } else {
        resolve(null);
      }
    }, 200);
  });
}

// ============================================================
// 매니저 보고서 목록 가져오기 (Mock API)
// ============================================================

export function getManagerReports(
  managerId: string,
  filters: {
    status: ReportStatus | 'all';
    dateRange: { start: Date | null; end: Date | null };
  }
): Promise<{
  reports: ManagerReport[];
  totalCount: number;
  statusCounts: Record<ReportStatus | 'all', number>;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 30개의 보고서 생성
      const allReports: ManagerReport[] = Array.from({ length: 30 }, (_, i) => {
        const statuses: ReportStatus[] = ['pending', 'approved', 'approved', 'approved', 'rejected'];
        const daysAgo = i;
        return {
          id: `report-${managerId}-${i + 1}`,
          recipientId: `rec-${String((i % 10) + 1).padStart(4, '0')}`,
          recipientName: recipientNames[i % recipientNames.length],
          visitDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo),
          registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo + 1000 * 60 * 30),
          status: statuses[i % statuses.length],
        };
      });

      // 필터링
      let filtered = allReports;

      if (filters.status !== 'all') {
        filtered = filtered.filter((r) => r.status === filters.status);
      }

      if (filters.dateRange.start) {
        filtered = filtered.filter((r) => r.visitDate >= filters.dateRange.start!);
      }

      if (filters.dateRange.end) {
        filtered = filtered.filter((r) => r.visitDate <= filters.dateRange.end!);
      }

      // 상태별 카운트
      const statusCounts: Record<ReportStatus | 'all', number> = {
        all: allReports.length,
        pending: allReports.filter((r) => r.status === 'pending').length,
        approved: allReports.filter((r) => r.status === 'approved').length,
        rejected: allReports.filter((r) => r.status === 'rejected').length,
      };

      resolve({
        reports: filtered,
        totalCount: filtered.length,
        statusCounts,
      });
    }, 200);
  });
}

// ============================================================
// 매니저 방문 기록 목록 가져오기 (Mock API)
// ============================================================

export function getManagerVisits(
  managerId: string,
  filters: {
    visitType: ManagerVisitType | 'all';
    search: string;
    dateRange: { start: Date | null; end: Date | null };
  }
): Promise<{
  visits: ManagerVisit[];
  totalCount: number;
  typeCounts: Record<ManagerVisitType | 'all', number>;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 40개의 방문 기록 생성
      const allVisits: ManagerVisit[] = Array.from({ length: 40 }, (_, i) => {
        const types: ManagerVisitType[] = ['regular', 'regular', 'regular', 'emergency', 'call'];
        const daysAgo = Math.floor(i / 2);
        const type = types[i % types.length];
        return {
          id: `visit-${managerId}-${i + 1}`,
          recipientId: `rec-${String((i % 10) + 1).padStart(4, '0')}`,
          recipientName: recipientNames[i % recipientNames.length],
          visitDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo),
          visitType: type,
          result:
            type === 'emergency'
              ? '긴급 상황 발생으로 응급 조치 완료'
              : type === 'call'
                ? '전화 상담 완료, 건강 상태 확인'
                : '정상 방문 완료, 특이사항 없음',
        };
      });

      // 필터링
      let filtered = allVisits;

      if (filters.visitType !== 'all') {
        filtered = filtered.filter((v) => v.visitType === filters.visitType);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter((v) =>
          v.recipientName.toLowerCase().includes(searchLower)
        );
      }

      if (filters.dateRange.start) {
        filtered = filtered.filter((v) => v.visitDate >= filters.dateRange.start!);
      }

      if (filters.dateRange.end) {
        filtered = filtered.filter((v) => v.visitDate <= filters.dateRange.end!);
      }

      // 유형별 카운트
      const typeCounts: Record<ManagerVisitType | 'all', number> = {
        all: allVisits.length,
        regular: allVisits.filter((v) => v.visitType === 'regular').length,
        emergency: allVisits.filter((v) => v.visitType === 'emergency').length,
        call: allVisits.filter((v) => v.visitType === 'call').length,
      };

      resolve({
        visits: filtered,
        totalCount: filtered.length,
        typeCounts,
      });
    }, 200);
  });
}
