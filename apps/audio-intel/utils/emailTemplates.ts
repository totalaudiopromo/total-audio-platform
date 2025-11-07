// Professional Email Templates for Audio Intel Beta Sequences
// Replaces basic ConvertKit templates with custom-branded HTML

export interface EmailTemplateData {
  firstName?: string;
  email?: string;
  betaDaysLeft?: number;
  pricingUrl?: string;
  unsubscribeUrl?: string;
  upgradeUrl?: string;
}

// Base email template with professional styling
const baseTemplate = (content: string, data: EmailTemplateData = {}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audio Intel</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #374151;
      background-color: #f8fafc;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      padding: 32px 24px;
      text-align: center;
    }

    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .tagline {
      color: #dbeafe;
      font-size: 14px;
      opacity: 0.9;
    }

    .content {
      padding: 32px 24px;
    }

    .greeting {
      font-size: 18px;
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 24px;
    }

    .body-text {
      font-size: 16px;
      line-height: 1.7;
      color: #4b5563;
      margin-bottom: 20px;
    }

    .highlight-box {
      background: #eff6ff;
      border: 1px solid #dbeafe;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }

    .highlight-box h3 {
      color: #1e40af;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .pricing-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .pricing-item:last-child {
      border-bottom: none;
    }

    .pricing-label {
      font-weight: 500;
      color: #374151;
    }

    .pricing-value {
      font-weight: 600;
      color: #1f2937;
    }

    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 24px 0;
      transition: transform 0.2s ease;
    }

    .cta-button:hover {
      transform: translateY(-1px);
    }

    .secondary-button {
      display: inline-block;
      border: 2px solid #3b82f6;
      color: #3b82f6 !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      text-align: center;
      margin: 12px 8px 12px 0;
    }

    .footer {
      background: #f9fafb;
      padding: 24px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
    }

    .signature {
      margin-bottom: 20px;
    }

    .signature-name {
      font-weight: 600;
      color: #1f2937;
      font-size: 16px;
    }

    .signature-title {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .signature-company {
      color: #3b82f6;
      font-weight: 500;
      font-size: 14px;
    }

    .footer-links {
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.5;
    }

    .footer-links a {
      color: #6b7280;
      text-decoration: none;
    }

    .footer-links a:hover {
      color: #3b82f6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎵 Audio Intel</div>
      <div class="tagline">Contact Intelligence for Music Industry</div>
    </div>

    <div class="content">
      ${content}
    </div>

    <div class="footer">
      <div class="signature">
        <div class="signature-name">Chris Schofield</div>
        <div class="signature-title">Founder & Producer (sadact)</div>
        <div class="signature-company">Total Audio Promo</div>
      </div>

      <div class="footer-links">
        <a href="https://intel.totalaudiopromo.com">Audio Intel</a> •
        <a href="https://totalaudiopromo.com">Total Audio Promo</a><br>
        ${data.unsubscribeUrl ? `<a href="${data.unsubscribeUrl}">Unsubscribe</a> • ` : ''}
        Built by someone who actually uses radio promotion tools daily
      </div>
    </div>
  </div>
</body>
</html>
`;

// Beta Welcome Email - Day 0
export const betaWelcomeEmail = (data: EmailTemplateData) =>
  baseTemplate(
    `
  <div class="greeting">Hi ${data.firstName || 'there'} 👋</div>

  <div class="body-text">
    Welcome to the Audio Intel beta! You now have access to the contact enrichment tool that's been helping me with my own radio promotion campaigns.
  </div>

  <div class="body-text">
    I'm Chris, the producer behind <strong>sadact</strong> and I built this because I was tired of juggling 10+ different platforms for contact research. This tool has genuinely saved me hours on every campaign.
  </div>

  <div class="highlight-box">
    <h3>🎯 Your Beta Access Includes:</h3>
    <div class="pricing-item">
      <div class="pricing-label">• Unlimited contact enrichment</div>
    </div>
    <div class="pricing-item">
      <div class="pricing-label">• AI-powered music industry intelligence</div>
    </div>
    <div class="pricing-item">
      <div class="pricing-label">• CSV export functionality</div>
    </div>
    <div class="pricing-item">
      <div class="pricing-label">• Direct feedback line to the founder</div>
    </div>
  </div>

  <div style="text-align: center;">
    <a href="https://intel.totalaudiopromo.com/upload" class="cta-button">Start Enriching Contacts →</a>
  </div>

  <div class="body-text">
    I'd love to hear how it works for your campaigns. Hit reply if you run into anything or just want to chat about radio promotion!
  </div>
`,
    data
  );

// Beta End Warning - Day 10
export const betaEndingEmail = (data: EmailTemplateData) =>
  baseTemplate(
    `
  <div class="greeting">Hi ${data.firstName || 'there'},</div>

  <div class="body-text">
    Hope Audio Intel has been useful for your contact research! The beta testing period ends in <strong>${
      data.betaDaysLeft || 4
    } days</strong>.
  </div>

  <div class="body-text">
    As a thank you for testing and providing feedback, beta participants get <strong>50% off forever</strong> on any paid plan.
  </div>

  <div class="highlight-box">
    <h3>🎉 Your Forever Discount:</h3>
    <div class="pricing-item">
      <div class="pricing-label">Professional Plan</div>
      <div class="pricing-value">£9.99/month <span style="text-decoration: line-through; color: #9ca3af;">£19.99</span></div>
    </div>
    <div class="pricing-item">
      <div class="pricing-label">Agency Plan</div>
      <div class="pricing-value">£19.99/month <span style="text-decoration: line-through; color: #9ca3af;">£39.99</span></div>
    </div>
  </div>

  <div style="text-align: center;">
    <a href="${
      data.pricingUrl || 'https://intel.totalaudiopromo.com/pricing'
    }" class="cta-button">Claim Your 50% Discount →</a>
    <br>
    <a href="https://intel.totalaudiopromo.com/upload" class="secondary-button">Continue Using Beta</a>
  </div>

  <div class="body-text">
    This discount is my way of saying thanks for helping shape Audio Intel into what it is today.
  </div>
`,
    data
  );

// Final Beta Email - Day 14
export const betaFinalEmail = (data: EmailTemplateData) =>
  baseTemplate(
    `
  <div class="greeting">Hi ${data.firstName || 'there'},</div>

  <div class="body-text">
    The Audio Intel beta testing period ends today. Thank you for taking the time to test the platform and provide feedback - it's been invaluable.
  </div>

  <div class="body-text">
    Whether you used it extensively or just explored the features, your participation helped shape what Audio Intel became.
  </div>

  <div class="highlight-box">
    <h3>🚀 Audio Intel launches publicly tomorrow with standard pricing:</h3>
    <div class="pricing-item">
      <div class="pricing-label">Professional</div>
      <div class="pricing-value">£19.99/month</div>
    </div>
    <div class="pricing-item">
      <div class="pricing-label">Agency</div>
      <div class="pricing-value">£39.99/month</div>
    </div>
    <div class="pricing-item">
      <div class="pricing-label">Enterprise</div>
      <div class="pricing-value">Custom pricing</div>
    </div>
  </div>

  <div class="body-text">
    <strong>Beta participants still get 50% off forever</strong> if you'd like to continue using the platform.
  </div>

  <div style="text-align: center;">
    <a href="${
      data.upgradeUrl || 'https://intel.totalaudiopromo.com/pricing'
    }" class="cta-button">Get 50% Off Forever →</a>
  </div>

  <div class="body-text">
    Thanks again for being part of the journey. Here's to more successful radio campaigns! 🎵
  </div>
