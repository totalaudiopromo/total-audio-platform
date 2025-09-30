# Agent Operations & Technical Workflow Hub

_Single reference for running Agent OS, Claude sub-agents, and development workflows across Total Audio Promo._

## 1. Agent OS at a Glance
- Base install: `/.agent-os/` with CLAUDE integration and 31+ specialised agents.
- Daily focal files: `WEEKLY_FOCUS.md`, `AUDIO_INTEL_CONTEXT.md`, `BUSINESS_NOTES.md`.
- Command cadence: `/analyze-product`, `/create-spec`, `/execute-tasks`, `/plan-product` for structured delivery.

## 2. Core Agent Families
| Agent Group | Purpose | Key References |
|-------------|---------|----------------|
| **Music Marketing Mastermind** | Campaign design, platform strategy, messaging alignment | `docs/archive/marketing-mastermind.md` |
| **Viral Content Automation** | Cross-platform scheduling, trend spotting, automation | `docs/archive/viral-content.md` |
| **Radio Promo Agent Stack** | Liberty replacement workflows, OAuth fixes, Airtable coordination | `tmp/notion-export/radio-promo-agent-day-in-the-life-workflow.md`, `tmp/notion-export/radio-promo-agent-system-architecture.md`, `tmp/notion-export/radio-promo-agent-multi-agent-architecture.md` |
| **Notion & MCP Utilities** | Integration health checks, invite automation, workspace cleanup | `scripts/utilities/notion-workspace-manager.js`, `tools/notion/*` |

## 3. Development Workflow Checklist
1. Review `WEEKLY_FOCUS.md` → confirm sprint commitments.
2. Run `/analyze-product` when scope unknown; produce spec with `/create-spec`.
3. Execute work using `/execute-tasks`; enforce mobile-first & customer acquisition guardrails.
4. Update `BUSINESS_NOTES.md` and relevant doc in `docs/consolidated/`.
5. Commit changes with descriptive context for business + technical impact.

## 4. Technical Operations Snapshot
- Repositories: multi-app monorepo (`apps/audio-intel`, `apps/playlist-pulse`, `apps/web`, `apps/api`).
- Commands: `npm run dev:audio-intel`, `npm run notion:*`, `npm run agents:*` for health checks.
- Integrations: Stripe, Warm API, Gmail, Kit email (token pending renewal), MCP servers for Notion/Airtable.
- Monitoring: `tools/agents/radio-promo/REAL_TIME_MONITORING_SUMMARY.md`, `tools/agents/radio-promo/WARM_GOOGLE_OAUTH_SOLUTION.md`.

## 5. Workflow Improvements Captured
- Radio Promo Agent now compresses campaign launch from 15–20 hours to <1 hour via multi-agent orchestration.
- Audio Intel enrichment pool + API fallback keeps cost at £0.001–0.005/contact with 6–75 ms response times.
- MCP scripts consolidated into `notion-workspace-manager.js` for audit/cleanup/organise cycles.

## 6. Operational Backlog (Tech & Agents)
- **Critical**: Renew Kit API token to restore email automation. (Blocking beta onboarding.)
- **High**: Update support docs/landing messaging; align pricing in all templates.
- **Medium**: Expand agent documentation to reflect consolidated files; integrate Playlist Pulse planning with Audio Intel agent stack.
- **Low**: Archive legacy Notion scripts once migration is complete.

## 7. Daily & Weekly Rituals
- **Daily**: Run `npm run notion:whoami` if MCP actions fail; append insights to `BUSINESS_NOTES.md`; sync agent context using `npm run memory:save` post-sessions.
- **Weekly (Friday)**: Execute `npm run notion:audit -- --dry-run` to detect stray pages; process `.business` quick notes; ensure consolidated docs updated.
- **Monthly**: Review agent health via `npm run agents:health` and rotate secrets with `docs/archive/SECRETS_ROTATION_CHECKLIST.md`.
- **Sprint overlays**: Mirror the Notion "Current Priorities & To-Dos" cadence—Friday case-study blast, Monday outreach, Wednesday follow-up, Friday review—and log outcomes in `WEEKLY_FOCUS.md`.

## 8. Escalation & Manual Oversight
- Use `MANUAL_REVIEW.md` for unresolved integration access (e.g., Notion databases not shared) or unsupported block exports (tables, child pages).
- Track architecture decisions in `BUSINESS_NOTES.md` under “Decisions” heading to keep agent memory accurate.

---
_Source merge:_ `docs/setup/AGENT_OS_COMPLETE_GUIDE.md`, `docs/archive/AI_AGENTS_GUIDE.md`, `docs/archive/DEVELOPMENT_WORKFLOWS.md`, multiple radio-promo Notion exports, and operational scripts under `tools/agents/`.
