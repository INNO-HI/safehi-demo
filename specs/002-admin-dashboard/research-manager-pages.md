# Research: 매니저 관리 페이지

**Feature Branch**: `002-admin-dashboard`
**Date**: 2026-01-14
**Source**: spec-manager-pages.md

## Research Tasks

### 1. 기존 패턴 분석

#### 대상자 관리 페이지 패턴 분석

**목록 페이지 구조** (recipients/page.tsx):
- KPI 카드 + 상태 탭 + 테이블 + 페이지네이션
- useRecipients 훅으로 데이터/필터/페이지네이션/선택 통합 관리
- RecipientTable 컴포넌트로 테이블 렌더링

**상세 페이지 구조** (recipients/[id]/page.tsx):
- 헤더 (뒤로가기 + 제목 + 상태 배지)
- 2컬럼 레이아웃 (좌측: 프로필, AI 추천 / 우측: 돌봄 정보, 방문 기록, 메모)
- useRecipientDetail 훅으로 상세 데이터 관리

**Decision**: 매니저 관리 페이지도 동일한 패턴 적용

---

### 2. 매니저 상태 정의

**상태 종류 결정**:
- `active`: 근무 중
- `休無`: 휴무
- `retired`: 퇴직

**Rationale**: 대상자의 상태(normal/caution/urgent/unvisited)와 다르게, 매니저는 근무 상태가 핵심
**Alternatives considered**:
- 업무량 기반 상태 (과부하/적정/여유) → 복잡성 증가로 제외
- 온라인/오프라인 상태 → 실시간 추적 필요해서 제외

---

### 3. 매니저 Mock 데이터 구조

**목록용 데이터**:
```typescript
interface Manager {
  id: string;
  name: string;
  gender: Gender;
  centerName: string;         // 소속 센터
  phone: string;              // 연락처
  assignedDongs: string[];    // 담당 동 목록
  recipientCount: number;     // 담당 대상자 수
  monthlyVisits: number;      // 이번 달 방문 횟수
  status: ManagerStatus;      // 근무 상태
}
```

**상세용 확장 데이터**:
```typescript
interface ManagerDetail extends Manager {
  email: string;
  startDate: Date;            // 근무 시작일
  monthlyReports: number;     // 이번 달 보고서 수
  approvalRate: number;       // 승인률 (%)
  recentReports: ManagerReport[];   // 최근 5건 보고서
  recentVisits: ManagerVisit[];     // 최근 5건 방문 기록
}
```

**Decision**: 기존 Recipient 패턴과 유사하게 목록/상세 분리
**Rationale**: 목록에서는 최소 데이터만, 상세에서는 확장 데이터 로드

---

### 4. 매니저 보고서 데이터 구조

**매니저별 보고서** (기존 CareLog 재활용):
```typescript
interface ManagerReport {
  id: string;
  recipientName: string;      // 대상자명
  visitDate: Date;            // 방문일
  registeredAt: Date;         // 등록일
  status: CareLogStatus;      // 대기중/승인/반려
}
```

**Decision**: 기존 CareLog 타입 재사용, 매니저 ID로 필터링
**Rationale**: 새 타입 정의보다 기존 타입 재사용이 일관성 유지에 유리

---

### 5. 매니저 방문 기록 데이터 구조

**방문 유형 확장**:
```typescript
type ManagerVisitType = 'regular' | 'emergency' | 'call';
// 정기 방문, 긴급 방문, 전화 상담

interface ManagerVisit {
  id: string;
  recipientName: string;      // 대상자명
  visitDate: Date;            // 방문일
  visitType: ManagerVisitType;
  result: string;             // 방문 결과 요약
}
```

**Decision**: 기존 VisitType(visit/call)을 확장하여 regular/emergency/call로 세분화
**Rationale**: 긴급 방문 구분이 매니저 성과 평가에 중요

---

### 6. Excel 내보내기 확장

**매니저 내보내기 데이터**:
```typescript
interface ManagerExportData {
  '매니저명': string;
  '소속 센터': string;
  '담당 동': string;
  '담당 대상자 수': number;
  '이번 달 방문': number;
  '상태': string;
}
```

**Decision**: 기존 exportRecipientsToExcel 패턴 재사용, exportManagersToExcel 함수 추가
**Rationale**: 동일한 SheetJS 라이브러리와 패턴 사용

---

### 7. 아바타 색상 규칙

**성별 기반 색상** (기존 규칙 유지):
- 여성: `bg-pink-100 text-pink-700`
- 남성: `bg-blue-100 text-blue-700`

**Decision**: 대상자 관리와 동일한 성별 기반 아바타 색상 사용
**Rationale**: 사용자 학습 비용 최소화, 일관된 UX

---

## Summary

| 항목 | 결정 | 근거 |
|------|------|------|
| 페이지 구조 | 대상자 관리 패턴 재사용 | 일관된 UX, 개발 효율성 |
| 매니저 상태 | active/leave/retired | 근무 상태 중심 |
| 데이터 구조 | 목록/상세 분리 | 성능 최적화 |
| 보고서 데이터 | CareLog 재사용 | 타입 일관성 |
| 방문 유형 | regular/emergency/call | 성과 평가 세분화 |
| 내보내기 | 기존 패턴 확장 | 코드 재사용 |
| 아바타 색상 | 성별 기반 | UX 일관성 |
