import * as XLSX from 'xlsx';
import type { StockRow, Contact } from './send-session';

// ── Stok Excel Parser ────────────────────────────────────────────────────────
// Format: Country | Location | 40HC CW | 20DC CW | 40DV CW | ...
// Country sütunu birleştirilmiş hücre — boş satırlarda önceki ülke taşınır

export interface ParseResult {
  rows: StockRow[];
  containerTypes: string[];
  errors: string[];
}

export function parseExcelBuffer(buffer: ArrayBuffer): ParseResult {
  const errors: string[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return { rows: [], containerTypes: [], errors: ['Excel dosyasında sayfa bulunamadı.'] };

    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    if (rawData.length < 2) {
      return { rows: [], containerTypes: [], errors: ['Dosya en az başlık + 1 veri satırı içermelidir.'] };
    }

    // Başlık satırını bul: "Country" veya "Location" içeren satır
    let headerIdx = -1;
    for (let i = 0; i < Math.min(rawData.length, 5); i++) {
      const row = rawData[i];
      const cells = row.map((c) => String(c ?? '').toLowerCase().trim());
      if (
        cells.some((c) => c.includes('country') || c.includes('ülke')) ||
        cells.some((c) => c.includes('location') || c.includes('lokasyon'))
      ) {
        headerIdx = i;
        break;
      }
    }
    if (headerIdx === -1) headerIdx = 0; // fallback

    const headerRow = rawData[headerIdx].map((h) => String(h ?? '').trim());

    // İlk sütun = Country, ikinci sütun = Location, geri kalanlar konteyner tipleri
    const containerTypes = headerRow.slice(2).filter((h) => h.length > 0);

    if (containerTypes.length === 0) {
      return { rows: [], containerTypes: [], errors: ['Konteyner tipi sütunları bulunamadı. Başlıkları kontrol edin.'] };
    }

    const rows: StockRow[] = [];
    let lastCountry = '';

    for (let i = headerIdx + 1; i < rawData.length; i++) {
      const row = rawData[i];
      const countryCell = String(row[0] ?? '').trim();
      const location = String(row[1] ?? '').trim();

      // Birleştirilmiş hücre taşıma: boş country = önceki ülke
      if (countryCell) lastCountry = countryCell;
      if (!location) continue; // Lokasyon boşsa satırı atla

      const containers: Record<string, number> = {};
      for (let c = 0; c < containerTypes.length; c++) {
        const raw = row[c + 2];
        const num = raw === '' || raw === undefined || raw === null ? 0 : Number(raw);
        containers[containerTypes[c]] = isNaN(num) ? 0 : num;
      }

      rows.push({ country: lastCountry, location, containers });
    }

    if (rows.length === 0) {
      return { rows: [], containerTypes, errors: ['Hiç veri satırı bulunamadı.'] };
    }

    return { rows, containerTypes, errors };
  } catch (err) {
    return {
      rows: [],
      containerTypes: [],
      errors: [`Dosya okunamadı: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`],
    };
  }
}

// ── Outlook / Google Contacts CSV Parser ─────────────────────────────────────
// Outlook export  : First Name, Last Name, E-mail Address, Display Name
// Google Contacts : First Name, Middle Name, Last Name, ..., E-mail 1 - Label, E-mail 1 - Value

const EMAIL_ALIASES = ['e-mail address', 'email address', 'e-mail', 'email', 'e_mail', 'e-posta'];
const FIRSTNAME_ALIASES = ['first name', 'firstname', 'ad', 'name'];
const MIDDLENAME_ALIASES = ['middle name', 'middlename', 'orta ad'];
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

    // E-posta sütununu bul — Google Contacts'ta "E-mail 1 - Label" ve "E-mail 1 - Value"
    // gibi çift sütun olabilir. "value" içereni tercih et, "label" olanı atla.
    let emailIdx = headerRow.findIndex(
      (h) => EMAIL_ALIASES.some((a) => h.includes(a)) && h.includes('value')
    );
    if (emailIdx === -1) {
      emailIdx = headerRow.findIndex(
        (h) => EMAIL_ALIASES.some((a) => h.includes(a)) && !h.includes('label')
      );
    }
    if (emailIdx === -1) {
      emailIdx = headerRow.findIndex((h) => EMAIL_ALIASES.some((a) => h.includes(a)));
    }

    if (emailIdx === -1) {
      return {
        contacts: [],
        errors: [`E-posta kolonu bulunamadı. Mevcut başlıklar: ${rawData[0].slice(0, 10).join(', ')}`],
      };
    }

    const displayIdx = headerRow.findIndex((h) => DISPLAY_ALIASES.some((a) => h === a));
    const firstIdx   = headerRow.findIndex((h) => FIRSTNAME_ALIASES.some((a) => h === a));
    const middleIdx  = headerRow.findIndex((h) => MIDDLENAME_ALIASES.some((a) => h === a));
    const lastIdx    = headerRow.findIndex((h) => LASTNAME_ALIASES.some((a) => h === a));

    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      const email = String(row[emailIdx] ?? '').trim().toLowerCase();
      if (!email || !email.includes('@')) continue;

      let displayName = '';
      if (displayIdx !== -1) displayName = String(row[displayIdx] ?? '').trim();
      if (!displayName && firstIdx !== -1) {
        const first  = String(row[firstIdx]  ?? '').trim();
        const middle = middleIdx !== -1 ? String(row[middleIdx] ?? '').trim() : '';
        const last   = lastIdx   !== -1 ? String(row[lastIdx]   ?? '').trim() : '';
        displayName  = [first, middle, last].filter(Boolean).join(' ');
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
    return {
      contacts: [],
      errors: [`Dosya okunamadı: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`],
    };
  }
}
