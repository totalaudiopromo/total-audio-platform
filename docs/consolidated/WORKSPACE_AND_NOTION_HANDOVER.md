# Workspace & Notion Migration Handover

_All-in-one guidance for maintaining the local-first documentation system while completing the Notion sunset._

## 1. Local Source of Truth

- Daily orientation: `WEEKLY_FOCUS.md`, `AUDIO_INTEL_CONTEXT.md`, `BUSINESS_NOTES.md` (open each morning, capture decisions throughout the day).
- Directory map: `docs/` (reference, setup, archive), `apps/` (product code), `tools/` (agents, workflows), `.business/` (quick capture files per `docs/archive/LOCAL_SOURCE_OF_TRUTH.md`).
- Git hygiene: commit business context alongside code changes; use `.business` for scratch but process weekly.

## 2. Remaining Notion Assets & Access

- Integration status: `NOTION_API_KEY` verified (`npm run notion:whoami`). Some pages/databases still unshared (see `MANUAL_REVIEW.md`).
- Export coverage (26 Sept 2025): key pages converted to Markdown under `tmp/notion-export/`. Missing entries flagged for manual sharing; additional markdown/CSV exports live in `~/Downloads` as a stop-gap until the pages are properly shared (see filenames listed in `MANUAL_REVIEW.md`).
- Helpful commands:
  ```bash
  npm run notion:audit -- --dry-run
  npm run notion:cleanup
  node scripts/notion/export-pages.js --offset <n> --limit <m>
  npm run mcp:notion
  ```

## 3. Consolidation Structure

- Business strategy, product playbook, content blueprint, and agent operations now live under `docs/consolidated/`.
- Archived originals retained in `docs/archive/` and `tmp/notion-export/` for traceability; mark them “superseded” when encountered.
- Updates should funnel into the consolidated files first, then filtered into primary daily docs as required.

## 4. Migration Workflow

1. Run `npm run notion:audit -- --dry-run` to surface stragglers; log outcomes in `CONSOLIDATION_REPORT.md`.
2. Export missing pages with `scripts/notion/export-pages.js`; share Notion access if 404/unauthorised.
3. Compare exports with existing Markdown (`rg "# " docs/consolidated` vs. `tmp/notion-export`).
4. Merge unique insights into consolidated docs; avoid re-introducing duplicates into archive.
5. Update cross-links (e.g., from `WEEKLY_FOCUS.md` to new consolidated sections).
6. Archive stale docs (move to `archive/cleanup-temp` or delete after confirmation).

## 5. Maintenance Cadence

- **Weekly**:
  - Friday review: find TODOs via `find docs -name "*.md" -exec rg -n "TODO" {} +`.
  - Archive processed notes; summarise in `BUSINESS_NOTES.md`.
  - Confirm MCP server health; rotate tokens if required.
- **Monthly**:
  - Validate consolidated docs reflect business direction and agent instructions.
  - Refresh `CONSOLIDATION_REPORT.md` with completed migrations.
  - Review `tmp/notion-export/` for obsolescence; move legacy files to `archive/` if no longer needed.

## 6. Outstanding Actions

- Share missing Notion pages (databases, 404 IDs) with the integration.
- Re-export once access granted and merge into consolidated docs.
- Convert unsupported block types (tables, embedded child pages) manually—flagged in `MANUAL_REVIEW.md`.
- Finish email automation fixes (dependency for workspace onboarding and Agent OS context syncing).

## 7. References

- `docs/reference/WORKSPACE_TRANSFORMATION_SUMMARY.md`
- `docs/archive/LOCAL_SOURCE_OF_TRUTH.md`
- `tmp/notion-export/total-audio-promo-organised-workspace.md`
- `tmp/notion-export/notion-workspace-organisation-guide.md`
- `tmp/notion-export/current-priorities-to-dos.md`

---

This handover supersedes previous Notion cleanup summaries; keep `docs/archive/consolidation/CONSOLIDATION_SUMMARY.md` for the historical audit trail only.
