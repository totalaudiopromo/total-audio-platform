#  Emerging Projects Portfolio

_Reference summary for initiatives developing alongside the core Audio Intel product._

---

## Radio Promo Agent System

**Snapshot**

- **Goal**: Automate Liberty Music PR workflows end-to-end using six specialised agents coordinated by a master orchestrator.
- **Architecture**: `intelligence`, `project`, `email`, `radio`, `analytics`, and `coverage` agents running parallel tasks, with fallback logic and incremental deployment plan.
- **Current Playbooks**: Day-in-the-life automation reduces campaign setup time from ~6 hours to <1 hour and increases capacity from 5–8 to 25–30 campaigns/month.

**Current Status**

- Phase 1–2 agents (transcript intelligence, project creation, Mailchimp automation, radio submissions, Warmusic tracking) designed with concrete prompts and workflow examples.
- Campaign performance benchmarks documented (e.g. Sarah Indie Pop case: 12 stations, £600 revenue from £150 starter budget).
- Liberty tooling integration (Monday.com, Mailchimp, Warmusic, CoverageBook) mapped with authentication guides and troubleshooting scripts under `tools/agents/radio-promo/`.

**Next Steps**

1. Ship MVP with Intelligence + Email + Analytics agents to validate 80% time savings.
2. Connect Coverage agent to PDF report generation pipeline; test with latest Liberty campaign assets.
3. Formalise monitoring dashboards (Warmusic + Airtable) and expose metrics inside Command Centre.

**Key Metrics**

- Target launch efficiency: 40-minute setup, 5–6 hours active work/week.
- Revenue uplift: £8k–£12k/month projected at full utilisation (vs £2k–£4k baseline).
- Agent uptime/error rate once deployed (goal <2% automation failures per campaign).

**Source references**

- `tmp/notion-export/radio-promo-agent-complete-system-master.md`
- `tmp/notion-export/radio-promo-agent-multi-agent-architecture.md`
- `docs/consolidated/AGENT_AND_WORKFLOW_OPERATIONS.md`
- `tools/agents/radio-promo/` deployment guides and scripts

---

## Investment AI Project – “DIV”

**Concept Overview**

- **Vision**: WhatsApp-based personal investment partner blending Warren Buffett value-investing discipline with Felix Dennis entrepreneurial pragmatism.
- **Audience**: UK professionals seeking hands-on, tax-efficient wealth building without financial jargon.
- **Working Name**: “DIV” (Dividend Intelligence Virtual advisor).

**Planned Capabilities**

- Portfolio health checks via WhatsApp (voice + text) with human-like coaching tone.
- ISA/SIPP optimisation prompts, CGT allowance tracking, and monthly dividend planning.
- Third-party integrations: Plaid (Open Banking), HMRC Making Tax Digital APIs, London Stock Exchange fundamentals, Morningstar data feeds.
- Core engine: rules-based guardrails atop an LLM, with Buffett-style checklists (economic moat, margin of safety) and Felix Dennis inspired cashflow triggers.

**Current Status**

- Discovery completed; personas, tone, and regulatory guardrails drafted during founder planning sessions (Sept 2025).
- Technical spike identified: Twilio WhatsApp webhook + serverless Node worker feeding a decision layer before LLM response.
- Compliance review checklist drafted (FCA guidance, advice vs. guidance boundaries) pending legal consult.

**Next Steps**

1. Build proof-of-concept WhatsApp bot that ingests a sample ISA portfolio (sandbox data) and returns allocation recommendations.
2. Validate user appetite via 10-interview discovery sprint with UK dividend investors.
3. Engage compliance advisor to scope “guidance” positioning and required disclaimers.

**Key Metrics (target state)**

- 70% user retention after 90 days of weekly check-ins.
- Net dividend yield improvement ≥1.5% for beta cohort within six months.
- FCA-compliant messaging audit score ≥90% (internal checklist).

**Source references**

- Founder strategy notes & chat directives (Sept 2025 planning sessions).
- Technical stack experiments under `scripts/` prototypes (to be created).

---

## Brand Evolution Initiatives

**Strategic Direction**

- Transition the umbrella identity from “Total Audio Promo” toward the shorter `totalaud.io` to reflect a broader audio intelligence suite beyond promotion.
- Expand positioning from music PR to end-to-end audio workflow support (promotion, analytics, content, voice tooling).

**Workstreams**

