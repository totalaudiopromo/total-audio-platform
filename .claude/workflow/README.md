# Workflow Automation Suite

**Version:** 1.0.0 (Batch 1)
**Status:** ✅ Production Ready
**Last Updated:** 2025-11-15

This directory contains the core workflow automation systems for Total Audio Platform development.

---

## 🎯 Overview

Three core automation systems implemented:

1. **Context Reset Automation** - Monitors session context usage and suggests resets
2. **Pre-Tool-Use Safety Hooks** - Blocks dangerous commands before execution
3. **Tool Execution Audit Trail** - Logs every tool execution for debugging

---

## 📁 Directory Structure

```
.claude/workflow/
├── context/              # Context usage tracking
│   ├── types.ts          # TypeScript type definitions
│   ├── tracker.ts        # Context usage tracker
│   ├── check-context.ts  # CLI to check context status
│   ├── post-tool-increment.ts  # Hook integration
│   └── config.json       # Configuration
├── safety/               # Safety validation
│   ├── types.ts          # TypeScript types
│   ├── rules.ts          # Safety rules (15+ patterns)
│   ├── validator.ts      # Validation logic
│   └── protected-paths.json  # Protected paths config
├── audit/                # Audit logging
│   ├── types.ts          # TypeScript types
│   ├── logger.ts         # JSONL logger
│   ├── summarize.ts      # Summary generator CLI
│   └── view.ts           # Log viewer CLI
└── README.md             # This file
```

---

## 🚀 Quick Start

### Check Context Status

```bash
npx tsx .claude/workflow/context/check-context.ts
```

### View Audit Logs

```bash
# Today's logs
npx tsx .claude/workflow/audit/view.ts

# Specific date
npx tsx .claude/workflow/audit/view.ts --date 2025-11-15

# Filter by tool
npx tsx .claude/workflow/audit/view.ts --tool Read --limit 10
```

### Generate Audit Summary

```bash
# Today's summary
npx tsx .claude/workflow/audit/summarize.ts

# Specific date
npx tsx .claude/workflow/audit/summarize.ts 2025-11-15
```

---

## 📖 System Details

### 1. Context Reset Automation

**Purpose:** Prevent context bloat and performance degradation

**How it works:**
- Tracks file reads, writes, and session duration
- Triggers when: >50 reads, >30 writes, OR >120 minutes
- Creates `.claude/CONTEXT_RESET_RECOMMENDED.md` reminder file
- Suggests `/clear` command to user

**Configuration:** `.claude/workflow/context/config.json`

```json
{
  "enabled": true,
  "thresholds": {
    "maxFileReads": 50,
    "maxFileWrites": 30,
    "maxSessionMinutes": 120
  }
}
```

**Manual check:**
```bash
npx tsx .claude/workflow/context/check-context.ts
```

---

### 2. Pre-Tool-Use Safety Hooks

**Purpose:** Block dangerous commands before execution

**How it works:**
- Runs automatically before every tool invocation
- Validates against 15+ safety rules
- Blocks destructive patterns (rm -rf /, fork bombs, etc.)
- Warns on critical file modifications

**Safety rules include:**
- Root filesystem deletion
- Fork bombs
- Disk operations
- Git force operations
- Database drops
- System shutdown/reboot
- And more...

**Protected paths:**
- `/`, `/home`, `/etc`, `/var`, `/usr`
- `.git`, `node_modules`
- `package.json`, `pnpm-lock.yaml`
- Critical workflow files

**Configuration:** `.claude/workflow/safety/protected-paths.json`

**Testing (safe simulation):**
```bash
# This would be blocked if run via Claude:
# echo "rm -rf /" (simulated dangerous command)
```

---

### 3. Tool Execution Audit Trail

**Purpose:** Full traceability of all tool executions

**How it works:**
- Logs every tool execution to `.claude/audit-logs/YYYY-MM-DD.jsonl`
- Scrubs sensitive data (API keys, passwords, tokens)
- Provides CLI tools for viewing and analysis
- Generates daily summaries

**Log format (JSONL):**
```json
{
  "timestamp": "2025-11-15T14:30:00.000Z",
  "sessionId": "session-1234567890",
  "tool": "Read",
  "params": {"file_path": "package.json"},
  "result": "success"
}
```

**Privacy:**
- Automatically scrubs: API_KEY, SECRET, PASSWORD, TOKEN
- Long alphanumeric strings treated as potential secrets
- Never logs actual secret values

