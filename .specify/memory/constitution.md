<!--
  ============================================================================
  Sync Impact Report
  ============================================================================
  Version change: 0.0.0 → 1.0.0 (MAJOR: Initial constitution ratification)

  Added Principles:
  - I. 접근성 최우선 (Accessibility First)
  - II. 디자인 시스템 (Design System)
  - III. 돌봄 유형 구분 (Care Type Distinction)
  - IV. 권한 체계 (Permission Hierarchy)
  - V. 기술 스택 (Technology Stack)
  - VI. 코드 품질 (Code Quality)
  - VII. 프로젝트 구조 (Project Structure)

  Added Sections:
  - 프로젝트 개요 (Project Overview)
  - 주요 화면 (Main Screens)
  - AI 기능 (AI Features)
  - Governance

  Templates Status:
  - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md: ✅ Compatible (no constitution-specific refs)
  - .specify/templates/tasks-template.md: ✅ Compatible (no constitution-specific refs)

  Follow-up TODOs: None
  ============================================================================
-->

# SafeHi 돌봄 관리 시스템 Constitution

## 프로젝트 개요

SafeHi는 지자체 돌봄 매니저를 위한 웹 대시보드입니다.
어르신 돌봄 업무(방문/전화)의 일정 관리, 보고서 작성, 대상자 관리를 지원합니다.

### 타겟 사용자

- **돌봄 매니저**: 40~60대, 현장에서 어르신 돌봄 수행
- **지자체 관리자**: 관할 구역 전체 데이터 조회, 보고서 승인/반려

## Core Principles

### I. 접근성 최우선 (40~60대 사용자)

40~60대 사용자를 위한 접근성은 **비협상적(NON-NEGOTIABLE)** 요구사항입니다.

- 최소 글자 크기 12px, 본문 14px 이상 MUST 적용
- Light 폰트 가중치 사용 금지, Regular(400) 이상만 MUST 사용
- 텍스트 대비율 WCAG AA (4.5:1) MUST 준수
- 줄간격(line-height) 1.5배 이상 MUST 적용
- 클릭/터치 영역 최소 44x44px MUST 확보

**근거**: 주 사용자층이 디지털 기기 사용에 익숙하지 않은 중장년층이므로,
가독성과 조작 편의성이 서비스 채택률과 직결됩니다.

### II. 디자인 시스템

일관된 사용자 경험을 위해 다음 디자인 시스템을 MUST 준수합니다.

**폰트**:
- Primary: Pretendard
- Fallback: -apple-system, "Malgun Gothic", sans-serif

**간격(Spacing)**:
- 4px 기반 시스템 (4, 8, 12, 16, 20, 24, 32, 40, 48...)

**모서리(Border Radius)**:
- 버튼: 8px
- 카드: 12px
- 모달: 16px

**지자체 테마 색상** (5가지 지원):
| 테마명 | 색상코드 | 용도 |
|--------|----------|------|
| 시민 블루 | #2E6AB3 | 기본 테마 |
| 자연 그린 | #3D7A5A | 환경/녹지 강조 지역 |
| 전통 레드 | #B85450 | 역사/문화 강조 지역 |
| 관공 네이비 | #3D4A5C | 공공기관 분위기 |
| 따뜻한 골드 | #9A7B4F | 복지/따뜻함 강조 |

### III. 돌봄 유형 구분

모든 UI에서 돌봄 유형은 색상과 아이콘으로 시각적 구분 MUST 제공합니다.

| 유형 | 아이콘 | 색상코드 |
|------|--------|----------|
| 방문 돌봄 | 🏠 | #2E6AB3 (파란색) |
| 전화 돌봄 | 📞 | #7C6B9E (보라색) |
| 긴급 | 🚨 | #C45A5A (빨간색) |

**근거**: 빠른 시각적 인지를 통해 업무 효율성을 높이고 긴급 상황 대응력을 강화합니다.

### IV. 권한 체계

역할 기반 접근 제어(RBAC)를 MUST 적용합니다.

**매니저 권한**:
- 본인 담당 대상자만 조회 가능
- 본인 작성 보고서 편집 가능
- 타인 데이터 접근 불가

**관리자 권한**:
- 관할 구역 전체 데이터 조회 가능
- 보고서 승인/반려 권한
- 매니저 계정 관리 권한

**근거**: 개인정보보호법 준수 및 책임 소재 명확화를 위해 최소 권한 원칙을 적용합니다.

### V. 기술 스택

다음 기술 스택을 MUST 사용합니다.

| 영역 | 기술 | 비고 |
|------|------|------|
| Frontend | Next.js 14+ | App Router 사용 |
| Language | TypeScript | strict mode 필수 |
| Styling | Tailwind CSS | - |
| State | Zustand 또는 React Query | 상황에 따라 선택 |
| Forms | React Hook Form + Zod | 유효성 검사 포함 |
| Testing | Vitest + Testing Library | - |

### VI. 코드 품질

코드 품질 유지를 위해 다음 사항을 MUST 준수합니다.

- ESLint + Prettier 적용 필수
- 컴포넌트는 재사용 가능하게 설계
- 한글 주석 권장 (영문 가능)
- 커밋 메시지: Conventional Commits 형식 (한글 본문 가능)
  - 예: `feat: 보고서 AI 요약 기능 추가`
  - 예: `fix: 캘린더 날짜 선택 오류 수정`

### VII. 프로젝트 구조

다음 폴더 구조를 MUST 준수합니다.

```text
src/
├── app/           # Next.js App Router 페이지
├── components/    # 재사용 컴포넌트
│   ├── ui/        # 기본 UI (Button, Input, Card 등)
│   └── features/  # 기능별 컴포넌트 (Calendar, Report 등)
├── hooks/         # 커스텀 React 훅
├── lib/           # 유틸리티 함수, API 클라이언트
├── styles/        # 글로벌 스타일, 테마 설정
└── types/         # TypeScript 타입 정의
```

## 주요 화면

SafeHi 시스템은 다음 화면들로 구성됩니다.

1. **인증**: 로그인 / 회원가입 / 기관인증
2. **대시보드**: 매니저용 / 관리자용 (역할별 분리)
3. **돌봄 일정**: 캘린더 기반 일정 관리
4. **보고서**: 목록 / 상세 / 수정
5. **대상자**: 목록 / 상세
6. **설정**: 개인설정, 테마 변경 등

## AI 기능

다음 AI 기능을 지원합니다.

- **보고서 AI 요약 생성**: 기존 돌봄 기록 데이터 + STT 텍스트 기반 자동 요약
- **긴급 보고 알림**: 긴급 상황 보고 시 관리자에게 자동 알림 연동

## Governance

### 헌법 우선 원칙

이 Constitution은 프로젝트의 모든 개발 관행보다 우선합니다.
Constitution과 충돌하는 코드 또는 설계는 승인되지 않습니다.

### 개정 절차

1. Constitution 수정이 필요한 경우, 수정 제안서 작성
2. 영향받는 코드/문서 목록 파악
3. 버전 번호 갱신 (SemVer 적용)
4. 관련 템플릿/문서 동기화 필수

### 버전 정책

- **MAJOR**: 원칙 삭제 또는 근본적 재정의
- **MINOR**: 새 원칙/섹션 추가 또는 기존 내용 실질적 확장
- **PATCH**: 문구 수정, 오타 교정, 비의미적 개선

### 준수 검토

모든 PR은 Constitution 준수 여부를 검토해야 합니다.
특히 접근성 원칙(I) 위반은 즉시 수정 요청됩니다.

**Version**: 1.0.0 | **Ratified**: 2026-01-05 | **Last Amended**: 2026-01-05
