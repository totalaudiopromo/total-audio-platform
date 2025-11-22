import type { NextApiRequest, NextApiResponse } from 'next';

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const TEST_VAR = process.env.TEST_VAR;
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_NAME = 'Contacts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Debug logs
  console.log('AIRTABLE_TOKEN:', AIRTABLE_TOKEN);
  console.log('TEST_VAR:', TEST_VAR);

  if (!AIRTABLE_TOKEN) {
    return res.status(500).json({ error: 'Airtable token not set in environment variables.' });
  }

  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
    const airtableRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!airtableRes.ok) {
      const error = await airtableRes.text();
      return res.status(airtableRes.status).json({ error });
    }

    const data = await airtableRes.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
