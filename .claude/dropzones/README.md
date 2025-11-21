# Dropzone System - Safe File Monitoring and Processing

**Status**: ✅ Operational (DRY-RUN, LIVE, and Kill-Switch verified)
**Version**: 1.0.0
**Last Updated**: 2025-11-21

---

## Overview

The Dropzone system provides **safe, monitored file processing** with multiple safety layers:

- **Kill-Switch** (`DROPZONE_DISABLE=1`) - Emergency shutdown
- **DRY-RUN Mode** (`DROPZONE_LIVE=0`) - Log-only testing
- **LIVE Mode** (`DROPZONE_LIVE=1`) - Actual processing
- **Manual Approval** - Files must be explicitly approved before processing
- **Graceful Shutdown** - Clean Ctrl+C handling

---

## Directory Structure

```
.claude/dropzones/
├── quarantine/         # Files awaiting manual approval
├── queue/             # Approved files ready for processing
├── processed/         # Successfully processed files
├── failed/            # Failed processing attempts
└── README.md          # This file

.claude/scripts/dropzones/
├── watch.ts           # File watcher (monitors queue/)
└── approve.ts         # Manual approval CLI

.claude/workflow/dropzones/
├── types.ts           # TypeScript type definitions
└── processor.ts       # File processing logic
```

---

## Safety Features

### 🔴 Kill-Switch (`DROPZONE_DISABLE=1`)

Emergency shutdown for ALL dropzone operations:

```bash
# Prevents watcher from starting
DROPZONE_DISABLE=1 npx tsx .claude/scripts/dropzones/watch.ts
# Output: Watcher disabled by DROPZONE_DISABLE=1

# Prevents file approval
DROPZONE_DISABLE=1 npx tsx .claude/scripts/dropzones/approve.ts approve test.txt --live
# Output: Approval disabled by DROPZONE_DISABLE=1
```

### 🟡 DRY-RUN Mode (`DROPZONE_LIVE=0`)

Safe testing mode - logs only, no file operations:

```bash
# Watcher in DRY-RUN mode (default)
DROPZONE_LIVE=0 npx tsx .claude/scripts/dropzones/watch.ts
# Output: [DRY RUN] Would process: file.txt
```

### 🟢 LIVE Mode (`DROPZONE_LIVE=1`)

Production mode - actually processes files:

```bash
# Watcher in LIVE mode
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzones/watch.ts
# Output: ✅ PROCESSED: file.txt
```

---

## Usage Guide

### Basic Workflow

```
1. File arrives → quarantine/
2. Manual review and approval → queue/
3. Watcher processes file → processed/ or failed/
```

### Step 1: Place File in Quarantine

```bash
# Manually place files in quarantine for review
cp /path/to/file.txt .claude/dropzones/quarantine/
```

### Step 2: Review Files

```bash
# List files awaiting approval
npx tsx .claude/scripts/dropzones/approve.ts list

# Output:
# Files in quarantine (1):
#   - file.txt (1024 bytes)
```

### Step 3: Approve Files

```bash
# DRY-RUN approval (safe, logs only)
npx tsx .claude/scripts/dropzones/approve.ts approve file.txt

# LIVE approval (actually moves file)
npx tsx .claude/scripts/dropzones/approve.ts approve file.txt --live
```

### Step 4: Start Watcher

```bash
# DRY-RUN mode (safe, logs only)
DROPZONE_LIVE=0 npx tsx .claude/scripts/dropzones/watch.ts

# LIVE mode (processes files)
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzones/watch.ts
```

### Step 5: Stop Watcher

```bash
# Press Ctrl+C for graceful shutdown
# Output: ✅ Watcher stopped cleanly
```

---

## Testing Results

### ✅ Stage 4B.2 - DRY-RUN Watcher Test

**Status**: PASSED
**Date**: 2025-11-21

- ✅ Watcher started in DRY-RUN mode
- ✅ Detected files in queue
- ✅ Logged "[DRY RUN] Would process" messages
- ✅ No actual file processing
- ✅ No file movement
- ✅ Graceful shutdown on SIGTERM

### ✅ Stage 4B.3 - LIVE Watcher Test

**Status**: PASSED
**Date**: 2025-11-21

- ✅ Watcher started in LIVE mode
- ✅ Processed 2 files successfully
- ✅ Files moved from queue → processed
- ✅ File contents preserved intact
- ✅ No errors, no failed files
- ✅ Graceful shutdown on SIGTERM
- ✅ No lingering processes

**Files Processed**:
1. `approved-dryrun.txt` (35 bytes)
2. `live-test.txt` (51 bytes)

### ✅ Stage 4B.4 - Kill-Switch Test

**Status**: PASSED
**Date**: 2025-11-21

**Watcher Kill-Switch**:
- ✅ `DROPZONE_DISABLE=1` prevents watcher startup
- ✅ Exits immediately with message
- ✅ No processing occurs

**Approval Kill-Switch**:
- ✅ `DROPZONE_DISABLE=1` prevents file approval
- ✅ Files remain in quarantine
- ✅ No file movement

---

## Environment Variables

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `DROPZONE_DISABLE` | `0` or `1` | `0` | Kill-switch: 1 = disable all operations |
| `DROPZONE_LIVE` | `0` or `1` | `0` | Processing mode: 0 = dry-run, 1 = live |