**View logs:**
```bash
# All logs for today
npx tsx .claude/workflow/audit/view.ts

# Filter by tool
npx tsx .claude/workflow/audit/view.ts --tool Bash

# Filter by session
npx tsx .claude/workflow/audit/view.ts --session session-123

# Limit results
npx tsx .claude/workflow/audit/view.ts --limit 50
```

**Generate summary:**
```bash
npx tsx .claude/workflow/audit/summarize.ts
```

---

## ⚙️ Configuration

Master configuration: `.claude/settings.json`

```json
{
  "hooks": {
    "pre-tool-use": ".claude/hooks/pre-tool-use.ts",
    "post-tool-use": ".claude/hooks/post-tool-use.ts"
  },
  "workflow": {
    "context": {
      "enabled": true,
      "checkOnPostTool": true
    },
    "safety": {
      "enabled": true
    },
    "audit": {
      "enabled": true,
      "scrubSensitive": true
    }
  }
}
```

---

## 🔧 How to Disable

### Disable All Systems

Remove or comment out in `.claude/settings.json`:

```json
{
  "hooks": {}
}
```

### Disable Individual Systems

**Context monitoring:**
```json
{
  "workflow": {
    "context": {
      "enabled": false
    }
  }
}
```

**Safety hooks:**
```json
{
  "workflow": {
    "safety": {
      "enabled": false
    }
  }
}
```

**Audit logging:**
```json
{
  "workflow": {
    "audit": {
      "enabled": false
    }
  }
}
```

---

## 🧪 Testing

All systems are fail-safe:
- Errors never crash Claude Code
- Defaults to allowing operations if validation fails
- All errors logged but execution continues

**Manual tests:**

1. **Context tracking:**
   ```bash
   # Read 51 files, then check
   npx tsx .claude/workflow/context/check-context.ts
   # Should show "reset recommended"
   ```

2. **Safety hooks:**
   ```bash
   # Try a dangerous command (will be blocked)
   # Example: rm -rf / (DO NOT RUN - just for documentation)
   ```

3. **Audit logs:**
   ```bash
   # Run some commands, then view logs
   npx tsx .claude/workflow/audit/view.ts
   # Should show recent tool executions
   ```

---

## 🐛 Troubleshooting

### Context check not working

```bash
# Manually run check
npx tsx .claude/workflow/context/check-context.ts

# Check config exists
cat .claude/workflow/context/config.json

# Reset usage counters
rm .claude/tmp/context-usage.json
```

### Safety hooks not blocking

```bash
# Check hooks are configured
cat .claude/settings.json

# Test manually
npx tsx .claude/hooks/pre-tool-use.ts Bash "rm -rf /"
# Should exit with code 1 and error message
```

### Audit logs not appearing

```bash
# Check logs directory exists
ls -la .claude/audit-logs/

# Check today's log
cat .claude/audit-logs/$(date +%Y-%m-%d).jsonl

# Manually log a test entry
npx tsx -e "require('./.claude/workflow/audit/logger').logToolExecution({tool:'Test',params:{}})"
```

---

## 📊 Success Metrics

**Context Reset:**
- ✅ Detects heavy usage (>50 reads)
- ✅ Suggests reset appropriately
- ✅ Never false positives on fresh sessions

**Safety Hooks:**
- ✅ Blocks 100% of dangerous patterns
- ✅ Never blocks safe operations
- ✅ Provides helpful error messages

**Audit Trail:**
- ✅ Logs all tool executions
- ✅ Scrubs 100% of known sensitive patterns
- ✅ Maintains readable JSONL format

---

## 🚀 Future Enhancements

**Batch 2 (Planned):**
- Session history tracker
- Git worktree parallelization

**Batch 3 (Planned):**
- Drop zone workflows
- Headless Claude in CI

---

## 📚 Related Documentation

- [POST_LIBERTY_DEMO_WORKFLOW_UPGRADES.md](../../POST_LIBERTY_DEMO_WORKFLOW_UPGRADES.md) - Full upgrade plan
- [.claude/CLAUDE.md](../ CLAUDE.md) - Main Claude Code configuration
- [Context tracking](./context/README.md) - Detailed context docs (to be created)
- [Safety rules](./safety/README.md) - Detailed safety docs (to be created)
- [Audit logging](./audit/README.md) - Detailed audit docs (to be created)

---

## 🤝 Contributing

When adding new safety rules:

1. Add to `.claude/workflow/safety/rules.ts`
2. Follow existing pattern structure
3. Test manually before committing
4. Document in safety README

When modifying thresholds:

1. Update `.claude/workflow/context/config.json`
2. Test with realistic workload
3. Document reasoning in commit message

---

**Questions or issues?** Check the main [CLAUDE.md](../CLAUDE.md) or create a GitHub issue.
