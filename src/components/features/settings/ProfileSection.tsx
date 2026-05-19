'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { UserProfile } from '@/types/settings';

interface ProfileSectionProps {
  profile: UserProfile;
  onSave: (data: Partial<UserProfile>) => Promise<void>;
  onPasswordChange: () => void;
}

/**
 * 내 프로필 섹션
 * 보기 모드: 아바타, 이름, 역할, 이메일, 전화번호, 가입일
 * 편집 모드: 이름/연락처 인라인 편집, 이메일/비밀번호 별도 변경
 */
export function ProfileSection({ profile, onSave, onPasswordChange }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const formattedDate = new Date(profile.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const handleEditStart = () => {
    setEditName(profile.name);
    setEditPhone(profile.phone);
    setEditEmail(profile.email);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ name: editName, phone: editPhone, email: editEmail });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card variant="default" padding="md" className="h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-h3 font-semibold text-neutral-text flex items-center gap-2 whitespace-nowrap">
          <svg className="w-5 h-5 flex-shrink-0 text-neutral-text-sub" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          내 프로필
        </h2>
        {!isEditing ? (
          <Button variant="primary" size="sm" onClick={handleEditStart} className="flex-shrink-0 w-fit !min-h-0 !py-1 !px-2">
            수정
          </Button>
        ) : (
          <div className="flex items-center gap-2 flex-shrink-0 w-fit ml-auto">
            <Button variant="secondary" size="sm" onClick={handleCancel} disabled={saving} className="w-fit !min-h-0 !py-1 !px-2 whitespace-nowrap">
              취소
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving} className="w-fit !min-h-0 !py-1 !px-2 whitespace-nowrap">
              저장
            </Button>
          </div>
        )}
      </div>

      {/* 프로필 정보 */}
      <div className="flex items-start gap-4 mb-5">
        {/* 이니셜 아바타 */}
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary-bg text-primary font-bold text-h2">
          {profile.avatarInitials}
        </div>

        {/* 상세 정보 */}
        <div className="flex-1 min-w-0">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-body-lg font-semibold text-neutral-text whitespace-nowrap">
                  {profile.name}
                </span>
                <Badge variant="info" size="sm">
                  {profile.roleLabel}
                </Badge>
              </div>
              <div className="space-y-1 text-body text-neutral-text-sub">
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="whitespace-nowrap">{profile.phone}</span>
                </p>
                <p className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate min-w-0 flex-1" title={profile.email}>{profile.email}</span>
                </p>
                <p className="text-caption text-neutral-text-tertiary whitespace-nowrap">
                  가입일: {formattedDate}
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm">
                  {profile.roleLabel}
                </Badge>
              </div>
              <Input
                label="이름"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                name="editName"
              />
              <Input
                label="연락처"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                name="editPhone"
              />
              <Input
                label="이메일"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                name="editEmail"
              />
            </div>
          )}
        </div>
      </div>

      {/* 비밀번호 변경 영역 */}
      <div className="border-t border-neutral-border pt-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-border">
          <div className="min-w-0 mr-3">
            <span className="block text-caption text-neutral-text-sub">비밀번호</span>
            <span className="block text-body font-medium text-neutral-text">●●●●●●●●</span>
          </div>
          <Button variant="soft" size="sm" onClick={onPasswordChange} className="flex-shrink-0 w-fit whitespace-nowrap">
            변경
          </Button>
        </div>
      </div>
    </Card>
  );
}
