# Quickstart: SafeHi 인증 시스템

## 개요

이 가이드는 SafeHi 인증 시스템 기능을 빠르게 시작하기 위한 안내입니다.

## 사전 요구사항

- Node.js 18.17 이상
- pnpm (권장) 또는 npm

## 프로젝트 설정

### 1. Next.js 프로젝트 초기화 (프로젝트가 없는 경우)

```bash
npx create-next-app@14 safehi --typescript --tailwind --eslint --app --src-dir
cd safehi
```

### 2. 필수 의존성 설치

```bash
# 폼 유효성 검증
pnpm add react-hook-form @hookform/resolvers zod

# 상태 관리
pnpm add zustand

# 개발 의존성
pnpm add -D @types/node
```

### 3. Pretendard 폰트 설정

```bash
pnpm add pretendard
```

`src/app/layout.tsx`에 폰트 import 추가:

```tsx
import 'pretendard/dist/web/variable/pretendardvariable.css';
```

`tailwind.config.ts` 수정 (SafeHi 디자인 시스템 적용):

```typescript
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

### 4. 글로벌 스타일 설정

`src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables for Theme Switching */
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

@layer base {
  html {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
      'Malgun Gothic', sans-serif;
  }

  body {
    @apply bg-neutral-bg text-neutral-text antialiased;
    font-size: 14px;
    line-height: 1.6;
  }
}

@layer components {
  /* 인증 페이지 카드 레이아웃 */
  .auth-card {
    @apply mx-auto w-full max-w-md rounded-card bg-white p-6 shadow-card;
  }

  /* 입력 필드 기본 스타일 */
  .input-field {
    @apply min-h-input w-full rounded-input border border-neutral-border
           bg-[#F8FAFC] px-4 py-3 text-body text-neutral-text
           placeholder-neutral-text-tertiary
           focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-light;
  }

  /* 입력 필드 에러 상태 */
  .input-field-error {
    @apply border-status-danger bg-status-danger-light
           focus:border-status-danger focus:ring-status-danger;
  }

  /* 버튼 기본 스타일 */
  .btn-primary {
    @apply flex min-h-button-lg w-full items-center justify-center rounded-button
           bg-primary px-4 py-3 text-body font-semibold text-white
           transition-colors hover:bg-primary-dark
           disabled:cursor-not-allowed disabled:opacity-50;
  }

  /* 버튼 Secondary/Ghost */
  .btn-secondary {
    @apply flex min-h-button-lg items-center justify-center rounded-button
           border border-primary bg-transparent px-4 py-3 text-body font-semibold text-primary
           transition-colors hover:bg-primary-bg
           disabled:cursor-not-allowed disabled:opacity-50;
  }

  /* 버튼 Danger */
  .btn-danger {
    @apply flex min-h-button-lg items-center justify-center rounded-button
           bg-status-danger px-4 py-3 text-body font-semibold text-white
           transition-colors hover:opacity-90
           disabled:cursor-not-allowed disabled:opacity-50;
  }

  /* 버튼 Soft */
  .btn-soft {
    @apply flex min-h-button-lg items-center justify-center rounded-button
           bg-primary-bg px-4 py-3 text-body font-semibold text-primary
           transition-colors hover:bg-primary-light hover:text-white
           disabled:cursor-not-allowed disabled:opacity-50;
  }

  /* 폼 라벨 */
  .form-label {
    @apply mb-2 block text-label text-neutral-text;
  }

  /* 폼 에러 메시지 */
  .form-error {
    @apply mt-1 text-caption text-status-danger;
  }

  /* 링크 스타일 */
  .link {
    @apply text-body text-primary hover:underline;
  }
}
```

## 폴더 구조 생성

```bash
# 인증 페이지 라우트
mkdir -p src/app/\(auth\)/login
mkdir -p src/app/\(auth\)/register
mkdir -p src/app/\(auth\)/forgot-password
mkdir -p src/app/\(auth\)/reset-password
mkdir -p src/app/\(auth\)/organization-verify

# 컴포넌트
mkdir -p src/components/ui
mkdir -p src/components/features/auth

# 훅, 유틸리티, 타입
mkdir -p src/hooks
mkdir -p src/lib/api
mkdir -p src/lib/validations
mkdir -p src/lib/utils
mkdir -p src/types
```

## 기본 컴포넌트 생성

### 1. Button 컴포넌트

`src/components/ui/Button.tsx`:

```tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-primary bg-gray-100 text-gray-700 hover:bg-gray-200',
      link: 'text-primary hover:underline',
    };

    return (
      <button
        ref={ref}
        className={cn(variants[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? '처리 중...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 2. Input 컴포넌트

`src/components/ui/Input.tsx`:

```tsx
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'input-field',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### 3. cn 유틸리티

`src/lib/utils/cn.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```bash
pnpm add clsx tailwind-merge
```

## 유효성 검증 스키마

`src/lib/validations/auth.ts`:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, '이름은 2자 이상이어야 합니다').max(50, '이름은 50자 이하여야 합니다'),
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다')
      .regex(/\d/, '숫자를 포함해야 합니다'),
    passwordConfirm: z.string(),
    phone: z.string().regex(/^010-\d{4}-\d{4}$/, '올바른 연락처 형식이 아닙니다 (010-0000-0000)'),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: '이용약관에 동의해야 합니다' }),
    }),
    agreePrivacy: z.literal(true, {
      errorMap: () => ({ message: '개인정보 처리방침에 동의해야 합니다' }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
```

## 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속

## 다음 단계

1. `/speckit.tasks` 명령으로 구현 태스크 생성
2. 태스크 순서대로 UI 컴포넌트 구현
3. 각 페이지 라우트에 폼 컴포넌트 연결
4. API 목업 함수 구현 및 연동

## 테스트 계정

로그인 테스트용 계정:
- 이메일: `test@example.com`
- 비밀번호: `Test1234!`
