# Implementation Plan: SafeHi 인증 시스템

**Branch**: `001-auth-system` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-auth-system/spec.md`

## Summary

SafeHi 돌봄 관리 시스템의 인증 시스템을 구현합니다. 로그인, 회원가입, 비밀번호 찾기, 기관 인증 4개 페이지를 Next.js 14 App Router와 TypeScript, Tailwind CSS를 사용하여 구현합니다. 디자인 시안을 기반으로 중앙 정렬 카드 레이아웃, 실시간 유효성 검증, 이메일 인증 흐름을 제공합니다.

## Technical Context

**Language/Version**: TypeScript 5.x + Next.js 14 (App Router)
**Primary Dependencies**:
- React Hook Form + Zod (폼 유효성 검증)
- Tailwind CSS (스타일링)
- Zustand (상태 관리)

**Storage**: 이번 피처는 프론트엔드 UI만 구현, 백엔드 API는 목업/스텁 처리
**Testing**: Vitest + Testing Library
**Target Platform**: 웹 브라우저 (데스크톱/모바일 반응형)
**Project Type**: Web Application (Next.js 프론트엔드)
**Performance Goals**: 페이지 로딩 3초 이내, 유효성 검증 피드백 500ms 이내
**Constraints**: WCAG AA 대비율 준수, 최소 글자 크기 12px, 클릭 영역 44x44px
**Scale/Scope**: 4개 인증 페이지, 재사용 가능한 UI 컴포넌트

## Design System Reference

디자인 시스템 시안을 기반으로 한 상세 스펙입니다.

### Color Themes (5가지 지자체 테마)

기본 테마: **시민 블루 (Civic Blue)** `#2E6AB3`

| 테마 | Primary | Light | Dark | Background |
|------|---------|-------|------|------------|
| 시민 블루 (Civic Blue) | #2E6AB3 | #4A8AD4 | #1E4A7A | #EBF4FF |
| 자연 그린 (Nature Green) | #3D7A5A | #5A9A7B | #2A5A40 | #EDF7F0 |
| 전통 레드 (Heritage Red) | #B85450 | #D4736F | #8B3D3A | #FDF2F2 |
| 관공 네이비 (Official Navy) | #3D4A5C | #5A6A7E | #2A3A42 | #F0F2F5 |
| 따뜻한 골드 (Warm Gold) | #9A7B4F | #BB976A | #6E5636 | #FBF7EE |

### Neutral Colors

| 용도 | 색상코드 |
|------|----------|
| Text (Primary) | #1E293B |
| Text (Sub) | #64748B |
| Background | #F1F5F9 (또는 테마별 Background) |

### Status Colors (모든 테마 공통)

| 상태 | 색상코드 | 용도 |
|------|----------|------|
| Success | #3D8B8E | 성공, 승인, 양호 |
| Warning | #C4940A | 주의, 검토 중 |
| Danger | #C45A5A | 긴급, 오류, 반려, 위험 |
| Info | #2E6AB3 | 안내 (전화 보고서 보라색 #7C6B9E) |

### Typography (Pretendard)

**폰트 패밀리**: `'Pretendard', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif`

| 스타일 | 크기 | 굵기 | 줄간격 | 자간 | 용도 |
|--------|------|------|--------|------|------|
| Display | 32px | Bold 700 | 140% | -0.5% | 대시보드 타이틀, 페이지 제목 |
| Heading 1 | 24px | Bold 700 | 140% | -0.3% | 섹션 제목, 카드 헤더 |
| Heading 2 | 20px | SemiBold 600 | 150% | 0% | 서브 섹션, 모달 제목 |
| Heading 3 | 16px | SemiBold 600 | 150% | 0% | 카드 내 제목, 폼 섹션 |
| Body Large | 15px | Regular 400 | 160% | 0% | 중요 본문, 설명 텍스트 |
| Body | 14px | Regular 400 | 160% | 0% | 일반 본문, 테이블 셀 |
| Body Small | 13px | Regular 400 | 160% | 0% | 보조 설명, 힌트 텍스트 |
| Caption | 12px | Regular 400 | 150% | 0% | 캡션, 메타 정보, 푸터 |
| Label | 12px | SemiBold 600 | 150% | +1% | 폼 라벨, 테이블 헤더, 배지 |

**접근성 (40~60대 최적화)**:
- 최소 글자 크기 12px (11px 이하 금지)
- Light 폰트 사용 금지 (Light 300, Thin 100 미사용)
- 회색 본문은 #64748B까지만 사용
- 본문 줄간격 1.5배 이상 (160% 권장)
- 텍스트 대비율 4.5:1 이상 (WCAG AA)
- 긴 문장은 40자 이내로

