# Audio Intel Product Playbook

_Combined reference for product vision, technical status, launch tasks, and agent automation._

## 1. Product Snapshot

- **Status**: Production-ready contact enrichment platform with 515 verified UK industry contacts and 25 orchestrated agents.
- **Core Promise**: “15 hours → 15 minutes” to research radio/press contacts with guaranteed organic-quality results.
- **Live Assets**: Next.js 15 app, Stripe billing, onboarding newsletter (“The Unsigned Advantage”), responsive UI tested across mobile breakpoints.
- **Daily quick links** (from Notion export): production site, Stripe dashboard, customer feedback inbox, bug tracker.

## 2. Pricing & Plans

- **Free Tier**: 10 enrichments, guided onboarding content.
- **PRO (£19/month)**: Unlimited enrichment, verified contact pool, reporting dashboard, email alerts.
- **AGENCY (£79/month)**: Multi-client workspaces, white-label exports, usage analytics, agent orchestration controls.
- **Revenue Target**: 1st paying customer by end of October 2025, £500 MRR by November.

## 3. Customer Segments & Demo Flow

- **Radio Promoters (85% conversion)**: Live enrichment demos with their 5–10 contacts, emphasise organic playlist/airplay tracking.
- **Budget-conscious Artists (60% conversion)**: Highlight weekend time savings, share BBC Radio 1/Spotify case studies, use social channels.
- **PR Agencies (70% conversion)**: Position as white-label research engine; show cost savings vs. junior staff manual work.
- **Demo Sequence**: Collect sample list → perform enrichment in real time → present structured results → grant 10-enrichment trial → follow-up with outcome-based messaging.
- **Week cadence from “Current Priorities & To-Dos”**: launch case-study content Friday, outreach on Monday, follow-ups Wednesday, review Friday, with goals of ≥2 demos, ≥5 beta signups, ≥25 newsletter subscribers per week.

## 4. Architecture & Performance

- **Contact Processing**: Real-time enrichment with dual routes—exact match pool vs. external API research—to keep costs at £0.001–£0.005 per contact.
- **Agent System**: 25 specialised agents coordinating research, QA, and reporting (Radio Promo Agent workflow, multi-agent architecture, system diagrams).
- **Infrastructure**: Stripe, Warm API, email orchestration, and MCP integrations stable; API response time 6–75 ms post warm-up.
- **Quality**: 100% match accuracy within curated pool, fallback heuristics for new entries, streaming quality assurance baked in.
- **Pivot status** (Dec 2024 intelligence update): retired the unreliable Perplexity enrichment and replaced it with a curated database approach—launch with 5 verified BBC contacts, expand monthly, market as “verified music industry intelligence.”

## 5. Launch Blockers & Operational Fixes

- **Email Automation** (Critical): Renew Kit API token (credentials received; store outside git), reconnect signup forms, update price references in templates, retest onboarding flows.
- **Content Alignment**: Refresh landing page copy, align pricing messaging, complete support docs, embed expectation management.
- **User Journey QA**: Run end-to-end beta signup including payment, enrichment, newsletter onboarding, and agent-triggered updates.
- **Website copy**: Remove promises about “enrich any contact list,” replace with curated-intelligence messaging and example outputs per the PIVOT doc.

## 6. Immediate Technical Priorities

- Email automation fix, landing page optimisation, end-to-end demo rehearsal.
- User journey instrumentation (analytics + retention triggers).
- Playlist Pulse integration blueprint (shared auth, shared contact intelligence layer).
- Mobile UX refinements based on 21-issue backlog already resolved during audit.

## 7. Growth Roadmap

- **Sprint Week Focus**: Email integration → beta prep → Playlist Pulse pipeline kick-off.
- **Near Term**: Enhanced analytics, referral incentives, expectation management tooltips, automated success summaries.
- **Future**: Unified Total Audio dashboard (Audio Intel + Echo + Playlist Pulse) with shared billing and agent controls.

## 8. Success Metrics & Monitoring

- Demo cadence (≥2/week) and conversion to trials/paying accounts.
- Activation: time-to-first enrichment, newsletter engagement, dashboard usage.
- Cost efficiency: API usage vs. contact pool hits, agent uptime, error budgets.
- Customer feedback loops: satisfaction surveys, stream quality audits, churn reason taxonomy.

## 9. Supporting Assets & References

- `AUDIO_INTEL_CONTEXT.md`
- `tmp/notion-export/audio-intel-business-hq.md`
- `tmp/notion-export/technical-development.md`
- `tmp/notion-export/radio-promo-agent-day-in-the-life-workflow.md`
- `tmp/notion-export/radio-promo-agent-system-architecture.md`
- `tmp/notion-export/radio-promo-agent-multi-agent-architecture.md`

These source documents are now superseded by this playbook for high-level context; retain them for deep technical diagrams or historical backlog detail.
