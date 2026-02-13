// ============================================================
// Excel/PDF 내보내기 유틸리티
// T006: SheetJS(xlsx) 사용 Excel 내보내기
// ============================================================

import * as XLSX from 'xlsx';
import type { Recipient, RecipientExportData, Manager, ManagerExportData } from '@/types/dashboard';
import { formatDate } from './date';
import { getRecipientStatusLabel, getManagerStatusLabel } from './status';

// ============================================================
// Excel 내보내기
// ============================================================

/**
 * 대상자 목록을 Excel 파일로 내보내기
 */
export function exportRecipientsToExcel(recipients: Recipient[], filename?: string): void {
  // 데이터 변환
  const exportData: RecipientExportData[] = recipients.map((recipient) => ({
    '대상자 이름': recipient.name,
    '주소': `${recipient.dong} ${recipient.address}`,
    '담당 매니저': recipient.managerName,
    '최근 방문': formatDate(recipient.lastVisitDate),
    '방문 횟수': recipient.visitCount,
    '상태': getRecipientStatusLabel(recipient.status),
  }));

  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // 컬럼 너비 설정
  worksheet['!cols'] = [
    { wch: 15 }, // 대상자 이름
    { wch: 30 }, // 주소
    { wch: 12 }, // 담당 매니저
    { wch: 12 }, // 최근 방문
    { wch: 10 }, // 방문 횟수
    { wch: 10 }, // 상태
  ];

  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '대상자 목록');

  // 파일명 생성 (기본: 대상자목록_YYYYMMDD.xlsx)
  const today = new Date();
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const defaultFilename = `대상자목록_${dateStr}.xlsx`;

  // 파일 다운로드
  XLSX.writeFile(workbook, filename || defaultFilename);
}

/**
 * 매니저 목록을 Excel 파일로 내보내기
 */
export function exportManagersToExcel(managers: Manager[], filename?: string): void {
  // 데이터 변환
  const exportData: ManagerExportData[] = managers.map((manager) => ({
    '매니저명': manager.name,
    '소속 센터': manager.centerName,
    '담당 동': manager.assignedDongs.join(', '),
    '담당 대상자 수': manager.recipientCount,
    '이번 달 방문': manager.monthlyVisits,
    '상태': getManagerStatusLabel(manager.status),
  }));

  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // 컬럼 너비 설정
  worksheet['!cols'] = [
    { wch: 12 }, // 매니저명
    { wch: 25 }, // 소속 센터
    { wch: 20 }, // 담당 동
    { wch: 15 }, // 담당 대상자 수
    { wch: 12 }, // 이번 달 방문
    { wch: 10 }, // 상태
  ];

  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '매니저 목록');

  // 파일명 생성 (기본: 매니저목록_YYYYMMDD.xlsx)
  const today = new Date();
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const defaultFilename = `매니저목록_${dateStr}.xlsx`;

  // 파일 다운로드
  XLSX.writeFile(workbook, filename || defaultFilename);
}

/**
 * 일반 데이터를 Excel 파일로 내보내기
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  sheetName: string,
  filename: string
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}

// ============================================================
// PDF 내보내기 헬퍼 (react-to-print와 함께 사용)
// ============================================================

/**
 * 프린트 스타일 생성 (react-to-print에서 사용)
 */
export function getPrintStyles(): string {
  return `
    @page {
      size: A4;
      margin: 20mm;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .no-print {
        display: none !important;
      }

      .print-break-before {
        page-break-before: always;
      }

      .print-break-after {
        page-break-after: always;
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }

      th, td {
        border: 1px solid #e5e7eb;
        padding: 8px;
        text-align: left;
      }

      th {
        background-color: #f3f4f6;
        font-weight: 600;
      }
    }
  `;
}

/**
 * PDF 내보내기용 컴포넌트 래퍼 클래스명
 */
export const printContainerClass = 'print-container';
export const noPrintClass = 'no-print';
export const printBreakBeforeClass = 'print-break-before';
export const printBreakAfterClass = 'print-break-after';

// ============================================================
// 파일 다운로드 헬퍼
// ============================================================

/**
 * Blob을 파일로 다운로드
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * JSON 데이터를 파일로 다운로드
 */
export function downloadJSON<T>(data: T, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, filename);
}

/**
 * CSV 문자열을 파일로 다운로드
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // BOM 추가 (한글 호환)
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}
