#!/usr/bin/env node

/**
 * TDD Implementation Planner Agent
 * Creates clear checklists for existing agents to follow
 * Focus: Breaking features into actionable steps for 25-agent system
 */

const fs = require('fs');
const path = require('path');

class TDDImplementationPlanner {
  constructor() {
    this.name = 'TDD-Implementation-Planner';
    this.specsDir = path.join(__dirname, 'specs', 'checklists');

    // Existing agents available for tasks
    this.existingAgents = {
      core: [
        'database-agent',
        'campaign-agent',
        'contact-agent',
        'analytics-agent',
        'agency-agent',
      ],
      integration: ['integration-agent', 'integration-agent-real'],
      content: [
        'content-generation-agent',
        'social-media-agent',
        'radio-promo-agent',
        'viral-content-automation',
      ],
      strategy: [
        'music-industry-strategist',
        'music-marketing-mastermind',
        'growth-hacking-optimizer',
      ],
    };

    // Development phase templates
    this.phaseTemplates = {
      planning: [
        'Review UI wireframes and component selections',
        'Validate test scenarios match business requirements',
        'Confirm integration points with existing system',
        'Set up development environment and dependencies',
      ],
      implementation: [
        'Create database migrations (if needed)',
        'Build API endpoints with proper authentication',
        'Implement frontend components with mobile-first approach',
        'Add error handling and loading states',
        'Integrate with existing agent workflows',
      ],
      testing: [
        'Run mobile responsiveness tests',
        'Validate UK business context (currency, dates, formats)',
        'Test integration with existing contact database',
        'Verify agent orchestration works correctly',
        'Check performance on 3G mobile connections',
      ],
      deployment: [
        'Run full test suite and fix any failures',
        'Update existing agents if needed',
        'Deploy to staging environment',
        'Test with real data (limited scope)',
        'Deploy to production with monitoring',
      ],
    };
  }

  async createImplementationPlan(featureName, product = 'audiointel', agentAssignments = {}) {
    console.log(`📋 Creating implementation plan for: ${featureName}`);

    const plan = {
      feature: featureName,
      product: product,
      created: new Date().toISOString(),

      // Overall approach
      approach: {
        development_method: 'TDD with existing agent integration',
        mobile_first: true,
        uk_business_context: true,
        integration_priority: 'Seamless with existing 25-agent system',
      },

      // Phase breakdown
      phases: {
        red_phase: {
          name: 'RED - Test Definition & Planning',
          duration: '1-2 hours (interruptible)',
          tasks: this.generateRedPhaseTasks(featureName, product),
          outputs: ['UI wireframes', 'Component specs', 'Test scenarios'],
          agent_involvement: 'Planning agents only',
        },

        green_phase: {
          name: 'GREEN - Minimal Implementation',
          duration: '2-4 hours (focused work)',
          tasks: this.generateGreenPhaseTasks(featureName, product, agentAssignments),
          outputs: ['Working feature', 'API endpoints', 'Frontend components'],
          agent_involvement: 'Full existing agent system',
        },

        refactor_phase: {
          name: 'REFACTOR - Optimization & Polish',
          duration: '1-2 hours (flexible)',
          tasks: this.generateRefactorPhaseTasks(featureName, product),
          outputs: ['Optimized code', 'Performance improvements', 'Documentation'],
          agent_involvement: 'Analytics and optimization agents',
        },
      },

      // Agent assignments
      agent_assignments: this.generateAgentAssignments(featureName, product, agentAssignments),

      // Integration points
      integration_checklist: {
        existing_apis: [
          'Verify contact enrichment API compatibility',
          'Test campaign tracking integration',
          'Ensure analytics capture new feature usage',
          'Check email integration still functions',
        ],
        database: [
          'Plan new tables/columns if needed',
          'Ensure data isolation between tenants',
          'Test backup and migration strategies',
          'Verify performance with large datasets',
        ],
        ui_consistency: [
          'Use existing design system patterns',
          'Maintain mobile-first responsive design',
          'Apply correct theme colors (blue/green)',
          'Follow existing navigation patterns',
        ],
      },

      // Business requirements checklist
      business_validation: {
        uk_context: [
          'Currency displays as GBP (£)',
          'Dates in DD/MM/YYYY format',
          'Phone numbers accept UK formats',
          'Industry roles reflect UK market',
        ],
        pricing_tier: [
          `Feature provides value for £${this.getPricingTier(product)} pricing`,
          'Competitive advantage vs US tools is clear',
          'ROI tracking helps justify subscription cost',
          'Feature scales with user growth',
        ],
        user_experience: [
          'Mobile users can complete core actions',
          'Feature accessible with screen readers',
          'Loading times acceptable on 3G connections',
          'Error messages guide users to resolution',
        ],
      },

      // Emergency procedures
      emergency_procedures: {
        rollback_plan: [
          'Feature can be disabled via environment variable',
          'Database changes can be reverted',
          'API endpoints have backward compatibility',
          'Frontend gracefully handles feature absence',
        ],
        family_interruption: [
          'Save work-in-progress to feature branch',
          'Document current step in implementation',
          'Set status in orchestrator system',
          'Resume guidance for later session',
        ],
      },
    };

    // Save implementation plan
    const filename = `${featureName.replace(/\s+/g, '-').toLowerCase()}.json`;
    const filepath = path.join(this.specsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(plan, null, 2));

    console.log(`✅ Implementation plan saved: ${filename}`);
    console.log(`   RED phase: ${plan.phases.red_phase.tasks.length} tasks`);
    console.log(`   GREEN phase: ${plan.phases.green_phase.tasks.length} tasks`);
    console.log(`   Agent assignments: ${Object.keys(plan.agent_assignments).length}`);

    return plan;
  }

