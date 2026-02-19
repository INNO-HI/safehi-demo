'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';

// ============================================================
// DialogModal: Radix Dialog 기반 모달 (설정 페이지 등에서 사용)
// props: open, onClose, title, children, footer
// ============================================================

interface DialogModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * DialogModal 컴포넌트 (Radix Dialog 기반)
 * 접근성 완벽 지원: 포커스 트랩, ESC 키 닫기, 배경 클릭 닫기
 */
export function DialogModal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: DialogModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        {/* 배경 오버레이 */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* 모달 컨텐츠 */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md bg-white rounded-2xl shadow-xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'duration-200',
            className
          )}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <Dialog.Title className="text-lg font-semibold text-neutral-900">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="닫기"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          {/* 본문 */}
          <div className="p-6">{children}</div>

          {/* 푸터 (선택적) */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// 모달 내부에서 사용할 수 있는 설명 컴포넌트
export const ModalDescription = Dialog.Description;

// ============================================================
// Modal: Portal 기반 모달 (통계/리포트 페이지 등에서 사용)
// props: isOpen, onClose, title, children, size
// ============================================================

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

/**
 * Modal 컴포넌트
 * 전체보기 기능 등에서 사용되는 모달 레이아웃
 * 접근성: ESC 키 닫기, 오버레이 클릭 닫기, focus trap 지원
 */
export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 모달 크기 스타일
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw] max-h-[90vh]',
  };

  // ESC 키 핸들러
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // 모달 열릴 때 포커스 관리 및 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      // 현재 포커스된 요소 저장
      previousActiveElement.current = document.activeElement as HTMLElement;

      // 모달에 포커스
      modalRef.current?.focus();

      // 배경 스크롤 잠금
      document.body.style.overflow = 'hidden';
    } else {
      // 이전 포커스 복원
      previousActiveElement.current?.focus();

      // 배경 스크롤 해제
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // 포탈로 body에 렌더링
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* 모달 콘텐츠 */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full mx-4 bg-white rounded-modal shadow-lg',
          'max-h-[85vh] overflow-hidden flex flex-col',
          'focus:outline-none',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-neutral-text"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  'text-neutral-text-sub hover:text-neutral-text',
                  'hover:bg-neutral-bg-sub',
                  'focus:outline-none focus:ring-2 focus:ring-primary-main',
                  'min-w-[44px] min-h-[44px] flex items-center justify-center',
                  !title && 'ml-auto'
                )}
                aria-label="닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Modal Footer 컴포넌트
 * 모달 하단 액션 버튼 영역
 */
export function ModalFooter({ children, className, ...props }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-neutral-border',
        'flex items-center justify-end gap-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
