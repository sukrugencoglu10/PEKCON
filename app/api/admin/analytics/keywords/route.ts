import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrUnauthorized } from '@/lib/admin-auth';
import {
  getKeywordTraffic,
  getKeywordFunnel,
  getChannelBreakdown,
} from '@/lib/analytics-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);

  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setDate(defaultFrom.getDate() - 30);

  const from = searchParams.get('from') ?? defaultFrom.toISOString().slice(0, 10);
  const to = searchParams.get('to') ?? new Date(now.getTime() + 86400000).toISOString().slice(0, 10);

  try {
    const [traffic, funnel, channels] = await Promise.all([
      getKeywordTraffic(from, to),
      getKeywordFunnel(from, to),
      getChannelBreakdown(from, to),
    ]);

    return NextResponse.json({ traffic, funnel, channels });
  } catch (error) {
    console.error('[Keywords API] Error:', error);
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
  }
}
