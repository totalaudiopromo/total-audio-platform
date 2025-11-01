# Data for SEO MCP Integration Setup

This guide explains how to set up and use the Data for SEO MCP (Model Context Protocol) integration in your Total Audio Promo platform.

## Overview

The Data for SEO MCP integration provides comprehensive SEO analysis capabilities including:

- Domain analysis and SEO scoring
- Keyword research and analysis
- Competitor analysis
- SERP (Search Engine Results Page) analysis

## Prerequisites

1. **Data for SEO Account**: You need a Data for SEO account with API access
2. **API Credentials**: Username and password from your Data for SEO account
3. **MCP Server**: The Data for SEO MCP server is already configured in your environment

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your backend configuration:

```bash
# Data for SEO API Credentials
DATAFORSEO_USERNAME=your_username
DATAFORSEO_PASSWORD=your_password
```

### 2. Backend Configuration

The Data for SEO integration is already enabled in your backend. The following routes are available:

- `POST /api/mcp/dataforseo/analyze-domain` - Analyze a domain's SEO performance
- `POST /api/mcp/dataforseo/research-keywords` - Research keywords and their metrics
- `POST /api/mcp/dataforseo/analyze-competitors` - Analyze competitor domains
- `POST /api/mcp/dataforseo/get-serp-results` - Get SERP results for keywords
- `POST /api/mcp/dataforseo/generate-seo-report` - Generate comprehensive SEO reports

### 3. Frontend Integration

The Data for SEO integration is available in two locations:

#### Main Frontend (`projects/web-apps/frontend`)

- Navigate to `/integrations` page
- Click on "Data for SEO" integration
- Use the tabbed interface to access different SEO tools

#### Audio Intel Live (`projects/web-apps/audio-intel-live`)

- Navigate to `/seo-analysis` page
- Use the comprehensive SEO analysis tools

## Usage Guide

### Domain Analysis

1. **Purpose**: Analyze a domain's overall SEO performance
2. **Input**: Domain name (e.g., "example.com")
3. **Output**:
   - SEO score (0-100)
   - Organic keywords count
   - Organic traffic metrics
   - Domain authority
   - Issues and recommendations

**Example Request**:

```json
{
  "domain": "example.com"
}
```

### Keyword Research

1. **Purpose**: Research keywords related to a seed keyword
2. **Input**:
   - Seed keyword (required)
   - Location (optional, e.g., "US", "UK")
3. **Output**:
   - Related keywords
   - Search volume
   - Keyword difficulty
   - Cost per click (CPC)
   - Competition level

**Example Request**:

```json
{
  "seedKeyword": "music promotion",
  "location": "US"
}
```

### Competitor Analysis

1. **Purpose**: Analyze competitors of a given domain
2. **Input**: Domain name
3. **Output**:
   - Competitor domains
   - Organic keywords for each competitor
   - Organic traffic metrics
   - Backlink counts
   - Domain authority scores

**Example Request**:

```json
{
  "domain": "example.com"
}
```

### SERP Analysis

1. **Purpose**: Get search engine results for specific keywords
2. **Input**:
   - Keyword (required)
   - Location (optional)
3. **Output**:
   - Top search results
   - Position rankings
   - Page titles and URLs
   - Snippets
   - Domain information

**Example Request**:

```json
{
  "keyword": "music promotion services",
  "location": "US"
}
```

## API Response Format

All Data for SEO endpoints return responses in the following format:

```json
{
  "success": true,
  "data": {
    // Response data specific to each endpoint
  }
}
```

Or in case of errors:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Error Handling

Common error scenarios and solutions:

1. **Authentication Errors**: Check your Data for SEO credentials
2. **Rate Limiting**: Data for SEO has API rate limits - implement appropriate delays
3. **Invalid Domain**: Ensure domains are in correct format (e.g., "example.com")
4. **Network Issues**: Check your internet connection and API endpoint accessibility

## Integration with Other Services

The Data for SEO integration works seamlessly with other MCP services:

- **Perplexity AI**: Combine keyword research with AI-powered content insights
- **Aura AI**: Use SEO data to optimize content and pitches
- **Claude AI**: Generate SEO-optimized content based on keyword research

## Best Practices

1. **Rate Limiting**: Implement appropriate delays between API calls
2. **Caching**: Cache results when possible to avoid redundant API calls
3. **Error Handling**: Always handle API errors gracefully
4. **Data Validation**: Validate input data before sending to API
5. **User Feedback**: Provide clear feedback during loading states

## Troubleshooting

### MCP Server Connection Issues

If the Data for SEO MCP server fails to connect:

1. Check if the MCP server is installed:

   ```bash
   claude mcp list
   ```

2. Reinstall the MCP server if needed:

   ```bash
   claude mcp add dataforseo "npx dataforseo-mcp-server"
   ```

3. Check environment variables for API credentials

### API Response Issues

1. Verify your Data for SEO account has sufficient credits
2. Check if the requested data is available for your account tier
3. Ensure input parameters are in the correct format

## Support

For issues with the Data for SEO MCP integration:

1. Check the Data for SEO API documentation
2. Review the backend logs for detailed error messages
3. Contact the development team with specific error details

## Future Enhancements

Planned improvements for the Data for SEO integration:

1. **Batch Processing**: Support for analyzing multiple domains/keywords at once
2. **Historical Data**: Access to historical SEO performance data
3. **Custom Reports**: Generate custom SEO reports with specific metrics
4. **Automation**: Automated SEO monitoring and alerting
5. **Integration Dashboard**: Centralized dashboard for all SEO metrics

---

For more information about Data for SEO API, visit: https://dataforseo.com/
