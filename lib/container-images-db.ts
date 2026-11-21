import { createClient } from '@libsql/client';
import {
  CONTAINER_IMAGE_TYPES,
  isValidContainerImageType,
  type ContainerImageMeta,
  type ContainerImageTypeKey,
} from './container-image-types';

export { CONTAINER_IMAGE_TYPES, isValidContainerImageType };
export type { ContainerImageMeta, ContainerImageTypeKey };

let db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;
let initPromise: Promise<void> | null = null;

async function createTables(client: ReturnType<typeof createClient>) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS container_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      container_type TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      data_base64 TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_container_images_type ON container_images(container_type, sort_order, id)`
  );
}

async function ensureContainerImagesTable() {
  if (initialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await createTables(db);
      } catch (err) {
        if (process.env.NODE_ENV !== 'production' && process.env.TURSO_DATABASE_URL) {
          console.warn(
            '[container-images-db] Yerel geliştirmede Turso bağlantısı başarısız, local.db kullanılıyor:',
            err instanceof Error ? err.message : err
          );
          db = createClient({ url: 'file:local.db' });
          await createTables(db);
        } else {
          initPromise = null;
          throw err;
        }
      }
      initialized = true;
    })();
  }
  await initPromise;
}

export async function insertContainerImage(
  containerType: ContainerImageTypeKey,
  mimeType: string,
  dataBase64: string
): Promise<ContainerImageMeta> {
  await ensureContainerImagesTable();
  const maxRes = await db.execute({
    sql: `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM container_images WHERE container_type = ?`,
    args: [containerType],
  });
  const nextOrder = Number(maxRes.rows[0]?.next_order ?? 0);

  const res = await db.execute({
    sql: `INSERT INTO container_images (container_type, mime_type, data_base64, sort_order)
          VALUES (?, ?, ?, ?)`,
    args: [containerType, mimeType, dataBase64, nextOrder],
  });
  const id = Number(res.lastInsertRowid);
  return {
    id,
    container_type: containerType,
    url: `/api/container-images/${id}`,
    created_at: new Date().toISOString(),
  };
}

export async function getAllContainerImagesGrouped(): Promise<
  Record<ContainerImageTypeKey, ContainerImageMeta[]>
> {
  const grouped = Object.fromEntries(
    CONTAINER_IMAGE_TYPES.map((t) => [t.key, [] as ContainerImageMeta[]])
  ) as Record<ContainerImageTypeKey, ContainerImageMeta[]>;

  await ensureContainerImagesTable();
  const res = await db.execute(
    `SELECT id, container_type, created_at
     FROM container_images
     ORDER BY sort_order ASC, id ASC`
  );

  for (const row of res.rows) {
    const type = String(row.container_type);
    if (!isValidContainerImageType(type)) continue;
    const id = Number(row.id);
    grouped[type].push({
      id,
      container_type: type,
      url: `/api/container-images/${id}`,
      created_at: String(row.created_at ?? ''),
    });
  }

  return grouped;
}

export async function getContainerImageBinary(
  id: number
): Promise<{ mime_type: string; data_base64: string } | null> {
  await ensureContainerImagesTable();
  const res = await db.execute({
    sql: `SELECT mime_type, data_base64 FROM container_images WHERE id = ? LIMIT 1`,
    args: [id],
  });
  const row = res.rows[0];
  if (!row) return null;
  return {
    mime_type: String(row.mime_type),
    data_base64: String(row.data_base64),
  };
}

export async function deleteContainerImage(id: number): Promise<boolean> {
  await ensureContainerImagesTable();
  const res = await db.execute({
    sql: `DELETE FROM container_images WHERE id = ?`,
    args: [id],
  });
  return (res.rowsAffected ?? 0) > 0;
}

export async function setContainerCoverImage(
  containerType: ContainerImageTypeKey,
  id: number
): Promise<boolean> {
  await ensureContainerImagesTable();
  const existing = await db.execute({
    sql: `SELECT id FROM container_images WHERE container_type = ? ORDER BY sort_order ASC, id ASC`,
    args: [containerType],
  });
  const ids = existing.rows.map((r) => Number(r.id));
  if (!ids.includes(id)) return false;
  const reordered = [id, ...ids.filter((x) => x !== id)];
  await reorderContainerImages(containerType, reordered);
  return true;
}

export async function reorderContainerImages(
  containerType: ContainerImageTypeKey,
  orderedIds: number[]
): Promise<void> {
  await ensureContainerImagesTable();
  if (orderedIds.length === 0) return;
  const statements = orderedIds.map((id, idx) => ({
    sql: `UPDATE container_images SET sort_order = ? WHERE id = ? AND container_type = ?`,
    args: [idx, id, containerType],
  }));
  await db.batch(statements, 'write');
}
