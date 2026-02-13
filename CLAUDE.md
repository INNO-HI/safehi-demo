# SafeHi Development Guidelines

Auto-generated from feature plans. Last updated: 2026-01-05

## Project Overview

SafeHi는 지자체 돌봄 매니저를 위한 웹 대시보드입니다.
어르신 돌봄 업무(방문/전화)의 일정 관리, 보고서 작성, 대상자 관리를 지원합니다.

## Active Technologies
- [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION] + [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION] (002-admin-dashboard)
- [if applicable, e.g., PostgreSQL, CoreData, files or N/A] (002-admin-dashboard)

- TypeScript 5.x + Next.js 14 (App Router)
- Tailwind CSS
- React Hook Form + Zod
- Zustand (상태 관리)
- Vitest + Testing Library

## Project Structure

```text
src/
├── app/           # Next.js App Router 페이지
├── components/    # 재사용 컴포넌트
│   ├── ui/        # 기본 UI (Button, Input, Card 등)
│   └── features/  # 기능별 컴포넌트
├── hooks/         # 커스텀 React 훅
├── lib/           # 유틸리티 함수, API 클라이언트
├── styles/        # 글로벌 스타일, 테마 설정
└── types/         # TypeScript 타입 정의
```

## Commands

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm test         # 테스트 실행
pnpm lint         # ESLint 실행
```

## Code Style

- TypeScript strict mode 필수
- ESLint + Prettier 적용
- 한글 주석 권장
- Conventional Commits 형식 (예: `feat: 보고서 AI 요약 기능 추가`)

## Accessibility Requirements (NON-NEGOTIABLE)

40~60대 사용자를 위한 접근성 필수 준수:
- 최소 글자 크기 12px, 본문 14px 이상
- Light 폰트 가중치 사용 금지, Regular(400) 이상
- 텍스트 대비율 WCAG AA (4.5:1) 준수
- 줄간격(line-height) 1.5배 이상
- 클릭/터치 영역 최소 44x44px

## Design System

- 폰트: Pretendard (fallback: -apple-system, Malgun Gothic, sans-serif)
- 간격: 4px 기반 시스템
- 모서리: 버튼 8px, 카드 12px, 모달 16px

## Recent Features

- 001-auth-system: 인증 시스템 (로그인, 회원가입, 비밀번호 찾기, 기관 인증)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
