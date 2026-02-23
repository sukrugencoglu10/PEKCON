import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/admin-auth';

export async function GET() {
  const response = NextResponse.redirect(
    new URL('/admin', process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000')
  );
  response.cookies.delete(COOKIE_NAME);
  return response;
}
