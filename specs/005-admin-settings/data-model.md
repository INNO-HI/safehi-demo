# Data Model: 설정 페이지 (Admin Settings)

**Feature**: 005-admin-settings
**Date**: 2026-02-19

## Entities

### UserProfile

관리자의 프로필 정보. 인증 시스템에서 제공하는 사용자 데이터와 연계.

| 필드 | 타입 | 설명 | 유효성 검사 |
|------|------|------|-------------|
| id | string | 고유 식별자 | 필수 |
| name | string | 이름 | 필수, 2~20자 |
| email | string | 이메일 | 필수, 이메일 형식 |
| phone | string | 전화번호 | 필수, 한국 전화번호 형식 |
| role | UserRole | 역할 | 'district_admin' \| 'manager' |
| roleLabel | string | 역할 표시명 | 예: "구/군 관리자" |
| createdAt | string | 가입일 | ISO 8601 형식 |
| avatarInitials | string | 이니셜 (이름 첫 2글자) | 자동 생성 |

**관계**: `JurisdictionInfo`와 1:1 관계 (관리자당 하나의 관할 구역)

---

### AccountInfo

계정 인증 정보. 프로필에서 파생되며 개별 필드 수정 가능.

| 필드 | 타입 | 설명 | 유효성 검사 |
|------|------|------|-------------|
| name | string | 이름 | 필수, 2~20자 |
| phone | string | 연락처 | 필수, 한국 전화번호 형식 (예: 02-XXXX-XXXX, 010-XXXX-XXXX) |
| email | string | 이메일 | 필수, 이메일 형식 |
| passwordMasked | string | 마스킹된 비밀번호 | 표시 전용 "●●●●●●●●" |

**상태 전이**: 각 필드는 `view` → `edit` → `saving` → `view` 상태를 가짐

---

### NotificationSettings

알림 환경설정. 4개 토글의 ON/OFF 상태.

| 필드 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| newReport | boolean | 새 보고서 알림 | true |
| urgentCase | boolean | 긴급 케이스 알림 | true |
| weeklyReport | boolean | 주간 리포트 알림 | true |
| emailNotification | boolean | 이메일 알림 | false |

**상태 전이**: 토글 클릭 시 `idle` → `saving` → `idle` (즉시 반영, 실패 시 롤백)

---

### SystemSettings

시스템 환경설정.

| 필드 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| language | string | 표시 언어 | 'ko' |
| timezone | string | 시간대 | 'Asia/Seoul' |
| darkMode | boolean | 다크 모드 | false |
| autoRefresh | boolean | 자동 새로고침 | true |

**제약**: 언어는 현재 'ko'만 지원. 다크 모드는 토글 UI만 제공 (실제 테마 미적용).

---

### JurisdictionInfo

관할 구역 정보. 읽기 전용.

| 필드 | 타입 | 설명 |
|------|------|------|
| organizationName | string | 기관명 (예: "서울특별시 양천구") |
| department | string | 부서 (예: "어르신복지과 · 돌봄 서비스팀") |
| dongCount | number | 담당 동 수 |
| centerCount | number | 복지센터 수 |
| managerCount | number | 소속 매니저 수 |
| dongList | string[] | 담당 동 목록 |

**관계**: `UserProfile`과 1:1 관계

---

### PasswordChangeRequest

비밀번호 변경 요청 데이터.

| 필드 | 타입 | 설명 | 유효성 검사 |
|------|------|------|-------------|
| currentPassword | string | 현재 비밀번호 | 필수 |
| newPassword | string | 새 비밀번호 | 필수, 8자 이상, 영문+숫자+특수문자 |
| confirmPassword | string | 새 비밀번호 확인 | 필수, newPassword와 일치 |

---

### SettingsState (통합 상태)

Zustand store의 전체 상태 구조.

| 필드 | 타입 | 설명 |
|------|------|------|
| profile | UserProfile | 프로필 정보 |
| notifications | NotificationSettings | 알림 설정 |
| system | SystemSettings | 시스템 설정 |
| jurisdiction | JurisdictionInfo | 관할 구역 |
| isLoading | boolean | 데이터 로딩 상태 |
| editingField | string \| null | 현재 편집 중인 계정 필드명 |

## 유효성 검사 규칙

### 이름
- 필수 입력
- 2자 이상, 20자 이하
- 공백만으로 구성 불가

### 이메일
- 필수 입력
- 이메일 형식 (xxx@xxx.xxx)

### 전화번호
- 필수 입력
- 한국 전화번호 형식: `0X-XXXX-XXXX` 또는 `0XX-XXX-XXXX` 또는 `0XX-XXXX-XXXX`
- 숫자와 하이픈만 허용

### 비밀번호
- 현재 비밀번호: 필수 입력
- 새 비밀번호: 8자 이상, 영문 + 숫자 + 특수문자 각 1개 이상 포함
- 비밀번호 확인: 새 비밀번호와 일치
