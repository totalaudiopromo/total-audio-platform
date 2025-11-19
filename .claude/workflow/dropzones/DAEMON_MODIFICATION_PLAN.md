# Dropzone Daemon Modification Plan

**Status**: PREPARATION ONLY - DO NOT ACTIVATE

## Current Behaviour (`.claude/dropzone-daemon.sh`)

The daemon currently watches `incoming/` directories directly:
- `contacts-to-enrich/incoming`
- `test-this/incoming`
- `review-this/incoming`
- `changelog-from-commits/incoming`

## Proposed Modified Behaviour (When Activated)

### 1. Watch `queue/` Directory Only

```bash
# OLD (current):
inotifywait -m -r -e close_write --format '%w%f' \
  "$DROPZONE_ROOT/contacts-to-enrich/incoming" \
  "$DROPZONE_ROOT/test-this/incoming" \
  # ... etc

# NEW (proposed):
inotifywait -m -r -e close_write --format '%w%f' \
  "$DROPZONE_ROOT/queue"
```

### 2. Ignore `incoming/` and `quarantine/`

Daemon should **NOT** process files directly from:
- `incoming/` - user drop zone (manual only)
- `quarantine/` - awaiting approval (manual only)

### 3. Require Approval Step

New workflow:
1. **User drops file** → `incoming/`
2. **Manual move** → `quarantine/` (or automated script)
3. **Manual approval** → `dz approve <file>` → moves to `queue/`
4. **Daemon processes** → from `queue/` only
5. **Results** → `processed/` or `failed/`

### 4. Add Approval Check Warning

When daemon starts, check if approval workflow is configured:

```bash
if [ ! -d "$DROPZONE_ROOT/queue" ]; then
  log "⚠️  WARNING: queue/ directory missing - approval workflow not set up"
  log "Files must be manually approved before processing"
fi
```

## Safety Modifications

### Log All Processing Attempts

```bash
log "📥 Processing file from queue: $filename"
log "⚠️  This file was manually approved from quarantine"
```

### Reject Unapproved Files

If daemon somehow receives a file that wasn't approved:

```bash
# Check if file has approval marker (future enhancement)
if [ ! -f "$DROPZONE_ROOT/queue/$filename.approved" ]; then
  log "❌ File not approved: $filename"
  mv "$file" "$DROPZONE_ROOT/quarantine/$filename"
  continue
fi
```

## Implementation Checklist (When Activating)

- [ ] Backup current `.claude/dropzone-daemon.sh`
- [ ] Modify `inotifywait`/`fswatch` paths to watch `queue/` only
- [ ] Add quarantine directory check on startup
- [ ] Add approval workflow warnings
- [ ] Test with dry-run mode first
- [ ] Verify no files are processed without approval

## Rollback Plan

If modified daemon causes issues:

```bash
# Stop daemon
bash .claude/scripts/dropzone-stop.sh

# Restore original daemon
git checkout .claude/dropzone-daemon.sh

# Restart with original behaviour
bash .claude/scripts/dropzone-start.sh
```

## Current Status

**NOT MODIFIED** - Daemon still watches `incoming/` directories.

**Reason**: Activation phase not yet approved. This document serves as preparation only.

**Next Step**: Await explicit approval before modifying daemon startup logic.
