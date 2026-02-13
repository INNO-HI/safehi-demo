'use client';

import { forwardRef, useId, useState, useCallback } from 'react';

// ============================================================
// SearchInput 컴포넌트
// T009: 검색창 컴포넌트
// ============================================================

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** 입력 지연 시간 (ms) - 검색 성능 최적화 */
  debounceMs?: number;
  /** 검색 버튼 클릭 핸들러 */
  onSearch?: () => void;
  /** 비활성화 */
  disabled?: boolean;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 접근성 라벨 */
  ariaLabel?: string;
  /** 초기화 버튼 표시 */
  showClear?: boolean;
}

// 크기별 스타일
const sizeStyles = {
  sm: 'h-9 text-sm pl-9 pr-9',
  md: 'h-11 text-base pl-10 pr-10',
  lg: 'h-12 text-lg pl-11 pr-11',
};

// 아이콘 크기별 스타일
const iconSizeStyles = {
  sm: 'w-4 h-4 left-2.5',
  md: 'w-5 h-5 left-3',
  lg: 'w-5 h-5 left-3.5',
};

// 클리어 버튼 위치
const clearButtonStyles = {
  sm: 'right-2',
  md: 'right-2.5',
  lg: 'right-3',
};

/**
 * SearchInput 컴포넌트
 * 검색창에 사용
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    onChange,
    placeholder = '검색어를 입력하세요',
    className = '',
    debounceMs = 0,
    onSearch,
    disabled = false,
    size = 'md',
    ariaLabel = '검색',
    showClear = true,
  },
  ref
) {
  const id = useId();
  const [localValue, setLocalValue] = useState(value);

  // 디바운스 처리
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (debounceMs > 0) {
        const timeoutId = setTimeout(() => {
          onChange(newValue);
        }, debounceMs);
        return () => clearTimeout(timeoutId);
      } else {
        onChange(newValue);
      }
    },
    [onChange, debounceMs]
  );

  // 초기화
  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  // Enter 키 처리
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        e.preventDefault();
        onSearch();
      }
    },
    [onSearch]
  );

  const showClearButton = showClear && localValue.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* 검색 아이콘 */}
      <svg
        className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none ${iconSizeStyles[size]}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* 입력 필드 */}
      <input
        ref={ref}
        id={id}
        type="search"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`
          w-full rounded-lg border border-neutral-300
          bg-white text-neutral-900
          placeholder:text-neutral-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          transition-colors duration-200
          ${sizeStyles[size]}
        `}
      />

      {/* 초기화 버튼 */}
      {showClearButton && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="검색어 지우기"
          className={`
            absolute top-1/2 -translate-y-1/2
            w-5 h-5 flex items-center justify-center
            text-neutral-400 hover:text-neutral-600
            rounded-full hover:bg-neutral-100
            transition-colors duration-200
            ${clearButtonStyles[size]}
          `}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
});

export default SearchInput;
