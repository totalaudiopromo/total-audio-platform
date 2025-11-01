#!/usr/bin/env node

/**
 * TDD Component Selector Agent
 * Selects shadcn/ui components for Total Audio features
 * Focus: Consistent UI across Audio Intel (blue) and Playlist Pulse (green)
 */

const fs = require('fs');
const path = require('path');

class TDDComponentSelector {
  constructor() {
    this.name = 'TDD-Component-Selector';
    this.specsDir = path.join(__dirname, 'specs', 'components');

    // shadcn/ui components categorized by usage
    this.components = {
      layout: [
        'Card',
        'Sheet',
        'Dialog',
        'Popover',
        'Tabs',
        'Accordion',
        'Collapsible',
        'Separator',
      ],
      navigation: [
        'Navigation-Menu',
        'Breadcrumb',
        'Pagination',
        'Command',
        'Menubar',
        'Context-Menu',
      ],
      forms: [
        'Input',
        'Button',
        'Select',
        'Checkbox',
        'Radio-Group',
        'Switch',
        'Slider',
        'Textarea',
        'Form',
        'Label',
      ],
      data: [
        'Table',
        'Data-Table',
        'Badge',
        'Avatar',
        'Progress',
        'Skeleton',
        'Alert',
        'Toast',
        'Hover-Card',
      ],
      feedback: ['Alert-Dialog', 'Toast', 'Tooltip', 'Progress', 'Spinner', 'Badge', 'Alert'],
    };

    // Total Audio specific component patterns
    this.patterns = {
      audiointel: {
        theme: 'blue',
        common_combinations: [
          ['Card', 'Avatar', 'Badge', 'Button'], // Contact cards
          ['Input', 'Button', 'Progress'], // Search & enrichment
          ['Table', 'Badge', 'Tooltip'], // Contact lists
          ['Dialog', 'Form', 'Button'], // Contact editing
        ],
      },
      playlistpulse: {
        theme: 'green',
        common_combinations: [
          ['Card', 'Avatar', 'Badge', 'Button'], // Playlist cards
          ['Tabs', 'Table', 'Badge'], // Campaign management
          ['Sheet', 'Form', 'Button'], // Campaign creation
          ['Progress', 'Alert', 'Button'], // Campaign status
        ],
      },
    };
  }

  async selectComponents(featureName, product = 'audiointel', featureType = 'form') {
    console.log(`🧩 Selecting components for: ${featureName}`);

    const pattern = this.patterns[product];
    const recommendations = this.getRecommendations(featureType, product);

    const selection = {
      feature: featureName,
      product: product,
      created: new Date().toISOString(),
      theme: pattern.theme,

      // Core components for this feature
      primary_components: recommendations.primary,

      // Supporting components
      secondary_components: recommendations.secondary,

      // Theme customization
      theme_customization: {
        primary_color: pattern.theme === 'blue' ? 'hsl(221, 83%, 53%)' : 'hsl(142, 71%, 45%)',
        accent_color: pattern.theme === 'blue' ? 'hsl(221, 83%, 53%)' : 'hsl(142, 71%, 45%)',
        component_variants: this.getThemeVariants(pattern.theme),
      },

      // Mobile-first considerations
      mobile_adaptations: {
        touch_friendly: 'All buttons min 44px',
        responsive_breakpoints: ['sm:640px', 'md:768px', 'lg:1024px'],
        mobile_specific: ['Sheet instead of Dialog on mobile', 'Bottom sheet navigation'],
      },

      // UK business context
      business_adaptations: {
        currency_format: 'GBP (£)',
        date_format: 'DD/MM/YYYY',
        phone_format: 'UK mobile (+44)',
        industry_badges: ['Radio', 'Press', 'Streaming', 'Live Venues'],
      },

      // Integration with existing system
      integration_notes: {
        api_endpoints: 'Use existing contact/campaign APIs',
        state_management: 'Compatible with current React state',
        routing: 'Works with existing Next.js routing',
        styling: 'Tailwind classes compatible with current setup',
      },
    };

    // Save component selection
    const filename = `${featureName.replace(/\s+/g, '-').toLowerCase()}.json`;
    const filepath = path.join(this.specsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(selection, null, 2));

    console.log(`✅ Component selection saved: ${filename}`);
    console.log(`   Primary: ${recommendations.primary.join(', ')}`);
    console.log(`   Theme: ${pattern.theme}`);

    return selection;
  }

