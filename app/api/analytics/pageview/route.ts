import { NextRequest, NextResponse } from 'next/server';
import { insertPageView } from '@/lib/analytics-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      gclid,
      fbclid,
      originalReferrer,
      pageUrl,
      locale,
    } = body;

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'sessionId gerekli' }, { status: 400 });
    }

    await insertPageView({
      session_id: sessionId,
      utm_source: utmSource ?? undefined,
      utm_medium: utmMedium ?? undefined,
      utm_campaign: utmCampaign ?? undefined,
      utm_term: utmTerm ?? undefined,
      gclid: gclid ?? undefined,
      fbclid: fbclid ?? undefined,
      original_referrer: originalReferrer ?? undefined,
      page_url: pageUrl ?? undefined,
      locale: locale ?? undefined,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[PageView] Error:', error);
    return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 500 });
  }
}
