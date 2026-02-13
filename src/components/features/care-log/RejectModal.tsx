'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface RejectModalProps {
  open: boolean;
  onClose: () => void;
  onReject: (reason: string) => Promise<void>;
  isProcessing: boolean;
  title?: string;
  placeholder?: string;
  submitText?: string;
  minLength?: number;
}

/**
 * 반려 사유 입력 모달 컴포넌트
 */
export function RejectModal({
  open,
  onClose,
  onReject,
  isProcessing,
  title = '돌봄 일지 반려',
  placeholder = '반려 사유를 10자 이상 입력해주세요.',
  submitText = '반려',
  minLength = 10,
}: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // 유효성 검사
    if (!reason.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    if (reason.trim().length < minLength) {
      setError(`내용은 ${minLength}자 이상 입력해야 합니다.`);
      return;
    }

    setError(null);
    await onReject(reason);
    setReason('');
    onClose();
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isProcessing}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            disabled={isProcessing || !reason.trim()}
          >
            {isProcessing ? '처리 중...' : submitText}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          내용을 입력해주세요. 담당 매니저에게 전달됩니다.
        </p>

        <div>
          <label
            htmlFor="reject-reason"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            disabled={isProcessing}
          />
          <div className="flex justify-between mt-1">
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-neutral-400">
              {reason.length}/500
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
