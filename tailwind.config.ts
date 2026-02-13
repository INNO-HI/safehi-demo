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
