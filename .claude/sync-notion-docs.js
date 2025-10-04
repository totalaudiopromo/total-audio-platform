#!/usr/bin/env node
/**
 * Sync Notion Business Docs to Local Files
 *
 * Syncs the 3 core business docs from Notion to local markdown:
 * - WEEKLY_FOCUS.md
 * - AUDIO_INTEL_CONTEXT.md
 * - BUSINESS_NOTES.md
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Notion page IDs (update these with your actual page IDs)
const NOTION_PAGES = {
  WEEKLY_FOCUS: process.env.NOTION_WEEKLY_FOCUS_ID || '',
  AUDIO_INTEL_CONTEXT: process.env.NOTION_CONTEXT_ID || '',
  BUSINESS_NOTES: process.env.NOTION_NOTES_ID || ''
};

const REPO_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';

async function syncNotionDocs() {
  const notionApiKey = process.env.NOTION_API_KEY;

  if (!notionApiKey) {
    console.log('⚠️  NOTION_API_KEY not set - skipping sync');
    return;
  }

  const notion = new Client({ auth: notionApiKey });

  try {
    console.log('🔄 Syncing Notion docs to local files...');

    for (const [docName, pageId] of Object.entries(NOTION_PAGES)) {
      if (!pageId) {
        console.log(`⚠️  ${docName} page ID not configured - skipping`);
        continue;
      }

      try {
        // Get page content
        const blocks = await notion.blocks.children.list({
          block_id: pageId,
          page_size: 100
        });

        // Convert blocks to markdown
        const markdown = await blocksToMarkdown(blocks.results, notion);

        // Get page title
        const page = await notion.pages.retrieve({ page_id: pageId });
        const title = getPageTitle(page);

        // Write to file
        const fileName = `${docName}.md`;
        const filePath = path.join(REPO_ROOT, fileName);

        const content = `# ${title}\n\n${markdown}\n\n---\n*Last synced from Notion: ${new Date().toISOString()}*\n`;

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Synced ${docName} to ${fileName}`);

      } catch (error) {
        console.error(`❌ Failed to sync ${docName}:`, error.message);
      }
    }

    console.log('✅ Notion sync complete');

  } catch (error) {
    console.error('❌ Notion sync failed:', error.message);
    process.exit(1);
  }
}

function getPageTitle(page) {
  const titleProp = page.properties?.title || page.properties?.Name || page.properties?.Title;
  if (titleProp?.title?.[0]?.plain_text) {
    return titleProp.title[0].plain_text;
  }
  return 'Untitled';
}

async function blocksToMarkdown(blocks, notion) {
  const lines = [];

  for (const block of blocks) {
    const text = await blockToMarkdown(block, notion);
    if (text) lines.push(text);
  }

  return lines.join('\n');
}

async function blockToMarkdown(block, notion) {
  const type = block.type;

  switch (type) {
    case 'paragraph':
      return richTextToMarkdown(block.paragraph.rich_text);

    case 'heading_1':
      return `# ${richTextToMarkdown(block.heading_1.rich_text)}`;

    case 'heading_2':
      return `## ${richTextToMarkdown(block.heading_2.rich_text)}`;

    case 'heading_3':
      return `### ${richTextToMarkdown(block.heading_3.rich_text)}`;

    case 'bulleted_list_item':
      return `- ${richTextToMarkdown(block.bulleted_list_item.rich_text)}`;

    case 'numbered_list_item':
      return `1. ${richTextToMarkdown(block.numbered_list_item.rich_text)}`;

    case 'to_do':
      const checked = block.to_do.checked ? 'x' : ' ';
      return `- [${checked}] ${richTextToMarkdown(block.to_do.rich_text)}`;

    case 'code':
      const language = block.code.language || '';
      const code = richTextToMarkdown(block.code.rich_text);
      return `\`\`\`${language}\n${code}\n\`\`\``;

    case 'quote':
      return `> ${richTextToMarkdown(block.quote.rich_text)}`;

    case 'divider':
      return '---';

    case 'callout':
      const icon = block.callout.icon?.emoji || '📌';
      return `${icon} ${richTextToMarkdown(block.callout.rich_text)}`;

    case 'toggle':
      return `<details>\n<summary>${richTextToMarkdown(block.toggle.rich_text)}</summary>\n</details>`;

    default:
      return '';
  }
}

function richTextToMarkdown(richText) {
  if (!richText || !richText.length) return '';

  return richText.map(text => {
    let content = text.plain_text;

    if (text.annotations.bold) content = `**${content}**`;
    if (text.annotations.italic) content = `*${content}*`;
    if (text.annotations.code) content = `\`${content}\``;
    if (text.annotations.strikethrough) content = `~~${content}~~`;

    if (text.href) content = `[${content}](${text.href})`;

    return content;
  }).join('');
}

// Run sync
syncNotionDocs();
