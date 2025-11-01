import type { NextApiRequest, NextApiResponse } from 'next';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Contacts';

// Sample data for testing the UI
const sampleData = {
  records: [
    {
      id: 'rec1',
      fields: {
        'First Name': 'Sarah',
        'Last Name': 'Johnson',
        Email: 'sarah.johnson@musicweekly.com',
        Station: 'Music Weekly',
        'Contact Type': 'Journalist',
        Status: 'Active',
        'Last Engagement': '2024-01-15',
        Region: 'UK',
        Genres: ['Electronic', 'Dance', 'Pop'],
        'Publication Tier': 'Tier 1',
        'Contact Method': 'email',
        'Response Rate': 85,
        'Campaign Replies': 'Positive',
        Influencer: true,
        Press: true,
        'Promo Reply': 'Positive',
      },
    },
    {
      id: 'rec2',
      fields: {
        'First Name': 'Mike',
        'Last Name': 'Chen',
        Email: 'mike.chen@beatsradio.com',
        Station: 'Beats Radio',
        'Contact Type': 'DJ',
        Status: 'Active',
        'Last Engagement': '2024-01-10',
        Region: 'USA',
        Genres: ['Hip-Hop', 'R&B / Soul'],
        'Publication Tier': 'Tier 2',
        'Contact Method': 'phone',
        'Response Rate': 72,
        Radio: true,
        Playlisting: true,
      },
    },
    {
      id: 'rec3',
      fields: {
        'First Name': 'Emma',
        'Last Name': 'Rodriguez',
        Email: 'emma.rodriguez@indieblog.net',
        Station: 'Indie Blog',
        'Contact Type': 'Blogger',
        Status: 'VIP',
        'Last Engagement': '2024-01-20',
        Region: 'EUROPE',
        Genres: ['Indie', 'Alternative', 'Rock'],
        'Publication Tier': 'Tier 1',
        'Contact Method': 'social',
        'Response Rate': 95,
        Influencer: true,
        Press: true,
        'Promo Reply': 'Positive',
      },
    },
    {
      id: 'rec4',
      fields: {
        'First Name': 'David',
        'Last Name': 'Thompson',
        Email: 'david.thompson@synthmag.com',
        Station: 'Synth Magazine',
        'Contact Type': 'Editor',
        Status: 'Active',
        'Last Engagement': '2024-01-05',
        Region: 'CANADA',
        Genres: ['Synthpop', 'Electronic', 'Experimental'],
        'Publication Tier': 'Tier 3',
        'Contact Method': 'email',
        'Response Rate': 68,
        Press: true,
      },
    },
    {
      id: 'rec5',
      fields: {
        'First Name': 'Lisa',
        'Last Name': 'Wang',
        Email: 'lisa.wang@ambientzone.com',
        Station: 'Ambient Zone',
        'Contact Type': 'Curator',
        Status: 'Active',
        'Last Engagement': '2024-01-18',
        Region: 'AUSTRALIA',
        Genres: ['Ambient / Chill', 'Experimental'],
        'Publication Tier': 'Tier 2',
        'Contact Method': 'email',
        'Response Rate': 88,
        Playlisting: true,
        Press: true,
      },
    },
  ],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // For now, return sample data to test the UI
  // TODO: Uncomment the Airtable integration when backend is fixed
  /*
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return res.status(500).json({ error: 'Missing Airtable configuration.' });
  }

  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
  */

  // Return sample data for now
  res.status(200).json(sampleData);
}
