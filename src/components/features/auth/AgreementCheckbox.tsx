'use client';

import { Checkbox } from '@/components/ui';

interface Agreement {
  id: string;
  label: string;
  required: boolean;
  link?: string;
}

interface AgreementCheckboxProps {
  agreements: Agreement[];
  values: Record<string, boolean>;
  onChange: (values: Record<string, boolean>) => void;
  error?: string;
}

/**
 * 약관 동의 체크박스 그룹
 * - 전체 동의 기능
 * - 개별 약관 체크
 * - 필수/선택 구분
 */
export function AgreementCheckbox({
  agreements,
  values,
  onChange,
  error,
}: AgreementCheckboxProps) {
  const allChecked = agreements.every((agreement) => values[agreement.id]);

  const handleAllChange = () => {
    const newValue = !allChecked;
    const newValues: Record<string, boolean> = {};
    agreements.forEach((agreement) => {
      newValues[agreement.id] = newValue;
    });
    onChange(newValues);
  };

  const handleIndividualChange = (id: string) => {
    onChange({
      ...values,
      [id]: !values[id],
    });
  };

  return (
    <div className="space-y-3">
      {/* 전체 동의 */}
      <div className="p-3 bg-neutral-bg rounded-card">
        <Checkbox
          id="agreement-all"
          label={
            <span className="font-semibold text-neutral-text">
              전체 동의
            </span>
          }
          checked={allChecked}
          onChange={handleAllChange}
        />
      </div>

      {/* 구분선 */}
      <div className="border-t border-neutral-border" />

      {/* 개별 약관 */}
      <div className="space-y-2 pl-2">
        {agreements.map((agreement) => (
          <div key={agreement.id} className="flex items-center justify-between flex-nowrap gap-2">
            <Checkbox
              id={`agreement-${agreement.id}`}
              label={
                <span className="text-body-sm">
                  {agreement.required && (
                    <span className="text-status-danger mr-1">[필수]</span>
                  )}
                  {!agreement.required && (
                    <span className="text-neutral-text-tertiary mr-1">[선택]</span>
                  )}
                  {agreement.label}
                </span>
              }
              checked={values[agreement.id] || false}
              onChange={() => handleIndividualChange(agreement.id)}
            />
            {agreement.link && (
              <a
                href={agreement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption text-neutral-text-sub hover:text-primary underline shrink-0 whitespace-nowrap"
              >
                보기
              </a>
            )}
          </div>
        ))}
      </div>

      {/* 에러 메시지 - 고정 높이로 레이아웃 밀림 방지 */}
      <div className="min-h-[1.5rem]">
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

// 기본 약관 목록
export const defaultAgreements: Agreement[] = [
  {
    id: 'terms',
    label: '서비스 이용약관 동의',
    required: true,
    link: '/terms',
  },
  {
    id: 'privacy',
    label: '개인정보 처리방침 동의',
    required: true,
    link: '/privacy',
  },
  {
    id: 'marketing',
    label: '마케팅 정보 수신 동의',
    required: false,
  },
];
