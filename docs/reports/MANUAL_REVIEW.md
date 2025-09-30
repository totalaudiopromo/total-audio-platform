# Manual Review – Outstanding Items

## 1. Notion Access & Re-Export Required
- `https://www.notion.so/a6062ff781624533bc91ebcd1435481c?v=e770e8d5ecf64580a885c282dc04b852` (database) – needs database export logic or manual copy (CSV in Downloads covers current snapshot).
- `https://www.notion.so/AI-Audience-Accelerator-TAP-2520a35b21ed81308060ecae12abf032` (local Markdown copy in `~/Downloads`).
- `https://www.notion.so/Content-Domination-System-2530a35b21ed81b5920fc7e2fa679b2d` (local Markdown copy in `~/Downloads`).
- `https://www.notion.so/AUDIO-INTEL-PIVOT-CURATED-INTELLIGENCE-DATABASE-2590a35b21ed81898ae0c63257a1c7d4` (local Markdown copy in `~/Downloads`).
- `https://www.notion.so/REVENUE-BUSINESS-OPERATIONS-2660a35b21ed812e9406ca29e4d3b78f` (local Markdown copy in `~/Downloads`).
- `https://www.notion.so/AUDIO-INTEL-PRODUCT-2660a35b21ed81b88be8c93f227cdc50` (local Markdown copy in `~/Downloads`).

_Reason_: Remaining items still return 404/unauthorised responses when hitting the API; we have the download exports for reference but should re-share the live pages so future automated pulls succeed.

## 2. Unsupported Block Types
- Several Notion exports contain `<!-- unhandled table -->` and nested child-page placeholders (e.g., Total Audio strategy, Technical Development). Decide whether to recreate tables manually or capture screenshots.

## 3. Superseded File Labelling
- Add banner text to legacy Markdown files (`docs/archive/BUSINESS_CONTEXT.md`, `AUDIO_INTEL_CONTEXT.md`, etc.) confirming their superseded status when next edited.

## 4. Email Automation Fix Validation
- Kit client credentials supplied (ID `kit.5wx6QPvhunue-d760yZHIg`, secret received 26 Sept). Store them outside the repo (e.g. `.env`) and verify the onboarding flow end-to-end once the updated token is in place; update the Content blueprint with any changes.
- Cross-check the welcome series copy against the new curated-intelligence positioning before sending the first campaign.

## 5. Colour Palette Implementation
- Brand guidelines include CSS snippets; ensure the design system in production (`apps/web`, `apps/audio-intel`) references the updated tokens before deleting old palettes.

## 6. Playlist Pulse Planning
- The consolidated product playbook references Playlist Pulse pipeline at a high level. Detailed technical plans (wireframes, backlog) live in Notion child pages not fully exported—recreate or migrate when access available.

Tick items off here as they are resolved.
