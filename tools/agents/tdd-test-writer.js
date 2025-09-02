#!/usr/bin/env node

/**
 * TDD Test Spec Writer Agent
 * Creates natural language test scenarios for Total Audio features
 * Focus: User behavior testing, not brittle selectors
 */

const fs = require('fs');
const path = require('path');

class TDDTestWriter {
  constructor() {
    this.name = 'TDD-Test-Writer';
    this.specsDir = path.join(__dirname, 'specs', 'tests');
    
    // Business scenarios by product
    this.businessScenarios = {
      audiointel: {
        contact_research: [
          'User searches for BBC Radio 1 contacts',
          'User enriches contact with social media info',
          'User exports filtered contact list to CSV',
          'User saves contact for future campaigns'
        ],
        campaign_tracking: [
          'User creates new radio promotion campaign',
          'User monitors email open rates in real-time',
          'User tracks reply rates by contact type',
          'User generates campaign performance report'
        ]
      },
      playlistpulse: {
        playlist_discovery: [
          'User finds playlists for indie rock genre',
          'User filters by UK-based curators only',
          'User saves promising playlists to campaign',
          'User researches curator contact preferences'
        ],
        campaign_management: [
          'User creates playlist pitch campaign',
          'User schedules follow-up sequences',
          'User tracks submission success rates',
          'User optimizes pitch templates based on data'
        ]
      }
    };
    
    // Common UI patterns to test
    this.uiPatterns = {
      mobile_first: [
        'Feature works on iPhone SE (320px width)',
        'Touch targets are minimum 44px',
        'Navigation accessible with thumb',
        'Content readable without zooming'
      ],
      data_handling: [
        'Loading states show while fetching data',
        'Error states explain what went wrong',
        'Empty states guide user to next action',
        'Success states confirm action completed'
      ],
      uk_context: [
        'Prices display in GBP (£)',
        'Dates show in DD/MM/YYYY format',
        'Phone numbers accept UK format',
        'Time zones handle GMT/BST correctly'
      ]
    };
  }
  
  async writeTestSpec(featureName, product = 'audiointel', complexity = 'standard') {
    console.log(`📝 Writing test scenarios for: ${featureName}`);
    
    const testSpec = {
      feature: featureName,
      product: product,
      created: new Date().toISOString(),
      complexity: complexity,
      
      // Business context tests
      business_scenarios: this.generateBusinessTests(featureName, product),
      
      // User experience tests
      user_experience: {
        happy_path: this.generateHappyPathTests(featureName, product),
        edge_cases: this.generateEdgeCaseTests(featureName, product),
        error_handling: this.generateErrorTests(featureName, product)
      },
      
      // Mobile-first testing
      mobile_testing: {
        responsive_design: this.uiPatterns.mobile_first,
        touch_interactions: [
          `User can tap to ${this.getMainAction(featureName)}`,
          'User can swipe to navigate between sections',
          'User can pinch to zoom if needed',
          'Keyboard appears correctly for text input'
        ],
        performance: [
          'Feature loads within 3 seconds on 3G',
          'Animations are smooth (60fps)',
          'No horizontal scroll required',
          'Images load progressively'
        ]
      },
      
      // UK music industry specific tests
      industry_context: {
        data_accuracy: [
          'Contact enrichment returns valid UK industry data',
          'Radio stations grouped by BBC regions',
          'Music venues categorized correctly',
          'Industry roles reflect UK market structure'
        ],
        business_value: [
          `Feature supports £${this.getPricingTier(product)} pricing tier`,
          'Competitive advantage vs US tools is clear',
          'ROI tracking works for UK campaigns',
          'Integration with existing 515+ contact database'
        ]
      },
      
      // Integration tests with existing system
      system_integration: [
        'Feature works with existing orchestrator agents',
        'Data syncs correctly with contact database',
        'Email integration functions properly',
        'Analytics tracking captures user actions',
        'No conflicts with existing workflows'
      ],
      
      // Natural language test format (not brittle selectors)
      test_approach: {
        methodology: 'Natural language testing - focus on user behavior',
        avoid: [
          'Brittle CSS selectors',
          'Implementation-specific tests',
          'Hardcoded element positions',
          'Browser-specific quirks'
        ],
        prefer: [
          'User intention-based scenarios',
          'Business outcome validation',
          'Cross-browser behavior',
          'Accessibility compliance'
        ]
      }
    };
    
    // Save test spec
    const filename = `${featureName.replace(/\s+/g, '-').toLowerCase()}.json`;
    const filepath = path.join(this.specsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(testSpec, null, 2));
    
    console.log(`✅ Test spec saved: ${filename}`);
    console.log(`   Business scenarios: ${testSpec.business_scenarios.length}`);
    console.log(`   Happy path tests: ${testSpec.user_experience.happy_path.length}`);
    
    return testSpec;
  }
  
  generateBusinessTests(featureName, product) {
    const scenarios = this.businessScenarios[product];
    const featureKey = this.inferFeatureType(featureName);
    
    const baseScenarios = scenarios[featureKey] || scenarios[Object.keys(scenarios)[0]];
    
    return [
      ...baseScenarios,
      `User completes ${featureName} workflow successfully`,
      `User handles interruption during ${featureName}`,
      `User returns to ${featureName} after session break`,
      `Multiple users access ${featureName} simultaneously`
    ];
  }
  
