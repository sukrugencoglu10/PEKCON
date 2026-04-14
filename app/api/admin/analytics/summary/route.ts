import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrUnauthorized } from '@/lib/admin-auth';
import {
  getConversionSummary,
  getConversionsByDay,
  getAttributionBreakdown,
  getGoogleAdsData,
  getRecentConversions,
} from '@/lib/analytics-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);

  // Default: last 7 days
  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setDate(defaultFrom.getDate() - 7);

  const from = searchParams.get('from') ?? defaultFrom.toISOString().slice(0, 10);
  const to = searchParams.get('to') ?? new Date(now.getTime() + 86400000).toISOString().slice(0, 10);

  try {
    const [kpi, daily, attribution, google_ads, recent] = await Promise.all([
      getConversionSummary(from, to),
      getConversionsByDay(from, to),
      getAttributionBreakdown(from, to),
      getGoogleAdsData(from, to),
      getRecentConversions(20),
    ]);

    return NextResponse.json({
      kpi,
      daily,
      attribution,
      google_ads,
      recent,
    });
  } catch (error) {
    console.error('[Analytics Summary] Error:', error);
    return NextResponse.json(
      { error: 'Veri alınamadı' },
      { status: 500 }
    );
  }
}
