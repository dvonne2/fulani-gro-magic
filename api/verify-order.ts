import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

const SHEET_RANGE = 'Orders!A:O';

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) {
    throw new Error('Google service account not configured');
  }
  return new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const orderId = String(req.query.orderId || '').trim();
  if (!orderId) {
    return res.status(400).json({ ok: false, error: 'Missing orderId' });
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: SHEET_RANGE,
    });

    const rows = result.data.values || [];
    const matches: any[] = [];
    const header = rows[0] || [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row && row[1] === orderId) {
        matches.push({
          row: `Orders!A${i + 1}:O${i + 1}`,
          index: i + 1,
          values: {
            timestamp: row[0] || '',
            orderId: row[1] || '',
            name: row[2] || '',
            phone: row[3] || '',
            whatsapp: row[4] || '',
            email: row[5] || '',
            address: row[6] || '',
            state: row[7] || '',
            lga: row[8] || '',
            package: row[9] || '',
            sku: row[10] || '',
            quantity: row[11] || '',
            productAmount: row[12] || '',
            deliveryFee: row[13] || '',
            total: row[14] || '',
          },
        });
      }
    }

    return res.status(200).json({
      ok: true,
      orderId,
      matchCount: matches.length,
      matches,
      checkedRange: SHEET_RANGE,
    });
  } catch (e: any) {
    console.error('[verify-order] Sheet error:', e);
    return res.status(502).json({ ok: false, error: 'Could not read sheet', diagnostic: e.message });
  }
}