  generateHappyPathTests(featureName, product) {
    const action = this.getMainAction(featureName);
    
    return [
      `User opens ${featureName} from main dashboard`,
      `User ${action} using mobile device`,
      `User ${action} using desktop browser`,
      `User receives confirmation of successful ${action}`,
      `User navigates back to previous screen`,
      `Data persists correctly after ${action}`
    ];
  }
  
  generateEdgeCaseTests(featureName, product) {
    return [
      'User attempts action with slow internet connection',
      'User tries to use feature offline',
      'User inputs unexpected characters or formats',
      'User attempts action without required permissions',
      'User reaches rate limits or data quotas',
      'User session expires during workflow'
    ];
  }
  
  generateErrorTests(featureName, product) {
    return [
      'Server returns error - user sees helpful message',
      'Network fails - user can retry action',
      'Invalid data submitted - user gets clear feedback',
      'Third-party API fails - graceful degradation',
      'User lacks permissions - alternative suggested',
      'Rate limit hit - user informed of wait time'
    ];
  }
  
  getMainAction(featureName) {
    const actions = {
      'search': 'searches for contacts',
      'filter': 'applies filters to results',
      'export': 'exports data to spreadsheet',
      'create': 'creates new campaign',
      'edit': 'edits existing record',
      'delete': 'removes unwanted item',
      'track': 'monitors performance metrics'
    };
    
    for (const [key, action] of Object.entries(actions)) {
      if (featureName.toLowerCase().includes(key)) {
        return action;
      }
    }
    
    return 'interacts with feature';
  }
  
  inferFeatureType(featureName) {
    const types = {
      'contact': 'contact_research',
      'search': 'contact_research', 
      'campaign': 'campaign_tracking',
      'playlist': 'playlist_discovery',
      'pitch': 'campaign_management',
      'track': 'campaign_tracking',
      'discover': 'playlist_discovery'
    };
    
    for (const [key, type] of Object.entries(types)) {
      if (featureName.toLowerCase().includes(key)) {
        return type;
      }
    }
    
    return 'contact_research'; // default
  }
  
  getPricingTier(product) {
    const pricing = {
      audiointel: '19-99',
      playlistpulse: '19-99'
    };
    
    return pricing[product] || '19-99';
  }
  
  async quickTest(featureName, product = 'audiointel') {
    console.log(`⚡ Quick test scenarios for: ${featureName}`);
    
    const quickSpec = {
      feature: featureName,
      product: product,
      created: new Date().toISOString(),
      type: 'quick-test',
      
      // Essential tests only
      essential_tests: [
        `User can access ${featureName} from main menu`,
        `${featureName} works on mobile device`,
        `User receives feedback when action completes`,
        `Error handling shows helpful messages`,
        `Feature integrates with existing system`
      ],
      
      mobile_check: 'Works on iPhone SE (320px)',
      business_check: `Supports £${this.getPricingTier(product)} tier value`,
      
      emergency_notes: 'Basic test coverage for quick implementation'
    };
    
    const filename = `${featureName.replace(/\s+/g, '-').toLowerCase()}-quick.json`;
    const filepath = path.join(this.specsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(quickSpec, null, 2));
    console.log(`⚡ Quick test spec saved: ${filename}`);
    
    return quickSpec;
  }
  
  listTestSpecs() {
    const files = fs.readdirSync(this.specsDir).filter(f => f.endsWith('.json'));
    
    console.log('\n📝 Test Specifications:');
    files.forEach(file => {
      try {
        const spec = JSON.parse(fs.readFileSync(path.join(this.specsDir, file)));
        const type = spec.type === 'quick-test' ? ' (quick)' : '';
        const testCount = spec.business_scenarios?.length || 
                         spec.essential_tests?.length || 0;
        console.log(`   ${spec.feature} - ${spec.product}${type}`);
        console.log(`     Tests: ${testCount} scenarios`);
      } catch (e) {
        console.log(`   ${file} (error reading)`);
      }
    });
    
    return files;
  }
}

// CLI interface
if (require.main === module) {
  const writer = new TDDTestWriter();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📝 TDD Test Writer - Natural Language Test Scenarios');
    console.log('Usage:');
    console.log('  node tdd-test-writer.js write "feature name" [audiointel|playlistpulse] [standard|detailed]');
    console.log('  node tdd-test-writer.js quick "feature name" [audiointel|playlistpulse]');
    console.log('  node tdd-test-writer.js list');
    process.exit(0);
  }
  
  const command = args[0];
  const featureName = args[1];
  const product = args[2] || 'audiointel';
  const complexity = args[3] || 'standard';
  
  switch (command) {
    case 'write':
      if (!featureName) {
        console.error('❌ Feature name required');
        process.exit(1);
      }
      writer.writeTestSpec(featureName, product, complexity);
      break;
      
    case 'quick':
      if (!featureName) {
        console.error('❌ Feature name required');
        process.exit(1);
      }
      writer.quickTest(featureName, product);
      break;
      
    case 'list':
      writer.listTestSpecs();
      break;
      
    default:
      console.error('❌ Unknown command:', command);
      process.exit(1);
  }
}

module.exports = TDDTestWriter;