'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps';
import { AlertTriangle, CheckCircle2, Clock3, XCircle } from 'lucide-react';

// ============================================================
// JejuDongMap 컴포넌트
// 제주시 동단위 돌봄 현황 지도
// ============================================================

type Status = '승인' | '대기' | '긴급' | '반려';

type DongMetric = {
  name: string;
  total: number;
  urgent: number;
  pending: number;
  approved: number;
  rejected: number;
  lat?: number;
  lng?: number;
};

type GeoJson = {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: { adm_nm?: string; [key: string]: unknown };
    geometry: unknown;
  }>;
};

const JEJU_GEOJSON_URL =
  'https://raw.githubusercontent.com/raqoon886/Local_HangJeongDong/master/hangjeongdong_%EC%A0%9C%EC%A3%BC%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EB%8F%84.geojson';

const STATUS_COLORS: Record<Status, { fill: string; text: string; soft: string }> = {
  승인: { fill: '#6EA8FE', text: '#3A7AEF', soft: '#EBF3FF' },
  대기: { fill: '#F6C56F', text: '#C08A20', soft: '#FEF6E7' },
  긴급: { fill: '#F08C8C', text: '#D96969', soft: '#FFF0F0' },
  반려: { fill: '#B9C3CF', text: '#8997A8', soft: '#F1F3F5' },
};

const DEFAULT_METRICS: DongMetric[] = [
  { name: '제주특별자치도 제주시 연동', total: 32, urgent: 4, pending: 7, approved: 18, rejected: 3, lat: 33.486, lng: 126.49 },
  { name: '제주특별자치도 제주시 노형동', total: 27, urgent: 2, pending: 6, approved: 17, rejected: 2, lat: 33.485, lng: 126.478 },
  { name: '제주특별자치도 제주시 이도2동', total: 21, urgent: 3, pending: 5, approved: 12, rejected: 1, lat: 33.499, lng: 126.536 },
  { name: '제주특별자치도 제주시 이도1동', total: 11, urgent: 1, pending: 2, approved: 7, rejected: 1, lat: 33.503, lng: 126.528 },
  { name: '제주특별자치도 제주시 아라동', total: 16, urgent: 1, pending: 4, approved: 10, rejected: 1, lat: 33.473, lng: 126.545 },
  { name: '제주특별자치도 제주시 삼도1동', total: 14, urgent: 1, pending: 4, approved: 8, rejected: 1, lat: 33.499, lng: 126.521 },
  { name: '제주특별자치도 제주시 삼도2동', total: 13, urgent: 2, pending: 3, approved: 7, rejected: 1, lat: 33.511, lng: 126.517 },
  { name: '제주특별자치도 제주시 용담1동', total: 15, urgent: 2, pending: 3, approved: 9, rejected: 1, lat: 33.512, lng: 126.512 },
  { name: '제주특별자치도 제주시 용담2동', total: 18, urgent: 2, pending: 4, approved: 11, rejected: 1, lat: 33.507, lng: 126.49 },
  { name: '제주특별자치도 제주시 건입동', total: 12, urgent: 1, pending: 3, approved: 7, rejected: 1, lat: 33.516, lng: 126.535 },
  { name: '제주특별자치도 제주시 화북동', total: 19, urgent: 3, pending: 4, approved: 11, rejected: 1, lat: 33.517, lng: 126.565 },
  { name: '제주특별자치도 제주시 삼양동', total: 17, urgent: 2, pending: 4, approved: 10, rejected: 1, lat: 33.521, lng: 126.586 },
  { name: '제주특별자치도 제주시 봉개동', total: 9, urgent: 1, pending: 2, approved: 5, rejected: 1, lat: 33.49, lng: 126.599 },
  { name: '제주특별자치도 제주시 오라동', total: 20, urgent: 2, pending: 5, approved: 12, rejected: 1, lat: 33.469, lng: 126.505 },
  { name: '제주특별자치도 제주시 외도동', total: 18, urgent: 1, pending: 5, approved: 11, rejected: 1, lat: 33.491, lng: 126.434 },
  { name: '제주특별자치도 제주시 이호동', total: 8, urgent: 1, pending: 1, approved: 5, rejected: 1, lat: 33.497, lng: 126.452 },
  { name: '제주특별자치도 제주시 도두동', total: 7, urgent: 1, pending: 1, approved: 4, rejected: 1, lat: 33.507, lng: 126.468 },
  { name: '제주특별자치도 제주시 애월읍', total: 22, urgent: 2, pending: 4, approved: 15, rejected: 1, lat: 33.463, lng: 126.331 },
  { name: '제주특별자치도 제주시 한림읍', total: 16, urgent: 1, pending: 3, approved: 11, rejected: 1, lat: 33.409, lng: 126.263 },
  { name: '제주특별자치도 제주시 한경면', total: 10, urgent: 1, pending: 2, approved: 6, rejected: 1, lat: 33.323, lng: 126.247 },
  { name: '제주특별자치도 제주시 조천읍', total: 24, urgent: 3, pending: 5, approved: 15, rejected: 1, lat: 33.54, lng: 126.637 },
  { name: '제주특별자치도 제주시 구좌읍', total: 19, urgent: 2, pending: 4, approved: 12, rejected: 1, lat: 33.517, lng: 126.81 },
  { name: '제주특별자치도 제주시 우도면', total: 6, urgent: 1, pending: 1, approved: 3, rejected: 1, lat: 33.505, lng: 126.955 },
];

