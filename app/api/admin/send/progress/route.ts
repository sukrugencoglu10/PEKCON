export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSession } from '@/lib/send-session';

export async function GET(request: NextRequest) {
  await requireAdmin();

  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return new Response('sessionId gerekli', { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const initial = getSession(sessionId);
      if (!initial) {
        send({ error: 'Oturum bulunamadı' });
        controller.close();
        return;
      }
      send(initial);

      const interval = setInterval(() => {
        const session = getSession(sessionId);
        if (!session) {
          clearInterval(interval);
          controller.close();
          return;
        }

        send({
          status: session.status,
          totalCount: session.totalCount,
          sentCount: session.sentCount,
          failedEmails: session.failedEmails,
        });

        if (session.status === 'done' || session.status === 'error') {
          clearInterval(interval);
          setTimeout(() => controller.close(), 1000);
        }
      }, 500);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
