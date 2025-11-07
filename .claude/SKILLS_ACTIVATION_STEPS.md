# 🚀 Claude Code Skills - Activation Steps

**Status:** ✅ Skills installed, ⏸️ Not yet enabled

---

## Step 1: Enable Skills (2 minutes)

1. **Open Claude Code Settings:**
   - Press `⌘,` (Command + Comma)
   - OR click the gear/settings icon

2. **Navigate to Capabilities:**
   - Look for "Capabilities" section in sidebar
   - OR search for "skills" in settings search bar

3. **Enable Skills Toggle:**
   - Find "Skills" option
   - Toggle it to **ON** (should turn blue/green)

4. **Restart Claude Code:**
   - Close Claude Code completely (⌘Q)
   - Reopen Claude Code
   - **This is critical!** Skills won't load without restart

---

## Step 2: Verify Skills Are Active (1 minute)

Open a new chat in Claude Code and ask:

```
"Are skills enabled? What skills do I have installed?"
```

**Expected Response:**
Claude should confirm skills are enabled and list:

- ✅ skill-creator (writing-skills)
- ✅ systematic-debugging
- ✅ brainstorming
- ✅ changelog-generator

If Claude doesn't see the skills:

1. Check skills directory exists: `ls ~/.claude/skills/`
2. Restart Claude Code again
3. Try asking: "Can you see SKILL.md files in ~/.claude/skills/?"

---

## Step 3: Test First Skill (5 minutes)

### Test A: Changelog Generator (Quick Win)

```
"Generate a changelog from my recent git commits in this project"
```

Expected: Claude analyzes git history and creates formatted changelog

---

### Test B: Systematic Debugging (If You Have a Bug)

```
"Use Systematic Debugging to help me understand why [describe issue]"
```

Expected: Claude follows 4-phase framework:

1. Root cause investigation
2. Pattern analysis
3. Hypothesis testing
4. Implementation

---

### Test C: Skill Creator (Create Your First Custom Skill)

```
"Use Skill Creator to build a simple validator skill that checks if touch targets are at least 44x44px in React components"
```

Expected: Claude asks questions about:

- When the skill should activate
- What it should check for
- How it should provide feedback
- Testing strategy

---

## Step 4: Create Custom Skills (This Week)

Once skills are working, use Skill Creator to build project-specific skills:

### For Audio Intel:

```
"Use Skill Creator to build a mobile UX validator that enforces these 21 standards:
1. Touch targets ≥44x44px
2. Responsive breakpoints (320px, 375px, 768px, 1024px)
3. Loading states for async operations
... [full list in SKILLS_INSTALLATION_COMPLETE.md]

Trigger when: Creating/modifying components in apps/audio-intel/"
```

---

### For Customer Acquisition:

```
"Use Skill Creator to build a customer acquisition tracker that monitors:
- Current MRR (£0 → £500 target)
- Demo calls booked vs completed
- Conversion rates (Radio 85%, Artist 60%, Agency 70%)
- Beta signups from content

Trigger when: Updating CLAUDE.md or customer data"
```

---

### For 2-Hour Sessions:

```
"Use Skill Creator to build a session validator that:
- Checks task scope fits 2 hours at session start
- Warns every 30 minutes if scope is expanding
- Detects rabbit holes and perfectionism
- Reminds to focus on customer acquisition

Trigger: Manual invocation at session start"
```

---

## Troubleshooting

### "Skills Not Showing Up"

```bash
# Check installation
ls -la ~/.claude/skills/
# Should see: skill-creator, systematic-debugging, brainstorming, changelog-generator

# Check each skill has SKILL.md
ls -la ~/.claude/skills/*/SKILL.md
# Should see 4 SKILL.md files

# Restart Claude Code (important!)
# Close completely (⌘Q) and reopen
```

---

### "Skills Not Activating Automatically"

- Skills activate based on context and their description
- Try manual invocation: "Use [skill name] to..."
- Some skills only activate when explicitly called
- Check skill description in SKILL.md to understand when it triggers

---

### "Can't Find Skills Settings"

- Try searching in settings: "skills"
- Check Capabilities section
- Update Claude Code to latest version if option is missing
- Skills feature requires recent version of Claude Code

---

### "Token Usage Too High"

```bash
# Archive unused skills
mkdir -p ~/.claude/skills-archive
mv ~/.claude/skills/brainstorming ~/.claude/skills-archive/

# Keep only essential skills active
# You can always restore from archive later
```

---

## Quick Commands Reference

### Manual Skill Invocation

```
"Use Skill Creator to..."
"Use Systematic Debugging to..."
"Use Brainstorming to..."
"Generate a changelog from..."
```

### Check Skill Status

```
"What skills are installed?"
"Are skills enabled?"
"Show me the skill-creator SKILL.md file"
```

### Test Specific Skills

```
"Test the systematic-debugging skill with [issue]"
"Use changelog-generator for commits from last week"
"Help me brainstorm a solution for [problem]"
```

---

## Success Criteria

After completing these steps, you should have:

- [x] Skills enabled in Claude Code settings
- [x] Claude Code restarted
- [x] Skills visible when asking "What skills do I have?"
- [x] Successfully tested at least one skill
- [x] Created first custom skill using Skill Creator
- [x] Skills integrated into daily workflow

---

## Next Actions After Activation

1. **Read:** [SKILLS_QUICK_REFERENCE.md](file:///Users/chrisschofield/.claude/SKILLS_QUICK_REFERENCE.md) - Daily usage patterns
2. **Follow:** [SKILLS_IMPLEMENTATION_CHECKLIST.md](file:///Users/chrisschofield/.claude/SKILLS_IMPLEMENTATION_CHECKLIST.md) - Week-by-week plan
3. **Create:** 5 custom skills using Skill Creator (mobile validator, customer tracker, session validator, experimental guard, theme validator)
4. **Measure:** Track time saved, bugs caught, sessions on-time
5. **Refine:** Adjust skills based on actual usage patterns

---

## Time Investment

- Step 1 (Enable Skills): 2 minutes
- Step 2 (Verify): 1 minute
- Step 3 (Test): 5 minutes
- Step 4 (Create Custom Skills): 2-3 hours this week

**Total Setup Time:** ~10 minutes to activate, 2-3 hours to customize
**Expected Monthly ROI:** 8-10 hours saved

---

## Support Resources

- [SKILLS_INSTALLATION_COMPLETE.md](file:///Users/chrisschofield/.claude/SKILLS_INSTALLATION_COMPLETE.md) - Full installation summary
- [SKILLS_SETUP_GUIDE.md](file:///Users/chrisschofield/.claude/SKILLS_SETUP_GUIDE.md) - Comprehensive guide
- [SKILLS_AUDIT_SUMMARY.md](file:///Users/chrisschofield/.claude/SKILLS_AUDIT_SUMMARY.md) - Why skills are valuable

---

**Current Status:** ✅ Skills installed in both directories
**Next Step:** Enable skills in Claude Code settings (⌘, → Capabilities → Skills)
**After Enabling:** Come back and say "Skills enabled! Let's test them."

🚀 You're 2 minutes away from having powerful workflow automation!
