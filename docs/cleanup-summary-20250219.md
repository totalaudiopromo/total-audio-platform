# Cleanup Summary – 2025-02-19

## Removed build artefacts
- Ran `npm run clean:build` to delete all `.next/` directories across apps
- Ran `npm run clean:node_modules` to remove every `node_modules/` folder (monorepo root + workspaces)

## Temp directory housekeeping
- Archived `tmp/kyara_meeting_brief.md` → `docs/archive/tmp-20250219-kyara_meeting_brief.md`
- Archived `tmp/kyara_bloodshot_corrected_analysis.md` → `docs/archive/tmp-20250219-kyara_bloodshot_corrected_analysis.md`
- Deleted `tmp/notion-export/` (temporary export dump)
- Removed now-empty `tmp/` directory

## Next steps
- Reinstall dependencies for any app you plan to run (e.g. `cd apps/audio-intel && npm install`)
- Regenerate `.next/` outputs via `npm run dev` / `npm run build` as needed
