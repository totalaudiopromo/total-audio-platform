# IndyDevDan Workflow - Quick Reference

## Environment Variables

| Variable           | Default | Description                                      |
| ------------------ | ------- | ------------------------------------------------ |
| `DROPZONE_LIVE`    | `0`     | `0` = dry-run (logs only), `1` = live processing |
| `DROPZONE_DISABLE` | unset   | Set to `1` for emergency kill-switch             |

---

## Safety Controls

```bash
# Check safety status
npx tsx .claude/workflow/safety-controls.ts status

# Emergency kill-switch (stops all processing)
npx tsx .claude/workflow/safety-controls.ts enable-kill-switch

# Disable kill-switch
npx tsx .claude/workflow/safety-controls.ts disable-kill-switch

# Pause/Resume
npx tsx .claude/workflow/safety-controls.ts pause
npx tsx .claude/workflow/safety-controls.ts resume
```

---

## Dropzone Watcher

```bash
# Start watcher (dry-run mode - default, safe)
npx tsx .claude/scripts/dropzone-watcher.ts

# Start watcher (live mode - actually processes)
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzone-watcher.ts

# Run in background
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzone-watcher.ts &

# Check status
npx tsx .claude/scripts/dropzone-watcher.ts status

# Run single poll (doesn't start loop)
npx tsx .claude/scripts/dropzone-watcher.ts once

# Stop watcher
kill $(cat .claude/tmp/watcher.pid)
```

---

## File Approval

```bash
# List files awaiting approval
npx tsx .claude/scripts/approve-file.ts list

# Approve a file
npx tsx .claude/scripts/approve-file.ts approve <filename>

# Reject a file
npx tsx .claude/scripts/approve-file.ts reject <filename> --reason "Invalid format"

# Approve all
npx tsx .claude/scripts/approve-file.ts approve-all

# Show dropzone status
npx tsx .claude/scripts/approve-file.ts status

# Preview file contents
npx tsx .claude/scripts/approve-file.ts preview <filename>
```

---

## Processor Router

```bash
# List queue
npx tsx .claude/scripts/processor-router.ts list

# Test routing (doesn't process)
npx tsx .claude/scripts/processor-router.ts route <filename>

# Process a file
npx tsx .claude/scripts/processor-router.ts process <filename>

# Process entire queue
npx tsx .claude/scripts/processor-router.ts process-all
```

### File Routing Rules

| Pattern          | Processor | Description          |
| ---------------- | --------- | -------------------- |
| `intel-*.csv`    | Intel     | Contact enrichment   |
| `contacts-*.csv` | Intel     | Contacts (legacy)    |
| `epk-*.md`       | EPK       | Press kit (markdown) |
| `epk-*.json`     | EPK       | Press kit (JSON)     |

---

## Individual Processors

```bash
# Intel Processor (contact enrichment)
npx tsx .claude/scripts/processors/intel-processor.ts <input.csv>

# EPK Processor (press kit generation)
npx tsx .claude/scripts/processors/epk-processor.ts <input.md|json>
```

---

## Audit Logs

```bash
# Show today's summary
npx tsx .claude/workflow/audit-logger.ts summary

# Show summary for specific date
npx tsx .claude/workflow/audit-logger.ts summary 2025-11-26

# Show recent errors
npx tsx .claude/workflow/audit-logger.ts errors

# Query logs
npx tsx .claude/workflow/audit-logger.ts query [date] [category]

# Clean up old logs (>30 days)
npx tsx .claude/workflow/audit-logger.ts cleanup

# View raw audit log
cat .claude/logs/audit/$(date +%Y-%m-%d).jsonl | jq .
```

---

## Worktree Isolation

```bash
# List worktrees
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts list

# Create worktree for automation
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts create automation/task-name

# Activate worktree (hooks enforce boundaries)
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts activate <path>

# Deactivate
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts deactivate

# Cleanup automation worktrees
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts cleanup
```

---

## Directory Structure

```
.claude/
├── dropzones/
│   ├── input/           # Drop files here
│   ├── quarantine/      # Awaiting approval
│   ├── queue/           # Approved, ready for processing
│   ├── processed/       # Successful outputs
│   └── errors/          # Failed processing
├── hooks/
│   ├── pre-tool-use.ts  # Validates before execution
│   ├── post-tool-use.ts # Audit logging after
│   └── on-prompt-submit.ts # Blocks dangerous prompts
├── logs/
│   ├── audit/           # Daily JSONL audit files
│   └── decisions/       # Decision trail
├── scripts/
│   ├── dropzone-watcher.ts
│   ├── processor-router.ts
│   ├── approve-file.ts
│   └── processors/
│       ├── intel-processor.ts
│       └── epk-processor.ts
├── workflow/
│   ├── safety-controls.ts
│   ├── audit-logger.ts
│   └── QUICK_REFERENCE.md
├── skills/
│   └── worktree-isolation/
│       ├── SKILL.md
│       └── worktree-manager.ts
└── tmp/
    ├── watcher.pid
    ├── kill-switch
    ├── paused
    └── active-worktree
```

---

## Typical Workflow

### 1. Drop Files

```bash
# Copy files to input (or quarantine for manual approval)
cp contacts.csv .claude/dropzones/input/intel-contacts.csv
```

### 2. Approve (if manual approval mode)

```bash
npx tsx .claude/scripts/approve-file.ts list
npx tsx .claude/scripts/approve-file.ts approve intel-contacts.csv
```

### 3. Process

```bash
# Option A: Start watcher
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzone-watcher.ts

# Option B: Process directly
npx tsx .claude/scripts/processor-router.ts process intel-contacts.csv
```

### 4. Check Results

```bash
ls .claude/dropzones/processed/
cat .claude/dropzones/processed/*-summary.json
```

---

## Emergency Procedures

### Stop All Processing

```bash
# Immediate stop (set kill-switch)
export DROPZONE_DISABLE=1

# Or create kill-switch file
npx tsx .claude/workflow/safety-controls.ts enable-kill-switch

# Or kill watcher directly
kill $(cat .claude/tmp/watcher.pid)
```

### Recover from Errors

```bash
# Check error logs
ls .claude/dropzones/errors/
cat .claude/dropzones/errors/*.error.log

# Move file back to queue to retry
mv .claude/dropzones/errors/file.csv .claude/dropzones/queue/
```

### Clear Kill-Switch

```bash
npx tsx .claude/workflow/safety-controls.ts disable-kill-switch
unset DROPZONE_DISABLE
```
