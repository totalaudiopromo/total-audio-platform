# Browser Automation Priority

## Configuration Summary

**Primary Tool**: Stagehand (browser CLI skill)
**Installation**: Installed in `tools/browser-automation/`
**Global Command**: `browser` (via npm link)
**API Key**: Configured in `.env` file

## Why Stagehand is Primary

Stagehand is set as the PRIMARY web automation tool because:

1. **Natural language interface** - More intuitive than CSS selectors
2. **AI-powered element detection** - Finds buttons, forms, links intelligently
3. **Better context efficiency** - Less token usage than Puppeteer
4. **Automatic screenshots** - Visual feedback after every action
5. **Persistent browser** - State maintained between commands

## Fallback to Puppeteer MCP

Puppeteer MCP (`mcp__puppeteer__*` tools) remains available as fallback for:

- Low-level DOM manipulation
- Debugging Puppeteer-specific issues
- API key failures

## Usage

```bash
# Navigate
browser navigate <url>

# Interact (natural language)
browser act "click the Sign In button"
browser act "fill in email with test@example.com"

# Extract data
browser extract "get all product prices" '{"prices": "number"}'

# Discover elements
browser observe "find all form fields"

# Screenshot
browser screenshot

# Clean up
browser close
```

## Updated: November 2025