- **Messaging**: Update landing copy, social bios, and nurture sequences to emphasise “audio intelligence” vs pure “promo.”
- **Visual Identity**: Align palette and typography with Command Centre textures and product-specific accent colours (see `docs/consolidated/CONTENT_AND_BRAND_BLUEPRINT.md`).
- **Domain Strategy**: Secure `totalaud.io`, map subdomains (`intel.totalaud.io`, `command.totalaud.io`), plan redirects from existing `totalaudiopromo.com` properties.
- **Technical Considerations**: Certificate management, SEO migration plan, analytics tagging updates, and shared component library refresh.

**Current Status**

- Palette and messaging scaffolding defined in the brand blueprint; hero copy and nurture flows awaiting update post-email automation fix.
- Domain evaluation in progress (costs, availability, DNS mapping). No production cutover yet.

**Next Steps**

1. Draft migration checklist (DNS, SSL, analytics, paid media) before domain purchase.
2. Prototype new logo wordmark options reflecting “totalaud.io” naming.
3. Soft-launch new messaging in newsletter + LinkedIn to gauge resonance before full rebrand.

**Source references**

- `docs/consolidated/CONTENT_AND_BRAND_BLUEPRINT.md`
- Founder rebrand discussions (Sept 2025 chat notes).

---

## Validation & Growth Experiments

**Active Experiments**

- Reddit engagement plan (r/WeAreTheMusicMakers, r/IndieMusicFeedback) with case study threads and AMA style posts.
- Weekly outreach cadence (Mon outreach, Wed follow-up, Fri review) tied to demo targets and newsletter growth.
- Beta signup funnels combining social proof, case studies, and ConvertKit newsletter automation.

**Discovery Methods**

- Subreddit testing using value-first posts + CTA to beta waitlist, monitoring comments and upvote ratios.
- Structured feedback loops via ConvertKit tags and Notion meeting notes for prospect interviews.
- Market research: Liberty campaign feedback CSV analysis, Warmusic performance trend reviews.

**Current Status**

- Case-study content ready for deployment; Reddit posts queued as part of “Current Priorities & To-Dos” board.
- Newsletter (“The Unsigned Advantage”) automation pending Kit API credential rollout.
- Demo goal: ≥2 per week with tracking in `WEEKLY_FOCUS.md`.

**Next Steps**

1. Launch Reddit case study thread and log engagement metrics (comments, signups sourced from UTMs).
2. Run 10 beta interviews focusing on message-market fit for radio promoters.
3. Establish experiment log in `docs/consolidated/BUSINESS_STRATEGY_OVERVIEW.md` appendix (to capture outcomes).

**Key Metrics**

- Weekly demo calls, beta signups, newsletter subscriber growth (+25/month target).
- Reddit post engagement (target 10+ meaningful interactions per thread).
- Feedback loop closure rate (follow-ups sent within 24 hours of responses).

**Source references**

- `tmp/notion-export/current-priorities-to-dos.md`
- `docs/consolidated/BUSINESS_STRATEGY_OVERVIEW.md`
- Liberty feedback CSVs under `~/Downloads`

---

## Technical Prototyping & Sandbox Projects

**Scope**

- Music tech demos (Playlist Pulse, Voice Echo, Content Domination) maintained as experimental workspaces within the monorepo.
- Integration experiments (Warm API, Google OAuth, MCP servers) housed under `tools/agents/`.
- Workflow optimisation scripts (Notion workspace manager, Claude agent consolidators) for internal productivity.

**Highlights**

- `apps/voice-echo/` – voice content automation prototypes with NextAuth and audio export tooling.
- `apps/playlist-pulse/` – campaign tracker MVP (Next.js) targeting future launch after email automation stabilises.
- `tools/agents/radio-promo/mcp-servers/` – custom MCP servers enabling Claude Desktop integration with Google services and Warm API.
- `scripts/utilities/notion-workspace-manager.js` – consolidated Notion cleanup utility (audit, organise, database creation modes).

**Current Status**

- All experimental apps follow the shared conventions defined in `docs/archive/context/development-standards.md` (folder structure, deployment flow).
- MCP and OAuth troubleshooting scripts in active use while scaling agent automation.
- Technical debt backlog captured in consolidated product playbook for prioritisation.

**Next Steps**

1. Resume Playlist Pulse API integration after Audio Intel onboarding is live.
2. Package MCP servers with clearer READMEs so Claude sub-agents can be spun up quickly.
3. Document sandbox results in a shared changelog to inform future product decisions.

**Metrics to Watch**

- Prototype deployment frequency (goal: monthly sandbox release).
- Automation coverage (% of Liberty workflow handled by scripts/agents).
- Time saved per development task post-tool consolidation.

**Source references**

- `docs/archive/context/development-standards.md`
- `docs/consolidated/AUDIO_INTEL_PRODUCT_PLAYBOOK.md`
- `tools/agents/` and `apps/*` experimental directories

---

_Last updated: 26 September 2025._