### Spacing System (4px 기반)

| 토큰 | 크기 | 용도 |
|------|------|------|
| spacing-1 | 4px | 아이콘-텍스트 간격 |
| spacing-2 | 8px | 인라인 요소 간격 |
| spacing-3 | 12px | 컴포넌트 내부 패딩 (기본) |
| spacing-4 | 16px | 컴포넌트 내부 패딩 (소) |
| spacing-5 | 20px | 컴포넌트 간 간격 |
| spacing-6 | 24px | 카드 패딩, 섹션 간격 |
| spacing-8 | 32px | 섹션 간 간격 (대) |

**컴포넌트별 간격**:

| 컴포넌트 | 패딩 | 마진 | 보더 |
|----------|------|------|------|
| 버튼 | 8px 12px (상하 좌우) | 8px | 8px |
| 입력 필드 | 12px 16px | 12px | 8px |
| 카드 | 24px | 20px | 12px |
| 섹션 | 24px | 24px | - |

### Border Radius

| 크기 | 용도 |
|------|------|
| 4px | 체크박스 |
| 6px | 배지 |
| 8px | 버튼, 입력 필드 |
| 12px | 카드 |
| 16px | 모달 |
| Full | 아바타 |

### Component Specifications

#### Buttons

| 타입 | 상태 | 스타일 |
|------|------|--------|
| Primary | 기본 | bg: Primary, text: white |
| Primary | 호버 | bg: Primary Dark |
| Primary | 눌림 | bg: Primary Dark, opacity 변화 |
| Primary | 비활성 | opacity: 50% |
| Secondary/Ghost | 기본 | bg: transparent, border: Primary, text: Primary |
| Danger | 기본 | bg: #C45A5A, text: white |
| Soft | 기본 | bg: Primary Light, text: Primary |

**사이즈 변형**:
- Small: 높이 32px
- Medium: 높이 40px
- Large: 높이 48px (인증 페이지 주 버튼)

#### Input Fields

| 상태 | 스타일 |
|------|--------|
| 기본 | bg: #F8FAFC, border: #E2E8F0, text: placeholder gray |
| 포커스 | bg: white, border: Primary, ring: Primary light |
| 입력 완료 | bg: white, border: #E2E8F0, text: #1E293B |
| 에러 | bg: #FEF2F2, border: #C45A5A, text: #1E293B |

#### Selection Controls

- **Checkbox**: 4px radius, Primary 색상 체크
- **Radio Button**: 원형, Primary 색상 선택
- **Toggle Switch**: Primary 색상 ON 상태

#### Badges & Status

| 타입 | 배경색 | 텍스트색 |
|------|--------|----------|
| 승인 | Success Light | Success |
| 검토 중 | Warning Light | Warning |
| 반려 | Danger Light | Danger |
| 긴급 | Danger | White |

#### Alerts & Toasts

| 타입 | 아이콘 | 배경색 |
|------|--------|--------|
| 성공 | ✓ | Success Light |
| 주의 | ⚠ | Warning Light |
| 오류 | ✕ | Danger Light |
| 안내 | ℹ | Info Light |

### Layout Specifications

- **Sidebar**: W: 240px
- **Card 간격**: 20px gutter
- **섹션 간격**: 24px
- **Grid System**: 12 컬럼, 20px gutter

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. 접근성 최우선 | PASS | 디자인 시안 분석 완료, 글자 크기/대비율/클릭 영역 준수 예정 |
| II. 디자인 시스템 | PASS | Pretendard 폰트, 4px 간격 시스템, 8px/12px 모서리 적용 예정 |
| III. 돌봄 유형 구분 | N/A | 인증 페이지에서는 돌봄 유형 미사용 |
| IV. 권한 체계 | PASS | 기관 인증 후 매니저 권한 부여 로직 설계됨 |
| V. 기술 스택 | PASS | Next.js 14, TypeScript, Tailwind CSS, React Hook Form + Zod 사용 |
| VI. 코드 품질 | PASS | ESLint + Prettier 적용, 한글 주석 사용 예정 |
| VII. 프로젝트 구조 | PASS | Constitution 폴더 구조 준수 |

