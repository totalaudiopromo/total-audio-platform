import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Creates a new database under a parent page
export async function createSocialContentDatabase(parentPageId: string) {
  return await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    title: [
      {
        type: 'text',
        text: { content: 'Social Content' },
      },
    ],
    properties: {
      Category: { title: {} },
      Platform: { rich_text: {} },
      Content: { rich_text: {} },
      CTA: { rich_text: {} },
      Status: {
        select: {
          options: [
            { name: 'Draft', color: 'yellow' },
            { name: 'Scheduled', color: 'blue' },
            { name: 'Published', color: 'green' },
          ],
        },
      },
    },
  });
}

// Adds a content entry to the Social Content database
type SocialContentEntry = {
  database_id: string;
  category: string;
  platform: string;
  content: string;
  cta: string;
  status?: 'Draft' | 'Scheduled' | 'Published';
};

export async function addSocialContentEntry(entry: SocialContentEntry) {
  return await notion.pages.create({
    parent: { database_id: entry.database_id },
    properties: {
      Category: { title: [{ text: { content: entry.category } }] },
      Platform: { rich_text: [{ text: { content: entry.platform } }] },
      Content: { rich_text: [{ text: { content: entry.content } }] },
      CTA: { rich_text: [{ text: { content: entry.cta } }] },
      Status: { select: { name: entry.status || 'Draft' } },
    },
  });
}
