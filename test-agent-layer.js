/**
 * Quick Agent Layer Test
 * Tests IntelAgent integration without authentication
 */

const { Agents } = require('./apps/audio-intel/agents/index.ts');

async function testAgentLayer() {
  console.log('🧪 Testing Agent Layer Integration\n');

  // Test 1: Check AgentRegistry
  console.log('1. Testing AgentRegistry...');
  try {
    const { AgentRegistry } = require('./apps/audio-intel/agents/core/AgentRegistry.ts');
    const agents = AgentRegistry.list();
    console.log(`   ✅ Found ${agents.length} agents: ${agents.join(', ')}`);
  } catch (error) {
    console.log(`   ❌ AgentRegistry error: ${error.message}`);
  }

  // Test 2: Execute IntelAgent
  console.log('\n2. Testing IntelAgent execution...');
  try {
    const result = await Agents.intel.execute({
      artist: 'Test Artist',
      genre: 'electronic',
      region: 'UK',
      includeLabels: false,
    });

    if (result.success) {
      console.log(`   ✅ IntelAgent executed successfully`);
      console.log(`   📊 Latency: ${result.metrics?.latency_ms}ms`);
      console.log(`   📋 Contacts found: ${result.data.contacts?.length || 0}`);
    } else {
      console.log(`   ❌ IntelAgent failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`   ❌ Execution error: ${error.message}`);
  }

  // Test 3: Check Health
  console.log('\n3. Testing health check...');
  try {
    const { AgentRegistry } = require('./apps/audio-intel/agents/core/AgentRegistry.ts');
    const health = await AgentRegistry.healthCheck();
    console.log(
      `   ${health.healthy ? '✅' : '❌'} System health: ${
        health.healthy ? 'Healthy' : 'Unhealthy'
      }`
    );
  } catch (error) {
    console.log(`   ❌ Health check error: ${error.message}`);
  }

  console.log('\n✨ Agent Layer test complete\n');
}

testAgentLayer().catch(console.error);
