'use client';

import { Select, type SelectOption } from './Select';

interface CascadingSelectProps {
  // 시/도 선택
  regionLabel?: string;
  regionPlaceholder?: string;
  regionOptions: SelectOption[];
  regionValue: string;
  onRegionChange: (value: string) => void;
  regionError?: string;

  // 구/군 선택
  districtLabel?: string;
  districtPlaceholder?: string;
  districtOptions: SelectOption[];
  districtValue: string;
  onDistrictChange: (value: string) => void;
  districtError?: string;
  districtDisabled?: boolean;

  // 기관 선택
  organizationLabel?: string;
  organizationPlaceholder?: string;
  organizationOptions: SelectOption[];
  organizationValue: string;
  onOrganizationChange: (value: string) => void;
  organizationError?: string;
  organizationDisabled?: boolean;

  required?: boolean;
}

/**
 * 연쇄 선택 컴포넌트
 * 시/도 → 구/군 → 기관 순차적 선택
 */
export function CascadingSelect({
  regionLabel = '시/도',
  regionPlaceholder = '시/도를 선택하세요',
  regionOptions,
  regionValue,
  onRegionChange,
  regionError,

  districtLabel = '구/군',
  districtPlaceholder = '구/군을 선택하세요',
  districtOptions,
  districtValue,
  onDistrictChange,
  districtError,
  districtDisabled = false,

  organizationLabel = '소속 기관',
  organizationPlaceholder = '기관을 선택하세요',
  organizationOptions,
  organizationValue,
  onOrganizationChange,
  organizationError,
  organizationDisabled = false,

  required = false,
}: CascadingSelectProps) {
  return (
    <div className="space-y-4">
      {/* 시/도 선택 */}
      <Select
        label={regionLabel}
        placeholder={regionPlaceholder}
        options={regionOptions}
        value={regionValue}
        onChange={(e) => onRegionChange(e.target.value)}
        error={regionError}
        required={required}
      />

      {/* 구/군 선택 */}
      <Select
        label={districtLabel}
        placeholder={districtPlaceholder}
        options={districtOptions}
        value={districtValue}
        onChange={(e) => onDistrictChange(e.target.value)}
        error={districtError}
        required={required}
        disabled={districtDisabled || !regionValue}
      />

      {/* 기관 선택 */}
      <Select
        label={organizationLabel}
        placeholder={organizationPlaceholder}
        options={organizationOptions}
        value={organizationValue}
        onChange={(e) => onOrganizationChange(e.target.value)}
        error={organizationError}
        required={required}
        disabled={organizationDisabled || !districtValue}
      />
    </div>
  );
}
