import { NextRequest, NextResponse } from 'next/server';

const locales = ['tr', 'en'];
const defaultLocale = 'tr';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect to default locale if no locale in path
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files, public assets)
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|.*\\.jpg|.*\\.jpeg|.*\\.png|.*\\.svg|.*\\.gif|.*\\.webp|.*\\.ico).*)',
  ],
};