function normalizeName(name?: string) {
  return (name || '').replace(/\s+/g, ' ').trim();
}

function getDominantStatus(metric: DongMetric): Status {
  if (metric.urgent > 0) return '긴급';
  if (metric.pending > 0) return '대기';
  if (metric.rejected > 0) return '반려';
  return '승인';
}

function getFillColor(metric?: DongMetric) {
  if (!metric) return '#EEF3F8';
  const status = getDominantStatus(metric);
  return STATUS_COLORS[status].fill;
}

function StatusBadge({ status, count }: { status: Status; count: number }) {
  const color = STATUS_COLORS[status];
  const Icon =
    status === '긴급'
      ? AlertTriangle
      : status === '대기'
      ? Clock3
      : status === '승인'
      ? CheckCircle2
      : XCircle;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status === '긴급' ? 'animate-urgent-pulse' : ''}`}
      style={{ backgroundColor: color.soft, color: color.text }}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{status}</span>
      <span className="opacity-80">{count}</span>
    </div>
  );
}

interface JejuDongMapProps {
  className?: string;
}

export default function JejuDongMap({ className = '' }: JejuDongMapProps) {
  const [geoData, setGeoData] = useState<GeoJson | null>(null);
  const [selectedName, setSelectedName] = useState<string>('제주특별자치도 제주시 연동');
  const [hoverName, setHoverName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    async function loadGeoJson() {
      try {
        setIsLoading(true);
        setError('');
        const response = await fetch(JEJU_GEOJSON_URL);
        if (!response.ok) {
          throw new Error(`GeoJSON 요청 실패: ${response.status}`);
        }
        const data = (await response.json()) as GeoJson;
        if (mounted) setGeoData(data);
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : '지도 데이터를 불러오지 못했습니다.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadGeoJson();
    return () => {
      mounted = false;
    };
  }, []);

  const jejuCityMetrics = useMemo(() => {
    return DEFAULT_METRICS.filter((item) => item.name.includes('제주시'));
  }, []);

  const metricMap = useMemo(() => {
    return new Map(jejuCityMetrics.map((item) => [normalizeName(item.name), item]));
  }, [jejuCityMetrics]);

  const selectedMetric = metricMap.get(selectedName) || jejuCityMetrics[0];

  const summaryData = [
    { name: '승인', value: selectedMetric.approved, color: STATUS_COLORS.승인.fill },
    { name: '대기', value: selectedMetric.pending, color: STATUS_COLORS.대기.fill },
    { name: '긴급', value: selectedMetric.urgent, color: STATUS_COLORS.긴급.fill },
    { name: '반려', value: selectedMetric.rejected, color: STATUS_COLORS.반려.fill },
  ].filter((item) => item.value > 0);

  const sortedMetrics = [...jejuCityMetrics].sort((a, b) => b.urgent - a.urgent || b.pending - a.pending || b.total - a.total);

  return (
    <div className={`grid gap-4 xl:grid-cols-[1.6fr_0.9fr] ${className}`}>
      {/* 지도 섹션 */}
      <section className="rounded-2xl border border-neutral-border/30 bg-white p-5 shadow-elevated">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-text">제주시 동단위 돌봄 현황</h2>
            <p className="mt-1 text-sm text-neutral-text-sub">제주시 권역만 표시합니다. 동·읍·면을 클릭하면 해당 지역의 현황을 확인할 수 있습니다.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['승인', '대기', '긴급'] as Status[]).map((s) => (
              <div key={s} className="inline-flex items-center gap-2 rounded-full bg-neutral-50 px-3 py-1.5 text-xs text-neutral-text-sub">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s].fill }} />
                {s === '승인' ? '승인 중심' : s === '대기' ? '대기 존재' : '긴급 존재'}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-neutral-50 p-3">
          <div className="h-[520px] w-full rounded-xl bg-white">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-neutral-text-sub">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>제주 행정동 지도를 불러오는 중입니다…</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="text-sm font-medium text-neutral-text">지도 데이터를 불러오지 못했습니다.</p>
                <p className="text-xs text-neutral-text-sub">{error}</p>
              </div>
            ) : geoData ? (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ center: [126.49, 33.44], scale: 36000 }}
                width={900}
                height={700}
                style={{ width: '100%', height: '100%' }}
              >
                <ZoomableGroup center={[126.49, 33.44]} zoom={1.15}>
                  <Geographies geography={geoData}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const name = normalizeName(String(geo.properties?.adm_nm || ''));
                        const isJejuCity = name.includes('제주시');
                        const metric = isJejuCity ? metricMap.get(name) : undefined;
                        const isSelected = isJejuCity && selectedName === name;

                        // 제주시 아닌 지역은 연하게 표시
                        if (!isJejuCity) {
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              style={{
                                default: { fill: '#F5F7FA', stroke: '#FFFFFF', strokeWidth: 0.5, outline: 'none', opacity: 0.5 },
                                hover: { fill: '#EEF1F5', stroke: '#FFFFFF', strokeWidth: 0.5, outline: 'none', opacity: 0.6 },
                                pressed: { fill: '#EEF1F5', stroke: '#FFFFFF', strokeWidth: 0.5, outline: 'none', opacity: 0.6 },
                              }}
                            />
                          );
                        }

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => setHoverName(name)}
                            onMouseLeave={() => setHoverName('')}
                            onClick={() => setSelectedName(name)}
                            style={{
                              default: {
                                fill: getFillColor(metric),
                                stroke: '#FFFFFF',
                                strokeWidth: isSelected ? 1.8 : 0.8,
                                outline: 'none',
                              },
                              hover: {
                                fill: metric ? STATUS_COLORS[getDominantStatus(metric)].text : '#D9E7FF',
                                stroke: '#FFFFFF',
                                strokeWidth: 1.2,
                                outline: 'none',
                                cursor: 'pointer',
                              },
                              pressed: {
                                fill: metric ? STATUS_COLORS[getDominantStatus(metric)].text : '#C8DAFF',
                                stroke: '#FFFFFF',
                                strokeWidth: 1.2,
                                outline: 'none',
                              },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {jejuCityMetrics.filter((item) => item.lat && item.lng).map((item) => {
                    const isSelected = normalizeName(item.name) === selectedName;
                    const shortName = item.name.replace(/제주특별자치도\s+제주시\s+/, '');
                    return (
                      <Marker key={item.name} coordinates={[item.lng as number, item.lat as number]}>
                        <g>
                          <circle r={isSelected ? 8 : 6} fill={STATUS_COLORS[getDominantStatus(item)].text} opacity={0.22} />
                          <circle r={isSelected ? 4.5 : 3.5} fill={STATUS_COLORS[getDominantStatus(item)].text} />
                          <text
                            textAnchor="middle"
                            y={-10}
                            style={{
                              fontSize: isSelected ? '11px' : '8px',
                              fontWeight: isSelected ? 700 : 500,
                              fill: isSelected ? '#1E293B' : '#64748B',
                              pointerEvents: 'none',
                            }}
                          >
                            {shortName}
                          </text>
                        </g>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex min-h-8 items-center text-sm text-neutral-text-sub">
          {hoverName ? `${hoverName.replace('제주특별자치도 ', '')} 선택 가능` : '제주시 권역만 노출됩니다. 동·읍·면 경계를 클릭해 현황을 확인하십시오.'}
        </div>
      </section>

      {/* 상세 패널 */}
      <aside className="space-y-4">
        {/* 선택 지역 상세 */}
        <section className="rounded-2xl border border-neutral-border/30 bg-white p-5 shadow-elevated">
          <div className="mb-4">
            <div className="text-sm font-medium text-neutral-text-sub">선택 지역</div>
            <h3 className="mt-1 text-xl font-semibold text-neutral-text">{selectedMetric.name.replace('제주특별자치도 ', '')}</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-neutral-50 p-4">
              <div className="text-sm text-neutral-text-sub">총 보고서</div>
              <div className="mt-2 text-3xl font-semibold text-neutral-text">{selectedMetric.total}</div>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-4">
              <div className="text-sm text-neutral-text-sub">긴급 비중</div>
              <div className="mt-2 text-3xl font-semibold text-neutral-text">
                {Math.round((selectedMetric.urgent / Math.max(selectedMetric.total, 1)) * 100)}%
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge status="승인" count={selectedMetric.approved} />
            <StatusBadge status="대기" count={selectedMetric.pending} />
            <StatusBadge status="긴급" count={selectedMetric.urgent} />
            <StatusBadge status="반려" count={selectedMetric.rejected} />
          </div>

          <div className="mt-5 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summaryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={86}
                  paddingAngle={3}
                  cornerRadius={8}
                >
                  {summaryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value, name) => [`${value}건`, String(name)]}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 우선 확인 지역 */}
        <section className="rounded-2xl border border-neutral-border/30 bg-white p-5 shadow-elevated">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral-text">우선 확인 지역</h3>
            <span className="text-xs text-neutral-text-sub">제주시 기준</span>
          </div>

          <div className="space-y-3">
            {sortedMetrics.slice(0, 6).map((item) => {
              const status = getDominantStatus(item);
              const color = STATUS_COLORS[status];
              const isActive = normalizeName(item.name) === selectedName;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedName(normalizeName(item.name))}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition min-h-[44px] ${
                    isActive ? 'border-neutral-300 bg-neutral-50' : 'border-neutral-border/30 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-neutral-text">{item.name.replace('제주특별자치도 ', '')}</div>
                    <div className="mt-1 text-xs text-neutral-text-sub">총 {item.total}건 · 긴급 {item.urgent}건 · 대기 {item.pending}건</div>
                  </div>
                  <div
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${status === '긴급' ? 'animate-urgent-pulse' : ''}`}
                    style={{ backgroundColor: color.soft, color: color.text }}
                  >
                    {status}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </aside>
    </div>
  );
}
