# SafeHi Development Guidelines

Auto-generated from feature plans. Last updated: 2026-01-05

## Project Overview

SafeHi는 지자체 돌봄 매니저를 위한 웹 대시보드입니다.
어르신 돌봄 업무(방문/전화)의 일정 관리, 보고서 작성, 대상자 관리를 지원합니다.

## Active Technologies

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
- 004-statistics-report: 통계/리포트 페이지 (KPI, 차트, PDF 생성)

## Development Rules (FROM PAST MISTAKES)

### 1. 기존 코드베이스 확인 필수
- 새 컴포넌트 작성 전 `dashboard-web` 저장소에 동일/유사 구현이 있는지 확인
- 경로: `/Users/aboutime/Desktop/developer/dashboard-web`
- 특히 레이아웃, 사이드바, 공통 컴포넌트는 반드시 기존 구현 참조 후 복사/수정

### 2. 공유 컴포넌트 참조
- Sidebar: `dashboard-web/src/components/layout/Sidebar.tsx` (다크 테마)
- 타입: `dashboard-web/src/types/dashboard.ts`
- 사이드바 기본값: `dashboard-web/src/lib/utils/sidebar-defaults.ts`

### 3. API 패턴
- dashboard-web: 실제 백엔드 연동 (`localhost:4100/core/dashboard`)
- safehi 신규 기능: Mock 데이터로 먼저 구현, 나중에 백엔드 연동

<!-- MANUAL ADDITIONS START -->

## Critical Rules (절대 위반 금지)

### 1. UI 요소는 반드시 화면 내에 배치
- 새로운 UI 요소 추가 시 뷰포트 내에서 보이는지 확인 필수
- overflow 설정으로 인해 요소가 잘리지 않는지 검증
- "화면 밖에 구현하면 무슨 의미야" - 사용자가 볼 수 없으면 구현한 게 아님

### 2. 카드/박스 컴포넌트 공백 관리
- 카드 내부에 불필요한 공백이 생기지 않도록 주의
- flex layout 사용 시 flex-1, gap 등으로 공간을 균등하게 채움
- padding, margin 조정 시 전체 레이아웃 균형 확인
- 컴포넌트 크기가 부모 박스를 꽉 채우도록 구현

### 3. Git 커밋 시 author/committer 확인
- 회사 프로젝트는 회사 계정으로 커밋 (INNO-HI-Inc <safeinnohi@gmail.com>)
- Co-Authored-By, Claude 관련 정보 포함 금지
- 커밋 전 `git log -1 --format='Author: %an <%ae> / Committer: %cn <%ce>'`로 확인
- author/committer 변경 시 둘 다 변경해야 함:
  ```bash
  GIT_COMMITTER_NAME="INNO-HI-Inc" GIT_COMMITTER_EMAIL="safeinnohi@gmail.com" \
  git commit --amend --author="INNO-HI-Inc <safeinnohi@gmail.com>" --no-edit
  ```

### 4. 사용자 질문 정확히 이해하기
- "백엔드 API 확인해줘" → 어떤 프로젝트의 백엔드인지 확인
- 모호한 요청은 반드시 명확히 질문 후 진행
- 추측하지 말고 확인하기

<!-- MANUAL ADDITIONS END -->
