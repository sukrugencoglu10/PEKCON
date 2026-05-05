import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;
let pvInitialized = false;

async function ensureTable() {
  if (initialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS conversions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      gclid TEXT,
      fbclid TEXT,
      original_referrer TEXT,
      container_category TEXT,
      container_type TEXT,
      quantity INTEGER,
      transaction_type TEXT,
      estimated_value REAL,
      contact_name TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      company_name TEXT,
      locale TEXT,
      page_url TEXT,
      user_agent TEXT
    )
  `);
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_conv_type ON conversions(type)`
  );
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_conv_created ON conversions(created_at)`
  );
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_conv_source ON conversions(utm_source)`
  );
  initialized = true;
}

async function ensurePageViewsTable() {
  if (pvInitialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL UNIQUE,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      gclid TEXT,
      fbclid TEXT,
      original_referrer TEXT,
      page_url TEXT,
      locale TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_pv_created ON page_views(created_at)`
  );
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_pv_term ON page_views(utm_term)`
  );
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_pv_source ON page_views(utm_source)`
  );
  pvInitialized = true;
}

export interface ConversionInput {
  type: 'form_submit' | 'whatsapp_click' | 'form_abandon';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  original_referrer?: string;
  container_category?: string;
  container_type?: string;
  quantity?: number;
  transaction_type?: string;
  estimated_value?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  company_name?: string;
  locale?: string;
  page_url?: string;
  user_agent?: string;
}

export async function insertConversion(data: ConversionInput) {
  await ensureTable();
  await db.execute({
    sql: `INSERT INTO conversions (
      type, utm_source, utm_medium, utm_campaign, utm_term,
      gclid, fbclid, original_referrer,
      container_category, container_type, quantity, transaction_type, estimated_value,
      contact_name, contact_email, contact_phone, company_name,
      locale, page_url, user_agent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.type,
      data.utm_source ?? null,
      data.utm_medium ?? null,
      data.utm_campaign ?? null,
      data.utm_term ?? null,
      data.gclid ?? null,
      data.fbclid ?? null,
      data.original_referrer ?? null,
      data.container_category ?? null,
      data.container_type ?? null,
      data.quantity ?? null,
      data.transaction_type ?? null,
      data.estimated_value ?? null,
      data.contact_name ?? null,
      data.contact_email ?? null,
      data.contact_phone ?? null,
      data.company_name ?? null,
      data.locale ?? null,
      data.page_url ?? null,
      data.user_agent ?? null,
    ],
  });
}

export async function getConversionSummary(from: string, to: string) {
  await ensureTable();
  const result = await db.execute({
    sql: `SELECT
      COUNT(*) as total,
      SUM(CASE WHEN type = 'form_submit' THEN 1 ELSE 0 END) as total_leads,
      SUM(CASE WHEN type = 'whatsapp_click' THEN 1 ELSE 0 END) as total_whatsapp,
      SUM(CASE WHEN type = 'form_abandon' THEN 1 ELSE 0 END) as total_abandon,
      COALESCE(SUM(estimated_value), 0) as total_value
    FROM conversions
    WHERE created_at >= ? AND created_at < ?`,
    args: [from, to],
  });
  const row = result.rows[0];
  return {
    total: Number(row.total ?? 0),
    total_leads: Number(row.total_leads ?? 0),
    total_whatsapp: Number(row.total_whatsapp ?? 0),
    total_value: Number(row.total_value ?? 0),
    total_abandon: Number(row.total_abandon ?? 0),
  };
}

export async function getConversionsByDay(from: string, to: string) {
  await ensureTable();
  const result = await db.execute({
    sql: `SELECT
      date(created_at) as date,
      SUM(CASE WHEN type = 'form_submit' THEN 1 ELSE 0 END) as form_count,
      SUM(CASE WHEN type = 'whatsapp_click' THEN 1 ELSE 0 END) as whatsapp_count,
      SUM(CASE WHEN type = 'form_abandon' THEN 1 ELSE 0 END) as abandon_count,
      COALESCE(SUM(estimated_value), 0) as value
    FROM conversions
    WHERE created_at >= ? AND created_at < ?
    GROUP BY date(created_at)
    ORDER BY date(created_at)`,
    args: [from, to],
  });
  return result.rows.map((r) => ({
    date: String(r.date),
    form_count: Number(r.form_count),
    whatsapp_count: Number(r.whatsapp_count),
    abandon_count: Number(r.abandon_count),
    value: Number(r.value),
  }));
}

export async function getAttributionBreakdown(from: string, to: string) {
  await ensureTable();
  const result = await db.execute({
    sql: `SELECT
      COALESCE(utm_source, '(direct)') as source,
      COALESCE(utm_medium, '(none)') as medium,
      COUNT(*) as count,
      COALESCE(SUM(estimated_value), 0) as value
    FROM conversions
    WHERE created_at >= ? AND created_at < ?
    GROUP BY utm_source, utm_medium
    ORDER BY count DESC`,
    args: [from, to],
  });
  return result.rows.map((r) => ({
    source: String(r.source),
    medium: String(r.medium),
    count: Number(r.count),
    value: Number(r.value),
  }));
}

