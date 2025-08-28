interface EmailTemplateData {
  userName?: string;
  contactsCount?: number;
  analyticsData?: any;
  agentData?: any;
  exportType?: 'contacts' | 'analytics' | 'search-results' | 'ai-agent-report';
  downloadUrl?: string;
  customMessage?: string;
  whiteLabel?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
}

export function generateContactExportEmail(data: EmailTemplateData): string {
  const { userName, contactsCount, downloadUrl, customMessage, whiteLabel } = data;
  const companyName = whiteLabel?.companyName || 'Audio Intel';
  const primaryColor = whiteLabel?.primaryColor || '#1E88E5';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Enriched Contacts Are Ready</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, ${primaryColor}, #1565C0); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: ${primaryColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .stats { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${primaryColor}; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 Your Enriched Contacts Are Ready</h1>
            <p>Professional contact intelligence delivered to your inbox</p>
        </div>
        
        <div class="content">
            <p>Hi ${userName || 'there'},</p>
            
            <p>Great news! Your contact enrichment is complete and ready for download.</p>
            
            <div class="stats">
                <h3>📊 Export Summary</h3>
                <p><strong>Contacts Processed:</strong> ${contactsCount?.toLocaleString() || 'N/A'}</p>
                <p><strong>Export Type:</strong> Enriched Contact Intelligence</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${customMessage ? `<p><em>${customMessage}</em></p>` : ''}
            
            <p>Your enriched contacts include:</p>
            <ul>
                <li>🎯 Professional contact intelligence</li>
                <li>📧 Verified email addresses</li>
                <li>🎵 Music industry context</li>
                <li>📊 Research confidence scores</li>
                <li>⏰ Last research timestamps</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${downloadUrl || '#'}" class="button">📥 Download Your Contacts</a>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
                <li>Download your enriched contacts</li>
                <li>Import into your CRM or email system</li>
                <li>Start your targeted outreach campaigns</li>
                <li>Track your results and optimize</li>
            </ol>
            
            <p>Need help with your outreach strategy? Our team is here to support your music promotion success.</p>
        </div>
        
        <div class="footer">
            <p>Powered by ${companyName} | Professional Music Industry Intelligence</p>
            <p>Questions? Reply to this email or contact our support team.</p>
        </div>
    </div>
</body>
</html>
  `;
}

export function generateAnalyticsExportEmail(data: EmailTemplateData): string {
  const { userName, analyticsData, downloadUrl, customMessage, whiteLabel } = data;
  const companyName = whiteLabel?.companyName || 'Audio Intel';
  const primaryColor = whiteLabel?.primaryColor || '#1E88E5';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Analytics Report Is Ready</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, ${primaryColor}, #1565C0); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: ${primaryColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .stats { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${primaryColor}; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Your Analytics Report Is Ready</h1>
            <p>Comprehensive insights into your contact intelligence performance</p>
        </div>
        
        <div class="content">
            <p>Hi ${userName || 'there'},</p>
            
            <p>Your comprehensive analytics report is ready for review.</p>
            
            <div class="stats">
                <h3>📈 Key Performance Metrics</h3>
                <p><strong>Total Contacts:</strong> ${analyticsData?.totalContacts?.toLocaleString() || 'N/A'}</p>
                <p><strong>Success Rate:</strong> ${analyticsData?.successRate?.toFixed(1) || 'N/A'}%</p>
                <p><strong>Average Confidence:</strong> ${analyticsData?.averageConfidence?.toFixed(1) || 'N/A'}%</p>
                <p><strong>Processing Time:</strong> ${analyticsData?.performanceMetrics?.averageProcessingTime?.toFixed(2) || 'N/A'}s</p>
            </div>
            
            ${customMessage ? `<p><em>${customMessage}</em></p>` : ''}
            
            <p>Your report includes:</p>
            <ul>
                <li>📊 Performance metrics and trends</li>
                <li>🎵 Platform breakdown analysis</li>
                <li>📈 Daily activity charts</li>
                <li>🎯 Success rate optimization insights</li>
                <li>⚡ System performance data</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${downloadUrl || '#'}" class="button">📥 Download Analytics Report</a>
            </div>
            
            <p><strong>Use This Report To:</strong></p>
            <ol>
                <li>Track your enrichment performance</li>
                <li>Identify top-performing platforms</li>
                <li>Optimize your outreach strategy</li>
                <li>Plan future campaigns</li>
            </ol>
            
            <p>Ready to optimize your music promotion strategy? Let's turn these insights into results.</p>
        </div>
        
        <div class="footer">
            <p>Powered by ${companyName} | Data-Driven Music Promotion</p>
            <p>Questions? Reply to this email or contact our support team.</p>
        </div>
    </div>
</body>
</html>
  `;
}

