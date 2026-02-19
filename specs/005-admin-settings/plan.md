# Implementation Plan: 설정 페이지 (Admin Settings)

**Branch**: `005-admin-settings` | **Date**: 2026-02-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-admin-settings/spec.md`

## Summary

관리자 대시보드의 설정 페이지(`/settings`)를 구현한다. 프로필/계정 정보 확인 및 수정, 알림 토글 관리, 시스템 설정(언어/시간대/다크모드/자동 새로고침), 관할 구역 정보 확인, 계정 관리(로그아웃/비밀번호 변경/문의) 기능을 포함한다. Mock 데이터 기반으로 구현하며, 기존 UI 컴포넌트(Card, Button, Input, Select, Badge)와 레이아웃(Sidebar, PageHeader)을 재활용한다. 새로운 Toggle 컴포넌트를 추가하고, Zustand 기반 useSettings 훅으로 상태를 관리한다.

## Technical Context

**Language/Version**: TypeScript 5.x + Next.js 14 (App Router)
**Primary Dependencies**: React, Tailwind CSS, Zustand, React Hook Form + Zod, clsx, tailwind-merge
**Storage**: 클라이언트 사이드 (Zustand persist → localStorage), 추후 백엔드 API 교체 예정
**Testing**: Vitest + Testing Library
**Target Platform**: 웹 브라우저 (Chrome, Safari, Edge, Firefox)
**Project Type**: Web (Next.js App Router SPA)
**Performance Goals**: 설정 페이지 초기 로드 3초 이내, 토글 전환 즉시 반영
**Constraints**: 접근성 WCAG AA 필수, 최소 폰트 12px, 클릭 영역 44x44px, 기존 디자인 시스템 준수
**Scale/Scope**: 단일 페이지, 6개 섹션, 약 10개 컴포넌트

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 요구사항 | 준수 여부 | 근거 |
|------|----------|-----------|------|
| I. 접근성 최우선 | 최소 12px, 본문 14px, Regular(400)+, WCAG AA 4.5:1, line-height 1.5x, 터치 44x44px | ✅ 준수 | 기존 Tailwind 설정(text-body: 14px, min-h-button: 40px+)과 globals.css 스타일 활용 |
| II. 디자인 시스템 | Pretendard 폰트, 4px 간격, 버튼 8px/카드 12px/모달 16px 모서리 | ✅ 준수 | tailwind.config.ts에 이미 정의된 디자인 토큰 재사용 |
| III. 돌봄 유형 구분 | 색상/아이콘 시각 구분 | N/A | 설정 페이지에는 돌봄 유형 표시 불필요 |
| IV. 권한 체계 | RBAC, 관리자 권한 | ✅ 준수 | 설정 페이지는 관리자 전용, useAuth 훅으로 인증 확인 |
| V. 기술 스택 | Next.js 14+, TypeScript strict, Tailwind, Zustand, React Hook Form + Zod, Vitest | ✅ 준수 | 기존 스택 그대로 사용 |
| VI. 코드 품질 | ESLint + Prettier, 재사용 컴포넌트, 한글 주석, Conventional Commits | ✅ 준수 | 기존 린트 설정 적용 |
| VII. 프로젝트 구조 | src/app, components/ui+features, hooks, lib, types 구조 | ✅ 준수 | 기존 폴더 구조 그대로 활용 |

**Gate 결과**: ✅ 모든 원칙 준수 — Phase 0 진행 가능

## Project Structure

### Documentation (this feature)

```text
specs/005-admin-settings/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── settings-api.md  # Mock API → 추후 실제 API 교체
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/(admin)/
│   └── settings/
│       └── page.tsx                          # 설정 페이지 메인
├── components/
│   ├── ui/
│   │   └── Toggle.tsx                        # 새 토글 스위치 컴포넌트
│   └── features/settings/
│       ├── ProfileSection.tsx                # 내 프로필 카드
│       ├── AccountInfoSection.tsx            # 계정 정보 (4필드 + 변경 버튼)
│       ├── NotificationSection.tsx           # 알림 토글 4개 + 푸시 배너
│       ├── SystemSettingsSection.tsx         # 시스템 설정 (드롭다운 + 토글)
│       ├── JurisdictionSection.tsx           # 관할 구역 정보 (읽기 전용)
│       ├── AccountManagementSection.tsx      # 계정 관리 (로그아웃/비번변경/문의)
│       └── PasswordChangeModal.tsx           # 비밀번호 변경 모달
├── hooks/
│   └── useSettings.ts                        # 설정 상태 관리 (Zustand)
├── lib/
│   └── mock-data/
│       └── settings.ts                       # Mock 데이터
└── types/
    └── settings.ts                           # 설정 관련 타입 정의
```

**Structure Decision**: 기존 프로젝트 구조(VII. 프로젝트 구조)를 100% 준수. 페이지는 `(admin)/settings/page.tsx`, 피처 컴포넌트는 `components/features/settings/`, UI 컴포넌트는 `components/ui/`에 배치. 사이드바에 `/settings` 경로를 추가한다.

## Complexity Tracking

> 위반 사항 없음 — 모든 Constitution 원칙 준수
