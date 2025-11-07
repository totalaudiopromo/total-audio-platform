#!/usr/bin/env node
// Minimal Notion MCP server for Cursor/Codex
// - Implements MCP over stdio using Content-Length framing
// - Tools:
//   - notion.search { query: string }
//   - notion.page { pageId: string }
// Env: NOTION_API_KEY must be set (keep it local; do not commit)
// Note: This is a minimal subset to get you productive; extend as needed.

const https = require('https');

const TOKEN = process.env.NOTION_API_KEY;
if (!TOKEN) {
  console.error('ERROR: NOTION_API_KEY not set');
}

// --- MCP framing helpers (LSP-style) ---
let inBuffer = Buffer.alloc(0);
process.stdin.on('data', chunk => {
  inBuffer = Buffer.concat([inBuffer, chunk]);
  drain();
});

function drain() {
  while (true) {
    const headerEnd = inBuffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) return; // need more data
    const headersRaw = inBuffer.slice(0, headerEnd).toString('utf8');
    const match = /Content-Length:\s*(\d+)/i.exec(headersRaw);
    if (!match) {
      // Drop invalid data
      inBuffer = inBuffer.slice(headerEnd + 4);
      continue;
    }
    const len = parseInt(match[1], 10);
    const bodyStart = headerEnd + 4;
    if (inBuffer.length < bodyStart + len) return; // wait for full body
    const body = inBuffer.slice(bodyStart, bodyStart + len).toString('utf8');
    inBuffer = inBuffer.slice(bodyStart + len);
    try {
      const msg = JSON.parse(body);
      handleMessage(msg);
    } catch (e) {
      // ignore parse errors
    }
  }
}

function send(msg) {
  const json = JSON.stringify(msg);
  const out = `Content-Length: ${Buffer.byteLength(json, 'utf8')}\r\n\r\n${json}`;
  process.stdout.write(out);
}

