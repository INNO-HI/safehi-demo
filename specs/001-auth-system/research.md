# Research: SafeHi 인증 시스템

**Date**: 2026-01-05
**Feature**: 001-auth-system

## 1. Next.js 14 App Router 인증 패턴

### Decision
Server Components와 Client Components를 혼합하여 인증 페이지 구현

### Rationale
- 인증 폼은 사용자 인터랙션이 필요하므로 Client Component로 구현
- 레이아웃과 정적 콘텐츠는 Server Component로 유지하여 초기 로딩 최적화
- `use client` 디렉티브를 폼 컴포넌트 레벨에서만 사용

### Alternatives Considered
1. **전체 Server Action 사용**: 폼 제출에 Server Action 활용 가능하나, 실시간 유효성 검증 UX가 저하됨
2. **전체 Client Component**: 불필요한 JavaScript 번들 증가

### Implementation Pattern
```tsx
// app/(auth)/login/page.tsx - Server Component
import { LoginForm } from '@/components/features/auth/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}

// components/features/auth/LoginForm.tsx - Client Component
'use client';
// 폼 로직 구현
```

---

## 2. React Hook Form + Zod 유효성 검증

### Decision
React Hook Form과 Zod를 결합하여 타입 안전한 폼 유효성 검증 구현

### Rationale
- Constitution V에서 지정된 기술 스택
- Zod로 스키마 정의 시 TypeScript 타입 자동 추론
- React Hook Form의 `resolver`로 Zod 스키마 연결하여 일관된 검증

### Validation Schema Example
```typescript
// lib/validations/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다')
    .regex(/\d/, '숫자를 포함해야 합니다'),
  passwordConfirm: z.string(),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/, '올바른 연락처 형식이 아닙니다 (010-0000-0000)'),
  agreeTerms: z.literal(true, { errorMap: () => ({ message: '이용약관에 동의해야 합니다' }) }),
  agreePrivacy: z.literal(true, { errorMap: () => ({ message: '개인정보 처리방침에 동의해야 합니다' }) }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
});
```

### Alternatives Considered
1. **Yup**: 비슷한 기능이나 TypeScript 지원이 Zod보다 약함
2. **수동 검증**: 유지보수 어려움, 타입 안전성 부족

---

## 3. 비밀번호 강도 표시 구현

### Decision
실시간 비밀번호 조건 체크 UI 구현 (체크리스트 형태)

### Rationale
- 디자인 시안에서 "8자 이상", "특수문자 포함", "숫자 포함" 조건 표시
- 조건 충족 시 체크 아이콘 + 색상 변경으로 시각적 피드백
- 접근성: 색상만이 아닌 아이콘으로도 상태 구분

### Implementation Pattern
```tsx
interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: '8자 이상', test: (p) => p.length >= 8 },
  { label: '특수문자 포함', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  { label: '숫자 포함', test: (p) => /\d/.test(p) },
];
```

---

## 4. 이메일 인증 흐름

### Decision
회원가입 시 이메일 인증 코드 발송 → 입력 → 검증 흐름 구현

### Rationale
- 디자인 시안에 "인증" 버튼이 이메일 필드 옆에 위치
- 이메일 인증 완료 전까지 회원가입 버튼 비활성화
- 인증 코드 유효시간 10분 (Assumption에 명시)

### Flow
1. 사용자가 이메일 입력 후 "인증" 버튼 클릭
2. API 호출하여 인증 코드 발송
3. 인증 코드 입력 필드 표시
4. 코드 입력 후 검증
5. 검증 성공 시 이메일 필드 잠금 + 성공 표시

### Alternatives Considered
1. **이메일 링크 인증**: 회원가입 완료 후 이메일 확인 필요, UX가 분산됨
2. **인증 없이 가입**: 스팸 계정 생성 위험

---

## 5. 지역/기관 계층적 선택

### Decision
시/도 → 구/군 → 기관 순차 선택 UI (연쇄 드롭다운)

### Rationale
- 디자인 시안에서 2단계 지역 선택 후 기관 선택
- 상위 선택 변경 시 하위 항목 초기화
- 기관 데이터는 API로 조회 (이번 피처에서는 목업)

