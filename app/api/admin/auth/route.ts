export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual, createHash } from 'crypto';
import { signToken, buildAuthCookie } from '@/lib/admin-auth';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Brute-force koruması: IP başına 15 dakikada en fazla 5 deneme
  if (isRateLimited(`admin-login:${getClientIp(request)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.' },
      { status: 429 }
    );
  }
  try {
    const { password } = await request.json() as { password?: string };

    if (!password) {
      return NextResponse.json({ error: 'Şifre gerekli.' }, { status: 400 });
    }

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası.' }, { status: 500 });
    }

    let isValid = false;
    try {
      // Hash'leri karşılaştır: uzunluk bilgisi sızmaz
      isValid = timingSafeEqual(
        createHash('sha256').update(password).digest(),
        createHash('sha256').update(expected).digest()
      );
    } catch {
      isValid = false;
    }

    if (!isValid) {
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: 'Geçersiz şifre.' }, { status: 401 });
    }

    const token = signToken(`admin:${Date.now()}`);
    const cookie = buildAuthCookie(token);

    const response = NextResponse.json({ success: true });
    response.cookies.set(cookie);
    return response;
  } catch {
    return NextResponse.json({ error: 'İstek işlenemedi.' }, { status: 500 });
  }
}
