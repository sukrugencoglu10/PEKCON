import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrUnauthorized } from '@/lib/admin-auth';
import { getDemandByContainerType, getDemandByDayOfWeek, getContainerTypeSummary } from '@/lib/analytics-db';
import { buildContainerForecasts, computeDowIndices, DailyDemandPoint } from '@/lib/forecast';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setDate(defaultFrom.getDate() - 90);

  const from = searchParams.get('from') ?? defaultFrom.toISOString().slice(0, 10);
  const to = searchParams.get('to') ?? new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
  const horizon = Math.min(90, Math.max(7, Number(searchParams.get('horizon') ?? '30')));

  // Regresyon için ekstra 90 gün öncesi verisi alınır
  const trainFrom = new Date(from);
  trainFrom.setDate(trainFrom.getDate() - 90);
  const trainFromStr = trainFrom.toISOString().slice(0, 10);

  try {
    const [rawDemand, rawDow, summary] = await Promise.all([
      getDemandByContainerType(trainFromStr, to),
      getDemandByDayOfWeek(trainFromStr, to),
      getContainerTypeSummary(from, to),
    ]);

    const demandPoints: DailyDemandPoint[] = rawDemand.map((r) => ({
      date: r.date,
      demand: r.demand,
      container_type: r.container_type,
    }));

    const forecasts = buildContainerForecasts(demandPoints, horizon);

    // DOW global (tüm konteyner tipleri birlikte) endeks hesapla
    const DOW_LABELS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const totalByDow = new Array(7).fill(0);
    const countByDow = new Array(7).fill(0);
    for (const r of rawDow) {
      totalByDow[r.dow] += r.demand;
      countByDow[r.dow] += 1;
    }
    const totalDemand = totalByDow.reduce((s, v) => s + v, 0);
    const avgDemand = totalDemand / 7;
    const dowPattern = DOW_LABELS.map((label, dow) => ({
      dow,
      label,
      demand: totalByDow[dow],
      index: avgDemand > 0 ? Math.round((totalByDow[dow] / avgDemand) * 100) / 100 : 1,
    }));

    return NextResponse.json({ forecasts, summary, dowPattern });
  } catch (error) {
    console.error('[Demand Forecast] Error:', error);
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
  }
}
