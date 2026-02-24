export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrUnauthorized } from '@/lib/admin-auth';
import { getSession } from '@/lib/send-session';

export async function GET(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId gerekli' }, { status: 400 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ contacts: [] });
  }

  return NextResponse.json({ contacts: session.contacts });
}