### Implementation Pattern
```tsx
const [selectedProvince, setSelectedProvince] = useState('');
const [selectedDistrict, setSelectedDistrict] = useState('');
const [selectedOrganization, setSelectedOrganization] = useState('');

// 상위 선택 변경 시 하위 초기화
useEffect(() => {
  setSelectedDistrict('');
  setSelectedOrganization('');
}, [selectedProvince]);

useEffect(() => {
  setSelectedOrganization('');
}, [selectedDistrict]);
```

---

## 6. 파일 업로드 구현

### Decision
드래그 앤 드롭 + 클릭 업로드 지원 FileUpload 컴포넌트

### Rationale
- 디자인 시안에 "파일을 드래그하거나 클릭하여 업로드" 문구
- 지원 형식: PDF, JPG, PNG
- 최대 파일 크기: 10MB

### Implementation Pattern
```tsx
interface FileUploadProps {
  accept: string;
  maxSize: number;
  onFileSelect: (file: File | null) => void;
}

// 드래그 앤 드롭 이벤트 핸들링
const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  const file = e.dataTransfer?.files[0];
  if (file && validateFile(file)) {
    onFileSelect(file);
  }
};
```

---

## 7. Tailwind CSS 테마 설정

### Decision
SafeHi 디자인 시스템을 Tailwind 설정에 완전 반영

### Rationale
- Constitution II에서 정의된 간격, 모서리, 색상 시스템 적용
- Pretendard 폰트 설정 (가변 폰트 지원)
- 5가지 지자체 테마 색상 지원
- 40~60대 접근성 최적화 타이포그래피

### Configuration
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      fontSize: {
        // 타입 스케일 (40~60대 최적화: 최소 12px)
        'display': ['32px', { lineHeight: '140%', letterSpacing: '-0.5%', fontWeight: '700' }],
        'h1': ['24px', { lineHeight: '140%', letterSpacing: '-0.3%', fontWeight: '700' }],
        'h2': ['20px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '600' }],
        'h3': ['16px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '600' }],
        'body-lg': ['15px', { lineHeight: '160%', letterSpacing: '0%', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '160%', letterSpacing: '0%', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '160%', letterSpacing: '0%', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '150%', letterSpacing: '1%', fontWeight: '600' }],
      },
      colors: {
        // 기본 테마: 시민 블루 (Civic Blue)
        primary: {
          DEFAULT: '#2E6AB3',
          light: '#4A8AD4',
          dark: '#1E4A7A',
          bg: '#EBF4FF',
        },
        // 5가지 지자체 테마
        theme: {
          'civic-blue': { primary: '#2E6AB3', light: '#4A8AD4', dark: '#1E4A7A', bg: '#EBF4FF' },
          'nature-green': { primary: '#3D7A5A', light: '#5A9A7B', dark: '#2A5A40', bg: '#EDF7F0' },
          'heritage-red': { primary: '#B85450', light: '#D4736F', dark: '#8B3D3A', bg: '#FDF2F2' },
          'official-navy': { primary: '#3D4A5C', light: '#5A6A7E', dark: '#2A3A42', bg: '#F0F2F5' },
          'warm-gold': { primary: '#9A7B4F', light: '#BB976A', dark: '#6E5636', bg: '#FBF7EE' },
        },
        // Neutral 색상
        neutral: {
          text: '#1E293B',
          'text-sub': '#64748B',
          'text-tertiary': '#94A3B8',
          bg: '#F1F5F9',
          border: '#E2E8F0',
        },
        // Status 색상 (모든 테마 공통)
        status: {
          success: '#3D8B8E',
          'success-light': '#E6F4F4',
          warning: '#C4940A',
          'warning-light': '#FEF9E7',
          danger: '#C45A5A',
          'danger-light': '#FEF2F2',
          info: '#2E6AB3',
          'info-light': '#EBF4FF',
        },
        // 돌봄 유형 색상
        care: {
          visit: '#2E6AB3',      // 방문 돌봄 (파란색)
          phone: '#7C6B9E',      // 전화 돌봄 (보라색)
          emergency: '#C45A5A',  // 긴급 (빨간색)
        },
      },
      spacing: {
        // 4px 기반 시스템
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },
      borderRadius: {
        'checkbox': '4px',
        'badge': '6px',
        'button': '8px',
        'input': '8px',
        'card': '12px',
        'modal': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      minHeight: {
        'button-sm': '32px',
        'button-md': '40px',
        'button-lg': '48px',
        'input': '48px',
      },
    },
  },
  plugins: [],
};

