export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSession } from '@/lib/send-session';
import { generateEmailHtml } from '@/lib/email';

export async function GET(request: NextRequest) {
  await requireAdmin();

  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return new Response('sessionId gerekli', { status: 400 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return new Response('Oturum bulunamadı', { status: 404 });
  }
  if (session.stock.length === 0) {
    return new Response('Stok verisi yüklenmemiş', { status: 400 });
  }

  const html = generateEmailHtml(session.stock, 'Değerli Müşteri');
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
