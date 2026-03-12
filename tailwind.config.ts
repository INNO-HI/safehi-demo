import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'A2G',
          '-apple-system',
          'BlinkMacSystemFont',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      fontSize: {
        // 타입 스케일 (40~60대 최적화: 전반적으로 키움)
        'display': ['36px', { lineHeight: '140%', letterSpacing: '-0.5%', fontWeight: '700' }],
        'h1': ['28px', { lineHeight: '140%', letterSpacing: '-0.3%', fontWeight: '700' }],
        'h2': ['22px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '160%', letterSpacing: '0%', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '160%', letterSpacing: '0%', fontWeight: '400' }],
        'body-sm': ['15px', { lineHeight: '160%', letterSpacing: '0%', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '150%', letterSpacing: '0%', fontWeight: '400' }],
        'label': ['14px', { lineHeight: '150%', letterSpacing: '1%', fontWeight: '600' }],
      },
      colors: {
        // 기본 테마: 시민 블루 (Civic Blue)
        primary: {
          DEFAULT: '#448CFF',
          light: '#6BA3FF',
          dark: '#2B6AD9',
          bg: '#EBF2FF',
        },
        // Neutral 색상
        neutral: {
          text: '#1E293B',
          'text-sub': '#64748B',
          'text-tertiary': '#94A3B8',
          bg: '#F1F5F9',
          border: '#E2E8F0',
        },
        // Status 색상 (부드러운 톤)
        status: {
          success: '#6EA8FE',
          'success-light': '#EBF3FF',
          warning: '#F6C56F',
          'warning-light': '#FEF6E7',
          danger: '#F08C8C',
          'danger-light': '#FFF0F0',
          info: '#448CFF',
          'info-light': '#EBF2FF',
          muted: '#B9C3CF',
          'muted-light': '#F1F3F5',
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
        'elevated': '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        'urgent-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'urgent-pulse': 'urgent-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out',
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