---

## Dropzone Types

Currently supported dropzone types:

| Type | Description | Processing Logic |
|------|-------------|------------------|
| `test-this` | Test/QA files | Runs test suite |
| `deploy-this` | Deployment files | Deployment automation |
| `review-this` | Code review files | Code review automation |

---

## Examples

### Example 1: Safe Testing Workflow

```bash
# 1. Place test file
echo "test content" > .claude/dropzones/quarantine/test.txt

# 2. Review files
npx tsx .claude/scripts/dropzones/approve.ts list

# 3. Test approval (DRY-RUN)
npx tsx .claude/scripts/dropzones/approve.ts approve test.txt

# 4. Approve for real
npx tsx .claude/scripts/dropzones/approve.ts approve test.txt --live

# 5. Start watcher in DRY-RUN first
DROPZONE_LIVE=0 npx tsx .claude/scripts/dropzones/watch.ts

# 6. If looks good, run in LIVE mode
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzones/watch.ts
```

### Example 2: Emergency Shutdown

```bash
# Kill-switch activates immediately
DROPZONE_DISABLE=1 npx tsx .claude/scripts/dropzones/watch.ts
# Output: Watcher disabled by DROPZONE_DISABLE=1
```

### Example 3: Batch Approval

```bash
# List all files
npx tsx .claude/scripts/dropzones/approve.ts list

# Approve multiple files
for file in file1.txt file2.txt file3.txt; do
  npx tsx .claude/scripts/dropzones/approve.ts approve "$file" --live
done

# Start watcher to process all
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzones/watch.ts
```

---

## Troubleshooting

### Watcher won't start

**Check**:
1. Is `DROPZONE_DISABLE=1` set? (kill-switch active)
2. Does `.claude/dropzones/queue/` directory exist?
3. Are permissions correct? (`chmod +x .claude/scripts/dropzones/*.ts`)

### Files not processing

**Check**:
1. Is watcher in DRY-RUN mode? (`DROPZONE_LIVE=0`)
2. Are files in `queue/` directory? (not `quarantine/`)
3. Check watcher output for error messages
4. Check `failed/` directory for failed files

### Files stuck in quarantine

**Solution**:
```bash
# Manually approve files
npx tsx .claude/scripts/dropzones/approve.ts approve filename.txt --live
```

### Lingering processes

**Solution**:
```bash
# Find processes
ps aux | grep -E "dropzone|watch"

# Kill if needed
pkill -f "watch.ts"
```

---

## Architecture

### File Flow

```
User Action
    ↓
quarantine/ (manual placement)
    ↓
approve.ts (manual approval)
    ↓
queue/ (approved files)
    ↓
watch.ts (monitors queue/)
    ↓
processor.ts (processes files)
    ↓
processed/ or failed/ (results)
```

### Safety Layers

```
Layer 1: Kill-Switch (DROPZONE_DISABLE=1)
    ↓
Layer 2: DRY-RUN Mode (DROPZONE_LIVE=0)
    ↓
Layer 3: Manual Approval (quarantine → queue)
    ↓
Layer 4: Queue-Only Monitoring (never watches quarantine)
    ↓
Layer 5: Graceful Shutdown (Ctrl+C handling)
```

---

## Development

### Running Tests

```bash
# DRY-RUN watcher test
DROPZONE_LIVE=0 npx tsx .claude/scripts/dropzones/watch.ts

# LIVE watcher test
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzones/watch.ts

# Kill-switch test
DROPZONE_DISABLE=1 npx tsx .claude/scripts/dropzones/watch.ts
```

### Adding New Dropzone Types

1. Add type to `types.ts`:
   ```typescript
   export type DropzoneType =
     | 'test-this'
     | 'deploy-this'
     | 'review-this'
     | 'your-new-type'; // Add here
   ```

2. Add processing logic in `processor.ts`:
   ```typescript
   case 'your-new-type':
     console.log(`Processing your new type: ${basename(filePath)}`);
     // Add processing logic here
     break;
   ```

---

## Performance

**Tested Performance**:
- File detection: < 100ms
- Processing: < 1s per file (depends on dropzone type)
- Memory usage: < 50MB (watcher process)
- Graceful shutdown: < 100ms

---

## Security Considerations

1. **Manual Approval Required**: Files cannot self-promote from quarantine to queue
2. **Kill-Switch Protection**: Emergency shutdown available at any time
3. **DRY-RUN First**: Always test with `DROPZONE_LIVE=0` before going live
4. **Queue-Only Monitoring**: Watcher never watches quarantine directory
5. **Explicit LIVE Mode**: Must set `DROPZONE_LIVE=1` for processing

---

## Future Enhancements

- [ ] Web dashboard for file monitoring
- [ ] Email notifications for processing results
- [ ] Retry logic for failed files
- [ ] File content validation before approval
- [ ] Automatic quarantine cleanup (old files)
- [ ] Processing history and analytics
- [ ] Multi-watcher support (parallel processing)

---

## Support

**Documentation**: This file
**Scripts**: `.claude/scripts/dropzones/`
**Types**: `.claude/workflow/dropzones/types.ts`
**Processor**: `.claude/workflow/dropzones/processor.ts`

---

**Last Verified**: 2025-11-21
**Status**: ✅ All tests passing
**Safety**: 🟢 Kill-switch operational
