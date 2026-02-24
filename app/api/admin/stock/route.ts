export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrUnauthorized } from '@/lib/admin-auth';
import { parseExcelBuffer } from '@/lib/excel-parser';
import { getSession, updateSession, createSession, generateSessionId } from '@/lib/send-session';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya yüklenmedi.' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Dosya boyutu 5MB sınırını aşıyor.' }, { status: 413 });
    }

    const allowedExtensions = /\.(xlsx|xls|csv)$/i;
    if (!allowedExtensions.test(file.name)) {
      return NextResponse.json(
        { error: 'Sadece Excel (.xlsx, .xls) veya CSV dosyaları kabul edilir.' },
        { status: 415 }
      );
    }

    const buffer = await file.arrayBuffer();
    const { rows, containerTypes, errors } = parseExcelBuffer(buffer);

    if (errors.length > 0 && rows.length === 0) {
      return NextResponse.json({ error: errors.join(' | ') }, { status: 422 });
    }

    const sessionId =
      (formData.get('sessionId') as string | null) ?? generateSessionId();

    let session = getSession(sessionId);
    if (!session) session = createSession(sessionId);
    updateSession(sessionId, { stock: rows, containerTypes });

    return NextResponse.json({
      success: true,
      sessionId,
      rowCount: rows.length,
      rows,
      containerTypes,
      warnings: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Stock upload error:', err);
    return NextResponse.json({ error: 'Dosya işlenirken hata oluştu.' }, { status: 500 });
  }
}
