'use client';

import { useState, useCallback } from 'react';
import type { StatisticsOverview, ReportType } from '@/types/statistics';
import {
  generateFullReportPDF,
  generateMonthlyReportPDF,
  generateManagerReportPDF,
  generateRecipientReportPDF,
  generateEmergencyReportPDF,
} from '@/lib/utils/pdf-generator';

interface UseReportGeneratorState {
  isGenerating: boolean;
  generatingType: ReportType | 'full' | null;
  error: string | null;
  lastGeneratedFilename: string | null;
}

interface UseReportGeneratorReturn extends UseReportGeneratorState {
  generateFullReport: () => Promise<boolean>;
  generateReport: (type: ReportType) => Promise<boolean>;
  clearError: () => void;
}

/**
 * PDF 리포트 생성 훅
 * 통계 페이지에서 다양한 유형의 PDF 리포트 생성을 관리
 */
export function useReportGenerator(
  month: string,
  data: StatisticsOverview | null
): UseReportGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState<ReportType | 'full' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastGeneratedFilename, setLastGeneratedFilename] = useState<string | null>(null);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 전체 리포트 생성
  const generateFullReport = useCallback(async (): Promise<boolean> => {
    if (!data) {
      setError('데이터가 없어 리포트를 생성할 수 없습니다.');
      return false;
    }

    setIsGenerating(true);
    setGeneratingType('full');
    setError(null);

    try {
      const result = await generateFullReportPDF(month, data);

      if (result.success && result.filename) {
        setLastGeneratedFilename(result.filename);
        return true;
      } else {
        setError(result.error || 'PDF 생성에 실패했습니다.');
        return false;
      }
    } catch {
      setError('PDF 생성 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsGenerating(false);
      setGeneratingType(null);
    }
  }, [month, data]);

  // 특정 유형 리포트 생성
  const generateReport = useCallback(
    async (type: ReportType): Promise<boolean> => {
      if (!data) {
        setError('데이터가 없어 리포트를 생성할 수 없습니다.');
        return false;
      }

      setIsGenerating(true);
      setGeneratingType(type);
      setError(null);

      try {
        let result;

        switch (type) {
          case 'monthly':
            result = await generateMonthlyReportPDF(month, data);
            break;
          case 'manager':
            result = await generateManagerReportPDF(month, data);
            break;
          case 'recipient':
            result = await generateRecipientReportPDF(month, data);
            break;
          case 'emergency':
            result = await generateEmergencyReportPDF(month, data);
            break;
          default:
            throw new Error(`알 수 없는 리포트 유형: ${type}`);
        }

        if (result.success && result.filename) {
          setLastGeneratedFilename(result.filename);
          return true;
        } else {
          setError(result.error || 'PDF 생성에 실패했습니다.');
          return false;
        }
      } catch {
        setError('PDF 생성 중 오류가 발생했습니다.');
        return false;
      } finally {
        setIsGenerating(false);
        setGeneratingType(null);
      }
    },
    [month, data]
  );

  return {
    isGenerating,
    generatingType,
    error,
    lastGeneratedFilename,
    generateFullReport,
    generateReport,
    clearError,
  };
}
