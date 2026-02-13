'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Card } from '@/components/ui/Card';

interface PhotoGridProps {
  photos: string[];
}

/**
 * 첨부 사진 그리드 컴포넌트
 * 썸네일 그리드로 표시하고 클릭 시 라이트박스로 확대합니다.
 */
export function PhotoGrid({ photos }: PhotoGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // 사진이 없는 경우
  if (photos.length === 0) {
    return null;
  }

  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">첨부 사진</h2>

      {/* 사진 그리드 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {photos.map((src, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setPhotoIndex(index);
              setIsOpen(true);
            }}
            className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={`사진 ${index + 1} 확대`}
          >
            {/* 실제 이미지 대신 placeholder 표시 (Mock) */}
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-neutral-400"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path
                  d="M21 15L16 10L5 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="absolute bottom-1 right-1 text-xs text-neutral-500 bg-white/80 px-1 rounded">
              {index + 1}
            </span>
          </button>
        ))}
      </div>

      <p className="text-sm text-neutral-500 mt-2">
        총 {photos.length}장의 사진
      </p>

      {/* 라이트박스 */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={photos.map((src) => ({
          src,
          // Mock 이미지이므로 placeholder 사용
          alt: '돌봄 일지 첨부 사진',
        }))}
        carousel={{ finite: photos.length <= 1 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
        }}
      />
    </Card>
  );
}