  getRecommendations(featureType, product) {
    const baseRecommendations = {
      form: {
        primary: ['Card', 'Form', 'Input', 'Button', 'Label'],
        secondary: ['Alert', 'Progress', 'Tooltip'],
      },
      list: {
        primary: ['Card', 'Table', 'Badge', 'Avatar'],
        secondary: ['Input', 'Button', 'Pagination', 'Select'],
      },
      dashboard: {
        primary: ['Card', 'Progress', 'Badge', 'Tabs'],
        secondary: ['Alert', 'Tooltip', 'Skeleton', 'Sheet'],
      },
      detail: {
        primary: ['Card', 'Badge', 'Avatar', 'Button'],
        secondary: ['Dialog', 'Tooltip', 'Separator', 'Tabs'],
      },
      navigation: {
        primary: ['Navigation-Menu', 'Breadcrumb', 'Tabs'],
        secondary: ['Button', 'Badge', 'Sheet'],
      },
    };

    // Add product-specific recommendations
    const productAdditions = {
      audiointel: {
        contact_enrichment: ['Progress', 'Alert', 'Badge'],
        search_results: ['Table', 'Avatar', 'Tooltip'],
        export_options: ['Select', 'Dialog', 'Progress'],
      },
      playlistpulse: {
        campaign_management: ['Tabs', 'Progress', 'Alert'],
        playlist_discovery: ['Card', 'Badge', 'Avatar'],
        pitch_templates: ['Sheet', 'Form', 'Button'],
      },
    };

    const base = baseRecommendations[featureType] || baseRecommendations.form;
    const additions = productAdditions[product] || {};

    return {
      primary: base.primary,
      secondary: [...base.secondary, ...(additions[featureType] || [])],
    };
  }

  getThemeVariants(theme) {
    const variants = {
      blue: {
        button_variant: 'default (blue primary)',
        badge_variant: 'secondary (blue subtle)',
        card_style: 'white background, blue accents',
        alert_style: 'blue border and icon',
      },
      green: {
        button_variant: 'default (green primary)',
        badge_variant: 'secondary (green subtle)',
        card_style: 'white background, green accents',
        alert_style: 'green border and icon',
      },
    };

    return variants[theme] || variants.blue;
  }

  async quickSelect(featureName, product = 'audiointel') {
    console.log(`⚡ Quick component selection for: ${featureName}`);

    const quickSelection = {
      feature: featureName,
      product: product,
      created: new Date().toISOString(),
      type: 'quick-select',

      // Essential components only
      components: ['Card', 'Button', 'Input', 'Badge'],
      theme: this.patterns[product].theme,

      // Minimal setup
      setup: {
        install: 'Already available in project',
        import: 'Import from @/components/ui',
        styling: 'Use default variants',
      },

      emergency_notes: 'Basic component set for quick implementation',
    };

    const filename = `${featureName.replace(/\s+/g, '-').toLowerCase()}-quick.json`;
    const filepath = path.join(this.specsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(quickSelection, null, 2));
    console.log(`⚡ Quick selection saved: ${filename}`);

    return quickSelection;
  }

  listSelections() {
    const files = fs.readdirSync(this.specsDir).filter(f => f.endsWith('.json'));

    console.log('\n🧩 Component Selections:');
    files.forEach(file => {
      try {
        const spec = JSON.parse(fs.readFileSync(path.join(this.specsDir, file)));
        const type = spec.type === 'quick-select' ? ' (quick)' : '';
        const components =
          spec.primary_components?.slice(0, 3).join(', ') ||
          spec.components?.slice(0, 3).join(', ') ||
          'N/A';
        console.log(`   ${spec.feature} - ${spec.theme} theme${type}`);
        console.log(`     Components: ${components}`);
      } catch (e) {
        console.log(`   ${file} (error reading)`);
      }
    });

    return files;
  }

  // Helper: Generate component import statements
  generateImports(componentList) {
    const importStatement = `import {\n  ${componentList.join(',\n  ')}\n} from '@/components/ui';`;
    return importStatement;
  }
}

// CLI interface
if (require.main === module) {
  const selector = new TDDComponentSelector();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🧩 TDD Component Selector - shadcn/ui Components');
    console.log('Usage:');
    console.log(
      '  node tdd-component-selector.js select "feature name" [audiointel|playlistpulse] [form|list|dashboard|detail]'
    );
    console.log('  node tdd-component-selector.js quick "feature name" [audiointel|playlistpulse]');
    console.log('  node tdd-component-selector.js list');
    process.exit(0);
  }

  const command = args[0];
  const featureName = args[1];
  const product = args[2] || 'audiointel';
  const featureType = args[3] || 'form';

  switch (command) {
    case 'select':
      if (!featureName) {
        console.error('❌ Feature name required');
        process.exit(1);
      }
      selector.selectComponents(featureName, product, featureType);
      break;

    case 'quick':
      if (!featureName) {
        console.error('❌ Feature name required');
        process.exit(1);
      }
      selector.quickSelect(featureName, product);
      break;

    case 'list':
      selector.listSelections();
      break;

    default:
      console.error('❌ Unknown command:', command);
      process.exit(1);
  }
}

module.exports = TDDComponentSelector;
