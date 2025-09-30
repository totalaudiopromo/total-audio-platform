#!/usr/bin/env node
/**
 * Export selected Notion pages to Markdown for consolidation analysis.
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');

const token = process.env.NOTION_API_KEY;
if (!token) {
  console.error('NOTION_API_KEY is not set.');
  process.exit(1);
}

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
};

const inputPath = getArg('input', 'tools/notion/pages.json');
const outDir = getArg('out', 'tmp/notion-export');
const offset = (() => {
  const raw = getArg('offset', null);
  if (!raw) return 0;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
})();

const limit = (() => {
  const raw = getArg('limit', null);
  if (!raw) return null;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
})();

const notion = new Client({ auth: token });

(async () => {
  try {
    const entries = readInput(inputPath).slice(offset);
    await fs.promises.mkdir(outDir, { recursive: true });

    let processed = 0;
    for (const entry of entries) {
      if (limit && processed >= limit) break;
      const pageId = extractPageId(entry);
      if (!pageId) {
        console.warn(`⚠️  Skipping entry without resolvable pageId: ${entry}`);
        continue;
      }
      try {
        const page = await notion.pages.retrieve({ page_id: pageId });
        const blocks = await fetchAllBlocks(pageId);
        const markdown = buildMarkdown(page, blocks);
        const fileName = `${slugify(getTitleFromPage(page) || pageId)}.md`;
        const outPath = path.join(outDir, fileName);
        await fs.promises.writeFile(outPath, markdown, 'utf8');
        console.log(`✅ Exported ${entry} -> ${outPath}`);
        processed += 1;
      } catch (err) {
        console.error(`❌ Failed to export ${entry}: ${err.message}`);
      }
    }

    console.log(`\nDone. Exported ${processed} page(s). Output directory: ${path.resolve(outDir)}`);
  } catch (err) {
    console.error(`Export failed: ${err.message}`);
    process.exit(1);
  }
})();

function readInput(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('Input JSON must be an array');
  }
  return parsed;
}

function extractPageId(entry) {
  if (!entry) return null;
  const str = String(entry).trim();
  if (!str) return null;
  if (/^[0-9a-fA-F-]{32,36}$/.test(str)) {
    return normalizeId(str);
  }
  try {
    const url = new URL(str);
    const qp = url.searchParams.get('p') || url.searchParams.get('pageId');
    if (qp) return normalizeId(qp);
    const segments = url.pathname.split('/').filter(Boolean);
    const tail = segments[segments.length - 1] || '';
    const mDash = tail.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/);
    if (mDash) return normalizeId(mDash[1]);
    const mRaw = tail.match(/([0-9a-fA-F]{32})/);
    if (mRaw) return normalizeId(mRaw[1]);
  } catch (_) {
    // ignore
  }
  return null;
}

function normalizeId(id) {
  const clean = id.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
  if (clean.length !== 32) return null;
  return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
}

async function fetchAllBlocks(parentId) {
  const blocks = [];
  let cursor;
  do {
    const response = await notion.blocks.children.list({
      block_id: parentId,
      page_size: 100,
      start_cursor: cursor,
    });
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  for (const block of blocks) {
    if (block.has_children) {
      block.children = await fetchAllBlocks(block.id);
    }
  }

  return blocks;
}

function buildMarkdown(page, blocks) {
  const title = getTitleFromPage(page) || 'Untitled';
  const url = page.url;
  const headerLines = [
    '---',
    `title: "${escapeQuotes(title)}"`,
    `notion_url: ${url}`,
    `exported_at: ${new Date().toISOString()}`,
    '---',
    '',
    `# ${title}`,
    '',
  ];
  const body = blocks.map(block => renderBlock(block, 0)).join('\n');
  return `${headerLines.join('\n')}${body}`;
}

function escapeQuotes(str) {
  return (str || '').replace(/"/g, '\\"');
}

function getTitleFromPage(page) {
  if (!page || typeof page !== 'object') return null;
  const props = page.properties || {};
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (prop?.type === 'title') {
      const titleArr = prop.title || [];
      if (Array.isArray(titleArr) && titleArr.length) {
        return titleArr.map(part => part.plain_text || '').join('').trim();
      }
    }
  }
  return null;
}

function renderBlock(block, depth = 0) {
  const { type } = block;
  switch (type) {
    case 'paragraph':
      return `${indent(depth)}${richTextToMarkdown(block.paragraph.rich_text)}\n`;
    case 'heading_1':
      return `${indent(depth)}# ${richTextToMarkdown(block.heading_1.rich_text)}\n`;
    case 'heading_2':
      return `${indent(depth)}## ${richTextToMarkdown(block.heading_2.rich_text)}\n`;
    case 'heading_3':
      return `${indent(depth)}### ${richTextToMarkdown(block.heading_3.rich_text)}\n`;
    case 'bulleted_list_item':
      return renderListItem('-', block.bulleted_list_item, depth);
    case 'numbered_list_item':
      return renderListItem('1.', block.numbered_list_item, depth);
    case 'to_do':
      return renderTodo(block, depth);
    case 'quote':
      return `${indent(depth)}> ${richTextToMarkdown(block.quote.rich_text)}\n`;
    case 'callout':
      return `${indent(depth)}> ${richTextToMarkdown(block.callout.rich_text)}\n${renderChildren(block, depth + 1)}`;
    case 'toggle':
      return `${indent(depth)}- ${richTextToMarkdown(block.toggle.rich_text)}\n${renderChildren(block, depth + 1)}`;
    case 'code':
      return renderCode(block, depth);
    case 'divider':
      return `${indent(depth)}---\n`;
    case 'image':
    case 'video':
    case 'file':
      return renderMedia(block, depth);
    default:
      return `${indent(depth)}<!-- unhandled ${type} -->\n${block.has_children ? renderChildren(block, depth + 1) : ''}`;
  }
}

function renderListItem(marker, data, depth) {
  const content = richTextToMarkdown(data.rich_text);
  const children = renderChildren({ children: data.children }, depth + 1);
  return `${indent(depth)}${marker} ${content}\n${children}`;
}

function renderTodo(block, depth) {
  const prefix = block.to_do.checked ? '- [x]' : '- [ ]';
  const content = richTextToMarkdown(block.to_do.rich_text);
  return `${indent(depth)}${prefix} ${content}\n${renderChildren(block, depth + 1)}`;
}

function renderCode(block, depth) {
  const language = block.code.language || '';
  const text = block.code.rich_text.map(part => part.plain_text || '').join('');
  const fenceOpen = indent(depth) + '```' + (language ? language : '') + '\n';
  const fenceClose = indent(depth) + '```\n';
  return `${fenceOpen}${text}\n${fenceClose}`;
}

function renderMedia(block, depth) {
  const data = block[block.type] || {};
  const url = data.external?.url || data.file?.url || '';
  return `${indent(depth)}![${block.type}](${url})\n`;
}

function renderChildren(block, depth) {
  if (!block.children || !block.children.length) return '';
  return block.children.map(child => renderBlock(child, depth)).join('');
}

function indent(depth) {
  return depth ? '  '.repeat(depth) : '';
}

function richTextToMarkdown(richText = []) {
  if (!Array.isArray(richText) || !richText.length) return '';
  return richText.map((item) => {
    const text = item.plain_text || '';
    if (!text) return '';
    let value = text;
    const ann = item.annotations || {};
    if (ann.code) value = `\`${value}\``;
    if (ann.bold) value = `**${value}**`;
    if (ann.italic) value = `_${value}_`;
    if (ann.strikethrough) value = `~~${value}~~`;
    if (ann.underline) value = `<u>${value}</u>`;
    if (item.href) {
      return `[${value}](${item.href})`;
    }
    return value;
  }).join('');
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'untitled';
}