  generateRedPhaseTasks(featureName, product) {
    return [
      `Review existing ${featureName} requirements and user stories`,
      `Run TDD UI planner to create mobile-first wireframes`,
      `Run component selector to choose shadcn/ui components`,
      `Run test writer to define acceptance criteria`,
      `Validate specs against UK music industry needs`,
      `Confirm integration approach with existing agents`,
      `Set up feature branch and development environment`,
      `Update project documentation with feature scope`,
    ];
  }

  generateGreenPhaseTasks(featureName, product, agentAssignments) {
    const tasks = [
      // Database tasks
      'Create database migrations (use database-agent if complex)',
      'Update API models and validation schemas',

      // Backend tasks
      'Implement API endpoints with authentication',
      'Add business logic using appropriate existing agents',
      'Set up integration with contact/campaign systems',

      // Frontend tasks
      'Create React components using selected shadcn/ui components',
      'Implement mobile-first responsive design',
      'Add loading states and error handling',
      'Connect frontend to API endpoints',

      // Integration tasks
      'Test with existing orchestrator workflows',
      'Verify analytics tracking captures user actions',
      'Ensure email integration continues functioning',

      // Validation
      'Run basic test scenarios from test spec',
      'Verify mobile functionality on actual device',
      'Test UK business context (currency, dates, etc.)',
      'Check feature works with existing user data',
    ];

    return tasks;
  }

  generateRefactorPhaseTasks(featureName, product) {
    return [
      'Optimize database queries for performance',
      'Improve error handling and user feedback',
      'Add comprehensive logging for debugging',
      'Optimize mobile performance and loading times',
      'Review code for security vulnerabilities',
      'Add analytics for business intelligence',
      'Update user documentation and help text',
      'Run full test suite and fix any issues',
      'Prepare deployment checklist and rollback plan',
    ];
  }

  generateAgentAssignments(featureName, product, customAssignments) {
    const defaultAssignments = {
      'database-operations': 'database-agent',
      'contact-integration': 'contact-agent',
      'campaign-management': 'campaign-agent',
      'analytics-tracking': 'analytics-agent',
      'content-generation': 'content-generation-agent',
    };

    // Add product-specific assignments
    if (product === 'audiointel') {
      defaultAssignments['contact-enrichment'] = 'integration-agent-real';
      defaultAssignments['radio-outreach'] = 'radio-promo-agent';
    } else if (product === 'playlistpulse') {
      defaultAssignments['playlist-research'] = 'music-industry-strategist';
      defaultAssignments['campaign-optimization'] = 'growth-hacking-optimizer';
    }

    return { ...defaultAssignments, ...customAssignments };
  }

  getPricingTier(product) {
    return '19-99';
  }

  async quickPlan(featureName, product = 'audiointel') {
    console.log(`⚡ Quick implementation plan for: ${featureName}`);

    const quickPlan = {
      feature: featureName,
      product: product,
      created: new Date().toISOString(),
      type: 'quick-plan',

      // Minimal phases
      quick_phases: {
        plan: 'Use existing specs or create minimal ones (15 min)',
        build: 'Focus on core functionality only (1-2 hours)',
        test: 'Basic mobile and integration tests (30 min)',
      },

      // Essential tasks only
      essential_tasks: [
        `Check if ${featureName} components already exist`,
        'Implement core functionality with existing patterns',
        'Test on mobile device',
        'Verify integration with existing system',
        'Deploy to staging and validate',
      ],

      // Which existing agents to use
      key_agents: [
        'database-agent (if data changes needed)',
        'integration-agent (for API work)',
        'orchestrator (for coordination)',
      ],

      emergency_notes: 'Minimal viable implementation - expand later',
    };

    const filename = `${featureName.replace(/\s+/g, '-').toLowerCase()}-quick.json`;
    const filepath = path.join(this.specsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(quickPlan, null, 2));
    console.log(`⚡ Quick plan saved: ${filename}`);

    return quickPlan;
  }

  listPlans() {
    const files = fs.readdirSync(this.specsDir).filter(f => f.endsWith('.json'));

    console.log('\n📋 Implementation Plans:');
    files.forEach(file => {
      try {
        const plan = JSON.parse(fs.readFileSync(path.join(this.specsDir, file)));
        const type = plan.type === 'quick-plan' ? ' (quick)' : '';
        const phases = plan.phases
          ? Object.keys(plan.phases).length
          : plan.quick_phases
            ? Object.keys(plan.quick_phases).length
            : 0;
        console.log(`   ${plan.feature} - ${plan.product}${type}`);
        console.log(
          `     Phases: ${phases}, Agents: ${Object.keys(plan.agent_assignments || plan.key_agents || {}).length}`
        );
      } catch (e) {
        console.log(`   ${file} (error reading)`);
      }
    });

    return files;
  }
}

// CLI interface
if (require.main === module) {
  const planner = new TDDImplementationPlanner();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('📋 TDD Implementation Planner - Clear Checklists for Existing Agents');
    console.log('Usage:');
    console.log(
      '  node tdd-implementation-planner.js create "feature name" [audiointel|playlistpulse]'
    );
    console.log(
      '  node tdd-implementation-planner.js quick "feature name" [audiointel|playlistpulse]'
    );
    console.log('  node tdd-implementation-planner.js list');
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
      planner.createImplementationPlan(featureName, product);
      break;

    case 'quick':
      if (!featureName) {
        console.error('❌ Feature name required');
        process.exit(1);
      }
      planner.quickPlan(featureName, product);
      break;

    case 'list':
      planner.listPlans();
      break;

    default:
      console.error('❌ Unknown command:', command);
      process.exit(1);
  }
}

module.exports = TDDImplementationPlanner;
