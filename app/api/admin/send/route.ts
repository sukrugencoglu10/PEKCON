export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrUnauthorized } from '@/lib/admin-auth';
import { getSession, updateSession } from '@/lib/send-session';
import { sendBulkBcc } from '@/lib/email';

export async function POST(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  const { sessionId } = await request.json() as { sessionId?: string };
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId gerekli' }, { status: 400 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 404 });
  }
  if (session.stock.length === 0) {
    return NextResponse.json({ error: 'Stok verisi yüklenmemiş' }, { status: 400 });
  }
  if (session.contacts.length === 0) {
    return NextResponse.json({ error: 'Alıcı listesi boş' }, { status: 400 });
  }
  if (session.status === 'sending') {
    return NextResponse.json({ error: 'Gönderim zaten devam ediyor' }, { status: 409 });
  }

  updateSession(sessionId, {
    status: 'sending',
    totalCount: session.contacts.length,
    sentCount: 0,
    failedEmails: [],
    startedAt: new Date(),
  });

  // Fire and forget — SSE endpoint'i ilerlemeyi okur
  void (async () => {
    const s = getSession(sessionId)!;
    try {
      await sendBulkBcc(s.contacts, s.stock, (sentSoFar) => {
        updateSession(sessionId, { sentCount: sentSoFar });
      });
      updateSession(sessionId, {
        status: 'done',
        sentCount: s.contacts.length,
        completedAt: new Date(),
      });
    } catch (err) {
      console.error('BCC gönderimi başarısız:', err);
      updateSession(sessionId, {
        status: 'error',
        errorMessage: String(err),
        completedAt: new Date(),
      });
    }
  })().catch((err) => {
    console.error('Bulk send crashed:', err);
    updateSession(sessionId, {
      status: 'error',
      errorMessage: String(err),
      completedAt: new Date(),
    });
  });

  return NextResponse.json({ success: true, message: 'Gönderim başlatıldı' });
}