export async function getGoogleAdsData(from: string, to: string) {
  await ensureTable();
  const result = await db.execute({
    sql: `SELECT
      COALESCE(utm_campaign, '(belirtilmemiş)') as campaign,
      COALESCE(utm_term, '(belirtilmemiş)') as term,
      COUNT(*) as count,
      COALESCE(SUM(estimated_value), 0) as value
    FROM conversions
    WHERE gclid IS NOT NULL AND gclid != ''
      AND created_at >= ? AND created_at < ?
    GROUP BY utm_campaign, utm_term
    ORDER BY count DESC`,
    args: [from, to],
  });
  return result.rows.map((r) => ({
    campaign: String(r.campaign),
    term: String(r.term),
    count: Number(r.count),
    value: Number(r.value),
  }));
}

export interface PageViewInput {
  session_id: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  original_referrer?: string;
  page_url?: string;
  locale?: string;
}

export async function insertPageView(data: PageViewInput) {
  await ensurePageViewsTable();
  try {
    await db.execute({
      sql: `INSERT OR IGNORE INTO page_views (
        session_id, utm_source, utm_medium, utm_campaign, utm_term,
        gclid, fbclid, original_referrer, page_url, locale
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        data.session_id,
        data.utm_source ?? null,
        data.utm_medium ?? null,
        data.utm_campaign ?? null,
        data.utm_term ?? null,
        data.gclid ?? null,
        data.fbclid ?? null,
        data.original_referrer ?? null,
        data.page_url ?? null,
        data.locale ?? null,
      ],
    });
  } catch {
    // session_id UNIQUE conflict — duplicate session, ignore silently
  }
}

export async function getKeywordTraffic(from: string, to: string) {
  await ensurePageViewsTable();
  const result = await db.execute({
    sql: `SELECT
      COALESCE(utm_term, '(belirtilmemiş)') as term,
      COALESCE(utm_campaign, '(belirtilmemiş)') as campaign,
      COALESCE(utm_source, '(direct)') as source,
      COUNT(*) as visits,
      SUM(CASE WHEN gclid IS NOT NULL AND gclid != '' THEN 1 ELSE 0 END) as gclid_count
    FROM page_views
    WHERE created_at >= ? AND created_at < ?
    GROUP BY utm_term, utm_campaign, utm_source
    ORDER BY visits DESC`,
    args: [from, to],
  });
  return result.rows.map((r) => ({
    term: String(r.term),
    campaign: String(r.campaign),
    source: String(r.source),
    visits: Number(r.visits),
    gclid_count: Number(r.gclid_count),
  }));
}

export async function getKeywordFunnel(from: string, to: string) {
  await ensurePageViewsTable();
  await ensureTable();
  const result = await db.execute({
    sql: `SELECT
      COALESCE(pv.utm_term, '(belirtilmemiş)') as term,
      COALESCE(pv.utm_campaign, '(belirtilmemiş)') as campaign,
      COUNT(DISTINCT pv.session_id) as visits,
      COUNT(DISTINCT c.id) as conversions,
      COALESCE(SUM(c.estimated_value), 0) as value
    FROM page_views pv
    LEFT JOIN conversions c
      ON pv.utm_term = c.utm_term
      AND pv.utm_campaign = c.utm_campaign
      AND c.created_at >= ? AND c.created_at < ?
    WHERE pv.created_at >= ? AND pv.created_at < ?
    GROUP BY pv.utm_term, pv.utm_campaign
    ORDER BY visits DESC`,
    args: [from, to, from, to],
  });
  return result.rows.map((r) => ({
    term: String(r.term),
    campaign: String(r.campaign),
    visits: Number(r.visits),
    conversions: Number(r.conversions),
    rate: Number(r.visits) > 0 ? Number(r.conversions) / Number(r.visits) : 0,
    value: Number(r.value),
  }));
}

export async function getChannelBreakdown(from: string, to: string) {
  await ensurePageViewsTable();
  const result = await db.execute({
    sql: `SELECT
      COALESCE(utm_source, '(direct)') as source,
      COALESCE(utm_medium, '(none)') as medium,
      COUNT(*) as visits,
      SUM(CASE WHEN gclid IS NOT NULL AND gclid != '' THEN 1 ELSE 0 END) as paid_clicks
    FROM page_views
    WHERE created_at >= ? AND created_at < ?
    GROUP BY utm_source, utm_medium
    ORDER BY visits DESC`,
    args: [from, to],
  });
  return result.rows.map((r) => ({
    source: String(r.source),
    medium: String(r.medium),
    visits: Number(r.visits),
    paid_clicks: Number(r.paid_clicks),
  }));
}

export async function getRecentConversions(limit: number = 20) {
  await ensureTable();
  const result = await db.execute({
    sql: `SELECT id, type, contact_name, contact_email, contact_phone,
      company_name, container_type, estimated_value,
      utm_source, utm_medium, gclid, created_at, locale
    FROM conversions
    ORDER BY created_at DESC
    LIMIT ?`,
    args: [limit],
  });
  return result.rows.map((r) => ({
    id: Number(r.id),
    type: String(r.type),
    contact_name: r.contact_name ? String(r.contact_name) : null,
    contact_email: r.contact_email ? String(r.contact_email) : null,
    contact_phone: r.contact_phone ? String(r.contact_phone) : null,
    company_name: r.company_name ? String(r.company_name) : null,
    container_type: r.container_type ? String(r.container_type) : null,
    estimated_value: r.estimated_value ? Number(r.estimated_value) : null,
    utm_source: r.utm_source ? String(r.utm_source) : null,
    utm_medium: r.utm_medium ? String(r.utm_medium) : null,
    gclid: r.gclid ? String(r.gclid) : null,
    created_at: String(r.created_at),
    locale: r.locale ? String(r.locale) : null,
  }));
}