export default config;
```

### CSS Variables for Theme Switching
```css
/* globals.css */
:root {
  --color-primary: #2E6AB3;
  --color-primary-light: #4A8AD4;
  --color-primary-dark: #1E4A7A;
  --color-primary-bg: #EBF4FF;
}

[data-theme="nature-green"] {
  --color-primary: #3D7A5A;
  --color-primary-light: #5A9A7B;
  --color-primary-dark: #2A5A40;
  --color-primary-bg: #EDF7F0;
}

[data-theme="heritage-red"] {
  --color-primary: #B85450;
  --color-primary-light: #D4736F;
  --color-primary-dark: #8B3D3A;
  --color-primary-bg: #FDF2F2;
}

[data-theme="official-navy"] {
  --color-primary: #3D4A5C;
  --color-primary-light: #5A6A7E;
  --color-primary-dark: #2A3A42;
  --color-primary-bg: #F0F2F5;
}

[data-theme="warm-gold"] {
  --color-primary: #9A7B4F;
  --color-primary-light: #BB976A;
  --color-primary-dark: #6E5636;
  --color-primary-bg: #FBF7EE;
}
```

---

## 8. 접근성 구현 가이드

### Decision
Constitution I 접근성 원칙을 모든 컴포넌트에 적용

### Requirements Checklist
- [ ] 최소 글자 크기 12px (Tailwind: `text-xs` = 12px)
- [ ] 본문 글자 크기 14px 이상 (Tailwind: `text-sm` = 14px)
- [ ] 폰트 가중치 Regular(400) 이상만 사용
- [ ] 텍스트 대비율 WCAG AA (4.5:1) 준수
- [ ] 줄간격 1.5배 이상 (Tailwind: `leading-relaxed` = 1.625)
- [ ] 클릭/터치 영역 최소 44x44px (Tailwind: `min-h-11 min-w-11`)

### Implementation Notes
```tsx
// Button 컴포넌트 예시
<button className="min-h-11 min-w-11 px-6 py-3 text-sm font-medium leading-relaxed">
  로그인
</button>

// Input 컴포넌트 예시
<input className="h-12 px-4 text-sm font-normal leading-relaxed" />
```

---

## 9. API 목업 전략

### Decision
이번 피처에서는 프론트엔드 UI만 구현, API는 로컬 목업 함수로 시뮬레이션

### Rationale
- 백엔드 API가 아직 구현되지 않음
- UI 개발과 테스트를 위해 예측 가능한 응답 제공
- 추후 실제 API 연결 시 최소 변경으로 교체 가능하도록 추상화

### Implementation Pattern
```typescript
// lib/api/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  user?: { id: string; name: string; email: string };
  error?: string;
}

// 목업 구현
export async function login(data: LoginRequest): Promise<LoginResponse> {
  // 시뮬레이션을 위한 딜레이
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 테스트 계정
  if (data.email === 'test@example.com' && data.password === 'Test1234!') {
    return {
      success: true,
      user: { id: '1', name: '테스트 사용자', email: data.email },
    };
  }

  return {
    success: false,
    error: '이메일 또는 비밀번호가 올바르지 않습니다',
  };
}
```

---

## Summary

| 영역 | 결정 사항 |
|------|-----------|
| 컴포넌트 구조 | Server/Client Component 혼합 사용 |
| 폼 유효성 | React Hook Form + Zod |
| 비밀번호 강도 | 실시간 체크리스트 UI |
| 이메일 인증 | 인증 코드 입력 방식 |
| 지역/기관 선택 | 연쇄 드롭다운 |
| 파일 업로드 | 드래그 앤 드롭 + 클릭 |
| 스타일링 | Tailwind CSS + Constitution 테마 |
| 접근성 | WCAG AA 준수 |
| API | 로컬 목업 함수 |

모든 기술적 결정은 Constitution 원칙과 기능 명세를 준수합니다.
