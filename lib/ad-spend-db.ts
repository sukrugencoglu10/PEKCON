import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let adSpendInitialized = false;

async function ensureAdSpendTable() {
  if (adSpendInitialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ad_spend (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel TEXT NOT NULL,
      spend_amount REAL NOT NULL,
      period_start TEXT NOT NULL,
      period_end TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_adspend_channel ON ad_spend(channel)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_adspend_period  ON ad_spend(period_start, period_end)`);
  adSpendInitialized = true;
}

export interface AdSpendInput {
  channel: 'google_ads' | 'meta_ads' | 'seo';
  spend_amount: number;
  period_start: string;
  period_end: string;
  notes?: string;
}

export interface AdSpendRow extends AdSpendInput {
  id: number;
  created_at: string;
}

export interface ChannelSpendRow {
  channel: string;
  total_spend: number;
  entry_count: number;
}

export async function insertAdSpend(data: AdSpendInput): Promise<void> {
  await ensureAdSpendTable();
  await db.execute({
    sql: `INSERT INTO ad_spend (channel, spend_amount, period_start, period_end, notes)
          VALUES (?, ?, ?, ?, ?)`,
    args: [data.channel, data.spend_amount, data.period_start, data.period_end, data.notes ?? null],
  });
}

export async function getAdSpendByChannel(from: string, to: string): Promise<ChannelSpendRow[]> {
  await ensureAdSpendTable();
  const result = await db.execute({
    sql: `SELECT channel, SUM(spend_amount) as total_spend, COUNT(*) as entry_count
          FROM ad_spend
          WHERE period_start >= ? AND period_end <= ?
          GROUP BY channel`,
    args: [from, to],
  });
  return result.rows.map((r) => ({
    channel: String(r.channel),
    total_spend: Number(r.total_spend ?? 0),
    entry_count: Number(r.entry_count ?? 0),
  }));
}

export async function getAdSpendEntries(from: string, to: string): Promise<AdSpendRow[]> {
  await ensureAdSpendTable();
  const result = await db.execute({
    sql: `SELECT id, channel, spend_amount, period_start, period_end, notes, created_at
          FROM ad_spend
          WHERE period_start >= ? AND period_end <= ?
          ORDER BY period_start DESC`,
    args: [from, to],
  });
  return result.rows.map((r) => ({
    id: Number(r.id),
    channel: String(r.channel) as AdSpendRow['channel'],
    spend_amount: Number(r.spend_amount),
    period_start: String(r.period_start),
    period_end: String(r.period_end),
    notes: r.notes ? String(r.notes) : undefined,
    created_at: String(r.created_at),
  }));
}

export async function deleteAdSpend(id: number): Promise<void> {
  await ensureAdSpendTable();
  await db.execute({ sql: `DELETE FROM ad_spend WHERE id = ?`, args: [id] });
}
