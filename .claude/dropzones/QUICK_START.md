# Dropzone System - Quick Start Guide

**⏱️ 2-minute setup guide for developers**

---

## 🚀 Quick Commands

### List Files
```bash
npx tsx .claude/scripts/dropzones/approve.ts list
```

### Approve a File (Safe Test)
```bash
npx tsx .claude/scripts/dropzones/approve.ts approve filename.txt
```

### Approve a File (Actually Move It)
```bash
npx tsx .claude/scripts/dropzones/approve.ts approve filename.txt --live
```

### Start Watcher (Safe Test)
```bash
DROPZONE_LIVE=0 npx tsx .claude/scripts/dropzones/watch.ts
```

### Start Watcher (Process Files)
```bash
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzones/watch.ts
```

### Emergency Stop
```bash
DROPZONE_DISABLE=1 npx tsx .claude/scripts/dropzones/watch.ts
```

---

## 📁 File Flow

```
1. Put file in:      .claude/dropzones/quarantine/
2. Approve it:       npx tsx ... approve filename.txt --live
3. File moves to:    .claude/dropzones/queue/
4. Watcher processes → .claude/dropzones/processed/
```

---

## 🔒 Safety Checklist

- [ ] Always test with `DROPZONE_LIVE=0` first
- [ ] Never run `DROPZONE_LIVE=1` without testing
- [ ] Use `DROPZONE_DISABLE=1` for emergency shutdown
- [ ] Manually approve files before processing
- [ ] Press Ctrl+C to stop watcher gracefully

---

## ⚙️ Environment Variables

| Variable | Safe Value | Live Value | Emergency |
|----------|------------|------------|-----------|
| `DROPZONE_LIVE` | `0` | `1` | - |
| `DROPZONE_DISABLE` | `0` | `0` | `1` |

---

## 🧪 Testing Workflow

```bash
# 1. Create test file
echo "test" > .claude/dropzones/quarantine/test.txt

# 2. Test approval (safe)
npx tsx .claude/scripts/dropzones/approve.ts approve test.txt

# 3. Approve for real
npx tsx .claude/scripts/dropzones/approve.ts approve test.txt --live

# 4. Test watcher (safe)
DROPZONE_LIVE=0 npx tsx .claude/scripts/dropzones/watch.ts
# Press Ctrl+C

# 5. Run watcher (live)
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzones/watch.ts
# Press Ctrl+C when done

# 6. Check result
ls .claude/dropzones/processed/
```

---

## 🆘 Common Issues

**"Watcher disabled"** → `DROPZONE_DISABLE=1` is set (remove it)

**"[DRY RUN] Would process"** → `DROPZONE_LIVE=0` (change to `1` for live)

**Files not processing** → Check files are in `queue/` not `quarantine/`

**Permission denied** → Run `chmod +x .claude/scripts/dropzones/*.ts`

---

**Full Documentation**: See `README.md` in this directory
