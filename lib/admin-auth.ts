import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

const SECRET = process.env.ADMIN_COOKIE_SECRET ?? 'fallback-dev-secret-change-in-prod';
export const COOKIE_NAME = 'pekcon_admin';
const MAX_AGE = 60 * 60 * 8; // 8 saat

export function signToken(payload: string): string {
  const sig = createHmac('sha256', SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): boolean {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = createHmac('sha256', SECRET).update(payload).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

// Sayfa route'ları için — auth başarısız → /admin'e redirect
export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) {
    redirect('/admin');
  }
}

// API route'ları için — auth başarısız → 401 JSON döndür (redirect değil)
// Kullanım: const authError = await requireAdminOrUnauthorized(); if (authError) return authError;
export async function requireAdminOrUnauthorized(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json(
      { error: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.' },
      { status: 401 }
    );
  }
  return null;
}

export function buildAuthCookie(value: string) {
  return {
    name: COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE,
  };
}
