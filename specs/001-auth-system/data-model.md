# Data Model: SafeHi 인증 시스템

**Date**: 2026-01-05
**Feature**: 001-auth-system

## Entity Relationship Diagram

```text
┌─────────────┐       ┌──────────────────────┐       ┌──────────────┐
│    User     │       │ OrganizationMembership│       │ Organization │
├─────────────┤       ├──────────────────────┤       ├──────────────┤
│ id          │───┐   │ id                   │   ┌───│ id           │
│ name        │   │   │ userId               │───┘   │ name         │
│ email       │   └──>│ organizationId       │       │ regionId     │
│ password    │       │ status               │       │ address      │
│ phone       │       │ documentUrl          │       │ createdAt    │
│ role        │       │ memo                 │       └──────────────┘
│ emailVerified│      │ requestedAt          │              │
│ createdAt   │       │ approvedAt           │              │
│ lockedUntil │       └──────────────────────┘              │
└─────────────┘                                             │
                                                            │
┌─────────────┐       ┌─────────────┐                      │
│   Region    │       │   District  │                      │
├─────────────┤       ├─────────────┤                      │
│ id          │<──────│ id          │<─────────────────────┘
│ name        │       │ name        │
│ code        │       │ regionId    │
└─────────────┘       │ code        │
                      └─────────────┘
```

## Entities

### User (사용자)

시스템에 가입한 사용자 정보를 저장합니다.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, UUID | 사용자 고유 식별자 |
| name | string | required, 2-50자 | 사용자 이름 |
| email | string | required, unique, email format | 이메일 주소 (로그인 ID) |
| password | string | required, hashed | 비밀번호 (bcrypt 해시) |
| phone | string | required, 010-0000-0000 format | 연락처 |
| role | enum | default: 'user' | 역할 ('user', 'manager', 'admin') |
| emailVerified | boolean | default: false | 이메일 인증 완료 여부 |
| createdAt | datetime | auto | 가입일시 |
| updatedAt | datetime | auto | 수정일시 |
| lockedUntil | datetime | nullable | 계정 잠금 해제 시간 (5회 로그인 실패 시) |
| loginAttempts | number | default: 0 | 연속 로그인 실패 횟수 |

**Validation Rules**:
- 비밀번호: 8자 이상, 특수문자 1개 이상, 숫자 1개 이상
- 이메일: 고유해야 함
- 연락처: 한국 휴대폰 번호 형식

**State Transitions**:
- 가입 시: `emailVerified = false`
- 이메일 인증 완료: `emailVerified = true`
- 기관 인증 승인: `role = 'manager'`
- 로그인 5회 실패: `lockedUntil = now + 30분`, `loginAttempts = 0`
- 로그인 성공: `loginAttempts = 0`

---

### Organization (기관)

돌봄 기관 정보를 저장합니다.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, UUID | 기관 고유 식별자 |
| name | string | required | 기관명 |
| districtId | string | FK, required | 소속 구/군 |
| address | string | nullable | 기관 주소 |
| createdAt | datetime | auto | 등록일시 |

---

### OrganizationMembership (기관 소속)

사용자와 기관 간의 소속 관계 및 인증 상태를 관리합니다.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, UUID | 소속 고유 식별자 |
| userId | string | FK, required | 사용자 ID |
| organizationId | string | FK, required | 기관 ID |
| status | enum | required | 인증 상태 |
| documentUrl | string | nullable | 증빙 서류 URL |
| memo | string | nullable, max 500자 | 기타 메모 |
| requestedAt | datetime | auto | 인증 요청일시 |
| approvedAt | datetime | nullable | 승인일시 |
| rejectedAt | datetime | nullable | 반려일시 |
| rejectionReason | string | nullable | 반려 사유 |

**Status Enum**:
- `pending`: 승인 대기
- `approved`: 승인됨
- `rejected`: 반려됨

**State Transitions**:
- 인증 요청: `status = 'pending'`, `requestedAt = now`
- 관리자 승인: `status = 'approved'`, `approvedAt = now`
- 관리자 반려: `status = 'rejected'`, `rejectedAt = now`, `rejectionReason = '...'`

---

### Region (시/도)

한국 행정구역 시/도 정보를 저장합니다.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, UUID | 지역 고유 식별자 |
| name | string | required | 시/도 이름 (예: 서울특별시) |
| code | string | required, unique | 행정구역 코드 |

---

### District (구/군)

한국 행정구역 구/군 정보를 저장합니다.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, UUID | 구/군 고유 식별자 |
| regionId | string | FK, required | 소속 시/도 |
| name | string | required | 구/군 이름 (예: 양천구) |
| code | string | required, unique | 행정구역 코드 |

---

### PasswordResetToken (비밀번호 재설정 토큰)

비밀번호 재설정 링크에 사용되는 토큰을 저장합니다.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, UUID | 토큰 고유 식별자 |
| userId | string | FK, required | 사용자 ID |
| token | string | required, unique | 재설정 토큰 (해시) |
| expiresAt | datetime | required | 만료 시간 (생성 후 24시간) |
| usedAt | datetime | nullable | 사용 시간 |
| createdAt | datetime | auto | 생성일시 |

---

### EmailVerificationCode (이메일 인증 코드)

회원가입 시 이메일 인증에 사용되는 코드를 저장합니다.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | PK, UUID | 코드 고유 식별자 |
| email | string | required | 인증 대상 이메일 |
| code | string | required, 6자리 숫자 | 인증 코드 |
| expiresAt | datetime | required | 만료 시간 (생성 후 10분) |
| verifiedAt | datetime | nullable | 인증 완료 시간 |
| createdAt | datetime | auto | 생성일시 |

---

## TypeScript Types

```typescript
// types/auth.ts

export type UserRole = 'user' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lockedUntil?: Date;
}

export type MembershipStatus = 'pending' | 'approved' | 'rejected';

export interface OrganizationMembership {
  id: string;
  userId: string;
  organizationId: string;
  status: MembershipStatus;
  documentUrl?: string;
  memo?: string;
  requestedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export interface Organization {
  id: string;
  name: string;
  districtId: string;
  address?: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  regionId: string;
  name: string;
  code: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  emailVerified: boolean;
  password: string;
  passwordConfirm: string;
  phone: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  passwordConfirm: string;
}

export interface OrganizationVerifyFormData {
  regionId: string;
  districtId: string;
  organizationId: string;
  document?: File;
  memo?: string;
}
```

## Seed Data (Development)

### Regions
```json
[
  { "id": "region-1", "name": "서울특별시", "code": "11" },
  { "id": "region-2", "name": "부산광역시", "code": "26" },
  { "id": "region-3", "name": "경기도", "code": "41" }
]
```

### Districts (서울특별시)
```json
[
  { "id": "district-1", "regionId": "region-1", "name": "양천구", "code": "11150" },
  { "id": "district-2", "regionId": "region-1", "name": "강서구", "code": "11160" },
  { "id": "district-3", "regionId": "region-1", "name": "영등포구", "code": "11180" }
]
```

### Organizations (양천구)
```json
[
  { "id": "org-1", "name": "목동종합사회복지관", "districtId": "district-1", "address": "서울시 양천구 목동로 123" },
  { "id": "org-2", "name": "양천노인복지관", "districtId": "district-1", "address": "서울시 양천구 신정로 456" }
]
```

### Test Users
```json
[
  {
    "id": "user-1",
    "name": "테스트 사용자",
    "email": "test@example.com",
    "password": "Test1234!",
    "phone": "010-1234-5678",
    "role": "user",
    "emailVerified": true
  }
]
```
