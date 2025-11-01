#!/usr/bin/env node

require('dotenv').config();
const TypeformApiIntegration = require('../integrations/typeform-api');

(async () => {
  const q = (process.argv[2] || '').toLowerCase();
  const typeform = new TypeformApiIntegration();
  const forms = await typeform.getRecentForms(30);
  const results = [];
  for (const form of forms) {
    try {
      const responses = await typeform.getFormResponses(form.id, 100);
      for (const response of responses) {
        try {
          const token = response.token || response.response_id || response.id;
          const brief = await typeform.processFormResponseForCampaign(form.id, token, response);
          const name = brief.data?.artistName || '';
          if (!name) continue;
          const row = {
            formTitle: form.title,
            formId: form.id,
            responseToken: token,
            artistName: name,
            trackTitle: brief.data?.trackTitle || '',
            genre: brief.data?.genre || '',
            releaseDate: brief.data?.releaseDate || '',
          };
          if (!q || JSON.stringify(row).toLowerCase().includes(q)) {
            results.push(row);
          }
        } catch (_) {}
      }
    } catch (_) {}
  }
  console.log(JSON.stringify({ count: results.length, results }, null, 2));
})().catch(err => {
  console.error(err.message);
  process.exit(1);
});
