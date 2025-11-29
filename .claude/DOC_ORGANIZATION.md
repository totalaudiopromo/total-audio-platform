# Documentation Organisation System

## Overview

Automated system to keep your Total Audio Platform documentation organised and tidy. No more cluttered root directory!

## Structure

### Root Level (Only These 5 Files)

- **README.md**- Project overview
- **SECURITY.md**- Security policies
- **AUDIO_INTEL_CONTEXT.md**- Business context (frequently referenced)
- **WEEKLY_FOCUS.md**- Current week priorities (frequently referenced)
- **BUSINESS_NOTES.md**- Running business log (frequently referenced)

### Organised Directories

```
docs/
 business/          # Business strategy, context, notes
 reports/           # Audits, analysis, completion reports
 guides/            # Setup guides, quick references, checklists
 security/          # Security docs (except main SECURITY.md)
 technical/         # Technical workflows, Agent OS docs
 misc/              # Other documentation
```

## Automatic Organisation Rules

| Pattern          | Destination       | Examples                       |
| ---------------- | ----------------- | ------------------------------ |
| `*_AUDIT*.md`    | `docs/reports/`   | CODE_EFFICIENCY_AUDIT.md       |
| `*_REPORT*.md`   | `docs/reports/`   | CONSOLIDATION_REPORT.md        |
| `*_SUMMARY*.md`  | `docs/reports/`   | Mobile test summaries          |
| `*_COMPLETE*.md` | `docs/reports/`   | CLEANUP_COMPLETE.md            |
| `SECURITY*.md`   | `docs/security/`  | SECURITY_ROTATION_CHECKLIST.md |
| `*SETUP*.md`     | `docs/guides/`    | QUICK_DATABASE_SETUP.md        |
| `*GUIDE*.md`     | `docs/guides/`    | Setup guides                   |
| `*WORKFLOW*.md`  | `docs/technical/` | CLAUDE_MAX_WORKFLOW.md         |
| `AGENT_OS*.md`   | `docs/technical/` | AGENT_OS_QUICK_REFERENCE.md    |
| `QUICK_*.md`     | `docs/guides/`    | Quick references               |
| `*CHECKLIST*.md` | `docs/guides/`    | Various checklists             |

## Usage

### Manual Organisation

Run this anytime to tidy up root directory:

```bash
bash .claude/auto-organise-docs.sh
```

### Automatic Organisation

The system can automatically organise docs after Claude creates them using hooks (optional).

## Adding Custom Rules

Edit `.claude/auto-organise-docs.sh` and add to `DOC_RULES` array:

```bash
"YOUR_PATTERN*.md:docs/your-category:Description"
```

## Benefits

**Clean Root**- Only 5 essential files visible
**Find Docs Faster**- Organised by category
**No Manual Work**- Run one command to tidy up
**Flexible**- Easy to customise rules
**Safe**- Never touches critical files (README, SECURITY, business docs)

## When to Run

- After Claude creates multiple documentation files
- Before committing code
- When root directory feels cluttered
- Weekly cleanup routine

## Example Session

```bash
# Before
$ ls *.md
AUDIO_INTEL_CONTEXT.md  CODE_EFFICIENCY_AUDIT.md  CONSOLIDATION_REPORT.md
WEEKLY_FOCUS.md  BUSINESS_NOTES.md  CLEANUP_COMPLETE.md  README.md
SECURITY.md  AGENT_OS_QUICK_REFERENCE.md  QUICK_DATABASE_SETUP.md
...15 files total...

# Run organiser
$ bash .claude/auto-organise-docs.sh

# After
$ ls *.md
AUDIO_INTEL_CONTEXT.md  WEEKLY_FOCUS.md  BUSINESS_NOTES.md
README.md  SECURITY.md

# 5 files in root, rest organised in docs/
$ tree docs/
docs/
 business/
 reports/
    CODE_EFFICIENCY_AUDIT.md
    CONSOLIDATION_REPORT.md
    CLEANUP_COMPLETE.md
 guides/
    QUICK_DATABASE_SETUP.md
 technical/
     AGENT_OS_QUICK_REFERENCE.md
```

## Philosophy

**"Add value while reducing complexity"**

Keep your workspace clean so you can focus on customer acquisition, not file management.

---

**Created**: 29 September 2025
**Mantra**: Clean repo = Clear mind = Better code
