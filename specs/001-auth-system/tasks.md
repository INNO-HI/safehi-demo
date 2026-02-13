# 태스크 목록: SafeHi 인증 시스템

**입력 문서**: `/specs/001-auth-system/` 디렉토리의 설계 문서들
**사전 요구사항**: plan.md, spec.md, research.md, data-model.md, contracts/auth-api.yaml

**테스트**: 테스트 태스크 미포함 (별도 요청 없음)

**구성 방식**: 각 유저 스토리별로 독립적인 구현 및 테스트가 가능하도록 태스크를 그룹화했습니다.

## 태스크 형식: `[ID] [P?] [Story] 설명`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 해당 태스크가 속한 유저 스토리 (예: US1, US2, US3, US4)
- 모든 태스크에 정확한 파일 경로 포함

## 경로 규칙

- **프로젝트 구조**: 저장소 루트의 `src/` (Next.js App Router)
- 컴포넌트 경로는 Constitution VII 구조를 따름

---

## Phase 1: 초기 설정 (공유 인프라)

**목적**: 프로젝트 초기화 및 기본 구조 설정

- [x] T001 quickstart.md에 따라 Next.js 14 프로젝트 초기화 (TypeScript, Tailwind CSS, ESLint 포함)
- [x] T002 [P] 핵심 의존성 설치: react-hook-form, @hookform/resolvers, zod, zustand (package.json)
- [x] T003 [P] 유틸리티 의존성 설치: clsx, tailwind-merge, pretendard (package.json)
- [x] T004 [P] 디자인 시스템 토큰으로 Tailwind CSS 설정 (tailwind.config.ts)
- [x] T005 [P] 테마 CSS 변수를 포함한 글로벌 스타일 설정 (src/app/globals.css)
- [x] T006 [P] Pretendard 폰트 import 설정 (src/app/layout.tsx)
- [x] T007 폴더 구조 생성: src/app/(auth)/, src/components/ui/, src/components/features/auth/, src/hooks/, src/lib/, src/types/

---

## Phase 2: 기반 구축 (필수 선행 작업)

**목적**: 모든 유저 스토리 구현 전에 반드시 완료해야 하는 핵심 인프라

**⚠️ 중요**: 이 단계가 완료되기 전에는 유저 스토리 작업을 시작할 수 없습니다

### TypeScript 타입 정의

- [x] T008 [P] 인증 관련 타입 정의 (User, UserRole, FormData 타입 등) 생성 (src/types/auth.ts)

### Zod 유효성 검증 스키마

- [x] T009 [P] 로그인 유효성 검증 스키마 생성 (src/lib/validations/auth.ts)
- [x] T010 [P] 회원가입 유효성 검증 스키마 생성 (src/lib/validations/auth.ts)
- [x] T011 [P] 비밀번호 찾기 유효성 검증 스키마 생성 (src/lib/validations/auth.ts)
- [x] T012 [P] 비밀번호 재설정 유효성 검증 스키마 생성 (src/lib/validations/auth.ts)
- [x] T013 [P] 기관 인증 유효성 검증 스키마 생성 (src/lib/validations/auth.ts)

### 유틸리티 함수

- [x] T014 [P] 클래스 병합용 cn() 유틸리티 생성 (src/lib/utils/cn.ts)
- [x] T015 [P] 전화번호 포맷터 생성 (src/lib/utils/format.ts)

### 기본 UI 컴포넌트

- [x] T016 [P] Button 컴포넌트 생성 (primary, secondary, danger, soft 변형) (src/components/ui/Button.tsx)
- [x] T017 [P] Input 컴포넌트 생성 (라벨, 에러, 필수 표시 포함) (src/components/ui/Input.tsx)
- [x] T018 [P] Checkbox 컴포넌트 생성 (라벨 포함) (src/components/ui/Checkbox.tsx)
- [x] T019 [P] Select 컴포넌트 생성 (드롭다운용) (src/components/ui/Select.tsx)
- [x] T020 [P] Card 컴포넌트 생성 (인증 레이아웃용) (src/components/ui/Card.tsx)
- [x] T021 [P] Alert 컴포넌트 생성 (success, warning, danger, info) (src/components/ui/Alert.tsx)

### 인증 레이아웃

- [x] T022 인증 레이아웃 생성 (중앙 정렬 카드, 로고, 푸터 포함) (src/app/(auth)/layout.tsx)

### Mock API 클라이언트

