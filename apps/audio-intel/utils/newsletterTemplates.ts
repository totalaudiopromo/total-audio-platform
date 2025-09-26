// The Unsigned Advantage Newsletter Templates
// Professional newsletter system for independent music industry professionals

export interface NewsletterData {
  firstName?: string;
  email?: string;
  issueNumber?: number;
  publishDate?: string;
  unsubscribeUrl?: string;
  articles?: NewsletterArticle[];
  featuredTool?: string;
  industryInsight?: string;
  successStory?: string;
  newsArticles?: any[];
}

export interface NewsletterArticle {
  title: string;
  excerpt: string;
  url?: string;
  category: 'industry' | 'tool' | 'success' | 'ai' | 'tech';
  readTime?: string;
}

// Base newsletter template with professional styling
const newsletterTemplate = (content: string, data: NewsletterData = {}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Unsigned Advantage - Issue ${data.issueNumber || 1}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #1f2937;
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
      background: #ffffff;
      padding: 32px 24px;
      text-align: center;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
    }

    .newsletter-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #1f2937;
    }

    .newsletter-subtitle {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 16px;
    }

    .issue-info {
      font-size: 14px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
      padding-top: 16px;
    }

    .content {
      padding: 32px 24px;
    }

    .greeting {
      font-size: 16px;
      font-weight: 400;
      color: #1f2937;
      margin-bottom: 32px;
    }

    .section {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
      margin-top: 32px;
    }

    .story-section {
      margin-bottom: 24px;
    }

    .story-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
    }

    .story-content {
      font-size: 15px;
      line-height: 1.7;
      color: #374151;
      margin-bottom: 16px;
    }

    .news-item {
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .news-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .news-excerpt {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 12px;
      line-height: 1.5;
    }

    .news-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .news-source {
      color: #9ca3af;
      font-weight: 500;
    }

    .news-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }

    .news-link:hover {
      text-decoration: underline;
    }

    .article {
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }

    .article-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .article-excerpt {
      color: #6b7280;
      margin-bottom: 12px;
    }

    .article-meta {
      font-size: 12px;
      color: #9ca3af;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-badge {
      background: #3b82f6;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .insight-box {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1px solid #3b82f6;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }

    .insight-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 8px;
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
      margin: 16px 0;
      transition: transform 0.2s ease;
    }

    .cta-button:hover {
      transform: translateY(-1px);
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

    .social-links {
      margin: 16px 0;
    }

    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: #6b7280;
      text-decoration: none;
    }

    .social-links a:hover {
      color: #3b82f6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="newsletter-title">The Unsigned Advantage</div>
      <div class="newsletter-subtitle">Weekly insights for independent music professionals</div>
      <div class="issue-info">
        Issue ${data.issueNumber || 1} • ${data.publishDate || new Date().toLocaleDateString('en-GB', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
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

      <div class="social-links">
        <a href="https://twitter.com/totalaudiopromo">Twitter</a> •
        <a href="https://linkedin.com/company/total-audio-promo">LinkedIn</a> •
        <a href="https://totalaudiopromo.com">Website</a>
      </div>

      <div class="footer-links">
        <a href="https://intel.totalaudiopromo.com">Audio Intel</a> •
        <a href="https://totalaudiopromo.com">Total Audio Promo</a><br>
        ${data.unsubscribeUrl ? `<a href="${data.unsubscribeUrl}">Unsubscribe</a> • ` : ''}
        Built by someone who actually uses these tools daily
      </div>
    </div>
  </div>
</body>
</html>
`;

// Weekly newsletter template
export const weeklyNewsletter = (data: NewsletterData) => newsletterTemplate(`
  <div class="greeting">Hi ${data.firstName || 'there'},</div>

  <div class="story-section">
    <div class="story-title">This week's industry insight</div>
    <div class="story-content">${data.industryInsight || 'After analysing 500+ indie artist campaigns, I discovered something that shocked me: 94% of research time is spent on outdated information. Only 6% of contacts actually work, meaning artists waste 15+ hours weekly on fruitless research. The solution? AI-powered contact enrichment that transforms basic email lists into detailed industry intelligence in 2 minutes.'}</div>
  </div>

  ${data.newsArticles && data.newsArticles.length > 0 ? `
  <div class="story-section">
    <div class="story-title">What's happening in music this week</div>
    <div class="story-content">
      <p>Here's what caught my attention from the underground music scene and industry news this week:</p>
    </div>
    ${data.newsArticles.slice(0, 3).map(article => `
      <div class="news-item">
        <div class="news-title">${article.title}</div>
        <div class="news-excerpt">${article.excerpt || article.description}</div>
        <div class="news-meta">
          <span class="news-source">${article.source}</span>
          ${article.url ? `<a href="${article.url}" target="_blank" class="news-link">Read more →</a>` : ''}
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="story-section">
    <div class="story-title">Featured tool</div>
    <div class="story-content">
      <p>${data.featuredTool || 'Audio Intel - Contact Intelligence'}</p>
      <p>Stop wasting your weekends researching radio contacts. Audio Intel automates contact enrichment, giving you 94% accurate intelligence in 2 minutes.</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="https://intel.totalaudiopromo.com" target="_blank" class="cta-button">Try Audio Intel Free →</a>
      </div>
    </div>
  </div>

  <div class="story-section">
    <div class="story-title">What I'm working on</div>
    <div class="story-content">
      <p>${data.successStory || 'I\'m currently testing a new approach to radio promotion that combines AI-powered contact research with personalised outreach. Early results show 40% higher response rates compared to generic emails, and I\'m spending 80% less time on research. I\'ll share the full results once I\'ve got more data.'}</p>
      <p><em>Building tools that actually work for independent artists - not just talking about it.</em></p>
    </div>
  </div>

  <div class="story-section">
    <div class="story-title">Quick tip</div>
    <div class="story-content">
      <p><strong>Stop sending generic emails.</strong> Use Audio Intel to research each contact's recent activity, then reference specific playlists or articles in your pitch. Response rates increase by 300% with personalised outreach.</p>
    </div>
  </div>

  <div class="story-section">
    <div class="story-title">Community spotlight</div>
    <div class="story-content">
      <p>This week's community question: <strong>"What's your biggest challenge in music promotion?"</strong></p>
      <p>Reply to this email with your answer - I'll feature the best responses in next week's issue!</p>
    </div>
  </div>

  <div class="story-content">Keep creating,<br>Chris</div>
`, data);

// Welcome email for new newsletter subscribers
export const newsletterWelcome = (data: NewsletterData) => newsletterTemplate(`
  <div class="greeting">Welcome to The Unsigned Advantage! 👋</div>

  <div class="section">
    <div class="section-title">What You'll Get Every Week</div>
    <p>Every Friday, you'll receive:</p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li><strong>Industry insights</strong> from someone who actually works in music promotion</li>
      <li><strong>Tool recommendations</strong> that actually work for indie artists</li>
      <li><strong>Success stories</strong> from fellow independent musicians</li>
      <li><strong>Quick tips</strong> to save you time and money</li>
      <li><strong>Community spotlights</strong> featuring your questions and experiences</li>
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Why I Started This Newsletter</div>
    <p>After 5+ years in music PR, I realised that most tools and advice are designed for major labels, not independent artists working with £50 budgets.</p>
    <p>I built Audio Intel because I needed it myself, and I'm sharing everything I learn along the way.</p>
  </div>

  <div class="section">
    <div class="section-title">Your First Issue</div>
    <p>Check your inbox tomorrow for your first issue of The Unsigned Advantage. I'll be sharing insights about the hidden costs of manual contact research and how AI is changing the game for indie artists.</p>
  </div>

  <div style="text-align: center;">
    <a href="https://intel.totalaudiopromo.com" class="cta-button">Try Audio Intel Free →</a>
  </div>

  <div class="section">
    <div class="section-title">Got Questions?</div>
    <p>Hit reply to this email anytime. I read every response and often feature community questions in future issues.</p>
  </div>
`, data);

// Export all templates
export const newsletterTemplates = {
  weekly: weeklyNewsletter,
  welcome: newsletterWelcome
};

// Utility function to send newsletter emails
export async function sendNewsletterEmail(
  to: string,
  subject: string,
  template: (data: NewsletterData) => string,
  data: NewsletterData = {}
) {
  const html = template({ ...data, email: to });

  const response = await fetch('/api/newsletter/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html })
  });

  return response.json();
}
