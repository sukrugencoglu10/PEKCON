import { NextRequest, NextResponse } from 'next/server';
import { partialQuoteSchema } from '@/lib/validators';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL ?? '';

const CATEGORY_LABELS: Record<string, string> = {
  standard_cargo: 'Standart Yük',
  refrigerated: 'Soğutmalı',
  flat_rack: 'Flat Rack',
  open_top: 'Open Top',
  custom: 'Özel',
};

/**
 * Yarım kalan teklif formu: kullanıcı telefonunu yazıp formu göndermeden ayrıldığında
 * istemci (sendBeacon) buraya bildirir. Lead Sheet'e "YARIM FORM" olarak yazılır ki
 * ekip arayıp dönebilsin. Reklam dönüşümü SAYILMAZ (GA4 / Ads / Meta'ya gitmez).
 */
export async function POST(request: NextRequest) {
  if (isRateLimited(`quote-partial:${getClientIp(request)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ success: false }, { status: 429 });
  }
  if (Number(request.headers.get('content-length') ?? 0) > 4096) {
    return NextResponse.json({ success: false }, { status: 413 });
  }

  try {
    // sendBeacon gövdesi her zaman JSON content-type ile gelmeyebilir; metin olarak oku
    const body = JSON.parse(await request.text());
    const data = partialQuoteSchema.parse(body);

    if (!GOOGLE_SHEET_WEBHOOK_URL) {
      console.error('[Partial quote] GOOGLE_SHEET_WEBHOOK_URL is missing');
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const row = {
      tarih: new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }),
      islemTuru: 'YARIM FORM (gönderilmedi)',
      kategori: data.containerCategory
        ? CATEGORY_LABELS[data.containerCategory] ?? data.containerCategory
        : '',
      konteynerTipi: [data.containerType, data.quantity ? `${data.quantity} adet` : '']
        .filter(Boolean)
        .join(' · '),
      adSoyad: data.fullName ?? '',
      telefon: data.phone,
      eposta: '',
      gclid: data.gclid ?? '',
    };

    // Sunucusuz fonksiyon yanıt döndükten sonra kapanabileceği için beklenir
    const res = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
      redirect: 'follow',
    });
    if (!res.ok) {
      console.error(`[Partial quote] Sheet failed: ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Partial quote] error:', error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