- [x] T023 Mock API 기본 함수 생성 (login, register, checkEmail 등) (src/lib/api/auth.ts)
- [x] T024 [P] Mock 지역/구군/기관 데이터 생성 (src/lib/api/regions.ts)

**체크포인트**: 기반 구축 완료 - 유저 스토리 구현 시작 가능

---

## Phase 3: 유저 스토리 1 - 기존 사용자 로그인 (우선순위: P1) 🎯 MVP

**목표**: 이미 계정이 있는 사용자가 이메일과 비밀번호로 로그인하고 대시보드로 이동

**독립 테스트**: 테스트 계정(test@example.com / Test1234!)으로 로그인 성공 시 대시보드 리다이렉트 확인

### 유저 스토리 1 구현

- [x] T025 [US1] LoginForm 컴포넌트 생성 (이메일, 비밀번호, 로그인 유지 체크박스 포함) (src/components/features/auth/LoginForm.tsx)
- [x] T026 [US1] react-hook-form + zod를 사용한 로그인 폼 유효성 검증 구현 (LoginForm.tsx)
- [x] T027 [US1] 로그인 API 호출 및 에러 처리 추가 (잘못된 로그인, 계정 잠금 처리) (LoginForm.tsx)
- [x] T028 [US1] 로그인 페이지 생성 (폼 및 네비게이션 링크 포함) (src/app/(auth)/login/page.tsx)
- [x] T029 [US1] useAuth 훅 생성 (인증 상태 관리용) (src/hooks/useAuth.ts)
- [x] T030 [US1] 로그인 성공 시 대시보드로 리다이렉트 추가

**체크포인트**: 유저 스토리 1 완료 - 로그인 기능 독립적으로 테스트 가능

---

## Phase 4: 유저 스토리 2 - 신규 사용자 회원가입 (우선순위: P1)

**목표**: 새로운 사용자가 정보 입력, 이메일 인증, 약관 동의를 통해 계정 생성

**독립 테스트**: 모든 필수 정보 입력 및 이메일 인증 완료 후 회원가입 성공 메시지 확인

### 유저 스토리 2 공유 컴포넌트

- [x] T031 [P] [US2] PasswordStrengthIndicator 컴포넌트 생성 (비밀번호 강도 표시) (src/components/features/auth/PasswordStrengthIndicator.tsx)
- [x] T032 [P] [US2] EmailVerification 컴포넌트 생성 (인증 코드 입력) (src/components/features/auth/EmailVerification.tsx)
- [x] T033 [P] [US2] AgreementCheckbox 컴포넌트 생성 (전체 동의 기능 포함) (src/components/features/auth/AgreementCheckbox.tsx)

### 유저 스토리 2 구현

- [x] T034 [US2] RegisterForm 컴포넌트 생성 (모든 필드 포함) (src/components/features/auth/RegisterForm.tsx)
- [x] T035 [US2] 실시간 비밀번호 강도 유효성 검증 구현 (RegisterForm.tsx)
- [x] T036 [US2] 이메일 인증 흐름 구현 (인증 코드 발송, 코드 확인) (RegisterForm.tsx)
- [x] T037 [US2] 전화번호 자동 포맷팅 구현 (010-0000-0000 형식) (RegisterForm.tsx)
- [x] T038 [US2] 전체 선택 기능이 있는 약관 동의 체크박스 그룹 구현 (RegisterForm.tsx)
- [x] T039 [US2] 회원가입 API 호출 및 이메일 중복 검사 추가 (RegisterForm.tsx)
- [x] T040 [US2] 회원가입 페이지 생성 (폼 및 로그인 링크 포함) (src/app/(auth)/register/page.tsx)

**체크포인트**: 유저 스토리 2 완료 - 회원가입 흐름 독립적으로 테스트 가능

---

## Phase 5: 유저 스토리 3 - 비밀번호 찾기/재설정 (우선순위: P2)

**목표**: 비밀번호를 잊은 사용자가 이메일로 재설정 링크를 받아 새 비밀번호 설정

**독립 테스트**: 이메일 입력 후 재설정 링크 발송 메시지 확인, 재설정 페이지에서 새 비밀번호 설정 확인

### 유저 스토리 3 구현

