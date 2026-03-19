import { NextResponse } from 'next/server';

// Cache the fuel price to avoid excessive API calls (24 hours)
let cachedPrice: number | null = null;
let cacheTime: number = 0;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Fallback average motorin price (TL/litre) — updated manually if API fails
const FALLBACK_PRICE = 65.88;

export async function GET() {
  // Return cached value if still valid
  if (cachedPrice !== null && Date.now() - cacheTime < CACHE_DURATION_MS) {
    return NextResponse.json({ price: cachedPrice, source: 'cache' });
  }

  try {
    const response = await fetch(
      'http://hasanadiguzel.com.tr/api/akaryakit/sehir=Istanbul',
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) throw new Error('API response not OK');

    const data = await response.json();

    // The API returns an array of fuel types; find "Motorin" (diesel)
    const motorin = Array.isArray(data?.SONUCLAR)
      ? data.SONUCLAR.find(
          (item: { TurAdi?: string; Fiyat?: number }) =>
            item?.TurAdi?.toLowerCase().includes('motorin')
        )
      : null;

    if (motorin?.Fiyat) {
      cachedPrice = parseFloat(motorin.Fiyat);
      cacheTime = Date.now();
      return NextResponse.json({ price: cachedPrice, source: 'api' });
    }

    throw new Error('Motorin not found in response');
  } catch {
    // Return fallback on any error
    return NextResponse.json({ price: FALLBACK_PRICE, source: 'fallback' });
  }
}
