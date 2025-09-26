#!/usr/bin/env node
// Search Notion for pages/databases by query (no SDK).
// Usage:
//   NOTION_API_KEY=secret node tools/notion/search.js --query "MASTER TO-DO"

const https = require('https');

function getArg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i+1] ? process.argv[i+1] : fallback;
}

const token = process.env.NOTION_API_KEY;
const query = getArg('query', '');
if (!token) { console.error('NOTION_API_KEY is not set.'); process.exit(1); }
if (!query) { console.error('Missing --query'); process.exit(1); }

function post(path, bodyObj) {
  const body = JSON.stringify(bodyObj);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.notion.com',
      path,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function extractTitle(r) {
  try {
    if (r.object === 'page') {
      const props = r.properties || {};
      for (const k of Object.keys(props)) {
        const p = props[k];
        if (p && p.type === 'title' && Array.isArray(p.title) && p.title.length) {
          return p.title.map(t => t.plain_text || '').join('').trim() || 'untitled';
        }
      }
      return 'untitled';
    }
    if (r.object === 'database') {
      const t = r.title || [];
      if (Array.isArray(t) && t.length) return t.map(x => x.plain_text || '').join('').trim() || 'untitled';
      return 'untitled';
    }
    const t = r.title || [];
    if (Array.isArray(t) && t.length) return t.map(x => x.plain_text || '').join('').trim() || 'untitled';
  } catch {}
  return 'untitled';
}

(async () => {
  const resp = await post('/v1/search', { query, page_size: 10 });
  if (resp.status !== 200) {
    console.error('Search failed:', resp.status, resp.data);
    process.exit(2);
  }
  const js = JSON.parse(resp.data);
  const items = (js.results || []).map(r => ({
    id: r.id,
    object: r.object,
    title: extractTitle(r),
    url: r.url || null,
  }));
  console.log(JSON.stringify(items, null, 2));
})();
