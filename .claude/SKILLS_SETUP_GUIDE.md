# Claude Code Skills - Setup Guide

## Quick Start (5 Minutes)

### Step 1: Enable Skills in Claude Code

1. Open Claude Code settings (⌘,)
2. Go to **Capabilities**
3. Enable **"Skills"**toggle
4. Restart Claude Code

### Step 2: Install Skills via Plugin Marketplace

```bash
# In Claude Code, type:
/plugin

# Follow prompts:
1. Add marketplace URL: https://github.com/anthropics/anthropic-skills
2. Browse available skills
3. Install: Skill Creator, Changelog Generator, Systematic Debugging, Brainstorming
```

### Step 3: Verify Installation

```bash
# Check skills directory
ls -la ~/.claude/skills/

# You should see folders like:
# - skill-creator/
# - changelog-generator/
# - systematic-debugging/
# - brainstorming/
```

---

## Manual Installation (Alternative Method)

If plugin marketplace doesn't work, install manually:

### 1. Download Skills

```bash
cd ~/.claude/skills

# Skill Creator (from obra/superpowers)
git clone --depth 1 --filter=blob:none --sparse https://github.com/obra/superpowers
cd superpowers
git sparse-checkout set skills/skill-creator
mv skills/skill-creator ../
cd .. && rm -rf superpowers

# Systematic Debugging
git clone --depth 1 --filter=blob:none --sparse https://github.com/obra/superpowers
cd superpowers
git sparse-checkout set skills/systematic-debugging
mv skills/systematic-debugging ../
cd .. && rm -rf superpowers

# Simplification Cascades
git clone --depth 1 --filter=blob:none --sparse https://github.com/obra/superpowers-skills
cd superpowers-skills
git sparse-checkout set skills/problem-solving/simplification-cascades
mv skills/problem-solving/simplification-cascades ../
cd .. && rm -rf superpowers-skills

# Changelog Generator
git clone --depth 1 --filter=blob:none --sparse https://github.com/ComposioHQ/awesome-claude-skills
cd awesome-claude-skills
git sparse-checkout set changelog-generator
mv changelog-generator ../
cd .. && rm -rf awesome-claude-skills
```

### 2. Restart Claude Code

Close and reopen Claude Code to load new skills.

---

## Priority Skills for Total Audio Projects

### Install First (This Week)

#### 1. Skill Creator

**Why:**Create custom skills for both projects
**Repo:**https://github.com/obra/superpowers
**Path:**`skills/skill-creator/`

**First Custom Skills to Create:**

- `audio-intel-mobile-validator`: Enforces 21 mobile UX standards
- `two-hour-session-scope`: Validates work fits in 2-hour window
- `experimental-sandbox-guard`: Prevents production code in totalaud.io

#### 2. Changelog Generator

**Why:**Customer trust + demo call prep
**Repo:**https://github.com/ComposioHQ/awesome-claude-skills
**Path:**`changelog-generator/`

**Use Cases:**

- Generate Audio Intel release notes for customers
- Track feature implementations for investor updates
- Document experimental learnings in totalaud.io

#### 3. Systematic Debugging

**Why:**Prevents 2-hour sessions turning into rabbit holes
**Repo:**https://github.com/obra/superpowers
**Path:**`skills/systematic-debugging/`

**Use Cases:**

- Vercel deployment issues (module resolution)
- TypeScript errors across both projects
- Mobile UX bugs in Audio Intel

---

### Install Later (After First Customer)

#### 4. Brainstorming

**Why:**Feature planning and customer acquisition strategy
**Repo:**https://github.com/obra/superpowers
**Path:**`skills/brainstorming/`

**Use Cases:**

- Plan new Audio Intel conversion features
- Design experimental totalaud.io workflows
- Scope 2-hour development sessions

---

### ⏸ Defer (After £500/month)

#### 5. Simplification Cascades

**Why:**Refactoring should wait until post-customer acquisition
**Repo:**https://github.com/obra/superpowers-skills
**Path:**`skills/problem-solving/simplification-cascades/`

**When to Use:**

- After Audio Intel proves sustainable revenue
- When totalaud.io moves from experimental to production
- During code cleanup sprints (not during customer acquisition)

---

## How to Use Skills

### Automatic Invocation

Skills are automatically invoked by Claude Code when relevant. No need to call them explicitly.

### Manual Invocation

If you want to explicitly use a skill:

```bash
# In chat with Claude Code:
"Use the Systematic Debugging skill to investigate this Vercel error"
"Use the Changelog Generator to create release notes from commits abc123..def456"
"Use the Skill Creator to build a new skill for mobile UX validation"
```

### Skill Context

Skills have access to:

- Your codebase
- Git history
- Project CLAUDE.md instructions
- Current conversation context

---

## Custom Skills to Create (Using Skill Creator)

### For Audio Intel (Customer Acquisition Focus)

#### 1. audio-intel-mobile-validator

**Purpose:**Enforce 21 mobile UX standards resolved in September 2025
**Triggers:**When creating/modifying components in `apps/audio-intel/`
**Checks:**

