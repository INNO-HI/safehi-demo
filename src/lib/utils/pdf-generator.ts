/**
 * PDF 생성 유틸리티
 * 통계/리포트 페이지에서 PDF 다운로드 기능 지원
 * html2canvas와 jspdf를 사용하여 실제 PDF 생성
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { StatisticsOverview, ReportType } from '@/types/statistics';

// PDF 생성 옵션
export interface PDFGeneratorOptions {
  month: string;
  data: StatisticsOverview;
  reportType?: ReportType;
}

// PDF 생성 결과
export interface PDFGeneratorResult {
  success: boolean;
  filename?: string;
  error?: string;
}

// 파일명 생성 헬퍼
function generateFilename(month: string, reportType?: ReportType): string {
  const typeLabel = reportType
    ? {
        monthly: '월간종합',
        manager: '매니저실적',
        recipient: '대상자현황',
        emergency: '긴급케이스',
      }[reportType]
    : '통계리포트';

  const [year, monthNum] = month.split('-');
  return `SafeHi_${typeLabel}_${year}년${monthNum}월.pdf`;
}

// 월 라벨 생성
function getMonthLabel(month: string): string {
  const [year, monthNum] = month.split('-');
  return `${year}년 ${parseInt(monthNum)}월`;
}

/**
 * 전체 통계 페이지를 PDF로 캡처하여 생성
 */
export async function generatePDF(
  options: PDFGeneratorOptions
): Promise<PDFGeneratorResult> {
  const { month, reportType } = options;

  try {
    // 통계 페이지 콘텐츠 영역 찾기
    const contentElement = document.getElementById('statistics-content');

    if (!contentElement) {
      return {
        success: false,
        error: 'PDF로 내보낼 콘텐츠를 찾을 수 없습니다.',
      };
    }

    // html2canvas로 페이지 캡처
    const canvas = await html2canvas(contentElement, {
      scale: 2, // 고해상도
      useCORS: true,
      logging: false,
      backgroundColor: '#F8FAFC', // 배경색 설정
      windowWidth: contentElement.scrollWidth,
      windowHeight: contentElement.scrollHeight,
    });

    // A4 사이즈 PDF 생성 (mm 단위)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // 이미지 비율 계산
    const imgWidth = pageWidth - 20; // 좌우 여백 10mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 헤더 추가
    pdf.setFontSize(16);
    pdf.setTextColor(31, 41, 55); // neutral-text 색상
    pdf.text(`SafeHi 통계 리포트`, 10, 15);

    pdf.setFontSize(12);
    pdf.setTextColor(100, 116, 139); // neutral-text-sub 색상
    pdf.text(`${getMonthLabel(month)} 기준`, 10, 22);

    // 생성 일시
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    pdf.setFontSize(10);
    pdf.text(`생성일시: ${dateStr}`, pageWidth - 50, 15);

    // 구분선
    pdf.setDrawColor(229, 231, 235); // border 색상
    pdf.line(10, 27, pageWidth - 10, 27);

    // 이미지가 페이지에 맞는지 확인하고 여러 페이지로 나누기
    const startY = 32;
    let remainingHeight = imgHeight;
    let sourceY = 0;
    let currentPage = 1;

    while (remainingHeight > 0) {
      const availableHeight = currentPage === 1 ? pageHeight - startY - 10 : pageHeight - 20;
      const heightToDraw = Math.min(remainingHeight, availableHeight);

      // 캔버스에서 해당 부분만 추출
      const sourceHeight = (heightToDraw / imgHeight) * canvas.height;

      if (currentPage > 1) {
        pdf.addPage();
      }

      // 이미지의 해당 부분을 PDF에 추가
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = sourceHeight;
      const tempCtx = tempCanvas.getContext('2d');

      if (tempCtx) {
        tempCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );

        const partImgData = tempCanvas.toDataURL('image/png');
        const yPosition = currentPage === 1 ? startY : 10;
        pdf.addImage(partImgData, 'PNG', 10, yPosition, imgWidth, heightToDraw);
      }

      sourceY += sourceHeight;
      remainingHeight -= heightToDraw;
      currentPage++;
    }

    // 푸터 추가 (마지막 페이지)
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(148, 163, 184);
      pdf.text(
        `${i} / ${totalPages}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
    }

    const filename = generateFilename(month, reportType);

    // PDF 다운로드
    pdf.save(filename);

    return {
      success: true,
      filename,
    };
  } catch (error) {
    console.error('[PDF Generator] 오류:', error);
    return {
      success: false,
      error: 'PDF 생성 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 전체 통계 리포트 PDF 생성
 */
export async function generateFullReportPDF(
  month: string,
  data: StatisticsOverview
): Promise<PDFGeneratorResult> {
  return generatePDF({ month, data });
}

/**
 * 월간 종합 리포트 PDF 생성
 */
export async function generateMonthlyReportPDF(
  month: string,
  data: StatisticsOverview
): Promise<PDFGeneratorResult> {
  return generatePDF({ month, data, reportType: 'monthly' });
}

/**
 * 매니저 실적 리포트 PDF 생성
 */
export async function generateManagerReportPDF(
  month: string,
  data: StatisticsOverview
): Promise<PDFGeneratorResult> {
  return generatePDF({ month, data, reportType: 'manager' });
}

/**
 * 대상자 현황 리포트 PDF 생성
 */
export async function generateRecipientReportPDF(
  month: string,
  data: StatisticsOverview
): Promise<PDFGeneratorResult> {
  return generatePDF({ month, data, reportType: 'recipient' });
}

/**
 * 긴급 케이스 리포트 PDF 생성
 */
export async function generateEmergencyReportPDF(
  month: string,
  data: StatisticsOverview
): Promise<PDFGeneratorResult> {
  return generatePDF({ month, data, reportType: 'emergency' });
}
