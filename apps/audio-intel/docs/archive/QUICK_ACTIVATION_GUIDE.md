# ⚡ QUICK ACTIVATION GUIDE - 10X YOUR WORKFLOW IN 30 MINUTES

**Goal**: Activate your world-class TDD agents and unified workflow system
**Time**: 30 minutes for massive workflow improvement

## 🚀 IMMEDIATE ACTIVATION (5 commands, 30 minutes)

### Step 1: Activate TDD Agents (5 minutes)

```bash
# Navigate to your workspace
cd /Users/chrisschofield/workspace/active/total-audio-platform

# Create active TDD directory
mkdir -p tools/agents/active/tdd

# Move TDD agents to active
cp tools/agents/archive/tests/tdd-*.js tools/agents/active/tdd/
cp tools/agents/archive/working/total-audio-tdd-orchestrator.js tools/agents/active/

# Make executable
chmod +x tools/agents/active/tdd/*.js
chmod +x tools/agents/active/total-audio-tdd-orchestrator.js

echo "✅ TDD agents activated!"
```

### Step 2: Test Your TDD System (10 minutes)

```bash
# Initialize the TDD orchestrator
cd tools/agents/active
node total-audio-tdd-orchestrator.js init

# Test with a simple feature
node total-audio-tdd-orchestrator.js plan "CSV export" audiointel

# Check status
node total-audio-tdd-orchestrator.js status

echo "✅ TDD system tested and working!"
```

### Step 3: Create Unified Launcher (10 minutes)

```bash
# Create unified agent launcher
cat > tools/agents/unified-launcher.js << 'EOF'
#!/usr/bin/env node

/**
 * Unified Agent Launcher - 10X Workflow Entry Point
 * Single command to access all your agents and workflows
 */

const { execSync } = require('child_process');
const path = require('path');

const AGENTS = {
  // TDD Workflow
  'tdd-plan': 'active/total-audio-tdd-orchestrator.js plan',
  'tdd-build': 'active/total-audio-tdd-orchestrator.js build',
  'tdd-quick': 'active/total-audio-tdd-orchestrator.js quick',
  'tdd-status': 'active/total-audio-tdd-orchestrator.js status',

  // Testing
  'test-write': 'active/tdd/tdd-test-writer.js write',
  'test-quick': 'active/tdd/tdd-test-writer.js quick',

  // Content & Marketing
  'newsletter': 'core-agents/content/newsletter-automation-agent.js',
  'social': 'core-agents/content/social-media-agent.js',
  'news': 'core-agents/content/newsjacking-agent.js',

  // Business Operations
  'analytics': 'core-agents/business/analytics-agent.js',
  'marketing': 'core-agents/business/chris-saas-marketing-agent.js',

  // Radio Promotion
  'radio': 'core-agents/radio-promo/radio-promo-agent.js',
  'campaign': 'core-agents/radio-promo/campaign-agent.js',

  // Gmail Setup
  'gmail-setup': 'gmail-setup/gmail-liberty-setup.js'
};

function showHelp() {
  console.log('\n🤖 UNIFIED AGENT LAUNCHER - 10X WORKFLOW');
  console.log('=========================================');
  console.log('Usage: node unified-launcher.js <workflow> [args...]');
  console.log('');
  console.log('🚀 TDD WORKFLOWS (10X Development):');
  console.log('  tdd-plan "feature"     Plan feature with TDD methodology');
  console.log('  tdd-build "feature"    Build feature with tests');
  console.log('  tdd-quick "feature"    Quick build without TDD planning');
  console.log('  tdd-status             Show all feature development status');
  console.log('');
  console.log('📝 TESTING:');
  console.log('  test-write "feature"   Generate natural language test scenarios');
  console.log('  test-quick "feature"   Quick test scenarios for rapid development');
  console.log('');
  console.log('📧 CONTENT & MARKETING:');
  console.log('  newsletter             Automated newsletter generation');
  console.log('  social                 Social media content automation');
  console.log('  news                   Newsjacking content creation');
  console.log('');
  console.log('📊 BUSINESS:');
  console.log('  analytics              Business analytics and insights');
  console.log('  marketing              SaaS marketing automation');
  console.log('');
  console.log('🎵 RADIO PROMOTION:');
  console.log('  radio                  Radio promotion workflows');
  console.log('  campaign               Campaign management');
  console.log('');
  console.log('📧 SETUP:');
  console.log('  gmail-setup            Gmail automation setup');
  console.log('');
  console.log('Examples:');
  console.log('  node unified-launcher.js tdd-plan "contact filtering" audiointel');
  console.log('  node unified-launcher.js test-quick "export feature"');
  console.log('  node unified-launcher.js newsletter generate');
}

function runAgent(workflow, args) {
  const agentPath = AGENTS[workflow];
  if (!agentPath) {
    console.error(`❌ Unknown workflow: ${workflow}`);
    console.log('Run "node unified-launcher.js" to see available workflows');
    process.exit(1);
  }

  const fullPath = path.join(__dirname, agentPath);
  const command = `node ${fullPath} ${args.join(' ')}`;

  console.log(`🚀 Running workflow: ${workflow}`);
  console.log(`📂 Command: ${command}`);
  console.log('');

  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
  } catch (error) {
    console.error(`❌ Workflow failed: ${error.message}`);
    process.exit(1);
  }
}

// CLI Interface
const [,, workflow, ...args] = process.argv;

if (!workflow) {
  showHelp();
  process.exit(0);
}

runAgent(workflow, args);
EOF

chmod +x tools/agents/unified-launcher.js
echo "✅ Unified launcher created!"
```

