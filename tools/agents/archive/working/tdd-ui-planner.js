#!/usr/bin/env node

/**
 * TDD UI Planner Agent
 * Creates mobile-first wireframes and UI specifications for Total Audio features
 * Focus: Audio Intel (blue), Playlist Pulse (green), UK music industry, £19-99 pricing
 */

const fs = require('fs');
const path = require('path');

class TDDUIPlanner {
  constructor() {
    this.name = 'TDD-UI-Planner';
    this.specsDir = path.join(__dirname, 'specs', 'ui-wireframes');
    this.businessContext = {
      audiointel: {
        theme: 'blue',
        focus: 'Contact research and enrichment',
        pricing: '£19-99/month',
        users: 'UK music industry professionals'
      },
      playlistpulse: {
        theme: 'green', 
        focus: 'Playlist curator discovery',
        pricing: '£19-99/month',
        users: 'Artists and PR agencies'
      }
    };
  }

  async createWireframe(featureName, product = 'audiointel', options = {}) {
    console.log(`🎨 Planning mobile-first UI for: ${featureName}`);
    
    const context = this.businessContext[product];
    const wireframe = {
      feature: featureName,
      product: product,
      created: new Date().toISOString(),
      business_context: context,
      mobile_first: true,
      
      // Mobile layout (320px-768px)
      mobile: {
        layout: 'single-column',
        navigation: 'bottom-tab' + (product === 'audiointel' ? ' (blue)' : ' (green)'),
        header: {
          height: '64px',
          elements: ['back-button', 'title', 'action-menu'],
          theme: context.theme
        },
        content: this.generateMobileContent(featureName, product),
        touch_targets: '44px minimum',
        typography: {
          primary: '16px',
          secondary: '14px', 
          headers: '18px-24px'
        }
      },
      
      // Tablet layout (768px-1024px) 
      tablet: {
        layout: 'sidebar + main',
        navigation: 'persistent-sidebar',
        content: this.generateTabletContent(featureName, product)
      },
      
      // Desktop layout (1024px+)
      desktop: {
        layout: 'multi-column',
        navigation: 'top-nav + sidebar',
        content: this.generateDesktopContent(featureName, product)
      },
      
      // UK music industry specific considerations
      uk_considerations: {
        currency: 'GBP (£)',
        time_format: '24-hour',
        date_format: 'DD/MM/YYYY',
        contact_fields: ['UK mobile', 'BBC regions', 'Industry role'],
        pricing_display: `${context.pricing} (competitive vs US tools)`
      },
      
      // Accessibility
      accessibility: {
        contrast: 'WCAG AA',
        touch_targets: '44px minimum',
        keyboard_nav: 'full support',
        screen_reader: 'semantic HTML'
      }
    };
    
    // Save wireframe
    const filename = `${featureName.replace(/\s+/g, '-').toLowerCase()}.json`;
    const filepath = path.join(this.specsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(wireframe, null, 2));
    
    console.log(`✅ Mobile wireframe saved: ${filename}`);
    console.log(`   Product: ${product} (${context.theme} theme)`);
    console.log(`   Focus: ${context.focus}`);
    
    return wireframe;
  }
  
  generateMobileContent(featureName, product) {
    const baseComponents = [
      'search-input (mobile-optimized)',
      'filter-chips (horizontal-scroll)',
      'results-list (infinite-scroll)',
      'action-buttons (fixed-bottom)'
    ];
    
    const productSpecific = {
      audiointel: [
        'contact-card-compact',
        'enrichment-progress', 
        'quick-actions (call/email)',
        'export-options'
      ],
      playlistpulse: [
        'playlist-card-compact',
        'curator-info-snippet',
        'campaign-status',
        'pitch-templates'
      ]
    };
    
    return [...baseComponents, ...productSpecific[product]];
  }
  
  generateTabletContent(featureName, product) {
    return [
      'sidebar-navigation',
      'main-content-area', 
      'details-panel (collapsible)',
      'bulk-actions-toolbar'
    ];
  }
  
  generateDesktopContent(featureName, product) {
    return [
      'top-navigation-bar',
      'left-sidebar-persistent',
      'main-content-grid',
      'right-panel-details',
      'bulk-operations-toolbar',
      'advanced-filters-panel'
    ];
  }
  
  async quickWireframe(featureName, product = 'audiointel') {
    console.log(`⚡ Quick wireframe for: ${featureName}`);
    
    const quickSpec = {
      feature: featureName,
      product: product,
      created: new Date().toISOString(),
      type: 'quick-spec',
      mobile_layout: 'single-column, bottom-nav',
      key_components: [
        'header-with-back',
        'main-content-area',
        'primary-action-button',
        'secondary-options'
      ],
      theme: this.businessContext[product].theme,
      emergency_notes: 'Created for quick implementation - expand later'
    };
    
    const filename = `${featureName.replace(/\s+/g, '-').toLowerCase()}-quick.json`;
    const filepath = path.join(this.specsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(quickSpec, null, 2));
    console.log(`⚡ Quick wireframe saved: ${filename}`);
    
    return quickSpec;
  }
  
  listWireframes() {
    const files = fs.readdirSync(this.specsDir).filter(f => f.endsWith('.json'));
    
    console.log('\n📱 UI Wireframes Created:');
    files.forEach(file => {
      try {
        const spec = JSON.parse(fs.readFileSync(path.join(this.specsDir, file)));
        const type = spec.type === 'quick-spec' ? ' (quick)' : '';
        console.log(`   ${spec.feature} - ${spec.product}${type}`);
      } catch (e) {
        console.log(`   ${file} (error reading)`);
      }
    });
    
    return files;
  }
}

// CLI interface
if (require.main === module) {
  const planner = new TDDUIPlanner();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📱 TDD UI Planner - Mobile-First Wireframes');
    console.log('Usage:');
    console.log('  node tdd-ui-planner.js create "feature name" [audiointel|playlistpulse]');
    console.log('  node tdd-ui-planner.js quick "feature name" [audiointel|playlistpulse]'); 
    console.log('  node tdd-ui-planner.js list');
    process.exit(0);
  }
  
  const command = args[0];
  const featureName = args[1];
  const product = args[2] || 'audiointel';
  
  switch (command) {
    case 'create':
      if (!featureName) {
        console.error('❌ Feature name required');
        process.exit(1);
      }
      planner.createWireframe(featureName, product);
      break;
      
    case 'quick':
      if (!featureName) {
        console.error('❌ Feature name required');
        process.exit(1);
      }
      planner.quickWireframe(featureName, product);
      break;
      
    case 'list':
      planner.listWireframes();
      break;
      
    default:
      console.error('❌ Unknown command:', command);
      process.exit(1);
  }
}

module.exports = TDDUIPlanner;