`,
    data
  );

// Export all templates
export const emailTemplates = {
  betaWelcome: betaWelcomeEmail,
  betaEnding: betaEndingEmail,
  betaFinal: betaFinalEmail,
};

// Utility function to send custom HTML emails via your notify API
export async function sendCustomEmail(
  to: string,
  subject: string,
  template: (data: EmailTemplateData) => string,
  data: EmailTemplateData = {}
) {
  const html = template({ ...data, email: to });

  const response = await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html }),
  });

  return response.json();
}

// Export email templates
export const generateContactExportEmail = (data: any) => {
  return baseTemplate(
    `
    <div class="content">
      <h1>Your Contact Export is Ready</h1>
      <p>Hi ${data.firstName || 'there'},</p>
      <p>Your enriched contact data has been processed and is ready for download.</p>
      
      <div class="cta">
        <a href="${data.downloadUrl || '#'}" class="button">
          Download Your Data
        </a>
      </div>
      
      <p class="footer-text">
        This link will expire in 7 days.
      </p>
    </div>
  `,
    data
  );
};

export const generateAnalyticsExportEmail = (data: any) => {
  return baseTemplate(
    `
    <div class="content">
      <h1>Your Analytics Report is Ready</h1>
      <p>Hi ${data.firstName || 'there'},</p>
      <p>Your analytics report has been generated and is ready for download.</p>
      
      <div class="cta">
        <a href="${data.downloadUrl || '#'}" class="button">
          Download Report
        </a>
      </div>
      
      <p class="footer-text">
        This link will expire in 7 days.
      </p>
    </div>
  `,
    data
  );
};

export const generateSearchResultsEmail = (data: any) => {
  return baseTemplate(
    `
    <div class="content">
      <h1>Your Search Results are Ready</h1>
      <p>Hi ${data.firstName || 'there'},</p>
      <p>Your search results have been processed and are ready for download.</p>
      
      <div class="cta">
        <a href="${data.downloadUrl || '#'}" class="button">
          Download Results
        </a>
      </div>
      
      <p class="footer-text">
        This link will expire in 7 days.
      </p>
    </div>
  `,
    data
  );
};

export const generateAIAgentReportEmail = (data: any) => {
  return baseTemplate(
    `
    <div class="content">
      <h1>Your AI Agent Report is Ready</h1>
      <p>Hi ${data.firstName || 'there'},</p>
      <p>Your AI agent report has been generated and is ready for download.</p>
      
      <div class="cta">
        <a href="${data.downloadUrl || '#'}" class="button">
          Download Report
        </a>
      </div>
      
      <p class="footer-text">
        This link will expire in 7 days.
      </p>
    </div>
  `,
    data
  );
};