- [x] T041 [P] [US3] ForgotPasswordForm 컴포넌트 생성 (src/components/features/auth/ForgotPasswordForm.tsx)
- [x] T042 [P] [US3] ResetPasswordForm 컴포넌트 생성 (비밀번호 강도 표시 포함) (src/components/features/auth/ResetPasswordForm.tsx)
- [x] T043 [US3] 비밀번호 찾기 API 호출 구현 (이메일 존재 여부와 무관하게 동일 응답 반환) (ForgotPasswordForm.tsx)
- [x] T044 [US3] 토큰 검증을 포함한 비밀번호 재설정 API 호출 구현 (ResetPasswordForm.tsx)
- [x] T045 [US3] 비밀번호 찾기 페이지 생성 (src/app/(auth)/forgot-password/page.tsx)
- [x] T046 [US3] URL에서 토큰을 받는 비밀번호 재설정 페이지 생성 (src/app/(auth)/reset-password/page.tsx)

**체크포인트**: 유저 스토리 3 완료 - 비밀번호 찾기/재설정 흐름 독립적으로 테스트 가능

---

## Phase 6: 유저 스토리 4 - 기관 소속 인증 (우선순위: P3)

**목표**: 로그인한 사용자가 소속 기관을 선택하고 증빙 서류를 제출하여 매니저 권한 요청

**독립 테스트**: 지역/기관 선택 후 인증 요청 제출, 승인 대기 메시지 확인

### 유저 스토리 4 공유 컴포넌트

- [x] T047 [P] [US4] FileUpload 컴포넌트 생성 (드래그 앤 드롭, 클릭, 미리보기) (src/components/ui/FileUpload.tsx)
- [x] T048 [P] [US4] CascadingSelect 컴포넌트 생성 (지역/구군/기관 연쇄 선택용) (src/components/ui/CascadingSelect.tsx)

### 유저 스토리 4 구현

- [x] T049 [US4] OrganizationVerifyForm 컴포넌트 생성 (src/components/features/auth/OrganizationVerifyForm.tsx)
- [x] T050 [US4] 연쇄 드롭다운 로직 구현 (지역 → 구군 → 기관) (OrganizationVerifyForm.tsx)
- [x] T051 [US4] 파일 업로드 구현 (10MB 제한, PDF/JPG/PNG 허용) (OrganizationVerifyForm.tsx)
- [x] T052 [US4] 기관 소속 인증 API 호출 추가 (OrganizationVerifyForm.tsx)
- [x] T053 [US4] 인증 가드가 적용된 기관 인증 페이지 생성 (src/app/(auth)/organization-verify/page.tsx)

**체크포인트**: 유저 스토리 4 완료 - 기관 인증 흐름 독립적으로 테스트 가능

---

## Phase 7: 마무리 및 공통 관심사

**목적**: 여러 유저 스토리에 영향을 미치는 개선 사항

- [x] T054 [P] 모든 폼에 로딩 상태 추가 (Button isLoading prop 활용)
- [x] T055 [P] 모바일 기기를 위한 반응형 디자인 적용
- [x] T056 [P] WCAG AA 준수 확인 (대비율, 최소 글자 크기, 클릭 영역)
- [x] T057 [P] 키보드 네비게이션 지원 추가 (포커스 관리, 탭 순서)
- [x] T058 코드 정리: 미사용 import 제거, 한글 주석 추가
- [x] T059 npm run build로 빌드 검증 실행 완료

---

## 의존성 및 실행 순서

### Phase 의존성

- **초기 설정 (Phase 1)**: 의존성 없음 - 즉시 시작 가능
- **기반 구축 (Phase 2)**: 초기 설정 완료 후 진행 - 모든 유저 스토리를 차단
- **유저 스토리 (Phase 3-6)**: 모두 기반 구축 단계 완료에 의존
  - US1 (로그인)과 US2 (회원가입)는 병렬 진행 가능 (둘 다 P1)
  - US3 (비밀번호 찾기)는 기반 구축 후 시작 가능 - US2의 PasswordStrengthIndicator 재사용
  - US4 (기관 인증)는 기반 구축 후 시작 가능 - US1의 인증 상태 필요
- **마무리 (Phase 7)**: 모든 유저 스토리 완료 후 진행

### 유저 스토리 간 의존성

- **유저 스토리 1 (P1)**: 기반 구축 (Phase 2) 후 시작 가능 - 다른 스토리에 의존성 없음
- **유저 스토리 2 (P1)**: 기반 구축 (Phase 2) 후 시작 가능 - US1과 로그인 링크 공유, 그 외 독립적
- **유저 스토리 3 (P2)**: 기반 구축 (Phase 2) 후 시작 가능 - US2의 PasswordStrengthIndicator 공유 (병렬 실행 필요 시 Phase 2로 추출 가능)
- **유저 스토리 4 (P3)**: 기반 구축 (Phase 2) 후 시작 가능 - 인증 가드를 위해 US1의 useAuth 훅 필요

