// ============================================================
// 관리자 대시보드 타입 정의
// specs/002-admin-dashboard/data-model.md 기반
// ============================================================

// ============================================================
// KPI 관련 타입
// ============================================================

/** KPI 카드 프로그레스 바 색상 */
export type KPIProgressColor = 'blue' | 'yellow' | 'purple' | 'green';

/** 증감 방향 */
export type ChangeDirection = 'up' | 'down' | 'none';

/** 개별 KPI 카드 데이터 */
export interface KPICard {
  title: string;
  value: number;
  change: number;
  changeDirection: ChangeDirection;
  progressColor: KPIProgressColor;
  progressPercent?: number;
}

/** 대시보드 홈의 KPI 데이터 */
export interface DashboardKPI {
  todayVisits: KPICard;
  pendingReports: KPICard;
  approvedCount: KPICard;
  totalRecipients: KPICard;
}

// ============================================================
// 돌봄 일지(CareLog) 관련 타입
// ============================================================

/** 돌봄 일지 상태 */
export type CareLogStatus = 'pending' | 'urgent' | 'approved' | 'rejected';

/** 돌봄 일지 데이터 */
export interface CareLog {
  id: string;
  recipientName: string;
  managerName: string;
  centerName: string;
  visitDate: Date;
  registeredAt: Date;
  status: CareLogStatus;
}

/** 돌봄 일지 상태별 한글 레이블 */
export const careLogStatusLabels: Record<CareLogStatus, string> = {
  pending: '대기',
  urgent: '긴급',
  approved: '승인',
  rejected: '반려',
};

/** 돌봄 일지 필터 상태 */
export interface CareLogFilters {
  status: CareLogStatus | 'all';
  search: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  dong: string | 'all';
}

// ============================================================
// 대상자(Recipient) 관련 타입
// ============================================================

/** 대상자 상태 */
export type RecipientStatus = 'normal' | 'caution' | 'urgent' | 'unvisited';

/** 성별 */
export type Gender = 'male' | 'female';

/** 대상자 데이터 */
export interface Recipient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  dong: string;
  address: string;
  managerName: string;
  lastVisitDate: Date | null;
  visitCount: number;
  status: RecipientStatus;
}

/** 대상자 상태별 한글 레이블 */
export const recipientStatusLabels: Record<RecipientStatus, string> = {
  normal: '정상',
  caution: '주의',
  urgent: '긴급',
  unvisited: '미방문',
};

/** 대상자 필터 상태 */
export interface RecipientFilters {
  status: RecipientStatus | 'all';
  search: string;
  dong: string | 'all';
  manager: string | 'all';
}

// ============================================================
// 알림(Notification) 관련 타입
// ============================================================

/** 알림 아이콘 타입 */
export type NotificationIcon = 'warning' | 'info' | 'success' | 'report';

/** 알림 데이터 */
export interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isUrgent: boolean;
  link?: string;
  icon?: NotificationIcon;
}

// ============================================================
// 최근 보고서(RecentReport) 관련 타입
// ============================================================

/** 최근 보고서 요약 데이터 */
export interface RecentReport {
  id: string;
  recipientName: string;
  managerName: string;
  registeredAt: Date;
  status: CareLogStatus;
  isUrgent: boolean;
}

// ============================================================
// 사이드바 사용자 정보 타입
// ============================================================

/** 사용자 역할 */
export type AdminRole = 'admin' | 'manager';

/** 관할 구역 정보 */
export interface Jurisdiction {
  region: string;
  dongCount: number;
  centerCount: number;
}

/** 사이드바 사용자 정보 */
export interface SidebarUser {
  name: string;
  organizationName: string;
  role: AdminRole;
  roleLabel: string;
  jurisdiction: Jurisdiction;
}

// ============================================================
// 페이지네이션(Pagination) 관련 타입
// ============================================================

/** 페이지네이션 상태 */
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** 페이지당 옵션 */
export const pageSizeOptions = [10, 20, 50, 100] as const;
export type PageSize = (typeof pageSizeOptions)[number];

// ============================================================
// 선택(Selection) 관련 타입
// ============================================================

/** 체크박스 선택 상태 */
export interface SelectionState {
  selectedIds: Set<string>;
  isAllSelected: boolean;
}

// ============================================================
// 사이드바 네비게이션 타입
// ============================================================