// --- Notion API helpers ---
function notionGet(path) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.notion.com',
        path,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Notion-Version': '2022-06-28',
        },
      },
      res => {
        let data = '';
        res.on('data', c => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

function notionPost(path, bodyObj) {
  const body = JSON.stringify(bodyObj || {});
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.notion.com',
        path,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      res => {
        let data = '';
        res.on('data', c => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function notionPatch(path, bodyObj) {
  const body = JSON.stringify(bodyObj || {});
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.notion.com',
        path,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      res => {
        let data = '';
        res.on('data', c => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// --- MCP request handling ---
function handleMessage(msg) {
  const { id, method, params } = msg;
  if (method === 'initialize') {
    return send({
      id,
      result: {
        protocolVersion: '2024-11-05',
        serverInfo: { name: 'notion-mcp-min', version: '0.1.0' },
        capabilities: { tools: {} },
      },
    });
  }
  if (method === 'tools/list') {
    return send({
      id,
      result: {
        tools: [
          {
            name: 'notion.search',
            description: 'Search Notion for pages/databases by query',
            inputSchema: {
              type: 'object',
              properties: { query: { type: 'string' } },
              required: ['query'],
            },
          },
          {
            name: 'notion.page',
            description: 'Fetch a Notion page summary and first blocks',
            inputSchema: {
              type: 'object',
              properties: { pageId: { type: 'string' } },
              required: ['pageId'],
            },
          },
          {
            name: 'notion.pageTitle',
            description: 'Fetch a Notion page title and URL',
            inputSchema: {
              type: 'object',
              properties: { pageId: { type: 'string' } },
              required: ['pageId'],
            },
          },
          {
            name: 'notion.pageByUrl',
            description:
              'Resolve a Notion share URL to pageId, then return page metadata and first blocks',
            inputSchema: {
              type: 'object',
              properties: { url: { type: 'string' } },
              required: ['url'],
            },
          },
          {
            name: 'notion.updatePageProperties',
            description: 'Update database page properties (e.g., priority, status)',
            inputSchema: {
              type: 'object',
              properties: {
                pageId: { type: 'string' },
                properties: { type: 'object' },
              },
              required: ['pageId', 'properties'],
            },
          },
          {
            name: 'notion.appendBlock',
            description: 'Append one or more blocks to a page or block (children)',
            inputSchema: {
              type: 'object',
              properties: {
                parentBlockId: { type: 'string' },
                children: { type: 'array' },
              },
              required: ['parentBlockId', 'children'],
            },
          },
          {
            name: 'notion.setCheckbox',
            description: 'Set a checkbox property on a database page',
            inputSchema: {
              type: 'object',
              properties: {
                pageId: { type: 'string' },
                propertyName: { type: 'string' },
                value: { type: 'boolean' },
              },
              required: ['pageId', 'propertyName', 'value'],
            },
          },
        ],
      },
    });
  }
  if (method === 'tools/call') {
    const name = params?.name;
    const args = params?.arguments || {};
    handleToolCall(id, name, args);
    return;
  }
  // Default: method not found
  send({ id, error: { code: -32601, message: 'Method not found' } });
}

async function handleToolCall(id, name, args) {
  try {
    if (!TOKEN) throw new Error('NOTION_API_KEY not set');
    if (name === 'notion.search') {
      const q = String(args.query || '').trim();
      if (!q) throw new Error('Missing query');
      const resp = await notionPost('/v1/search', { query: q, page_size: 10 });
      if (resp.status !== 200) throw new Error(`Search failed: ${resp.status}`);
      const js = JSON.parse(resp.data);
      const items = (js.results || []).map(r => ({
        id: r.id,
        object: r.object,
        title: extractTitle(r),
        url: r.url || null,
      }));
      return send({ id, result: { content: [{ type: 'json', json: { items } }] } });
    }
    if (name === 'notion.page') {
      const pageId = String(args.pageId || '').trim();
      if (!pageId) throw new Error('Missing pageId');
      const p = await notionGet(`/v1/pages/${pageId}`);
      if (p.status !== 200) throw new Error(`Page fetch failed: ${p.status}`);
      const page = JSON.parse(p.data);
      const blocks = await notionGet(`/v1/blocks/${pageId}/children?page_size=20`);
      const children = blocks.status === 200 ? JSON.parse(blocks.data).results : [];
      return send({ id, result: { content: [{ type: 'json', json: { page, children } }] } });
    }
    if (name === 'notion.pageByUrl') {
      const rawUrl = String(args.url || '').trim();
      if (!rawUrl) throw new Error('Missing url');
      const pageId = extractPageIdFromUrl(rawUrl);
      if (!pageId) throw new Error('Could not extract pageId from URL');
      const p = await notionGet(`/v1/pages/${pageId}`);
      if (p.status !== 200) throw new Error(`Page fetch failed: ${p.status}`);
      const page = JSON.parse(p.data);
      const blocks = await notionGet(`/v1/blocks/${pageId}/children?page_size=20`);
      const children = blocks.status === 200 ? JSON.parse(blocks.data).results : [];
      return send({
        id,
        result: { content: [{ type: 'json', json: { pageId, page, children } }] },
      });
    }
    if (name === 'notion.updatePageProperties') {
      const pageId = String(args.pageId || '').trim();
      const properties = args.properties || {};
      if (!pageId) throw new Error('Missing pageId');
      if (typeof properties !== 'object' || !Object.keys(properties).length)
        throw new Error('Missing properties');
      const resp = await notionPatch(`/v1/pages/${pageId}`, { properties });
      if (resp.status !== 200) throw new Error(`Update failed: ${resp.status} ${resp.data}`);
      const js = JSON.parse(resp.data);
      return send({ id, result: { content: [{ type: 'json', json: js }] } });
    }
    if (name === 'notion.appendBlock') {
      const parentBlockId = String(args.parentBlockId || '').trim();
      const children = Array.isArray(args.children) ? args.children : [];
      if (!parentBlockId) throw new Error('Missing parentBlockId');
      if (!children.length) throw new Error('children must be a non-empty array');
      const resp = await notionPatch(`/v1/blocks/${parentBlockId}/children`, { children });
      if (resp.status !== 200) throw new Error(`Append failed: ${resp.status} ${resp.data}`);
      const js = JSON.parse(resp.data);
      return send({ id, result: { content: [{ type: 'json', json: js }] } });
    }
    if (name === 'notion.setCheckbox') {
      const pageId = String(args.pageId || '').trim();
      const propertyName = String(args.propertyName || '').trim();
      const value = !!args.value;
      if (!pageId || !propertyName) throw new Error('Missing pageId or propertyName');
      const properties = { [propertyName]: { checkbox: value } };
      const resp = await notionPatch(`/v1/pages/${pageId}`, { properties });
      if (resp.status !== 200)
        throw new Error(`Checkbox update failed: ${resp.status} ${resp.data}`);
      const js = JSON.parse(resp.data);
      return send({ id, result: { content: [{ type: 'json', json: js }] } });
    }
    if (name === 'notion.pageTitle') {
      const pageId = String(args.pageId || '').trim();
      if (!pageId) throw new Error('Missing pageId');
      const p = await notionGet(`/v1/pages/${pageId}`);
      if (p.status !== 200) throw new Error(`Page fetch failed: ${p.status}`);
      const page = JSON.parse(p.data);
      const title = extractTitle({ object: 'page', ...page });
      const url = page.url || null;
      return send({ id, result: { content: [{ type: 'json', json: { pageId, title, url } }] } });
    }
    throw new Error(`Unknown tool: ${name}`);
  } catch (e) {
    send({ id, error: { code: -32000, message: e.message || 'Tool error' } });
  }
}

function extractTitle(r) {
  try {
    if (r.object === 'page') {
      const props = r.properties || {};
      for (const k of Object.keys(props)) {
        const p = props[k];
        if (p && p.type === 'title' && Array.isArray(p.title) && p.title.length) {
          return (
            p.title
              .map(t => t.plain_text || '')
              .join('')
              .trim() || 'untitled'
          );
        }
      }
      return 'untitled';
    }
    if (r.object === 'database') {
      const t = r.title || [];
      if (Array.isArray(t) && t.length)
        return (
          t
            .map(x => x.plain_text || '')
            .join('')
            .trim() || 'untitled'
        );
      return 'untitled';
    }
    const t = r.title || [];
    if (Array.isArray(t) && t.length)
      return (
        t
          .map(x => x.plain_text || '')
          .join('')
          .trim() || 'untitled'
      );
  } catch {}
  return 'untitled';
}

function extractPageIdFromUrl(url) {
  try {
    const u = new URL(url);
    // Check query params (some links use ?p= or ?pageId=)
    const qp = u.searchParams.get('p') || u.searchParams.get('pageId');
    if (qp) return normalizeId(qp);
    // Extract last path segment and look for 32-char hex id possibly with dashes
    const segs = u.pathname.split('/').filter(Boolean);
    const last = segs[segs.length - 1] || '';
    // Match patterns like ...-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx or raw xxxxx...
    const mDash = last.match(
      /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/
    );
    if (mDash) return normalizeId(mDash[1]);
    const mRaw = last.match(/([0-9a-fA-F]{32})/);
    if (mRaw) return normalizeId(mRaw[1]);
  } catch {}
  return null;
}

function normalizeId(id) {
  const clean = id.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
  if (clean.length !== 32) return null;
  // Return hyphenated UUID format Notion accepts: 8-4-4-4-12
  return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(
    16,
    20
  )}-${clean.slice(20)}`;
}

// Keep process alive
process.stdin.resume();
