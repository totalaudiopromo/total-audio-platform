#!/usr/bin/env node
// Verifies NOTION_API_KEY can access every URL in tools/notion/pages.json
const fs = require('fs');
const path = require('path');
const https = require('https');

const token = process.env.NOTION_API_KEY;
if (!token) {
  console.error('NOTION_API_KEY not set');
  process.exit(1);
}

function extractIdFromUrl(url) {
  try {
    const u = new URL(url);
    const qp = u.searchParams.get('p') || u.searchParams.get('pageId');
    if (qp) return normalize(qp);
    const segs = u.pathname.split('/').filter(Boolean);
    const last = segs[segs.length - 1] || '';
    const mDash = last.match(
      /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/
    );
    if (mDash) return normalize(mDash[1]);
    const mRaw = last.match(/([0-9a-fA-F]{32})/);
    if (mRaw) return normalize(mRaw[1]);
  } catch {}
  return null;
}

function normalize(id) {
  const clean = id.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
  if (clean.length !== 32) return null;
  return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.notion.com',
        path,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
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

async function checkId(id) {
  // Try as page first
  let resp = await get(`/v1/pages/${id}`);
  if (resp.status === 200) return { ok: true, type: 'page' };
  // Try as database
  resp = await get(`/v1/databases/${id}`);
  if (resp.status === 200) return { ok: true, type: 'database' };
  return { ok: false, status: resp.status, body: resp.data };
}

async function main() {
  const listPath = path.join('tools', 'notion', 'pages.json');
  const urls = JSON.parse(fs.readFileSync(listPath, 'utf8'));
  const results = [];
  for (const url of urls) {
    const id = extractIdFromUrl(url);
    if (!id) {
      results.push({ url, ok: false, error: 'could-not-extract-id' });
      continue;
    }
    try {
      const r = await checkId(id);
      results.push({ url, id, ...r });
    } catch (e) {
      results.push({ url, id, ok: false, error: e.message });
    }
  }
  const summary = {
    total: results.length,
    ok: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
  };
  console.log(JSON.stringify({ summary, results }, null, 2));
  if (summary.failed > 0) process.exitCode = 2;
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
