// Simple test to check if Firecrawl API is working
const fetch = require('node-fetch');

async function testFirecrawl() {
  try {
    console.log('🔍 Testing Firecrawl API...\n');
    
    const apiKey = 'fc-d1fc4de2c54e46c082e4719749d184e3';
    const testUrl = 'https://www.capitalfm.com';
    
    console.log(`Testing URL: ${testUrl}\n`);
    
    const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: testUrl,
        pageOptions: {
          onlyMainContent: true,
          includeHtml: true,
          includeMarkdown: true
        }
      })
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Error response: ${errorText}`);
      throw new Error(`Firecrawl API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Firecrawl API is working!');
    console.log(`Title: ${data.title || 'No title'}`);
    console.log(`Content length: ${data.markdown ? data.markdown.length : 0} characters`);
    
  } catch (error) {
    console.error('❌ Firecrawl test failed:', error.message);
  }
}

testFirecrawl(); 