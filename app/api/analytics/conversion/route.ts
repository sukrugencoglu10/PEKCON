import { NextRequest, NextResponse } from 'next/server';
import { insertConversion } from '@/lib/analytics-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, utm_source, utm_medium, utm_campaign, utm_term, gclid, fbclid, original_referrer, locale, page_url } = body;

    if (!['whatsapp_click', 'form_abandon'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await insertConversion({
      type,
      utm_source: utm_source || undefined,
      utm_medium: utm_medium || undefined,
      utm_campaign: utm_campaign || undefined,
      utm_term: utm_term || undefined,
      gclid: gclid || undefined,
      fbclid: fbclid || undefined,
      original_referrer: original_referrer || undefined,
      locale: locale || undefined,
      page_url: page_url || undefined,
      user_agent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Conversion API] Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