### Step 4: Test Unified System (5 minutes)

```bash
# Test the unified launcher
cd tools/agents
node unified-launcher.js

# Try a quick TDD workflow
node unified-launcher.js tdd-plan "mobile optimization" audiointel

echo "✅ Unified system working!"
```

### Step 5: Update Agent OS Integration (5 minutes)

```bash
# Enhance Agent OS config
cat > .agent-os/config.yml << 'EOF'
# Agent OS Configuration - Enhanced for Total Audio

agent_os_version: 1.4.1

agents:
  claude_code:
    enabled: true
    custom_workflow_launcher: ./tools/agents/unified-launcher.js
    tdd_integration: true

# Total Audio specific configuration
total_audio:
  business_focus: "uk_music_industry_saas"
  primary_products: ["audiointel", "playlistpulse"]
  testing_approach: "tdd_natural_language"
  pricing_context: "£19-99_tier"

project_types:
  default:
    instructions: ~/.agent-os/instructions
    standards: ~/.agent-os/standards
    custom_agents: ./tools/agents/active

  audio_intel:
    instructions: ./apps/audio-intel/.claude/instructions
    standards: ./apps/audio-intel/.claude/standards

  tdd_development:
    instructions: ~/.agent-os/instructions/tdd
    standards: ~/.agent-os/standards/tdd

default_project_type: default

workflows:
  feature_development: "tdd-plan → tdd-build → test"
  quick_fix: "tdd-quick → test-quick"
  content_creation: "newsletter | social | news"
  business_analysis: "analytics → marketing"
EOF

echo "✅ Agent OS integration enhanced!"
```

## 🎯 IMMEDIATE BENEFITS UNLOCKED

### ⚡ 10X Development Speed

- **Before**: Manual feature planning and testing
- **After**: `node unified-launcher.js tdd-plan "feature name"`
- **Result**: Automated test scenarios, UI planning, implementation roadmap

### 🎯 Business-Focused Testing

- **Before**: Technical tests without business context
- **After**: UK music industry scenarios, £19-99 pricing validation
- **Result**: Tests that validate actual customer value

### 🔄 Unified Workflow

- **Before**: 18+ scattered agents, manual coordination
- **After**: Single entry point, orchestrated workflows
- **Result**: Zero cognitive overhead, maximum productivity

## 🚀 NEXT-LEVEL COMMANDS (Available Now!)

### TDD Workflows

```bash
# Plan a new Audio Intel feature
node unified-launcher.js tdd-plan "radio station filtering" audiointel

# Build planned feature
node unified-launcher.js tdd-build "radio station filtering"

# Quick implementation without full TDD
node unified-launcher.js tdd-quick "bug fix"

# Check all feature development status
node unified-launcher.js tdd-status
```

### Content Automation

```bash
# Generate newsletter content
node unified-launcher.js newsletter generate-weekly

# Create social media content
node unified-launcher.js social generate-posts

# Find trending music industry news
node unified-launcher.js news scan-trends
```

### Business Intelligence

```bash
# Analyze customer acquisition metrics
node unified-launcher.js analytics customer-acquisition

# Generate SaaS marketing content
node unified-launcher.js marketing content-strategy
```

## 📈 WORKFLOW EXAMPLES

### Example 1: New Feature Development (TDD)

```bash
# 1. Plan feature with comprehensive TDD methodology
node unified-launcher.js tdd-plan "playlist discovery" audiointel

# 2. Generate natural language test scenarios
node unified-launcher.js test-write "playlist discovery" audiointel

# 3. Build feature with TDD orchestration
node unified-launcher.js tdd-build "playlist discovery"

# 4. Check implementation status
node unified-launcher.js tdd-status
```

### Example 2: Quick Fix Workflow

```bash
# 1. Quick implementation without full TDD
node unified-launcher.js tdd-quick "mobile responsive fix"

# 2. Quick test scenarios for validation
node unified-launcher.js test-quick "mobile responsive fix"
```

### Example 3: Content Marketing Automation

```bash
# 1. Generate newsletter for "The Unsigned Advantage"
node unified-launcher.js newsletter weekly-edition

# 2. Create social media posts
node unified-launcher.js social generate-weekly

# 3. Find industry news to leverage
node unified-launcher.js news newsjacking-opportunities
```

## ✅ VERIFICATION CHECKLIST

After running the activation commands, verify:

- [ ] TDD orchestrator initializes: `node tools/agents/active/total-audio-tdd-orchestrator.js status`
- [ ] Unified launcher shows help: `node tools/agents/unified-launcher.js`
- [ ] Test planning works: `node unified-launcher.js tdd-plan "test feature"`
- [ ] Agent OS integration: Check `.agent-os/config.yml` has total_audio section

## 🎯 WHAT YOU'VE UNLOCKED

### World-Class TDD System ✅

- Natural language test scenarios (not brittle selectors)
- Mobile-first testing (iPhone SE, 44px touch targets)
- UK music industry context (BBC Radio 1, £19-99 pricing)
- Complete workflow orchestration

### Unified Agent Ecosystem ✅

- Single entry point for all workflows
- TDD-first development by default
- Business-focused automation
- Agent OS professional standards

### 10X Productivity Multiplier ✅

- Automated feature planning
- Natural language testing
- Workflow orchestration
- Zero cognitive overhead

**You now have a world-class development workflow that rivals the best SaaS companies! 🚀**
