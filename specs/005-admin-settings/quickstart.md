# Quickstart: 설정 페이지 (Admin Settings)

**Feature**: 005-admin-settings
**Date**: 2026-02-19

## 구현 순서 요약

```
1. 타입 정의 (types/settings.ts)
2. Mock 데이터 (lib/mock-data/settings.ts)
3. Toggle UI 컴포넌트 (components/ui/Toggle.tsx)
4. Zustand 훅 (hooks/useSettings.ts)
5. 피처 컴포넌트 6개 (components/features/settings/)
6. 설정 페이지 조합 (app/(admin)/settings/page.tsx)
7. 사이드바 메뉴 추가 (lib/utils/sidebar-defaults.ts)
8. 테스트 작성
```

## 빠른 시작

### 1단계: 타입 정의

`src/types/settings.ts` 생성 — data-model.md의 엔티티를 TypeScript 인터페이스로 변환.

```typescript
// UserProfile, NotificationSettings, SystemSettings,
// JurisdictionInfo, PasswordChangeRequest, SettingsState
```

### 2단계: Mock 데이터

`src/lib/mock-data/settings.ts` 생성 — contracts/settings-api.md의 Mock 함수 구현.

```typescript
// getSettings(), updateProfile(), updateNotifications(),
// updateSystemSettings(), changePassword()
// 각 함수는 300~500ms 지연 포함
```

### 3단계: Toggle 컴포넌트

`src/components/ui/Toggle.tsx` 생성 — 알림/시스템 설정용 토글 스위치.

**핵심 요구사항**:
- `<input type="checkbox" role="switch">` 접근성 패턴
- ON: `bg-blue-500` (#3b82f6), OFF: `bg-slate-200` (#e2e8f0)
- 최소 터치 영역 44x44px
- label, description props 지원
- 기존 컴포넌트 패턴(forwardRef, cn 유틸) 준수

### 4단계: Zustand 훅

`src/hooks/useSettings.ts` 생성 — useAuth 패턴 참조.

**핵심 요구사항**:
- Zustand + persist middleware
- getSettings → 초기 데이터 로드
- updateNotification → 개별 토글 변경 (optimistic update)
- updateSystemSetting → 시스템 설정 변경
- updateProfile → 프로필 필드 변경
- editingField 상태 관리

### 5단계: 피처 컴포넌트

`src/components/features/settings/` 아래 6개 컴포넌트 생성:

| 컴포넌트 | 재사용 UI | 주요 기능 |
|----------|-----------|-----------|
| ProfileSection | Card, Badge | 이니셜 아바타, 프로필 정보 표시, 수정 버튼 |
| AccountInfoSection | Card, Input, Button | 4필드 인라인 편집, 개별 변경 버튼 |
| NotificationSection | Card, Toggle | 4개 토글, 푸시 알림 배너 |
| SystemSettingsSection | Card, Select, Toggle | 드롭다운 2개, 토글 2개 |
| JurisdictionSection | Card, Button | 기관 정보, 통계 카드 3개, 동 목록 |
| AccountManagementSection | Card, Button, Modal | 로그아웃/비번변경/문의 3개 액션 |

**레이아웃 배치** (피그마 기준):
```
[PageHeader: "설정"]

[ProfileSection (좌)] [AccountInfoSection (우)]   ← grid-cols-2

[NotificationSection (전체 폭)]                     ← col-span-full

[SystemSettingsSection (좌)] [JurisdictionSection (우)] ← grid-cols-2

[AccountManagementSection (전체 폭, 빨간 테두리)]   ← col-span-full

[Footer]
```

### 6단계: 페이지 조합

`src/app/(admin)/settings/page.tsx` — dashboard/page.tsx 패턴 그대로 따름.

```typescript
'use client';
// 1. useAuth() → 인증 확인 + 리다이렉트
// 2. useSettings() → 설정 데이터 로드
// 3. PageHeader title="설정" description="계정, 알림, 시스템 설정을 관리합니다"
// 4. flex-1 overflow-y-auto p-6 > max-w-7xl mx-auto
// 5. 섹션 컴포넌트 배치 (grid layout)
// 6. Footer
```

### 7단계: 사이드바 메뉴 추가

`src/lib/utils/sidebar-defaults.ts`에 항목 추가:

```typescript
{ id: 'statistics', label: '통계/리포트', href: '/statistics', icon: 'chart' },
{ id: 'settings', label: '설정', href: '/settings', icon: 'settings' },
```

### 8단계: 테스트

Vitest + Testing Library로 각 컴포넌트와 훅 테스트 작성.

**우선순위**:
1. Toggle 컴포넌트 유닛 테스트
2. useSettings 훅 테스트
3. 각 섹션 컴포넌트 렌더링 + 인터랙션 테스트
4. 설정 페이지 통합 테스트

## 기존 코드 참조

| 참조 대상 | 파일 경로 | 참조 이유 |
|-----------|-----------|-----------|
| 페이지 패턴 | `src/app/(admin)/dashboard/page.tsx` | useAuth, 로딩, PageHeader 패턴 |
| Zustand 훅 | `src/hooks/useAuth.ts` | store + persist 패턴 |
| Card 컴포넌트 | `src/components/ui/Card.tsx` | variant, padding API |
| Button 컴포넌트 | `src/components/ui/Button.tsx` | variant (primary/secondary/danger), size |
| Input 컴포넌트 | `src/components/ui/Input.tsx` | label, error, rightElement API |
| Select 컴포넌트 | `src/components/ui/Select.tsx` | options, placeholder API |
| Badge 컴포넌트 | `src/components/ui/Badge.tsx` | variant (info) for 역할 배지 |
| Modal 컴포넌트 | `src/components/ui/Modal.tsx` | 비밀번호 변경 모달 |
| 사이드바 | `src/lib/utils/sidebar-defaults.ts` | 메뉴 항목 추가 |
| Tailwind 설정 | `tailwind.config.ts` | 색상, 간격, 모서리 토큰 |
| 글로벌 스타일 | `src/app/globals.css` | btn-*, input-field, form-* 클래스 |
