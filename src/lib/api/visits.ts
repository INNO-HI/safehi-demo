/**
 * 방문 기록 API
 * /core/dashboard/recipients/:id/visits
 */

import type { Visit } from '@/types/dashboard';
import { apiGet } from './client';

/**
 * 대상자별 방문 기록 조회
 */
export async function getVisitsByRecipientId(
  recipientId: string,
  dateStart?: Date | null,
  dateEnd?: Date | null
): Promise<Visit[]> {
  const params = new URLSearchParams();
  if (dateStart) params.set('dateStart', dateStart.toISOString());
  if (dateEnd) params.set('dateEnd', dateEnd.toISOString());

  const qs = params.toString();
  try {
    return await apiGet<Visit[]>(`/recipients/${recipientId}/visits${qs ? '?' + qs : ''}`);
  } catch {
    return [];
  }
}