/** 사이드바 메뉴 아이템 */
export interface SidebarMenuItem {
  id: string;
  label: string;
  href: string;
  icon: 'dashboard' | 'document' | 'users' | 'briefcase' | 'chart' | 'settings';
  badge?: number;
}

/** 사이드바 메뉴 그룹 */
export interface SidebarMenuGroup {
  title?: string;
  items: SidebarMenuItem[];
}

// ============================================================
// 테이블 관련 타입
// ============================================================

/** 정렬 방향 */
export type SortDirection = 'asc' | 'desc' | null;

/** 테이블 컬럼 정의 */
export interface TableColumn<T> {
  id: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
}

/** 정렬 상태 */
export interface SortState {
  column: string | null;
  direction: SortDirection;
}

// ============================================================
// 일괄 처리(Bulk Action) 관련 타입
// ============================================================

/** 일괄 처리 액션 타입 */
export type BulkActionType = 'approve' | 'reject';

/** 일괄 처리 결과 */
export interface BulkActionResult {
  success: boolean;
  processedCount: number;
  failedCount: number;
  message: string;
}

// ============================================================
// 내보내기(Export) 관련 타입
// ============================================================

/** 내보내기 형식 */
export type ExportFormat = 'excel' | 'pdf';

/** 대상자 Excel 내보내기 데이터 */
export interface RecipientExportData {
  '대상자 이름': string;
  '주소': string;
  '담당 매니저': string;
  '최근 방문': string;
  '방문 횟수': number;
  '상태': string;
}

// ============================================================
// 상세 페이지 타입 정의
// specs/002-admin-dashboard/data-model-detail-pages.md 기반
// ============================================================

/** 방문 유형 */
export type VisitType = 'visit' | 'call';

/** 돌봄 상태 레벨 */
export type CareConditionStatus = 'good' | 'normal' | 'warning' | 'bad';

/** 돌봄 상태 */
export interface CareCondition {
  status: CareConditionStatus;
  label: string;
  description?: string;
}

/** 돌봄 상태별 한글 레이블 */
export const careConditionLabels: Record<CareConditionStatus, string> = {
  good: '양호',
  normal: '보통',
  warning: '주의 필요',
  bad: '위험',
};

/** 방문 유형별 한글 레이블 */
export const visitTypeLabels: Record<VisitType, string> = {
  visit: '방문',
  call: '전화',
};

/** 돌봄 일지 상세 */
export interface CareLogDetail {
  id: string;
  recipientId: string;
  recipientName: string;
  status: CareLogStatus;
  createdAt: Date;
  visitInfo: {
    visitDate: Date;
    visitType: VisitType;
    managerName: string;
    centerName: string;
  };
  careContent: {
    healthStatus: CareCondition;
    mealStatus: CareCondition;
    emotionalStatus: CareCondition;
    livingEnvironment: CareCondition;
  };
  notes: string;
  photos: string[];
  rejectionReason?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
}

/** 방문 요약 */
export interface VisitSummary {
  id: string;
  careLogId: string;
  visitDate: Date;
  visitType: VisitType;
  managerName: string;
  summary: string;
}

