# EXCLUDE PLAYLIST-PULSE FROM CI/CD

## Issue

The CI/CD pipeline is checking for `playlist-pulse` but this app should be **EXCLUDED**from all builds, tests, and deployments.

## Apps to Include (ONLY THESE)

- audio-intel
- tracker
- pitch-generator
- command-centre
- web

## Apps to Exclude

-  playlist-pulse (DO NOT BUILD, TEST, OR DEPLOY)

## Files That May Reference playlist-pulse

Check and remove any references to `playlist-pulse` from:

### 1. `.github/workflows/ci.yml`

- Build matrix should NOT include playlist-pulse
- Cache paths should NOT include playlist-pulse

### 2. `.github/workflows/ci-cd.yml`

- Build matrix should NOT include playlist-pulse
- Deployment jobs should NOT reference playlist-pulse

### 3. `.github/workflows/golden-deploy.yml`

- Build matrix on line 21 should NOT include playlist-pulse

### 4. Root `package.json`

- Build scripts should NOT reference playlist-pulse
- Test scripts should NOT reference playlist-pulse

## Expected Build Matrix

```yaml
matrix:
  app: [audio-intel, tracker, pitch-generator, command-centre, web]
```

**NOT:**

```yaml
matrix:
  app: [audio-intel, tracker, pitch-generator, command-centre, web, playlist-pulse]
```

## Task for Claude Code Web

1. Search all workflow files for "playlist-pulse" or "playlist_pulse"
2. Remove ALL references to playlist-pulse
3. Verify build matrix only includes the 5 active apps listed above
4. Ensure no deployment case statements reference playlist-pulse
5. Commit with message: "fix: exclude playlist-pulse from CI/CD pipeline"

## Verification

After fix, these commands should NOT mention playlist-pulse:

```bash
grep -r "playlist-pulse" .github/workflows/
grep -r "playlist_pulse" .github/workflows/
```

Both should return empty results.
