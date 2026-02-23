export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { parseContactsCsv } from '@/lib/excel-parser';
import { getSession, createSession, updateSession, generateSessionId } from '@/lib/send-session';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB (Outlook CSV büyük olabilir)

export async function POST(request: NextRequest) {
  await requireAdmin();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya yüklenmedi.' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Dosya boyutu 10MB sınırını aşıyor.' }, { status: 413 });
    }

    const buffer = await file.arrayBuffer();
    const { contacts, errors } = parseContactsCsv(buffer);

    if (errors.length > 0 && contacts.length === 0) {
      return NextResponse.json({ error: errors.join(' | ') }, { status: 422 });
    }

    const sessionId = (formData.get('sessionId') as string | null) ?? generateSessionId();
    let session = getSession(sessionId);
    if (!session) session = createSession(sessionId);
    updateSession(sessionId, { contacts });

    return NextResponse.json({
      success: true,
      sessionId,
      contactCount: contacts.length,
      contacts,
      warnings: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Contacts upload error:', err);
    return NextResponse.json({ error: 'Dosya işlenirken hata oluştu.' }, { status: 500 });
  }
}
