import { NextRequest, NextResponse } from 'next/server';

const locales = ['tr', 'en'];
const defaultLocale = 'tr';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get('host') ?? '';

  // www → non-www 301 yönlendirmesi
  if (hostname.startsWith('www.')) {
    const nonWwwHost = hostname.replace(/^www\./, '');
    const url = request.nextUrl.clone();
    url.host = nonWwwHost;
    return NextResponse.redirect(url, { status: 301 });
  }

  // admin.pekcon.com → /admin'e yönlendir
  if (hostname.startsWith('admin.') && pathname === '/') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // /undefined/* → /tr/* yönlendirmesi
  if (pathname.startsWith('/undefined/')) {
    const cleanPath = pathname.replace('/undefined/', '/tr/');
    return NextResponse.redirect(new URL(cleanPath, request.url), 301);
  }

  // Reklam trafiği: /tr/konteynerler (ölçü/teknik sayfası, mobil dönüşüm %7,5)
  // → /tr/satilik-konteyner. Hangi reklam/site bağlantısından gelirse gelsin
  // gclid/gbraid/wbraid veya utm_medium=cpc taşıyan istekler satış sayfasına
  // gider; sorgu dizesi aynen korunur (GA4/Ads ilişkilendirmesi bozulmaz).
  // Organik ve site içi ziyaretler ölçü sayfasında kalır (302 = SEO etkisi yok).
  if (pathname === '/tr/konteynerler' || pathname === '/tr/konteynerler/') {
    const sp = request.nextUrl.searchParams;
    const isPaid =
      sp.has('gclid') || sp.has('gbraid') || sp.has('wbraid') ||
      sp.get('utm_medium')?.toLowerCase() === 'cpc';
    if (isPaid) {
      const url = request.nextUrl.clone();
      url.pathname = '/tr/satilik-konteyner';
      return NextResponse.redirect(url, 302);
    }
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect to default locale if no locale in path
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files, public assets)
    '/((?!admin|api|_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|llms\.txt|images|icons|.*\\.jpg|.*\\.jpeg|.*\\.png|.*\\.svg|.*\\.gif|.*\\.webp|.*\\.ico).*)',
  ],
};
