#!/usr/bin/env node

// Create a real Liberty Monday.com campaign for Laura the Bard
require('dotenv').config();
const MondayApiIntegration = require('../integrations/monday-api');

(async () => {
  try {
    const monday = new MondayApiIntegration();
    await monday.validateBoardAccess();

    const campaignData = {
      artistName: 'Laura the Bard',
      trackName: 'TBD',
      genre: 'Indie Folk',
      releaseDate: '2025-10-01',
      campaignType: '6-week'
    };

    const created = await monday.createLibertyCampaign(campaignData, null);
    console.log(JSON.stringify({ created }, null, 2));

    try {
      const sub = await monday.addCampaignTask(created.id, {
        name: 'Upload assets to Drive',
        status: 'Not Started',
        deadline: '2025-09-20',
        description: 'Artwork, WAV, bio'
      });
      console.log(JSON.stringify({ sub }, null, 2));
    } catch (e) {
      console.error('Subtask creation failed:', e.message);
    }

    const items = await monday.getCampaignItems();
    const found = items.find(i => i.id === created.id);
    console.log(JSON.stringify({ foundExists: !!found, itemId: created.id, name: created.campaignTitle }, null, 2));
  } catch (e) {
    console.error('Create campaign failed:', e.message);
    process.exit(1);
  }
})();


