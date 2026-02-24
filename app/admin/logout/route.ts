import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // request.nextUrl.origin → dev'de localhost:3000, prod'da pekcon.com
  const response = NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
  response.cookies.delete(COOKIE_NAME);
  return response;
}
