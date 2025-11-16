# Drop Zone Workflows

**Status:** ⚠️ Requires inotify-tools installation
**ROI:** 5-10 hours/week saved on repetitive tasks

Auto-process files dropped into special directories with intelligent automation.

---

## 📋 Prerequisites

Install file watcher for your platform:

**Linux:**
```bash
sudo apt-get install inotify-tools
```

**macOS:**
```bash
brew install fswatch
```

---

## 🚀 Quick Start

### 1. Start the daemon

```bash
bash .claude/scripts/dropzone-start.sh
```

### 2. Drop files into dropzones

```bash
# Enrich contacts CSV
cp ~/Downloads/contacts.csv .claude/dropzones/contacts-to-enrich/incoming/

# Generate tests for component
cp apps/audio-intel/app/components/NewComponent.tsx .claude/dropzones/test-this/incoming/

# Review code
cp apps/pitch-generator/app/api/route.ts .claude/dropzones/review-this/incoming/

# Generate changelog from commits
git log --oneline > commits.txt
cp commits.txt .claude/dropzones/changelog-from-commits/incoming/
```

### 3. Check processed results

```bash
# View processed files
ls .claude/dropzones/*/processed/

# Check daemon status
bash .claude/scripts/dropzone-status.sh
```

### 4. Stop the daemon

```bash
bash .claude/scripts/dropzone-stop.sh
```

---

## 📁 Available Dropzones

### 1. Contact Enrichment (`contacts-to-enrich/`)

**Purpose:** Auto-enrich contact CSVs with Audio Intel

**Input:** CSV file with contact names/stations
**Output:** Enriched CSV with emails, social media, phone numbers

**Example:**
```bash
cp radio_contacts.csv .claude/dropzones/contacts-to-enrich/incoming/
# → 2 seconds later: .claude/dropzones/contacts-to-enrich/processed/radio_contacts.csv (enriched)
```

**Note:** Currently creates placeholder. TODO: Integrate with Audio Intel API.

---

### 2. Test Generation (`test-this/`)

**Purpose:** Auto-generate Playwright tests for React components

**Input:** `.tsx` component file
**Output:** `.test.tsx` test file with mobile UX, accessibility, and functionality tests

**Example:**
```bash
cp apps/audio-intel/app/components/Button.tsx .claude/dropzones/test-this/incoming/
# → 5 seconds later: .claude/dropzones/test-this/processed/Button.test.tsx
```

**Integration:** Uses existing test generator agent (`tools/agents/active/testing/test-generator.js`)

---

### 3. Code Review (`review-this/`)

**Purpose:** Auto-review code for security, performance, and mobile UX

**Input:** Code file (`.ts`, `.tsx`, `.js`, `.jsx`)
**Output:** `.review.md` with security, performance, and UX analysis

**Example:**
```bash
cp apps/tracker/app/api/users/route.ts .claude/dropzones/review-this/incoming/
# → 3 seconds later: .claude/dropzones/review-this/processed/route.review.md
```

**Review checklist:**
- ✅ Security (XSS, SQL injection, auth)
- ✅ Performance (re-renders, memory leaks)
- ✅ Mobile UX (touch targets, ARIA, responsive)
- ✅ Code quality (types, error handling, naming)

---

### 4. Changelog Generation (`changelog-from-commits/`)

**Purpose:** Auto-generate changelog from git commits

**Input:** Text file with commit messages or git log output
**Output:** Formatted `CHANGELOG.md` with features, fixes, and changes

**Example:**
```bash
git log --oneline main..feature/new-feature > commits.txt
cp commits.txt .claude/dropzones/changelog-from-commits/incoming/
# → 2 seconds later: .claude/dropzones/changelog-from-commits/processed/CHANGELOG-20251116-143022.md
```

**Format:** Groups commits by type (feat:, fix:, docs:, etc.)

---

## 🔧 Management Commands

### Start daemon
```bash
bash .claude/scripts/dropzone-start.sh
```

### Stop daemon
```bash
bash .claude/scripts/dropzone-stop.sh
```

### Check status
```bash
bash .claude/scripts/dropzone-status.sh
```