/** 대상자 상세 */
export interface RecipientDetail {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  status: RecipientStatus;
  basicInfo: {
    address: string;
    dong: string;
    phone: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  manager: {
    id: string;
    name: string;
    phone: string;
    centerName: string;
  };
  healthInfo: {
    diseases: string[];
    medications: string[];
    notes: string;
  };
  recentVisits: VisitSummary[];
}

/** 담당자 메모 */
export interface Memo {
  id: string;
  recipientId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

/** 방문 기록 */
export interface Visit {
  id: string;
  recipientId: string;
  careLogId: string;
  visitDate: Date;
  visitType: VisitType;
  managerName: string;
  summary: string;
}

/** 방문 기록 필터 */
export interface VisitFilters {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

/** 복지 정책 */
export interface Policy {
  id: string;
  name: string;
  summary: string;
  matchScore: number;
  applicationMethod: string;
  details: {
    description: string;
    eligibility: string[];
    benefits: string[];
    documents: string[];
    contactInfo: string;
  };
}

/** 승인/반려 응답 */
export interface ApprovalResponse {
  success: boolean;
  careLogId: string;
  newStatus: CareLogStatus;
  processedAt: Date;
  processedBy: string;
}

// ============================================================
// 피드백 관련 타입
// ============================================================

/** 피드백 */
export interface Feedback {
  id: string;
  careLogId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: Date;
  isReply?: boolean;
}

// ============================================================
// 필요 조치사항 타입
// ============================================================

/** 조치사항 우선순위 */
export type ActionPriority = 'urgent' | 'warning' | 'normal';

/** 필요 조치사항 */
export interface RequiredAction {
  id: string;
  priority: ActionPriority;
  content: string;
}

// ============================================================
// 복지 정책 추천 타입
// ============================================================

/** 추천 복지 정책 */
export interface RecommendedPolicy {
  id: string;
  name: string;
  organization: string;
  schedule: string;
}

// ============================================================
// 돌봄 일지 상세 확장 타입
// ============================================================

/** 돌봄 내용 텍스트 블록 */
export interface CareContentBlock {
  title: string;
  content: string;
}

/** 돌봄 일지 상세 확장 (Figma 기준) */
export interface CareLogDetailExtended extends CareLogDetail {
  visitLocation?: string;
  careContentBlocks?: CareContentBlock[];
  requiredActions?: RequiredAction[];
  recommendedPolicies?: RecommendedPolicy[];
  feedbacks?: Feedback[];
}

// ============================================================
// 대상자 상세 확장 타입 (Figma 기준)
// ============================================================

/** 대상자 KPI 통계 */
export interface RecipientKPI {
  monthlyVisits: number;
  totalVisits: number;
  totalReports: number;
  urgentHistory: number;
}

/** 긴급 알림 정보 */
export interface UrgentAlert {
  message: string;
  detail: string;
  createdAt: Date;
}

/** 담당자 메모 확장 */
export interface MemoExtended extends Memo {
  type: 'warning' | 'normal';
}

/** 월별 방문 현황 */
export interface MonthlyVisitStat {
  month: string;
  count: number;
}

/** AI 정책 추천 (간략) */
export interface PolicyRecommendation {
  id: string;
  name: string;
  description: string;
  icon: 'health' | 'safety' | 'welfare' | 'support';
  badge: '적합' | '추천';
}

/** 대상자 상세 확장 (Figma 기준) */
export interface RecipientDetailExtended extends RecipientDetail {
  careStartDate?: Date;
  kpi?: RecipientKPI;
  urgentAlert?: UrgentAlert;
  memos?: MemoExtended[];
  monthlyVisits?: MonthlyVisitStat[];
  policyRecommendations?: PolicyRecommendation[];
}

// ============================================================
// 매니저(Manager) 관련 타입
// specs/002-admin-dashboard/data-model-manager-pages.md 기반
// ============================================================

/** 매니저 근무 상태 */
export type ManagerStatus = 'active' | 'leave' | 'retired';

/** 매니저 방문 유형 */
export type ManagerVisitType = 'regular' | 'emergency' | 'call';

/** 보고서 상태 (CareLogStatus에서 urgent 제외) */
export type ReportStatus = 'pending' | 'approved' | 'rejected';

/** 매니저 데이터 (목록용) */
export interface Manager {
  id: string;
  name: string;
  gender: Gender;
  centerName: string;
  phone: string;
  assignedDongs: string[];
  recipientCount: number;
  monthlyVisits: number;
  status: ManagerStatus;
}

/** 매니저 상세 데이터 */
export interface ManagerDetail extends Manager {
  email: string;
  startDate: Date;
  stats: {
    monthlyVisits: number;
    monthlyReports: number;
    approvalRate: number;
    totalRecipients: number;
  };
  recentReports: ManagerReport[];
  recentVisits: ManagerVisit[];
}

/** 매니저 보고서 */
export interface ManagerReport {
  id: string;
  recipientId: string;
  recipientName: string;
  visitDate: Date;
  registeredAt: Date;
  status: ReportStatus;
}

/** 매니저 방문 기록 */
export interface ManagerVisit {
  id: string;
  recipientId: string;
  recipientName: string;
  visitDate: Date;
  visitType: ManagerVisitType;
  result: string;
}

/** 매니저 필터 상태 */
export interface ManagerFilters {
  status: ManagerStatus | 'all';
  search: string;
  dong: string | 'all';
  center: string | 'all';
}

/** 매니저 보고서 필터 */
export interface ManagerReportFilters {
  status: ReportStatus | 'all';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

/** 매니저 방문 기록 필터 */
export interface ManagerVisitFilters {
  visitType: ManagerVisitType | 'all';
  search: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

/** 매니저 KPI */
export interface ManagerKPIs {
  total: number;
  active: number;
  leave: number;
  retired: number;
}

/** 매니저 Excel 내보내기 데이터 */
export interface ManagerExportData {
  '매니저명': string;
  '소속 센터': string;
  '담당 동': string;
  '담당 대상자 수': number;
  '이번 달 방문': number;
  '상태': string;
}

// ============================================================
// 방문 기록 확장 타입 (피그마 기준)
// ============================================================

/** 확장된 방문 유형 (긴급 포함) */
export type ExtendedVisitType = 'regular' | 'emergency' | 'call';

/** 방문 기록 확장 (피그마 기준) */
export interface VisitExtended {
  id: string;
  recipientId: string;
  careLogId: string;
  visitDate: Date;
  visitType: ExtendedVisitType;
  managerName: string;
  managerCenter: string;
  summary: string;
  duration: number; // 소요 시간 (분)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

/** 방문 기록 통계 */
export interface VisitStats {
  totalVisits: number;
  monthlyVisits: number;
  monthlyChange: number; // 전월 대비 변화율 (%)
  emergencyVisits: number;
  avgDuration: number; // 평균 방문 시간 (분)
}

/** 방문 기록 필터 확장 */
export interface VisitFiltersExtended {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  manager: string | 'all';
  visitType: ExtendedVisitType | 'all';
}

// ============================================================
// 담당자 메모 확장 타입 (피그마 기준)
// ============================================================

/** 메모 유형 */
export type MemoType = 'warning' | 'normal';

/** 담당자 메모 확장 */
export interface MemoExtendedFull {
  id: string;
  recipientId: string;
  authorId: string;
  authorName: string;
  authorCenter: string;
  title: string;
  content: string;
  type: MemoType;
  createdAt: Date;
}

/** 메모 통계 */
export interface MemoStats {
  totalMemos: number;
  warningMemos: number;
  normalMemos: number;
  authorCount: number;
}

/** 메모 필터 */
export interface MemoFilters {
  search: string;
  type: MemoType | 'all';
  author: string | 'all';
}

// ============================================================
// AI 복지 정책 추천 확장 타입 (피그마 기준)
// ============================================================

/** 정책 뱃지 타입 */
export type PolicyBadgeType = 'best' | 'recommended';

/** 정책 아이콘 타입 */
export type PolicyIconType = 'health' | 'safety' | 'nutrition' | 'exercise' | 'care';

/** AI 분석 조건 */
export interface AIAnalysisCondition {
  age: number;
  gender: Gender;
  livingStatus: string; // 독거, 부부 등
  healthConditions: string[]; // 고혈압, 당뇨 등
}

/** 정책 혜택 */
export interface PolicyBenefit {
  icon: string;
  text: string;
}

/** 확장된 복지 정책 */
export interface PolicyExtended {
  id: string;
  name: string;
  summary: string;
  matchScore: number;
  badge: PolicyBadgeType | null;
  icon: PolicyIconType;
  benefits: PolicyBenefit[];
  organization: string;
  applicationPeriod: string;
  applicationMethod: string;
  details: {
    description: string;
    eligibility: string[];
    documents: string[];
    contactInfo: string;
  };
}

/** AI 분석 결과 */
export interface AIAnalysisResult {
  condition: AIAnalysisCondition;
  healthSummary: string;
  policyCount: number;
  lastAnalyzedAt: Date;
}

// ============================================================
// 매니저 상세 확장 타입 (피그마 기준)
// ============================================================

/** 매니저 담당 대상자 */
export interface ManagerAssignedRecipient {
  id: string;
  name: string;
  gender: Gender;
  dong: string;
  careStartDate: Date;
  lastVisitDate: Date | null;
  isUrgent: boolean;
}

/** 월별 활동 통계 (누적 막대 차트용) */
export interface ManagerMonthlyActivity {
  month: string;
  regularVisits: number;   // 정기 방문
  emergencyVisits: number; // 긴급 방문
  callConsults: number;    // 전화 상담
}

/** 보고서 현황 카운트 */
export interface ManagerReportCounts {
  approved: number;
  pending: number;
  rejected: number;
}

/** 매니저 상세 확장 */
export interface ManagerDetailExtended extends ManagerDetail {
  totalVisits: number;
  reportCounts: ManagerReportCounts;
  assignedRecipients: ManagerAssignedRecipient[];
  monthlyActivities: ManagerMonthlyActivity[];
}
