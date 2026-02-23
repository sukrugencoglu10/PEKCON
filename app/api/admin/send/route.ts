export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSession, updateSession } from '@/lib/send-session';
import { sendSingleEmail, delay } from '@/lib/email';

const DELAY_MS = 1200; // Office 365: ~50 mail/dk, güvenli limit

export async function POST(request: NextRequest) {
  await requireAdmin();

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
    for (let i = 0; i < s.contacts.length; i++) {
      const contact = s.contacts[i];
      try {
        await sendSingleEmail(contact.email, contact.displayName, s.stock);
      } catch (err) {
        console.error(`Gönderilemedi: ${contact.email}`, err);
        const current = getSession(sessionId)!;
        updateSession(sessionId, {
          failedEmails: [...current.failedEmails, contact.email],
        });
      }
      updateSession(sessionId, { sentCount: i + 1 });
      if (i < s.contacts.length - 1) await delay(DELAY_MS);
    }

    const final = getSession(sessionId)!;
    updateSession(sessionId, {
      status: final.failedEmails.length > 0 ? 'error' : 'done',
      completedAt: new Date(),
    });
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