**Output:**
```
🔍 Drop Zone Daemon Status

Status: ✅ Running (PID: 12345)

📁 Dropzone Status:

  contacts-to-enrich:
    Incoming: 0 files
    Processed: 5 files
    Failed: 0 files

  test-this:
    Incoming: 1 files
    Processed: 12 files
    Failed: 0 files
```

### View logs
```bash
tail -f .claude/tmp/dropzone-daemon.log
```

---

## 📊 Directory Structure

```
.claude/dropzones/
├── contacts-to-enrich/
│   ├── incoming/       # Drop CSV files here
│   ├── processed/      # Enriched results appear here
│   └── failed/         # Failed enrichments (check logs)
├── test-this/
│   ├── incoming/       # Drop component files here
│   ├── processed/      # Generated tests appear here
│   └── failed/         # Failed generations
├── review-this/
│   ├── incoming/       # Drop code files here
│   ├── processed/      # Review reports appear here
│   └── failed/         # Failed reviews
└── changelog-from-commits/
    ├── incoming/       # Drop commit logs here
    ├── processed/      # Generated changelogs appear here
    └── failed/         # Failed generations
```

---

## ⚙️ How It Works

### File Watcher
- Daemon uses `inotifywait` (Linux) or `fswatch` (macOS)
- Watches all `incoming/` directories for new files
- Triggers appropriate processor when file appears

### Processing Flow
1. **File detected** in `incoming/` directory
2. **Moved to** `incoming/*.processing` (prevents duplicate processing)
3. **Processed** by appropriate handler
4. **Output created** in `processed/` directory
5. **Original moved** to `processed/` or `failed/`

### Fail-Safe Design
- Processing files marked with `.processing` extension
- Failures move to `failed/` directory
- All errors logged to `.claude/tmp/dropzone-daemon.log`
- Daemon continues running even if one file fails

---

## 🐛 Troubleshooting

### Daemon won't start

**Error:** "Neither inotifywait nor fswatch found"

**Fix:**
```bash
# Linux
sudo apt-get install inotify-tools

# macOS
brew install fswatch
```

---

### Files not being processed

**Check daemon is running:**
```bash
bash .claude/scripts/dropzone-status.sh
```

**Check logs:**
```bash
tail -f .claude/tmp/dropzone-daemon.log
```

**Restart daemon:**
```bash
bash .claude/scripts/dropzone-stop.sh
bash .claude/scripts/dropzone-start.sh
```

---

### Processing failed

**Check failed directory:**
```bash
ls .claude/dropzones/*/failed/
```

**View error in logs:**
```bash
grep ERROR .claude/tmp/dropzone-daemon.log
```

---

## 🚀 Integration with Existing Tools

### Test Generator Agent
Drop zone uses existing `tools/agents/active/testing/test-generator.js` for test generation.

### Audio Intel API
TODO: Integrate with Audio Intel enrichment API for real contact enrichment.

### Claude Code CLI
TODO: Integrate with Claude Code for automated code review.

---

## 📈 Performance

**Expected processing times:**
- Contact enrichment: 2-3 seconds per CSV
- Test generation: 3-5 seconds per component
- Code review: 2-4 seconds per file
- Changelog: 1-2 seconds

**Concurrent processing:** Files are processed sequentially to avoid resource contention.

---

## 🔐 Security

**Sensitive data handling:**
- Never logs file contents
- API keys and tokens never written to logs
- Failed files preserved for manual review
- All processing happens locally

---

## 🎯 Future Enhancements

**Planned integrations:**
- Audio Intel API for real contact enrichment
- Claude Code API for intelligent code review
- Slack/Telegram notifications on processing complete
- Email notifications for failed processing
- Scheduled batch processing

---

## 📚 Related Documentation

- [Dropzone daemon script](../.claude/dropzone-daemon.sh)
- [Test generator agent](../../tools/agents/active/testing/test-generator.js)
- [Workflow automation README](../workflow/README.md)

---

**Questions or issues?** Check the main [CLAUDE.md](../.claude/CLAUDE.md) or create a GitHub issue.
