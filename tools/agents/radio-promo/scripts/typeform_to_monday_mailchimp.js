#!/usr/bin/env node

// End-to-end: pull artist from Typeform by name, create Mailchimp draft via
// duplication with Claude-written body, fetch Airtable targets and add as
// Monday subitems. Designed for Liberty workflow.

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const https = require('https');

const TypeformApiIntegration = require('../integrations/typeform-api');
const PressReleaseGenerator = require('../integrations/press-release-generator');
const MondayApiIntegration = require('../integrations/monday-api');

function httpGetJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, res => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          resolve({ status: res.statusCode, json });
        } catch (e) {
          reject(new Error('JSON_PARSE_ERROR'));
        }
      });
    });
    req.on('error', reject);
  });
}

async function findTypeformCampaignByArtist(artistQuery) {
  const typeform = new TypeformApiIntegration();
  const forms = await typeform.getRecentForms(30);
  const q = artistQuery.toLowerCase();
  for (const form of forms) {
    try {
      const responses = await typeform.getFormResponses(form.id, 100);
      for (const response of responses) {
        const hay = JSON.stringify(response).toLowerCase();
        if (hay.includes(q)) {
          const token = response.token || response.response_id || response.id;
          const brief = await typeform.processFormResponseForCampaign(form.id, token, response);
          return { form, response, brief };
        }
      }
    } catch (e) {
      // Continue to next form
    }
  }
  return null;
}

async function fetchAirtableTargets(limit = 25) {
  const base = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_ID;
  const view = process.env.AIRTABLE_VIEW_ID;
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!base || !table || !apiKey) return [];
  const headers = { Authorization: `Bearer ${apiKey}` };
  const url = `https://api.airtable.com/v0/${base}/${table}?view=${view}&pageSize=${Math.min(limit, 100)}`;
  const { status, json } = await httpGetJson(url, headers);
  if (status !== 200 || !json.records) return [];
  return json.records.map(r => r.fields);
}

function toCsv(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Array.from(
    rows.reduce((set, r) => {
      Object.keys(r).forEach(k => set.add(k));
      return set;
    }, new Set())
  );
  const escape = v => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map(h => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

async function main() {
  const artistQuery = process.argv[2] || 'Laura the Bard';
  const monday = new MondayApiIntegration();
  await monday.validateBoardAccess();

  // 1) Pull campaign brief from Typeform
  const found = await findTypeformCampaignByArtist(artistQuery);
  if (!found) {
    console.log(
      JSON.stringify({ ok: false, step: 'typeform', message: 'Artist not found in Typeform' })
    );
    process.exit(0);
  }
  const artistData = found.brief.data || {};
  if (!artistData.artistName) artistData.artistName = artistQuery;
  if (!artistData.trackTitle) artistData.trackTitle = 'TBD';
  if (!artistData.genre) artistData.genre = 'Indie';
  if (!artistData.releaseDate) artistData.releaseDate = new Date().toISOString().split('T')[0];

  // 2) Create Claude-written press, duplicate Mailchimp source and inject
  const pr = new PressReleaseGenerator();
  if (process.env.MC_DUPLICATE_SOURCE == null) {
    process.env.MC_DUPLICATE_SOURCE =
      'Charcom x Luisa Wilson - KEEP MY EYES ON YOU - Main Contacts';
  }
  const content = await pr.createClaudeFirstContent(artistData);
  const mailchimpDraft = await pr.createMailchimpDraftFromSource(artistData, content);

  // 3) Locate/ensure Monday item for artist, then add targets as subitems
  const items = await monday.getCampaignItems();
  const targetItem = items.find(i =>
    (i.name || '').toLowerCase().includes(artistQuery.toLowerCase())
  );
  let itemId = targetItem?.id;
  if (!itemId) {
    const created = await monday.createLibertyCampaign({
      artistName: artistData.artistName,
      trackName: artistData.trackTitle,
      genre: artistData.genre,
      releaseDate: artistData.releaseDate,
      campaignType: '6-week',
    });
    itemId = created.id;
  }

  // 4) Fetch Airtable targets and add a handful as subitems
  const targets = await fetchAirtableTargets(20);
  const shortlist = targets.slice(0, 10);
  for (const t of shortlist) {
    const name = t['Station Name'] || t['Station'] || t['Name'] || 'Station';
    const tier = t['Station Tier'] || '';
    const genres = t['Preferred Genres'] || '';
    const email = t['Email'] || t['Contact Email'] || '';
    const desc = `Tier: ${tier}\nGenres: ${genres}\nEmail: ${email}`.trim();
    try {
      await monday.addCampaignTask(itemId, {
        name: `Pitch: ${name}`,
        status: 'Working on it',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: desc,
      });
    } catch (e) {
      // continue
    }
  }

  // 5) Save CSV of targets
  const csv = toCsv(targets);
  const outDir = path.resolve(__dirname, '../../campaigns');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const csvPath = path.join(
    outDir,
    `${artistData.artistName.replace(/[^a-zA-Z0-9]/g, '_')}_targets.csv`
  );
  fs.writeFileSync(csvPath, csv);

  console.log(
    JSON.stringify(
      {
        ok: true,
        artist: artistData,
        mailchimpDraft,
        mondayItemId: itemId,
        airtableTargets: targets.length,
        csvPath,
      },
      null,
      2
    )
  );
}

main().catch(err => {
  console.error(err.message || String(err));
  process.exit(1);
});
