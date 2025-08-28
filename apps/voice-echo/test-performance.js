const axios = require('axios');

// Test data - 50 sample contacts
const testContacts = Array.from({ length: 50 }, (_, i) => ({
  name: `Test Contact ${i + 1}`,
  email: `test${i + 1}@example.com`
}));

async function testEnrichmentPerformance() {
  console.log('🚀 Testing Audio Intel Contact Enrichment Performance');
  console.log(`📊 Processing ${testContacts.length} contacts...`);
  
  const startTime = Date.now();
  
  try {
    const response = await axios.post('http://localhost:3001/api/enrich', {
      contacts: testContacts
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000 // 15 second timeout
    });
    
    const endTime = Date.now();
    const elapsed = (endTime - startTime) / 1000;
    
    console.log('\n✅ Enrichment Complete!');
    console.log(`⏱️  Total Time: ${elapsed.toFixed(2)}s`);
    console.log(`📈 Performance: ${Math.round(testContacts.length / elapsed)} contacts/second`);
    console.log(`🎯 Target Met: ${elapsed < 10 ? '✅ YES' : '❌ NO'} (< 10s)`);
    
    if (response.data.success) {
      console.log(`📊 Success Rate: ${response.data.successRate}`);
      console.log(`💾 Cache Hit Rate: ${response.data.cacheHitRate}`);
      console.log(`🔧 Batch Size: ${response.data.batchSize}`);
      
      const highConfidence = response.data.enriched.filter(c => c.researchConfidence === 'High').length;
      const accuracy = Math.round((highConfidence / testContacts.length) * 100);
      console.log(`🎯 Accuracy: ${accuracy}% (${highConfidence}/${testContacts.length} high confidence)`);
      console.log(`🎯 Target Met: ${accuracy >= 94 ? '✅ YES' : '❌ NO'} (≥ 94%)`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testEnrichmentPerformance(); 