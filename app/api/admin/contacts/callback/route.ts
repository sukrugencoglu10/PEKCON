export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, fetchOutlookContacts } from '@/lib/ms-graph';
import { getSession, createSession, updateSession } from '@/lib/send-session';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const returnedState = searchParams.get('state');
  const error = searchParams.get('error');

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  if (error) {
    return NextResponse.redirect(new URL('/admin/dashboard?error=oauth_denied', base));
  }
  if (!code || !returnedState) {
    return NextResponse.redirect(new URL('/admin/dashboard?error=oauth_invalid', base));
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get('oauth_state')?.value ?? '';
  const colonIdx = storedState.lastIndexOf(':');
  const expectedState = storedState.slice(0, colonIdx);
  const sessionId = storedState.slice(colonIdx + 1);

  if (returnedState !== expectedState) {
    return NextResponse.redirect(new URL('/admin/dashboard?error=oauth_state_mismatch', base));
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    const contacts = await fetchOutlookContacts(accessToken);

    let session = getSession(sessionId);
    if (!session) session = createSession(sessionId);
    updateSession(sessionId, { contacts });

    const response = NextResponse.redirect(
      new URL(`/admin/dashboard?sessionId=${sessionId}&step=3`, base)
    );
    response.cookies.delete('oauth_state');
    return response;
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(
      new URL(`/admin/dashboard?error=oauth_failed&sessionId=${sessionId}`, base)
    );
  }
}
