'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// ============================================================
// useFilters 훅
// T016: URL 쿼리 파라미터 기반 필터 관리
// ============================================================

type FilterValue = string | number | boolean | null | undefined;

interface FilterConfig<T> {
  /** 필터 키 */
  key: keyof T;
  /** URL 파라미터 이름 */
  param?: string;
  /** 기본값 */
  defaultValue: T[keyof T];
  /** 파싱 함수 */
  parse?: (value: string) => T[keyof T];
  /** 직렬화 함수 */
  serialize?: (value: T[keyof T]) => string;
}

interface UseFiltersOptions<T> {
  /** 필터 설정 배열 */
  configs: FilterConfig<T>[];
  /** URL 업데이트 시 replace 사용 (기본: true) */
  replace?: boolean;
}

interface UseFiltersReturn<T> {
  /** 현재 필터 값 */
  filters: T;
  /** 단일 필터 업데이트 */
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  /** 여러 필터 일괄 업데이트 */
  setFilters: (newFilters: Partial<T>) => void;
  /** 모든 필터 초기화 */
  resetFilters: () => void;
  /** 특정 필터 초기화 */
  resetFilter: (key: keyof T) => void;
}

/**
 * URL 쿼리 파라미터 기반 필터 관리 훅
 */
export function useFilters<T extends Record<string, FilterValue>>(
  options: UseFiltersOptions<T>
): UseFiltersReturn<T> {
  const { configs, replace = true } = options;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 기본 파싱 함수
  const defaultParse = (value: string): FilterValue => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(Number(value))) return Number(value);
    return value;
  };

  // 기본 직렬화 함수
  const defaultSerialize = (value: FilterValue): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // 현재 필터 값 계산
  const filters = useMemo(() => {
    const result = {} as T;

    for (const config of configs) {
      const paramName = config.param || String(config.key);
      const urlValue = searchParams.get(paramName);

      if (urlValue !== null) {
        const parse = config.parse || defaultParse;
        result[config.key] = parse(urlValue) as T[keyof T];
      } else {
        result[config.key] = config.defaultValue;
      }
    }

    return result;
  }, [configs, searchParams]);

  // URL 업데이트 함수
  const updateURL = useCallback(
    (newFilters: Partial<T>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const config of configs) {
        const key = config.key;
        const paramName = config.param || String(key);
        const value = key in newFilters ? newFilters[key] : filters[key];
        const serialize = config.serialize || defaultSerialize;

        const serialized = serialize(value as T[keyof T]);

        if (
          serialized === '' ||
          serialized === defaultSerialize(config.defaultValue)
        ) {
          params.delete(paramName);
        } else {
          params.set(paramName, serialized);
        }
      }

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      if (replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [configs, filters, pathname, replace, router, searchParams]
  );

  // 단일 필터 업데이트
  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      updateURL({ [key]: value } as unknown as Partial<T>);
    },
    [updateURL]
  );

  // 여러 필터 일괄 업데이트
  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      updateURL(newFilters);
    },
    [updateURL]
  );

  // 모든 필터 초기화
  const resetFilters = useCallback(() => {
    const defaultFilters = {} as Partial<T>;
    for (const config of configs) {
      defaultFilters[config.key] = config.defaultValue;
    }
    updateURL(defaultFilters);
  }, [configs, updateURL]);

  // 특정 필터 초기화
  const resetFilter = useCallback(
    (key: keyof T) => {
      const config = configs.find((c) => c.key === key);
      if (config) {
        updateURL({ [key]: config.defaultValue } as Partial<T>);
      }
    },
    [configs, updateURL]
  );

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    resetFilter,
  };
}

// ============================================================
// 간단한 필터 훅 (단일 값)
// ============================================================

/**
 * 단일 문자열 필터 훅
 */
export function useStringFilter(
  paramName: string,
  defaultValue: string = ''
): [string, (value: string) => void] {
  const { filters, setFilter } = useFilters({
    configs: [
      {
        key: 'value' as const,
        param: paramName,
        defaultValue,
      },
    ],
  });

  return [
    filters.value as string,
    (value: string) => setFilter('value' as keyof typeof filters, value as typeof filters[keyof typeof filters]),
  ];
}

/**
 * 단일 숫자 필터 훅
 */
export function useNumberFilter(
  paramName: string,
  defaultValue: number = 0
): [number, (value: number) => void] {
  const { filters, setFilter } = useFilters({
    configs: [
      {
        key: 'value' as const,
        param: paramName,
        defaultValue,
        parse: (v) => parseInt(v, 10),
      },
    ],
  });

  return [
    filters.value as number,
    (value: number) => setFilter('value' as keyof typeof filters, value as typeof filters[keyof typeof filters]),
  ];
}

export default useFilters;
