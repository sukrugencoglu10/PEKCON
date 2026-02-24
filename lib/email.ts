import nodemailer, { type Transporter } from 'nodemailer';
import type { StockRow } from './send-session';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Kurumsal proxy/firewall SSL denetimi için
      },
    });
  }
  return transporter;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cell(val: number): string {
  if (val === 0) return '<span style="color:#94a3b8;">–</span>';
  return `<strong style="color:#0069b4;">${val}</strong>`;
}

function generateStockTable(stock: StockRow[]): string {
  if (stock.length === 0) return '';

  // Konteyner tiplerini ilk satırdan türet
  const types = Object.keys(stock[0].containers);

  // Country gruplaması — aynı ülke tekrar yazılmaz
  let lastCountry = '';

  const bodyRows = stock
    .map((row, idx) => {
      const showCountry = row.country !== lastCountry;
      if (showCountry) lastCountry = row.country;

      const countryCell = showCountry
        ? `<td style="padding:7px 10px;font-size:11px;font-weight:700;color:#0069b4;
                      border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;
                      white-space:nowrap;text-transform:uppercase;letter-spacing:0.5px;">
             ${escapeHtml(row.country)}
           </td>`
        : `<td style="padding:7px 10px;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;"></td>`;

      return `
      <tr style="background-color:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        ${countryCell}
        <td style="padding:7px 10px;font-size:11px;font-weight:600;color:#334155;
                   border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;
                   white-space:nowrap;">${escapeHtml(row.location)}</td>
        ${types
          .map(
            (t) =>
              `<td style="padding:7px 8px;text-align:center;font-size:11px;
                          border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
                 ${cell(row.containers[t] ?? 0)}
               </td>`
          )
          .join('')}
      </tr>`;
    })
    .join('');

  const thStyle = `padding:8px 10px;text-align:center;font-size:10px;color:#ffffff;
                   font-weight:700;text-transform:uppercase;letter-spacing:0.4px;
                   white-space:nowrap;border-right:1px solid #1e6fa3;`;

  return `
  <div style="overflow-x:auto;margin-bottom:24px;">
  <table cellpadding="0" cellspacing="0"
         style="border-collapse:collapse;border:1px solid #e2e8f0;font-size:11px;min-width:100%;">
    <thead>
      <tr style="background-color:#0069b4;">
        <th style="${thStyle}text-align:left;">COUNTRY</th>
        <th style="${thStyle}text-align:left;">DEPOTS</th>
        ${types.map((t) => `<th style="${thStyle}">${escapeHtml(t)}</th>`).join('')}
      </tr>
    </thead>
    <tbody>${bodyRows}</tbody>
  </table>
  </div>`;
}

