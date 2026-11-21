export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminOrUnauthorized } from '@/lib/admin-auth';
import {
  deleteContainerImage,
  getAllContainerImagesGrouped,
  insertContainerImage,
  isValidContainerImageType,
  reorderContainerImages,
  setContainerCoverImage,
  type ContainerImageMeta,
} from '@/lib/container-images-db';

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB
const MAX_FILES_PER_REQUEST = 15;

function revalidateSalesPages() {
  try {
    revalidatePath('/tr/satilik-konteyner');
    revalidatePath('/en/satilik-konteyner');
    revalidatePath('/en/containers-for-sale');
  } catch {
    // ignore
  }
}

export async function GET() {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  try {
    const images = await getAllContainerImagesGrouped();
    return NextResponse.json({ images });
  } catch (err) {
    console.error('[Admin Container Images GET error]', err);
    const detail = process.env.NODE_ENV !== 'production' && err instanceof Error ? err.message : undefined;
    return NextResponse.json({ error: detail ? `Görseller alınamadı: ${detail}` : 'Görseller alınamadı.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const containerType = String(formData.get('containerType') ?? '');

    if (!isValidContainerImageType(containerType)) {
      return NextResponse.json({ error: 'Geçersiz konteyner tipi.' }, { status: 400 });
    }

    const entries = formData.getAll('files');
    const files = entries.filter((item): item is File => item instanceof File && item.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ error: 'En az bir görsel seçmelisiniz.' }, { status: 400 });
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Tek seferde en fazla ${MAX_FILES_PER_REQUEST} görsel yükleyebilirsiniz.` },
        { status: 400 }
      );
    }

    const uploaded: ContainerImageMeta[] = [];

    for (const file of files) {
      if (!ALLOWED_MIMES.has(file.type)) {
        return NextResponse.json(
          { error: `Desteklenmeyen dosya türü: ${file.name} (JPG, PNG, WebP veya AVIF yükleyin).` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: `Dosya çok büyük: ${file.name} (maksimum 4 MB).` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      const saved = await insertContainerImage(containerType, file.type, base64);
      uploaded.push(saved);
    }

    revalidateSalesPages();
    return NextResponse.json({ uploaded }, { status: 201 });
  } catch (err) {
    console.error('[Admin Container Images POST error]', err);
    return NextResponse.json({ error: 'Görseller yüklenemedi.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  const idParam = request.nextUrl.searchParams.get('id');
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Geçersiz görsel ID.' }, { status: 400 });
  }

  try {
    const deleted = await deleteContainerImage(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Görsel bulunamadı.' }, { status: 404 });
    }
    revalidateSalesPages();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Admin Container Images DELETE error]', err);
    return NextResponse.json({ error: 'Görsel silinemedi.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdminOrUnauthorized();
  if (authError) return authError;

  try {
    const body = (await request.json()) as {
      containerType?: string;
      coverId?: number;
      orderedIds?: number[];
    };
    const containerType = String(body.containerType ?? '');

    if (!isValidContainerImageType(containerType)) {
      return NextResponse.json({ error: 'Geçersiz konteyner tipi.' }, { status: 400 });
    }

    if (Array.isArray(body.orderedIds)) {
      const ids = body.orderedIds
        .map((n) => Number(n))
        .filter((n) => Number.isInteger(n) && n > 0);
      if (ids.length === 0) {
        return NextResponse.json({ error: 'Geçersiz sıralama listesi.' }, { status: 400 });
      }
      await reorderContainerImages(containerType, ids);
      revalidateSalesPages();
      return NextResponse.json({ ok: true });
    }

    const coverId = Number(body.coverId);
    if (!Number.isInteger(coverId) || coverId <= 0) {
      return NextResponse.json({ error: 'Geçersiz kapak görseli isteği.' }, { status: 400 });
    }

    const updated = await setContainerCoverImage(containerType, coverId);
    if (!updated) {
      return NextResponse.json({ error: 'Görsel bulunamadı.' }, { status: 404 });
    }

    revalidateSalesPages();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Admin Container Images PATCH error]', err);
    return NextResponse.json({ error: 'Sıralama güncellenemedi.' }, { status: 500 });
  }
}
