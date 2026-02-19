# API Contracts: 설정 페이지 (Admin Settings)

**Feature**: 005-admin-settings
**Date**: 2026-02-19
**Status**: Mock 데이터 기반 (추후 REST API로 교체)

## 개요

현재 백엔드 API가 미구현 상태이므로, Mock 데이터 함수로 구현한다.
각 함수는 추후 실제 API 호출로 1:1 교체할 수 있도록 동일한 인터페이스를 유지한다.

## Endpoints (Mock → API)

### 1. 설정 전체 조회

```
GET /api/settings
```

**Mock 함수**: `getSettings(): Promise<SettingsData>`

**Response**:
```typescript
{
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'district_admin' | 'manager';
    roleLabel: string;
    createdAt: string;
    avatarInitials: string;
  };
  notifications: {
    newReport: boolean;
    urgentCase: boolean;
    weeklyReport: boolean;
    emailNotification: boolean;
  };
  system: {
    language: string;
    timezone: string;
    darkMode: boolean;
    autoRefresh: boolean;
  };
  jurisdiction: {
    organizationName: string;
    department: string;
    dongCount: number;
    centerCount: number;
    managerCount: number;
    dongList: string[];
  };
}
```

**Status Codes**: 200 OK, 401 Unauthorized

---

### 2. 프로필 수정

```
PATCH /api/settings/profile
```

**Mock 함수**: `updateProfile(data: Partial<UserProfile>): Promise<UserProfile>`

**Request Body**:
```typescript
{
  name?: string;
  phone?: string;
  email?: string;
}
```

**Response**: 업데이트된 UserProfile 객체

**Status Codes**: 200 OK, 400 Bad Request (유효성 검사 실패), 401 Unauthorized

**유효성 검사 오류 응답**:
```typescript
{
  error: string;
  field: string;
  message: string;
}
```

---

### 3. 알림 설정 변경

```
PATCH /api/settings/notifications
```

**Mock 함수**: `updateNotifications(key: string, value: boolean): Promise<NotificationSettings>`

**Request Body**:
```typescript
{
  [key: string]: boolean;
  // 예: { newReport: false }
}
```

**Response**: 업데이트된 NotificationSettings 객체

**Status Codes**: 200 OK, 401 Unauthorized

---

### 4. 시스템 설정 변경

```
PATCH /api/settings/system
```

**Mock 함수**: `updateSystemSettings(data: Partial<SystemSettings>): Promise<SystemSettings>`

**Request Body**:
```typescript
{
  language?: string;
  timezone?: string;
  darkMode?: boolean;
  autoRefresh?: boolean;
}
```

**Response**: 업데이트된 SystemSettings 객체

**Status Codes**: 200 OK, 401 Unauthorized

---

### 5. 비밀번호 변경

```
POST /api/settings/password
```

**Mock 함수**: `changePassword(data: PasswordChangeRequest): Promise<{ success: boolean }>`

**Request Body**:
```typescript
{
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

**Response**:
```typescript
{ success: true }
```

**Status Codes**: 200 OK, 400 Bad Request (현재 비밀번호 불일치, 유효성 실패), 401 Unauthorized

**오류 응답**:
```typescript
{
  error: 'INVALID_CURRENT_PASSWORD' | 'PASSWORD_TOO_WEAK' | 'PASSWORDS_NOT_MATCH';
  message: string;
}
```

---

### 6. 로그아웃

```
POST /api/auth/logout
```

**Mock 함수**: 기존 `logout()` 함수 재사용 (`src/lib/api/auth.ts`)

**Response**: 200 OK

---

## Mock 데이터 지연 시뮬레이션

모든 Mock 함수는 실제 API 응답 속도를 시뮬레이션하기 위해 300~500ms 지연을 포함한다.

```typescript
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

## API 교체 가이드

추후 백엔드 연동 시:
1. `src/lib/mock-data/settings.ts`의 Mock 함수를 `src/lib/api/settings.ts`로 교체
2. `useSettings` 훅에서 import 경로만 변경
3. 함수 시그니처(입력/출력 타입)는 동일하게 유지
