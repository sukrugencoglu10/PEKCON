export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { getContainerImageBinary } from '@/lib/container-images-db';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const img = await getContainerImageBinary(numericId);
    if (!img) {
      return new Response('Not found', { status: 404 });
    }

    const bytes = Buffer.from(img.data_base64, 'base64');
    return new Response(bytes, {
      status: 200,
      headers: {
        'Content-Type': img.mime_type,
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('[Container Image GET error]', err);
    return new Response('Internal server error', { status: 500 });
  }
}
