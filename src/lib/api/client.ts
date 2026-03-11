/**
 * HTTP API 클라이언트
 *
 * core-backend의 /core/dashboard/* 엔드포인트와 통신.
 * 모든 응답은 { ok: boolean, data?: T, error?: { code, message } } 형태.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4100/core/dashboard';

export interface ApiEnvelope<T = unknown> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string };
}

/**
 * 공통 fetch 래퍼
 *
 * @throws {ApiError} 4xx/5xx 응답 시
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const method = init?.method || 'GET';

  // 저장된 토큰 읽기
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('auth-storage');
      if (raw) {
        const parsed = JSON.parse(raw);
        token = parsed?.state?.token ?? null;
      }
    } catch {
      /* noop */
    }
  }

  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };

  // Content-Type은 body가 있는 요청에만 설정
  if (init?.body) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // ── 요청 로깅 ──
  console.log(`[API 요청] ${method} ${url}`);
  if (init?.body) {
    try {
      console.log('[API 요청 Body]', JSON.parse(init.body as string));
    } catch {
      console.log('[API 요청 Body]', init.body);
    }
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers,
    });
  } catch (networkErr) {
    console.error(`[API 네트워크 에러] ${method} ${url}`, networkErr);
    throw new ApiError(
      '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.',
      'NETWORK_ERROR',
      0
    );
  }

  // ── 응답 로깅 ──
  console.log(`[API 응답] ${method} ${url} → ${res.status}`);

  let body: ApiEnvelope<T>;
  try {
    body = await res.json();
  } catch {
    console.error(`[API 파싱 에러] ${method} ${url} → HTTP ${res.status} (JSON 파싱 실패)`);
    throw new ApiError(
      `서버 응답을 파싱할 수 없습니다 (HTTP ${res.status})`,
      'PARSE_ERROR',
      res.status
    );
  }

  console.log(`[API 응답 Body]`, body);

  if (!body.ok) {
    console.warn(`[API 실패] ${method} ${url} →`, body.error);
    throw new ApiError(
      body.error?.message || `API error (${res.status})`,
      body.error?.code || 'UNKNOWN',
      res.status
    );
  }

  return body.data as T;
}

/**
 * 커스텀 API 에러 클래스
 */
export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// =====================================================
// 편의 함수
// =====================================================

export function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'DELETE' });
}