**Gate Result**: PASS - Phase 0 진행 가능

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-system/
├── spec.md              # 기능 명세서
├── plan.md              # 구현 계획서 (이 파일)
├── research.md          # Phase 0: 리서치 결과
├── data-model.md        # Phase 1: 데이터 모델
├── quickstart.md        # Phase 1: 빠른 시작 가이드
├── contracts/           # Phase 1: API 계약
│   └── auth-api.yaml    # 인증 API OpenAPI 스펙
└── tasks.md             # Phase 2: 태스크 목록 (별도 명령으로 생성)
```

### Source Code (repository root)

```text
src/
├── app/                      # Next.js App Router 페이지
│   ├── (auth)/               # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   │   └── page.tsx      # 로그인 페이지
│   │   ├── register/
│   │   │   └── page.tsx      # 회원가입 페이지
│   │   ├── forgot-password/
│   │   │   └── page.tsx      # 비밀번호 찾기 페이지
│   │   ├── reset-password/
│   │   │   └── page.tsx      # 비밀번호 재설정 페이지
│   │   ├── organization-verify/
│   │   │   └── page.tsx      # 기관 인증 페이지
│   │   └── layout.tsx        # 인증 레이아웃 (카드 중앙 정렬)
│   ├── layout.tsx            # 루트 레이아웃
│   └── globals.css           # 글로벌 스타일
├── components/
│   ├── ui/                   # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Select.tsx
│   │   ├── FileUpload.tsx
│   │   └── Card.tsx
│   └── features/
│       └── auth/             # 인증 기능 컴포넌트
│           ├── LoginForm.tsx
│           ├── RegisterForm.tsx
│           ├── ForgotPasswordForm.tsx
│           ├── ResetPasswordForm.tsx
│           ├── OrganizationVerifyForm.tsx
│           ├── PasswordStrengthIndicator.tsx
│           ├── AgreementCheckbox.tsx
│           └── EmailVerification.tsx
├── hooks/
│   ├── useAuth.ts            # 인증 상태 관리 훅
│   └── useFormValidation.ts  # 폼 유효성 검증 훅
├── lib/
│   ├── api/
│   │   └── auth.ts           # 인증 API 클라이언트 (목업)
│   ├── validations/
│   │   └── auth.ts           # Zod 스키마 정의
│   └── utils/
│       └── format.ts         # 전화번호 포맷 등 유틸리티
├── styles/
│   └── theme.ts              # 테마 설정 (색상, 간격 등)
└── types/
    └── auth.ts               # 인증 관련 타입 정의
```

**Structure Decision**: Constitution VII에 명시된 프로젝트 구조를 준수합니다. Next.js App Router의 라우트 그룹 기능을 활용하여 인증 관련 페이지를 `(auth)` 그룹으로 묶고, 공통 레이아웃을 적용합니다.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 없음 | - | - |

모든 Constitution 원칙을 준수하며 불필요한 복잡성 없이 구현합니다.

## Post-Phase 1 Constitution Check

*Re-evaluation after design artifacts are complete.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. 접근성 최우선 | PASS | research.md 8번 항목에 접근성 구현 가이드 명시 (12px/14px 글자, 44x44px 클릭 영역, 4.5:1 대비율) |
| II. 디자인 시스템 | PASS | research.md 7번 항목에 Tailwind 테마 설정 명시, quickstart.md에 글로벌 스타일 정의 |
| III. 돌봄 유형 구분 | N/A | 인증 페이지에서는 해당 없음 |
| IV. 권한 체계 | PASS | data-model.md에 User.role (user/manager/admin) 및 OrganizationMembership 상태 전이 정의 |
| V. 기술 스택 | PASS | Next.js 14, TypeScript, Tailwind CSS, React Hook Form + Zod, Zustand 사용 |
| VI. 코드 품질 | PASS | quickstart.md에 ESLint + Prettier 설정 포함, 한글 주석 사용 |
| VII. 프로젝트 구조 | PASS | plan.md Source Code 섹션에 Constitution 폴더 구조 준수 확인 |

**Final Gate Result**: PASS - `/speckit.tasks` 진행 가능

## Generated Artifacts

| Artifact | Path | Description |
|----------|------|-------------|
| Feature Spec | [spec.md](./spec.md) | 기능 명세서 |
| Implementation Plan | [plan.md](./plan.md) | 구현 계획서 (이 문서) |
| Research | [research.md](./research.md) | 기술 결정 및 패턴 리서치 |
| Data Model | [data-model.md](./data-model.md) | 엔티티 정의 및 TypeScript 타입 |
| API Contract | [contracts/auth-api.yaml](./contracts/auth-api.yaml) | OpenAPI 3.0 스펙 |
| Quickstart | [quickstart.md](./quickstart.md) | 빠른 시작 가이드 |
