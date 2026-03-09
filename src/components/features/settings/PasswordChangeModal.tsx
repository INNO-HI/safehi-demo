'use client';

import { useState } from 'react';
import { DialogModal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { changePassword } from '@/lib/mock-data/settings';

interface PasswordChangeModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 비밀번호 변경 모달
 * 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인 3단계
 */
export function PasswordChangeModal({ open, onClose }: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }
    if (!newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(newPassword)) {
      newErrors.newPassword = '영문, 숫자, 특수문자를 각각 1개 이상 포함해주세요.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setErrors({
        currentPassword: error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setSuccess(false);
    onClose();
  };

  return (
    <DialogModal
      open={open}
      onClose={handleClose}
      title="비밀번호 변경"
      footer={
        !success ? (
          <>
            <Button variant="secondary" size="md" onClick={handleClose} className="w-fit whitespace-nowrap">
              취소
            </Button>
            <Button variant="primary" size="md" onClick={handleSubmit} loading={loading} className="w-fit whitespace-nowrap">
              변경하기
            </Button>
          </>
        ) : undefined
      }
    >
      {success ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-green-100">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-body font-medium text-neutral-text">비밀번호가 변경되었습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="현재 비밀번호"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
            required
            name="currentPassword"
          />
          <Input
            label="새 비밀번호"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            hint="8자 이상, 영문·숫자·특수문자 포함"
            required
            name="newPassword"
          />
          <Input
            label="새 비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
            name="confirmPassword"
          />
        </div>
      )}
    </DialogModal>
  );
}
