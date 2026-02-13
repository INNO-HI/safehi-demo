'use client';

import { useState, useCallback, useMemo } from 'react';

// ============================================================
// useSelection 훅
// T017: 체크박스 선택 상태 관리
// ============================================================

interface UseSelectionOptions<T> {
  /** 전체 항목 목록 */
  items: T[];
  /** 항목 ID 추출 함수 */
  getItemId: (item: T) => string;
  /** 초기 선택된 ID 목록 */
  initialSelected?: string[];
}

interface UseSelectionReturn {
  /** 선택된 ID Set */
  selectedIds: Set<string>;
  /** 선택된 ID 배열 */
  selectedArray: string[];
  /** 선택된 항목 수 */
  selectedCount: number;
  /** 전체 선택 여부 */
  isAllSelected: boolean;
  /** 일부 선택 여부 (전체는 아님) */
  isIndeterminate: boolean;
  /** 선택 여부 확인 */
  isSelected: (id: string) => boolean;
  /** 단일 항목 선택/해제 토글 */
  toggleSelect: (id: string) => void;
  /** 단일 항목 선택 */
  select: (id: string) => void;
  /** 단일 항목 해제 */
  deselect: (id: string) => void;
  /** 전체 선택/해제 토글 */
  toggleSelectAll: () => void;
  /** 전체 선택 */
  selectAll: () => void;
  /** 전체 해제 */
  deselectAll: () => void;
  /** 여러 항목 선택 */
  selectMany: (ids: string[]) => void;
  /** 여러 항목 해제 */
  deselectMany: (ids: string[]) => void;
  /** 선택 초기화 */
  reset: () => void;
}

/**
 * 체크박스 선택 상태 관리 훅
 */
export function useSelection<T>({
  items,
  getItemId,
  initialSelected = [],
}: UseSelectionOptions<T>): UseSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(initialSelected)
  );

  // 전체 항목 ID 목록
  const allIds = useMemo(
    () => items.map((item) => getItemId(item)),
    [items, getItemId]
  );

  // 선택된 ID 배열
  const selectedArray = useMemo(
    () => Array.from(selectedIds),
    [selectedIds]
  );

  // 선택된 항목 수
  const selectedCount = selectedIds.size;

  // 전체 선택 여부
  const isAllSelected = useMemo(
    () => allIds.length > 0 && allIds.every((id) => selectedIds.has(id)),
    [allIds, selectedIds]
  );

  // 일부 선택 여부
  const isIndeterminate = useMemo(
    () => selectedIds.size > 0 && !isAllSelected,
    [selectedIds.size, isAllSelected]
  );

  // 선택 여부 확인
  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  // 단일 항목 토글
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // 단일 항목 선택
  const select = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // 단일 항목 해제
  const deselect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // 전체 선택/해제 토글
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  }, [isAllSelected, allIds]);

  // 전체 선택
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(allIds));
  }, [allIds]);

  // 전체 해제
  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // 여러 항목 선택
  const selectMany = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        next.add(id);
      }
      return next;
    });
  }, []);

  // 여러 항목 해제
  const deselectMany = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        next.delete(id);
      }
      return next;
    });
  }, []);

  // 초기화
  const reset = useCallback(() => {
    setSelectedIds(new Set(initialSelected));
  }, [initialSelected]);

  return {
    selectedIds,
    selectedArray,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    isSelected,
    toggleSelect,
    select,
    deselect,
    toggleSelectAll,
    selectAll,
    deselectAll,
    selectMany,
    deselectMany,
    reset,
  };
}

export default useSelection;
