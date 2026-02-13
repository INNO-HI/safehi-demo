'use client';

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { cn } from '@/lib/utils/cn';
import { formatFileSize } from '@/lib/utils/format';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // bytes
  required?: boolean;
  error?: string;
  hint?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
}

const DEFAULT_ACCEPT = '.pdf,.jpg,.jpeg,.png';
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * 파일 업로드 컴포넌트
 * - 드래그 앤 드롭 지원
 * - 클릭하여 선택
 * - 파일 미리보기 (이름, 크기)
 * - 파일 크기/형식 검증
 */
export function FileUpload({
  label,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  required = false,
  error,
  hint,
  value,
  onChange,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayError = error || localError;

  const validateFile = useCallback(
    (file: File): string | null => {
      // 파일 크기 검증
      if (file.size > maxSize) {
        return `파일 크기는 ${formatFileSize(maxSize)} 이하여야 합니다.`;
      }

      // 파일 형식 검증
      const allowedExtensions = accept
        .split(',')
        .map((ext) => ext.trim().toLowerCase().replace('.', ''));
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        return `허용된 파일 형식: ${accept}`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setLocalError(validationError);
        return;
      }

      setLocalError(null);
      onChange(file);
    },
    [validateFile, onChange]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
    setLocalError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="w-full">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-status-danger ml-1">*</span>}
        </label>
      )}

      {value ? (
        // 선택된 파일 표시
        <div className="flex items-center justify-between p-4 bg-primary-bg border border-primary rounded-card">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <div>
              <p className="text-body font-medium text-neutral-text">
                {value.name}
              </p>
              <p className="text-caption text-neutral-text-sub">
                {formatFileSize(value.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 text-neutral-text-sub hover:text-status-danger transition-colors"
            aria-label="파일 삭제"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ) : (
        // 업로드 영역
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center p-8',
            'border-2 border-dashed rounded-card cursor-pointer',
            'transition-colors duration-200',
            isDragging
              ? 'border-primary bg-primary-bg'
              : 'border-neutral-border hover:border-primary hover:bg-neutral-bg',
            displayError && 'border-status-danger'
          )}
        >
          <svg
            className={cn(
              'w-12 h-12 mb-4',
              isDragging ? 'text-primary' : 'text-neutral-text-tertiary'
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-body text-neutral-text mb-1">
            파일을 드래그하거나 클릭하여 선택하세요
          </p>
          <p className="text-caption text-neutral-text-sub">
            {accept.replace(/\./g, '').toUpperCase()} / 최대 {formatFileSize(maxSize)}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="sr-only"
        aria-hidden="true"
      />

      {hint && !displayError && (
        <p className="mt-1 text-caption text-neutral-text-sub">{hint}</p>
      )}

      {displayError && (
        <p className="form-error" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
