'use client';

import { forwardRef } from 'react';

// ============================================================
// ProfileButton 컴포넌트
// T023: 이니셜 아바타 프로필 버튼
// ============================================================

interface ProfileButtonProps {
  /** 사용자 이름 */
  name: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 이미지 URL (있으면 이니셜 대신 표시) */
  imageUrl?: string;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 추가 클래스 */
  className?: string;
}

// 크기별 스타일
const sizeStyles = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

/**
 * 이름에서 이니셜 추출
 */
function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

/**
 * 이름 기반 배경색 생성 (일관된 색상)
 */
function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * ProfileButton 컴포넌트
 * 이니셜 아바타를 표시하는 프로필 버튼
 */
export const ProfileButton = forwardRef<HTMLButtonElement, ProfileButtonProps>(
  function ProfileButton(
    { name, onClick, imageUrl, size = 'md', className = '' },
    ref
  ) {
    const initial = getInitial(name);
    const bgColor = getAvatarColor(name);

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={`${name} 프로필`}
        className={`
          relative flex items-center justify-center
          rounded-full font-semibold text-white
          transition-transform duration-200
          hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${sizeStyles[size]}
          ${!imageUrl ? bgColor : ''}
          ${className}
        `}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}
      </button>
    );
  }
);

export default ProfileButton;