- Touch target sizes (min 44x44px)
- Mobile viewport responsiveness
- Loading states for network requests
- Error handling and user feedback
- Conversion funnel optimization

#### 2. customer-acquisition-tracker

**Purpose:**Track demo calls, conversions, revenue metrics
**Triggers:**When updating CLAUDE.md with customer data
**Outputs:**

- Current conversion rates by segment (Radio 85%, Artist 60%, Agency 70%)
- Progress toward £500/month goal
- Demo call quality scoring

#### 3. two-hour-session-validator

**Purpose:**Prevent scope creep during 2-hour sessions
**Triggers:**At session start and every 30 minutes
**Checks:**

- Current task scope fits in remaining time
- No rabbit holes or over-optimization
- Customer acquisition focus maintained

---

### For totalaud.io (Experimental Focus)

#### 1. experimental-sandbox-guard

**Purpose:**Prevent experimental code from affecting production (Audio Intel)
**Triggers:**When working in `/totalaud.io` directory
**Checks:**

- No shared dependencies with Audio Intel
- No Supabase schema changes affecting production
- Clear separation of concerns

#### 2. theme-system-validator

**Purpose:**Enforce consistency across 5 themes (ascii, xp, aqua, daw, analogue)
**Triggers:**When modifying theme configs or theme-aware components
**Checks:**

- All themes have required config keys
- Theme colours are accessible (WCAG AA)
- Sound banks are defined for each theme

#### 3. onboarding-flow-tester

**Purpose:**Validate 4-phase onboarding state machine
**Triggers:**When modifying onboarding components/hooks
**Checks:**

- Phase transitions work correctly
- localStorage persistence is reliable
- Skip functionality (?skip_onboarding=true) works

---

## Token Usage Considerations

Skills consume tokens. Optimize by:

- Only install skills you actively use
- Archive unused skills to `~/.claude/skills-archive/`
- Disable automatic invocation for low-priority skills
- Use manual invocation for infrequent tasks

**Rule of Thumb:**

- Customer acquisition skills: Always active
- Experimental skills: Manual invocation only
- Optimization skills: Deferred until post-revenue

---

## Integration with Existing Workflows

### Git Workflow Enhancement

```bash
# Before committing (Audio Intel):
1. Run mobile tests: npm run test:mobile
2. Invoke Changelog Generator for release notes
3. Commit with customer-facing message
4. Update customer acquisition metrics

# Before committing (totalaud.io):
1. Run type checks: pnpm typecheck
2. Document experimental learnings
3. Ensure no production dependencies
```

### MCP + Skills Synergy

Your 14+ MCP servers + Skills = Powerful automation:

- **Gmail MCP + Customer Acquisition Tracker**: Auto-track demo call responses
- **Notion MCP + Changelog Generator**: Auto-publish release notes
- **Puppeteer MCP + Mobile Validator**: Automated mobile UX testing

---

## Troubleshooting

### Skills Not Loading

```bash
# Check skills are in correct directory
ls -la ~/.claude/skills/

# Each skill should have a SKILL.md or skill.json file
# Restart Claude Code after installation
```

### Skills Consuming Too Many Tokens

```bash
# Move unused skills to archive
mkdir -p ~/.claude/skills-archive
mv ~/.claude/skills/simplification-cascades ~/.claude/skills-archive/
```

### Skill Conflicts

If multiple skills try to activate simultaneously:

- Prioritize customer acquisition skills
- Manually invoke specific skill needed
- Disable auto-invocation for experimental skills

---

## Next Steps

### This Week

- [ ] Enable Skills in Claude Code settings
- [ ] Install Skill Creator, Changelog Generator, Systematic Debugging
- [ ] Create first custom skill: `audio-intel-mobile-validator`
- [ ] Generate changelog for recent Audio Intel updates

### This Month

- [ ] Install Brainstorming skill
- [ ] Create `customer-acquisition-tracker` skill
- [ ] Create `two-hour-session-validator` skill
- [ ] Document skill effectiveness in CLAUDE.md

### After First Customer

- [ ] Review which skills accelerated customer acquisition
- [ ] Archive unused skills
- [ ] Create new skills based on customer feedback patterns
- [ ] Consider installing Simplification Cascades for refactoring

---

## Resources

### Official Documentation

- Claude Code Skills: https://docs.claude.com/skills
- Anthropic Skills Repo: https://github.com/anthropics/anthropic-skills

### Community Skills

- obra/superpowers: https://github.com/obra/superpowers
- obra/superpowers-skills: https://github.com/obra/superpowers-skills
- ComposioHQ/awesome-claude-skills: https://github.com/ComposioHQ/awesome-claude-skills

### Video Tutorial

- "5 Claude Code Skills Every Vibe Coder Needs": https://www.youtube.com/watch?v=901VMcZq8X4

---

**Last Updated:**October 2025
**Status:**Ready for implementation
**Next Action:**Enable Skills in Claude Code settings (⌘, → Capabilities → Skills)
