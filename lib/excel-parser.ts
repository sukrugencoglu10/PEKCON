import * as XLSX from 'xlsx';
import type { StockRow, Contact } from './send-session';

const KONTEYNER_ALIASES = ['konteyner tipi', 'konteyner_tipi', 'tip', 'type', 'container'];
const ADET_ALIASES = ['mevcut adet', 'mevcut_adet', 'adet', 'quantity', 'stok', 'stock'];

// Outlook CSV standart sütun adları
const EMAIL_ALIASES = ['e-mail address', 'email address', 'e-mail', 'email', 'e_mail'];
const FIRSTNAME_ALIASES = ['first name', 'firstname', 'ad', 'name'];
const LASTNAME_ALIASES = ['last name', 'lastname', 'soyad', 'surname'];
const DISPLAY_ALIASES = ['display name', 'full name', 'fullname', 'displayname', 'ad soyad'];

export interface ContactParseResult {
  contacts: Contact[];
  errors: string[];
}

export function parseContactsCsv(buffer: ArrayBuffer): ContactParseResult {
  const errors: string[] = [];
  const contacts: Contact[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return { contacts: [], errors: ['Dosyada sayfa bulunamadı.'] };

    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    if (rawData.length < 2) {
      return { contacts: [], errors: ['Dosya en az başlık + 1 veri satırı içermelidir.'] };
    }

    const headerRow = rawData[0].map((h) => String(h).toLowerCase().trim());

    // E-posta kolonu zorunlu
    const emailIdx = headerRow.findIndex((h) =>
      EMAIL_ALIASES.some((a) => h.includes(a))
    );
    if (emailIdx === -1) {
      return {
        contacts: [],
        errors: [`"E-mail Address" kolonu bulunamadı. Mevcut başlıklar: ${rawData[0].join(', ')}`],
      };
    }

    // Ad: önce display name, yoksa first+last
    const displayIdx = headerRow.findIndex((h) =>
      DISPLAY_ALIASES.some((a) => h === a)
    );
    const firstIdx = headerRow.findIndex((h) =>
      FIRSTNAME_ALIASES.some((a) => h === a)
    );
    const lastIdx = headerRow.findIndex((h) =>
      LASTNAME_ALIASES.some((a) => h === a)
    );

    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      const email = String(row[emailIdx] ?? '').trim().toLowerCase();
      if (!email || !email.includes('@')) continue;

      let displayName = '';
      if (displayIdx !== -1) {
        displayName = String(row[displayIdx] ?? '').trim();
      }
      if (!displayName && firstIdx !== -1) {
        const first = String(row[firstIdx] ?? '').trim();
        const last = lastIdx !== -1 ? String(row[lastIdx] ?? '').trim() : '';
        displayName = [first, last].filter(Boolean).join(' ');
      }
      if (!displayName) displayName = email;

      contacts.push({ email, displayName });
    }

    // Tekrar eden e-posta adreslerini kaldır
    const seen = new Set<string>();
    const unique = contacts.filter((c) => {
      if (seen.has(c.email)) return false;
      seen.add(c.email);
      return true;
    });

    return { contacts: unique, errors };
  } catch (err) {
    return { contacts: [], errors: [`Dosya okunamadı: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`] };
  }
}

export interface ParseResult {
  rows: StockRow[];
  errors: string[];
}

export function parseExcelBuffer(buffer: ArrayBuffer): ParseResult {
  const errors: string[] = [];
  const rows: StockRow[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return { rows: [], errors: ['Excel dosyasında sayfa bulunamadı.'] };
    }

    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    if (rawData.length < 2) {
      return { rows: [], errors: ['Dosya en az bir başlık satırı ve bir veri satırı içermelidir.'] };
    }

    const headerRow = rawData[0].map((h) => String(h).toLowerCase().trim());

    const konteynerIdx = headerRow.findIndex((h) =>
      KONTEYNER_ALIASES.some((alias) => h.includes(alias))
    );
    const adetIdx = headerRow.findIndex((h) =>
      ADET_ALIASES.some((alias) => h.includes(alias))
    );

    if (konteynerIdx === -1) {
      errors.push(`"Konteyner Tipi" kolonu bulunamadı. Mevcut başlıklar: ${headerRow.join(', ')}`);
    }
    if (adetIdx === -1) {
      errors.push(`"Mevcut Adet" kolonu bulunamadı. Mevcut başlıklar: ${headerRow.join(', ')}`);
    }
    if (errors.length > 0) return { rows: [], errors };

    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      const tipi = String(row[konteynerIdx] ?? '').trim();
      const adetRaw = row[adetIdx];
      const adet = Number(adetRaw);

      if (!tipi) continue;
      if (isNaN(adet) || adet < 0) {
        errors.push(`Satır ${i + 1}: Geçersiz adet değeri "${adetRaw}"`);
        continue;
      }

      rows.push({ konteynerTipi: tipi, mevcutAdet: adet });
    }
  } catch (err) {
    errors.push(`Dosya okunamadı: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
  }

  return { rows, errors };
}
