export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { signToken, buildAuthCookie } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
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
      isValid =
        password.length === expected.length &&
        timingSafeEqual(Buffer.from(password), Buffer.from(expected));
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
