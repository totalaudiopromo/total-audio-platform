# Claude Code Skills - Quick Start Guide

**Time Required:** 30 minutes
**Goal:** Get 3 essential skills running today

---

## Step 1: Enable Skills (5 minutes)

1. Open Claude Code settings:
   - Press `⌘,` (Command + Comma)
   - Or click the gear icon

2. Navigate to **Capabilities** section

3. Find **"Skills"** toggle and turn it **ON**

4. **Restart Claude Code** (important!)

5. Verify skills are enabled:
   - Open a chat
   - Type: "Are skills enabled?"
   - Claude should confirm skills capability is active

---

## Step 2: Install Core Skills (20 minutes)

### Option A: Plugin Marketplace (Recommended)

```bash
# In Claude Code chat, type:
/plugin

# Follow prompts:
1. Add marketplace: https://github.com/anthropics/anthropic-skills
2. Browse available skills
3. Install: Skill Creator
4. Install: Changelog Generator
5. Install: Systematic Debugging

# Restart Claude Code after installation
```

---

### Option B: Manual Installation (If Marketplace Doesn't Work)

Open Terminal and run these commands:

```bash
cd ~/.claude/skills

# Install Skill Creator
git clone --depth 1 --filter=blob:none --sparse https://github.com/obra/superpowers temp-superpowers
cd temp-superpowers
git sparse-checkout set skills/skill-creator
mv skills/skill-creator ../skill-creator
cd .. && rm -rf temp-superpowers

# Install Systematic Debugging
git clone --depth 1 --filter=blob:none --sparse https://github.com/obra/superpowers temp-superpowers2
cd temp-superpowers2
git sparse-checkout set skills/systematic-debugging
mv skills/systematic-debugging ../systematic-debugging
cd .. && rm -rf temp-superpowers2

# Install Changelog Generator
git clone --depth 1 https://github.com/ComposioHQ/awesome-claude-skills temp-awesome
mv temp-awesome/changelog-generator ./changelog-generator
rm -rf temp-awesome

# Verify installation
ls -la
# You should see: skill-creator, systematic-debugging, changelog-generator

# Restart Claude Code
```

---

## Step 3: Test Skills (5 minutes)

### Test 1: Skill Creator

```
Open Claude Code chat and type:

"Use Skill Creator to help me build a simple validator skill"

Expected: Claude asks you questions about the skill you want to create
```

### Test 2: Changelog Generator

```
"Generate a changelog from my recent git commits"

Expected: Claude reads your git history and generates formatted changelog
```

### Test 3: Systematic Debugging

```
"Use Systematic Debugging to help me understand why [describe a bug]"

Expected: Claude follows 4-phase framework (root cause, patterns, hypothesis, implementation)
```

---

##  You're Done!

**What You Have Now:**

- Skills enabled in Claude Code
- 3 core skills installed and tested
- Foundation for creating custom skills
- Ready to improve workflow immediately

---

## Next Steps (After Quick Start)

### Today (Optional)

- Create your first custom skill using Skill Creator
- Generate a changelog for your latest work
- Use Systematic Debugging next time you're stuck >15 minutes

### This Week

- Read [SKILLS_SETUP_GUIDE.md](../SKILLS_SETUP_GUIDE.md) for detailed usage
- Create custom skills:
  - `audio-intel-mobile-validator`
  - `customer-acquisition-tracker`
  - `two-hour-session-validator`

### This Month

- Review [SKILLS_QUICK_REFERENCE.md](../SKILLS_QUICK_REFERENCE.md) for daily patterns
- Complete [SKILLS_IMPLEMENTATION_CHECKLIST.md](../SKILLS_IMPLEMENTATION_CHECKLIST.md)
- Measure effectiveness and adjust

---

## Troubleshooting

### Skills Not Showing Up

```bash
# Check installation
ls -la ~/.claude/skills/

# Each skill should have:
# - SKILL.md file (or similar)
# - Proper folder structure

# Restart Claude Code (this is crucial!)
```

### Skills Not Activating

```
# Try manual invocation:
"Use Skill Creator to..." (explicit instruction)

# Check Claude confirms skill is available:
"What skills do I have installed?"
```

### Plugin Marketplace Not Working

```
# Use Option B (manual installation) above
# Commands are copy-paste ready
# Takes 5 minutes
```

---

##  Full Documentation

- [SKILLS_AUDIT_SUMMARY.md](../SKILLS_AUDIT_SUMMARY.md) - Why skills are worth it for your projects
- [SKILLS_SETUP_GUIDE.md](../SKILLS_SETUP_GUIDE.md) - Comprehensive setup and usage instructions
- [SKILLS_QUICK_REFERENCE.md](../SKILLS_QUICK_REFERENCE.md) - Daily usage patterns and decision trees
- [SKILLS_IMPLEMENTATION_CHECKLIST.md](../SKILLS_IMPLEMENTATION_CHECKLIST.md) - Phase-by-phase implementation

---

## Quick Tips

1. **Start Small:** Just install these 3 core skills today
2. **Test Immediately:** Use skills with real work to see value
3. **Create Custom Skills:** Use Skill Creator to codify your workflow patterns
4. **Archive Unused:** If a skill isn't helping, move it to `~/.claude/skills-archive/`
5. **Manual Invocation:** You can always explicitly ask Claude to "Use [skill name]"

---

**Time Invested:** 30 minutes
**Expected Value:** 30%+ time savings on debugging, automatic changelog generation, foundation for custom skills

**Next Action:** Open Claude Code settings (⌘,) → Capabilities → Enable Skills → Restart

---

**Questions?** Check [SKILLS_SETUP_GUIDE.md](../SKILLS_SETUP_GUIDE.md) for detailed instructions or ask Claude: "How do I use the [skill name] skill?"