export function generateSearchResultsEmail(data: EmailTemplateData): string {
  const { userName, contactsCount, downloadUrl, customMessage, whiteLabel } = data;
  const companyName = whiteLabel?.companyName || 'Audio Intel';
  const primaryColor = whiteLabel?.primaryColor || '#1E88E5';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Search Results Are Ready</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, ${primaryColor}, #1565C0); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: ${primaryColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .stats { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${primaryColor}; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Your Search Results Are Ready</h1>
            <p>Curated music industry contacts based on your criteria</p>
        </div>
        
        <div class="content">
            <p>Hi ${userName || 'there'},</p>
            
            <p>Your targeted search for music industry contacts is complete!</p>
            
            <div class="stats">
                <h3>📋 Search Summary</h3>
                <p><strong>Results Found:</strong> ${contactsCount?.toLocaleString() || 'N/A'}</p>
                <p><strong>Search Type:</strong> Music Industry Contacts</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${customMessage ? `<p><em>${customMessage}</em></p>` : ''}
            
            <p>Your search results include:</p>
            <ul>
                <li>🎵 Curated music industry contacts</li>
                <li>📧 Verified contact information</li>
                <li>🎯 Targeted platform matching</li>
                <li>📊 Relevance scoring</li>
                <li>🔍 Detailed contact intelligence</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${downloadUrl || '#'}" class="button">📥 Download Search Results</a>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
                <li>Review your search results</li>
                <li>Filter by relevance or platform</li>
                <li>Export to your preferred format</li>
                <li>Start your outreach campaign</li>
            </ol>
            
            <p>Need help refining your search criteria? We're here to help you find the perfect contacts.</p>
        </div>
        
        <div class="footer">
            <p>Powered by ${companyName} | Smart Music Industry Discovery</p>
            <p>Questions? Reply to this email or contact our support team.</p>
        </div>
    </div>
</body>
</html>
  `;
}

export function generateAIAgentReportEmail(data: EmailTemplateData): string {
  const { userName, agentData, downloadUrl, customMessage, whiteLabel } = data;
  const companyName = whiteLabel?.companyName || 'Audio Intel';
  const primaryColor = whiteLabel?.primaryColor || '#1E88E5';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your AI Agent Strategic Report Is Ready</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, ${primaryColor}, #1565C0); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: ${primaryColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .stats { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${primaryColor}; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .agent-info { background: #f0f8ff; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ff6b35; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 Your AI Agent Strategic Report Is Ready</h1>
            <p>Expert music industry insights and actionable recommendations</p>
        </div>
        
        <div class="content">
            <p>Hi ${userName || 'there'},</p>
            
            <p>Your AI-powered strategic analysis is complete and ready for review!</p>
            
            <div class="agent-info">
                <h3>🤖 AI Agent Analysis</h3>
                <p><strong>Agent Type:</strong> ${agentData?.agentType?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'N/A'}</p>
                <p><strong>Query:</strong> "${agentData?.query || 'N/A'}"</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${customMessage ? `<p><em>${customMessage}</em></p>` : ''}
            
            <p>Your strategic report includes:</p>
            <ul>
                <li>🧠 AI-powered industry analysis</li>
                <li>🎯 Strategic recommendations</li>
                <li>📋 Actionable next steps</li>
                <li>📊 Data-driven insights</li>
                <li>🎵 Music industry expertise</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="${downloadUrl || '#'}" class="button">📥 Download Strategic Report</a>
            </div>
            
            <p><strong>Key Highlights:</strong></p>
            <ul>
                <li>📈 Strategic growth opportunities</li>
                <li>🎵 Industry-specific insights</li>
                <li>📊 Performance optimization tips</li>
                <li>🎯 Targeted action plans</li>
            </ul>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
                <li>Review your strategic report</li>
                <li>Implement key recommendations</li>
                <li>Track progress and results</li>
                <li>Schedule follow-up analysis</li>
            </ol>
            
            <p>Ready to transform your music career with AI-powered insights? Let's turn these recommendations into results.</p>
        </div>
        
        <div class="footer">
            <p>Powered by ${companyName} | AI-Powered Music Industry Intelligence</p>
            <p>Questions? Reply to this email or contact our support team.</p>
        </div>
    </div>
</body>
</html>
  `;
} 