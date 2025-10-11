#!/usr/bin/env node

const fetch = require('node-fetch');

const LIBERTY_API_KEY = '83f53d36bd6667b4c56015e8a0d1ed66-us13';
const LIBERTY_SERVER = 'us13';

async function getLists() {
  const response = await fetch(`https://${LIBERTY_SERVER}.api.mailchimp.com/3.0/lists?count=100`, {
    headers: { 'Authorization': `Bearer ${LIBERTY_API_KEY}` }
  });

  const data = await response.json();

  console.log('Liberty Mailchimp Lists:\n');
  data.lists.forEach((list, idx) => {
    console.log(`${idx + 1}. ${list.name}`);
    console.log(`   ID: ${list.id}`);
    console.log(`   Members: ${list.stats.member_count}\n`);
  });
}

getLists();