export function generateEmailHtml(stock: StockRow[], _recipientName?: string, baseUrl?: string): string {
  const logoBase = baseUrl ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'https://pekcon.com';
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>PEKCON Konteyner Stok Listesi</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:30px 12px;">

        <!-- Ana kart -->
        <table cellpadding="0" cellspacing="0"
               style="max-width:720px;width:100%;background-color:#ffffff;
                      border:1px solid #d9d9d9;">

          <!-- Üst logo bandı -->
          <tr>
            <td style="background-color:#0069b4;padding:16px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:3px;">PEKCON</span>
                    <span style="font-size:10px;color:#a8d4f5;margin-left:8px;
                                 letter-spacing:1px;text-transform:uppercase;">
                      Container &amp; Logistics
                    </span>
                  </td>
                  <td align="right">
                    <a href="http://www.pekcon.com"
                       style="font-size:11px;color:#a8d4f5;text-decoration:none;">
                      www.pekcon.com
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gövde -->
          <tr>
            <td style="padding:28px 28px 20px;color:#333333;font-size:13px;line-height:1.7;">

              <!-- Başlık -->
              <p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#0069b4;letter-spacing:0.5px;">
                CURRENT STOCK LIST &nbsp;|&nbsp; GÜNCEL STOK LİSTESİ
              </p>

              <!-- İngilizce -->
              <p style="margin:0 0 4px;"><strong>Dear Colleague,</strong></p>
              <p style="margin:0 0 4px;">Our current stock list as below.</p>
              <p style="margin:0 0 16px;">We are looking forward to your valuable requests.</p>

              <!-- Türkçe -->
              <p style="margin:0 0 4px;"><strong>Değerli İlgili,</strong></p>
              <p style="margin:0 0 4px;">Güncel stok bilgilerimiz aşağıdaki gibidir.</p>
              <p style="margin:0 0 4px;">Bilginize sunar, değerli taleplerinizi bekleriz.</p>
              <p style="margin:0 0 18px;">
                <a href="mailto:marketing@pekcon.com" style="color:#0069b4;">marketing@pekcon.com</a>
              </p>

              ${generateStockTable(stock)}

            </td>
          </tr>

          <!-- İmza -->
          <tr>
            <td style="padding:0 28px 28px;font-size:13px;color:#333333;line-height:1.8;">
              <p style="margin:0 0 10px;">Best Regards,</p>

              <!-- PEKCON Logo -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td>
                    <img
                      src="${logoBase}/pekcon-logo.png"
                      alt="PEKCON Container &amp; Logistics"
                      width="160"
                      style="display:block;border:0;outline:none;text-decoration:none;max-width:160px;"
                    />
                  </td>
                </tr>
              </table>

              <!-- İletişim bilgileri -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:16px;font-size:12px;color:#555555;">
                    <strong>Mobile:</strong> +90 537 632 24 30
                  </td>
                  <td style="padding-right:16px;font-size:12px;color:#555555;">
                    <strong>Phone:</strong> +90 212 297 97 58
                  </td>
                  <td style="font-size:12px;color:#555555;">
                    <strong>Fax:</strong> +90 212 297 97 68
                  </td>
                </tr>
                <tr>
                  <td colspan="3" style="padding-top:4px;font-size:12px;color:#555555;">
                    <strong>Email:</strong>
                    <a href="mailto:marketing@pekcon.com" style="color:#0069b4;">
                      marketing@pekcon.com
                    </a>
                    &nbsp;&nbsp;
                    <strong>Web:</strong>
                    <a href="http://www.pekcon.com" style="color:#0069b4;text-decoration:none;">
                      www.pekcon.com
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alt bant -->
          <tr>
            <td style="background-color:#0069b4;padding:10px 28px;">
              <p style="margin:0;font-size:10px;color:#a8d4f5;text-align:center;">
                Bu e-posta PEKCON Denizcilik Konteyner ve Lojistik tarafından gönderilmiştir.
                &nbsp;|&nbsp;
                <a href="mailto:marketing@pekcon.com?subject=Unsubscribe"
                   style="color:#a8d4f5;text-decoration:underline;">Aboneliği iptal et</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const BATCH_SIZE = 490; // Gmail: mesaj başına maks 500 alıcı (To + CC dahil)

export async function sendBulkBcc(
  contacts: Array<{ email: string; displayName: string }>,
  stock: StockRow[],
  onBatchSent?: (sentSoFar: number) => void
): Promise<void> {
  const transport = getTransporter();
  const html = generateEmailHtml(stock);
  const subject = 'PEKCON – Güncel Konteyner Stok Listesi';
  const from = `"${process.env.SMTP_FROM_NAME ?? 'PEKCON'}" <${process.env.SMTP_USER}>`;
  const to   = `"${process.env.SMTP_FROM_NAME ?? 'PEKCON Container & Logistics'}" <${process.env.SMTP_USER}>`;
  const cc   = process.env.SMTP_CC ?? 'murat@pekcon.com';

  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    const batch = contacts.slice(i, i + BATCH_SIZE);
    const bcc = batch
      .map((c) => c.displayName ? `"${c.displayName}" <${c.email}>` : c.email)
      .join(', ');

    await transport.sendMail({ from, to, cc, bcc, subject, html });
    onBatchSent?.(Math.min(i + BATCH_SIZE, contacts.length));
  }
}

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
