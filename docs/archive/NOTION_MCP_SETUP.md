Notion MCP Setup (Context Continuity)

Goal: Give your coding assistants fast, consistent access to your Notion context (Master TO‑DO, Technical Development, Audio Intel Master Reference, Content & Brand).

1. Create a Notion integration

- Go to Notion → Settings → Integrations → Create new integration
- Copy the internal integration token (NOTION_API_KEY)
- Share each critical page with the integration (top‑right Share → Invite the integration)
  - MASTER TO-DO LIST - SEPTEMBER 2025
  - TECHNICAL DEVELOPMENT
  - Audio Intel Master Reference
  - CONTENT & BRAND

2. Configure the local MCP server

- Option A: Use an existing Notion MCP server (recommended)
  - Install the official/community Notion MCP server (per their README)
  - Set env vars: NOTION_API_KEY, plus page/database IDs as needed
- Option B: Minimal health check (in this repo)
  - Create `.env` with NOTION_API_KEY in the server project
  - Verify connectivity by listing a known page or database

3. Wire into Claude Desktop / Claude Code

- Open Claude settings → Model Context Protocol (MCP) servers
- Add a server entry, for example:
  - Name: notion
  - Command: node
  - Args: ["/absolute/path/to/notion-mcp-server.js"]
  - Env: NOTION_API_KEY=...
- Restart Claude Desktop; you should see the Notion tool available

4. Best practices

- Keep NOTION_API_KEY in an `.env` file, never commit it
- Use page IDs for the pages listed above and save them in your MCP config
- Start with read-only operations; add write actions only when needed

5. Quick verification

- Ask Claude: “List tasks from MASTER TO-DO LIST - SEPTEMBER 2025”
- Ask Claude: “Summarize the latest decisions from Technical Development”

If you want, I can drop a ready-made MCP config stub and a small Node-based probe script to validate access using NOTION_API_KEY.
