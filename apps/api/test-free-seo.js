const axios = require('axios');

// Test Google Trends API
async function testGoogleTrends() {
  console.log('🧪 Testing Google Trends API...');
  
  try {
    const response = await axios.get('https://trends.google.com/trends/api/widgetdata/multiline', {
      params: {
        hl: 'en-US',
        tz: '-120',
        req: JSON.stringify({
          time: 'today 12-m',
          keyword: ['music promotion'],
          cat: 0
        })
      }
    });

    // Parse the response (Google Trends returns data with a prefix)
    const data = response.data.substring(5); // Remove ")]}'" prefix
    const parsedData = JSON.parse(data);
    
    console.log('✅ Google Trends API working!');
    console.log('📊 Data structure:', Object.keys(parsedData));
    
    if (parsedData.timelineData) {
      console.log('📈 Timeline data points:', parsedData.timelineData.length);
      console.log('📊 Sample data point:', parsedData.timelineData[0]);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Google Trends API failed:', error.message);
    return false;
  }
}

// Test Google Suggest API
async function testGoogleSuggest() {
  console.log('\n🧪 Testing Google Suggest API...');
  
  try {
    const response = await axios.get('https://suggestqueries.google.com/complete/search', {
      params: {
        client: 'firefox',
        q: 'music promotion'
      }
    });

    console.log('✅ Google Suggest API working!');
    console.log('🔍 Suggestions:', response.data[1]?.slice(0, 5));
    
    return true;
  } catch (error) {
    console.error('❌ Google Suggest API failed:', error.message);
    return false;
  }
}

// Test Google Trends Related Queries
async function testRelatedQueries() {
  console.log('\n🧪 Testing Google Trends Related Queries...');
  
  try {
    const response = await axios.get('https://trends.google.com/trends/api/widgetdata/relatedsearches', {
      params: {
        hl: 'en-US',
        tz: '-120',
        req: JSON.stringify({
          keyword: 'music promotion',
          cat: 0
        })
      }
    });

    const data = response.data.substring(5);
    const parsedData = JSON.parse(data);
    
    console.log('✅ Related Queries API working!');
    
    if (parsedData.default?.rankedList?.[0]?.rankedKeyword) {
      const queries = parsedData.default.rankedList[0].rankedKeyword.slice(0, 5);
      console.log('🔍 Related queries:', queries.map(q => q.query));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Related Queries API failed:', error.message);
    return false;
  }
}

// Test Geographic Interest
async function testGeographicInterest() {
  console.log('\n🧪 Testing Geographic Interest API...');
  
  try {
    const response = await axios.get('https://trends.google.com/trends/api/widgetdata/geo', {
      params: {
        hl: 'en-US',
        tz: '-120',
        req: JSON.stringify({
          keyword: 'music promotion',
          cat: 0
        })
      }
    });

    const data = response.data.substring(5);
    const parsedData = JSON.parse(data);
    
    console.log('✅ Geographic Interest API working!');
    
    if (parsedData.default?.geoMapData) {
      const topRegions = parsedData.default.geoMapData.slice(0, 5);
      console.log('🌍 Top regions:', topRegions.map(r => `${r.geoName}: ${r.value[0]}`));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Geographic Interest API failed:', error.message);
    return false;
  }
}

// Test Question-based Keywords
async function testQuestionKeywords() {
  console.log('\n🧪 Testing Question-based Keywords...');
  
  const questionWords = ['what', 'how', 'why'];
  const results = [];
  
  for (const questionWord of questionWords) {
    try {
      const response = await axios.get('https://suggestqueries.google.com/complete/search', {
        params: {
          client: 'firefox',
          q: `${questionWord} music promotion`
        }
      });
      
      const suggestions = response.data[1] || [];
      results.push(...suggestions.slice(0, 2));
    } catch (error) {
      console.error(`❌ Failed to get suggestions for "${questionWord} music promotion"`);
    }
  }
  
  if (results.length > 0) {
    console.log('✅ Question-based keywords working!');
    console.log('❓ Questions found:', results.slice(0, 6));
    return true;
  } else {
    console.error('❌ Question-based keywords failed');
    return false;
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Free SEO Tools Tests...\n');
  
  const tests = [
    testGoogleTrends,
    testGoogleSuggest,
    testRelatedQueries,
    testGeographicInterest,
    testQuestionKeywords
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await test();
    results.push(result);
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Free SEO tools are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
  
  return passed === total;
}

// Run the tests
runAllTests().then(success => {
  if (success) {
    console.log('\n✨ Ready to integrate with your platform!');
  } else {
    console.log('\n🔧 Some APIs may need configuration or have rate limits.');
  }
}).catch(error => {
  console.error('💥 Test runner failed:', error);
}); 