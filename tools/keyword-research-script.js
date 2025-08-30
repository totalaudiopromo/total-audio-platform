// Keywords Everywhere API Research Script for Audio Intel
// Free plan typically allows 100-1000 API calls per month

const KEYWORDS_EVERYWHERE_API_KEY = '691e7a59b5d480db7629';
const API_BASE_URL = 'https://api.keywordseverywhere.com/v1';

// Core music industry keywords to research (prioritized list)
const PRIORITY_KEYWORDS = [
  // High commercial intent
  'music contact database',
  'playlist curator contacts',
  'music PR email list',
  'radio DJ contacts',
  'music blogger outreach',
  
  // Problem-aware keywords
  'how to find playlist curators',
  'music promotion contacts',
  'contact enrichment music',
  'music industry CRM',
  'playlist submission contacts',
  
  // Long-tail opportunities
  'music contact database uk',
  'playlist curator email addresses',
  'free music contact list',
  'music PR database software',
  'contact enrichment tools music',
  
  // Question-based keywords
  'how to contact music bloggers',
  'where to find radio DJ emails',
  'best music contact database',
  'music PR contact management',
  'playlist submission service'
];

// Function to get keyword data
async function getKeywordData(keyword) {
  try {
    const response = await fetch(`${API_BASE_URL}/get_keyword_data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEYWORDS_EVERYWHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        country: 'GB', // UK focus for Total Audio Promo
        currency: 'GBP',
        dataSource: 'gkp', // Google Keyword Planner
        kw: [keyword]
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error fetching data for "${keyword}":`, error.message);
    return null;
  }
}

// Function to get related keywords
async function getRelatedKeywords(keyword) {
  try {
    const response = await fetch(`${API_BASE_URL}/get_related_keywords`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEYWORDS_EVERYWHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        country: 'GB',
        currency: 'GBP',
        dataSource: 'gkp',
        kw: keyword
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error fetching related keywords for "${keyword}":`, error.message);
    return null;
  }
}

// Main research function
async function conductKeywordResearch() {
  const results = [];
  
  console.log('🔍 Starting Keywords Everywhere API research...');
  console.log(`📊 Researching ${PRIORITY_KEYWORDS.length} priority keywords for Audio Intel\n`);
  
  for (let i = 0; i < PRIORITY_KEYWORDS.length; i++) {
    const keyword = PRIORITY_KEYWORDS[i];
    console.log(`\n[${i + 1}/${PRIORITY_KEYWORDS.length}] Researching: "${keyword}"`);
    
    // Get main keyword data
    const keywordData = await getKeywordData(keyword);
    if (keywordData && keywordData.data && keywordData.data.length > 0) {
      const data = keywordData.data[0];
      
      const result = {
        keyword: keyword,
        volume: data.vol || 0,
        cpc: data.cpc || 0,
        competition: data.competition || 'N/A',
        trend: data.trend || 'N/A',
        priority: calculatePriority(data)
      };
      
      console.log(`   📈 Volume: ${result.volume} | 💰 CPC: £${result.cpc} | 🎯 Priority: ${result.priority}/10`);
      results.push(result);
    }
    
    // Small delay to respect API limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Sort by priority
  results.sort((a, b) => b.priority - a.priority);
  
  console.log('\n🎯 TOP 10 PRIORITY KEYWORDS FOR AUDIO INTEL:');
  console.log('================================================');
  
  results.slice(0, 10).forEach((result, index) => {
    console.log(`${index + 1}. "${result.keyword}"`);
    console.log(`   Volume: ${result.volume} | CPC: £${result.cpc} | Priority: ${result.priority}/10\n`);
  });
  
  return results;
}

// Priority calculation based on volume, CPC, and relevance
function calculatePriority(data) {
  let priority = 0;
  
  // Volume scoring (0-4 points)
  if (data.vol > 1000) priority += 4;
  else if (data.vol > 500) priority += 3;
  else if (data.vol > 100) priority += 2;
  else if (data.vol > 50) priority += 1;
  
  // CPC scoring - higher CPC = more commercial intent (0-3 points)
  if (data.cpc > 5) priority += 3;
  else if (data.cpc > 2) priority += 2;
  else if (data.cpc > 1) priority += 1;
  
  // Competition scoring - lower competition = better opportunity (0-3 points)
  if (data.competition === 'LOW') priority += 3;
  else if (data.competition === 'MEDIUM') priority += 2;
  else if (data.competition === 'HIGH') priority += 1;
  
  return Math.min(priority, 10); // Cap at 10
}

// Alternative free research methods if API credits run low
function freeResearchMethods() {
  console.log('\n🆓 FREE RESEARCH METHODS (NO API NEEDED):');
  console.log('=========================================');
  
  const freeMethods = [
    '1. Google Autocomplete: Type "music contact" in Google search',
    '2. Answer The Public: answerthepublic.com (free tier)',
    '3. Ubersuggest: ubersuggest.com (3 free searches daily)',
    '4. Reddit Research: r/WeAreTheMusicMakers, r/edmproduction',
    '5. YouTube Autocomplete: Search music promotion topics',
    '6. Google Trends: trends.google.com (validate keyword trends)',
    '7. SERP Analysis: Manual competitor research for target keywords',
    '8. Forum Mining: Gearslutz, VI-Control for user language'
  ];
  
  freeMethods.forEach(method => console.log(method));
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    conductKeywordResearch,
    getKeywordData,
    getRelatedKeywords,
    PRIORITY_KEYWORDS
  };
}

// Usage instructions
console.log('\n📋 USAGE INSTRUCTIONS:');
console.log('====================');
console.log('1. Run: node keyword-research-script.js');
console.log('2. Or copy functions into browser console');
console.log('3. Results will show priority keywords for Audio Intel');
console.log('4. Use free methods when API credits run low\n');

// Auto-run if in Node.js environment
if (typeof window === 'undefined') {
  conductKeywordResearch().then(() => {
    console.log('\n✅ Keyword research complete!');
    console.log('💡 Next step: Create content targeting top keywords');
    freeResearchMethods();
  }).catch(error => {
    console.log('❌ API research failed, using free methods:');
    freeResearchMethods();
  });
}