### 각 유저 스토리 내 순서

- 모델/타입은 서비스보다 먼저 (Phase 2에서 완료)
- 공유 컴포넌트는 기능 컴포넌트보다 먼저
- 핵심 구현은 통합보다 먼저
- 스토리 완료 후 다음 우선순위로 이동

### 병렬 실행 기회

- [P] 표시된 모든 초기 설정 태스크는 병렬 실행 가능
- [P] 표시된 모든 기반 구축 태스크는 병렬 실행 가능 (Phase 2 내에서)
- 기반 구축 단계 완료 후, US1과 US2는 병렬 시작 가능
- 스토리 내 [P] 표시된 모든 공유 컴포넌트 태스크는 병렬 실행 가능
- 파일을 공유하지 않는 모든 폼 컴포넌트는 병렬 개발 가능

---

## 병렬 실행 예시: 기반 구축 Phase

```bash
# 모든 타입/유효성 검증 태스크를 동시에 실행:
태스크: "인증 관련 타입 정의 생성 (src/types/auth.ts)"
태스크: "로그인 유효성 검증 스키마 생성 (src/lib/validations/auth.ts)"
태스크: "회원가입 유효성 검증 스키마 생성 (src/lib/validations/auth.ts)"
# ... (모든 유효성 검증 스키마)

# 모든 UI 컴포넌트 태스크를 동시에 실행:
태스크: "Button 컴포넌트 생성 (src/components/ui/Button.tsx)"
태스크: "Input 컴포넌트 생성 (src/components/ui/Input.tsx)"
태스크: "Checkbox 컴포넌트 생성 (src/components/ui/Checkbox.tsx)"
# ... (모든 UI 컴포넌트)
```

## 병렬 실행 예시: 유저 스토리 2

```bash
# US2의 모든 공유 컴포넌트를 동시에 실행:
태스크: "PasswordStrengthIndicator 생성 (src/components/features/auth/PasswordStrengthIndicator.tsx)"
태스크: "EmailVerification 생성 (src/components/features/auth/EmailVerification.tsx)"
태스크: "AgreementCheckbox 생성 (src/components/features/auth/AgreementCheckbox.tsx)"
```

---

## 구현 전략

### MVP 우선 (유저 스토리 1만)

1. Phase 1: 초기 설정 완료
2. Phase 2: 기반 구축 완료 (중요 - 모든 스토리 차단)
3. Phase 3: 유저 스토리 1 (로그인) 완료
4. **중단 및 검증**: 테스트 계정으로 로그인 테스트
5. 준비되면 배포/데모

### 점진적 전달

1. 초기 설정 + 기반 구축 완료 → 기반 준비 완료
2. 유저 스토리 1 (로그인) 추가 → 독립 테스트 → 배포/데모 (MVP!)
3. 유저 스토리 2 (회원가입) 추가 → 독립 테스트 → 배포/데모
4. 유저 스토리 3 (비밀번호 찾기) 추가 → 독립 테스트 → 배포/데모
5. 유저 스토리 4 (기관 인증) 추가 → 독립 테스트 → 배포/데모
6. 각 스토리는 이전 스토리를 깨뜨리지 않으면서 가치를 추가

### 병렬 팀 전략

여러 개발자가 있는 경우:

1. 팀이 함께 초기 설정 + 기반 구축 완료
2. 기반 구축 완료 후:
   - 개발자 A: 유저 스토리 1 (로그인)
   - 개발자 B: 유저 스토리 2 (회원가입)
3. US1/US2 완료 후:
   - 개발자 A: 유저 스토리 3 (비밀번호 찾기)
   - 개발자 B: 유저 스토리 4 (기관 인증)
4. 각 스토리는 독립적으로 완료 및 통합

---

## 참고 사항

- [P] 태스크 = 다른 파일, 의존성 없음
- [Story] 라벨은 추적을 위해 태스크를 특정 유저 스토리에 매핑
- 각 유저 스토리는 독립적으로 완료 및 테스트 가능해야 함
- 각 태스크 또는 논리적 그룹 완료 후 커밋
- 스토리를 독립적으로 검증하기 위해 체크포인트에서 중단 가능
- 피해야 할 것: 모호한 태스크, 같은 파일 충돌, 독립성을 깨뜨리는 스토리 간 의존성
