'use client';

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { Button, Alert, CascadingSelect, FileUpload } from '@/components/ui';
import {
  organizationVerifySchema,
  type OrganizationVerifyFormData,
} from '@/lib/validations/auth';
import { requestOrganizationVerification } from '@/lib/api/auth';
import {
  getRegions,
  getDistrictsByRegion,
  getOrganizationsByDistrict,
} from '@/lib/api/regions';
import type { SelectOption } from '@/components/ui/Select';

/**
 * 기관 소속 인증 폼 컴포넌트
 * - 시/도 → 구/군 → 기관 연쇄 선택
 * - 직원 증빙 서류 업로드 (선택)
 * - 기타 메모 입력 (선택)
 */
export function OrganizationVerifyForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 선택된 지역/구군에 따른 옵션 관리
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrganizationVerifyFormData>({
    resolver: zodResolver(organizationVerifySchema),
    defaultValues: {
      regionId: '',
      districtId: '',
      organizationId: '',
      memo: '',
      document: undefined,
    },
  });

  // 지역 옵션
  const regionOptions: SelectOption[] = useMemo(
    () =>
      getRegions().map((region) => ({
        value: region.id,
        label: region.name,
      })),
    []
  );

  // 구/군 옵션 (선택된 지역에 따라)
  const districtOptions: SelectOption[] = useMemo(
    () =>
      selectedRegion
        ? getDistrictsByRegion(selectedRegion).map((district) => ({
            value: district.id,
            label: district.name,
          }))
        : [],
    [selectedRegion]
  );

  // 기관 옵션 (선택된 구/군에 따라)
  const organizationOptions: SelectOption[] = useMemo(
    () =>
      selectedDistrict
        ? getOrganizationsByDistrict(selectedDistrict).map((org) => ({
            value: org.id,
            label: org.name,
          }))
        : [],
    [selectedDistrict]
  );

  // 지역 변경 시 구/군, 기관 초기화
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedDistrict('');
    setValue('regionId', value);
    setValue('districtId', '');
    setValue('organizationId', '');
  };

  // 구/군 변경 시 기관 초기화
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setValue('districtId', value);
    setValue('organizationId', '');
  };

  const onSubmit = async (data: OrganizationVerifyFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await requestOrganizationVerification(data);

      if (response.success) {
        setIsSuccess(true);
      } else {
        setServerError(response.error || '인증 요청에 실패했습니다.');
      }
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <Alert variant="success" title="인증 요청 완료">
          <p>기관 소속 인증 요청이 접수되었습니다.</p>
          <p className="mt-2 text-body-sm">
            관리자 승인까지 1~2 영업일이 소요됩니다.
            <br />
            승인 완료 시 등록된 이메일로 알림을 보내드립니다.
          </p>
        </Alert>

        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="primary" fullWidth>
              대시보드로 이동
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 안내 문구 */}
      <p className="text-body text-neutral-text-sub">
        돌봄 매니저로 활동하려면 소속 기관 인증이 필요합니다.
        소속 기관을 선택하고 증빙 서류를 제출해주세요.
      </p>

      {/* 서버 에러 메시지 */}
      {serverError && (
        <Alert variant="danger" dismissible onDismiss={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      {/* 지역/구군/기관 연쇄 선택 */}
      <Controller
        name="organizationId"
        control={control}
        render={({ field }) => (
          <CascadingSelect
            regionOptions={regionOptions}
            regionValue={selectedRegion}
            onRegionChange={handleRegionChange}
            regionError={errors.regionId?.message}
            districtOptions={districtOptions}
            districtValue={selectedDistrict}
            onDistrictChange={handleDistrictChange}
            districtError={errors.districtId?.message}
            organizationOptions={organizationOptions}
            organizationValue={field.value}
            onOrganizationChange={(value) => {
              field.onChange(value);
            }}
            organizationError={errors.organizationId?.message}
            required
          />
        )}
      />

      {/* 직원 증빙 서류 */}
      <Controller
        name="document"
        control={control}
        render={({ field }) => (
          <FileUpload
            label="직원 증빙 서류"
            hint="재직증명서, 사원증 등 소속을 확인할 수 있는 서류"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={10 * 1024 * 1024}
            value={field.value || null}
            onChange={field.onChange}
            error={errors.document?.message}
          />
        )}
      />

      {/* 기타 메모 */}
      <Controller
        name="memo"
        control={control}
        render={({ field }) => (
          <div className="w-full">
            <label className="form-label">기타 메모</label>
            <textarea
              {...field}
              placeholder="추가로 전달할 내용이 있으면 입력해주세요 (선택)"
              rows={3}
              className="input-field resize-none"
            />
          </div>
        )}
      />

      {/* 인증 요청 버튼 */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        인증 요청하기
      </Button>

      {/* 나중에 하기 링크 */}
      <p className="text-center text-body-sm text-neutral-text-sub">
        <Link href="/dashboard" className="link">
          나중에 하기
        </Link>
      </p>
    </form>
  );
}
