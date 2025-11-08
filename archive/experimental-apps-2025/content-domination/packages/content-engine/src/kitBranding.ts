/**
 * Audio Intel - Kit.com Branding & Template Configuration
 * Applies Audio Intel brand guidelines to all email templates
 */

interface BrandConfig {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  logo_url: string;
  company_name: string;
  website_url: string;
  social_links: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  contact_info: {
    email: string;
    phone?: string;
    address: string;
  };
}

interface EmailTemplate {
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'trial' | 'conversion' | 'winback' | 'nurture';
  variables: string[];
}

class AudioIntelBranding {
  private brandConfig: BrandConfig;

  constructor() {
    this.brandConfig = {
      primary_color: '#2538c7', // Audio Intel Blue
      secondary_color: '#f6ab00', // Audio Intel Yellow
      accent_color: '#1e2a8a', // Darker blue for highlights
      font_family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      logo_url: 'https://intel.totalaudiopromo.com/logo-white.png',
      company_name: 'Audio Intel',
      website_url: 'https://intel.totalaudiopromo.com',
      social_links: {
        twitter: 'https://twitter.com/audiointel',
        linkedin: 'https://linkedin.com/company/audio-intel',
        instagram: 'https://instagram.com/audiointel',
      },
      contact_info: {
        email: 'hello@intel.totalaudiopromo.com',
        phone: '+44 20 7946 0958',
        address: 'United Kingdom',
      },
    };
  }

  // Generate branded email template
  generateBrandedTemplate(
    templateType: 'welcome' | 'trial' | 'conversion' | 'winback' | 'nurture',
    content: {
      subject: string;
      preheader?: string;
      headline: string;
      body: string;
      cta_text: string;
      cta_url: string;
      secondary_cta_text?: string;
      secondary_cta_url?: string;
    }
  ): string {
    const baseTemplate = this.getBaseTemplate();

    return baseTemplate
      .replace('{{SUBJECT}}', content.subject)
      .replace('{{PREHEADER}}', content.preheader || '')
      .replace('{{HEADLINE}}', content.headline)
      .replace('{{BODY_CONTENT}}', content.body)
      .replace('{{CTA_TEXT}}', content.cta_text)
      .replace('{{CTA_URL}}', content.cta_url)
      .replace('{{SECONDARY_CTA_TEXT}}', content.secondary_cta_text || '')
      .replace('{{SECONDARY_CTA_URL}}', content.secondary_cta_url || '')
      .replace('{{TEMPLATE_TYPE}}', templateType);
  }

  // Base branded HTML template
  private getBaseTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>{{SUBJECT}} - ${this.brandConfig.company_name}</title>
    
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        
        /* Base styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-family: ${this.brandConfig.font_family};
            line-height: 1.6;
            color: #333333;
            background-color: #f8f9fa;
        }
        
        /* Typography */
        h1, h2, h3, h4 {
            font-weight: 700;
            line-height: 1.3;
            margin: 0 0 20px 0;
        }
        
        h1 { font-size: 28px; color: #ffffff; }
        h2 { font-size: 24px; color: ${this.brandConfig.primary_color}; }
        h3 { font-size: 20px; color: #333333; }
        
        p { 
            margin: 0 0 16px 0; 
            font-size: 16px; 
            line-height: 1.6; 
        }
        
        /* Button styles */
        .btn {
            display: inline-block;
            padding: 18px 35px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s ease;
            margin: 10px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, ${this.brandConfig.primary_color}, ${
      this.brandConfig.accent_color
    });
            color: #ffffff;
            box-shadow: 0 4px 15px rgba(37, 56, 199, 0.3);
        }
        
        .btn-secondary {
            background: #ffffff;
            color: ${this.brandConfig.primary_color};
            border: 2px solid ${this.brandConfig.primary_color};
        }
        
        .btn:hover { transform: translateY(-2px); }
        
        /* Layout styles */
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, ${this.brandConfig.primary_color} 0%, ${
      this.brandConfig.secondary_color
    } 100%);
            padding: 40px 30px;
            text-align: center;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        /* Component styles */
        .highlight-box {
            background: #f0f8ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid ${this.brandConfig.primary_color};
            margin: 20px 0;
        }
        
        .yellow-box {
            background: #fff8e1;
            padding: 25px;
            border-radius: 8px;
            border: 2px solid ${this.brandConfig.secondary_color};
            margin: 30px 0;
        }
        
        .feature-list {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            text-decoration: none;
            color: ${this.brandConfig.primary_color};
        }
        
        /* Mobile responsive */
        @media only screen and (max-width: 480px) {
            .container { margin: 0 10px; }
            .header, .content, .footer { padding: 20px !important; }
            h1 { font-size: 24px !important; }
            .btn { 
                display: block !important;
                width: 100% !important; 
                margin: 10px 0 !important;
            }
        }
    </style>
</head>
<body>
    <!-- Preheader text -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        {{PREHEADER}}
    </div>
    
    <!-- Email container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="padding: 20px 0;">
                <div class="container">
                    
                    <!-- Header -->
                    <div class="header">
                        <img src="${this.brandConfig.logo_url}" 
                             alt="${this.brandConfig.company_name}" 
                             style="height: 50px; margin-bottom: 20px;">
                        <h1>{{HEADLINE}}</h1>
                        <p style="color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 600; margin: 0;">
                            Your music industry advantage, {{first_name}}
                        </p>
                    </div>
                    
                    <!-- Main content -->
                    <div class="content">
                        {{BODY_CONTENT}}
                        
                        <!-- Call to action buttons -->
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="{{CTA_URL}}" class="btn btn-primary">
                                {{CTA_TEXT}}
                            </a>
                            {{#if SECONDARY_CTA_TEXT}}
                            <br>
                            <a href="{{SECONDARY_CTA_URL}}" class="btn btn-secondary">
                                {{SECONDARY_CTA_TEXT}}
                            </a>
                            {{/if}}
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="footer">
                        <!-- Quick links -->
                        <div style="margin-bottom: 20px;">
                            <a href="${this.brandConfig.website_url}/help" 
                               style="color: ${
                                 this.brandConfig.primary_color
                               }; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 600;">
                                Help Centre
                            </a>
                            <a href="${this.brandConfig.website_url}/case-studies" 
                               style="color: ${
                                 this.brandConfig.primary_color
                               }; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 600;">
                                Success Stories
                            </a>
                            <a href="${this.brandConfig.website_url}/features" 
                               style="color: ${
                                 this.brandConfig.primary_color
                               }; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 600;">
                                Features
                            </a>
                        </div>
                        
                        <!-- Social links -->
                        <div class="social-links" style="margin: 20px 0;">
                            ${Object.entries(this.brandConfig.social_links)
                              .map(
                                ([platform, url]) => `
                                <a href="${url}" target="_blank">
                                    ${this.getSocialIcon(platform)}
                                </a>
                            `
                              )
                              .join('')}
                        </div>
                        
                        <!-- Company info -->
                        <p style="margin: 0 0 10px; color: #666; font-size: 13px;">
                            ${
                              this.brandConfig.company_name
                            } - AI-Powered Music Industry Intelligence<br>
                            Specialising in UK Music Professional Contact Enrichment
                        </p>
                        
                        <!-- GDPR compliance -->
                        <p style="margin: 0; color: #888; font-size: 11px; line-height: 1.4;">
                            You're receiving this email because you signed up for ${
                              this.brandConfig.company_name
                            } updates.<br>
                            <a href="${
                              this.brandConfig.website_url
                            }/email-preferences?email={{email}}" 
                               style="color: #666; text-decoration: underline;">
                                Manage preferences
                            </a> | 
                            <a href="${this.brandConfig.website_url}/unsubscribe?email={{email}}" 
                               style="color: #666; text-decoration: underline;">
                                Unsubscribe
                            </a> | 
                            <a href="${this.brandConfig.website_url}/privacy" 
                               style="color: #666; text-decoration: underline;">
                                Privacy Policy
                            </a><br><br>
                            ${this.brandConfig.contact_info.address}
                        </p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
    
    <!-- Tracking pixel -->
    <img src="${
      this.brandConfig.website_url
    }/email-tracking/pixel.gif?campaign={{utm_campaign}}&email_id={{email_id}}&subscriber={{subscriber_id}}" 
         alt="" style="width: 1px; height: 1px; opacity: 0;">
         
</body>
</html>`;
  }

  // Get social media icons
  private getSocialIcon(platform: string): string {
    const icons = {
      twitter: '𝕏',
      linkedin: '💼',
      instagram: '📷',
      youtube: '📺',
    };
    return icons[platform as keyof typeof icons] || '🔗';
  }

  // Generate complete email templates for Audio Intel sequences
  generateEmailTemplates(): EmailTemplate[] {
    const templates: EmailTemplate[] = [];

    // Welcome email template
    templates.push({
      name: 'Welcome & Quick Start',
      subject: 'Welcome to Audio Intel Enterprise - Your music industry advantage starts now',
      type: 'welcome',
      variables: ['first_name', 'company_name', 'trial_end_date'],
      content: this.generateBrandedTemplate('welcome', {
        subject: 'Welcome to Audio Intel Enterprise',
        preheader: 'Your 14-day Enterprise trial is ready - get quick wins in 10 minutes',
        headline: 'Welcome to Audio Intel Enterprise',
        body: `
          <div class="highlight-box">
              <p style="margin: 0; font-size: 16px; color: ${this.brandConfig.primary_color}; font-weight: 600;">
                  🎉 Congratulations {{first_name}}! You've just unlocked the UK music industry's most powerful contact intelligence platform.
              </p>
          </div>
          
          <p>As a {{company_name}} team member, you now have access to <strong>2,500 contact enrichments per month</strong> and our complete Enterprise feature set for the next 14 days.</p>
          
          <div class="yellow-box">
              <h3 style="color: #333; font-size: 20px; font-weight: 800; margin: 0 0 20px; display: flex; align-items: center;">
                  ⚡ Get Quick Wins in the Next 10 Minutes:
              </h3>
              
              <div style="margin-bottom: 15px;">
                  <strong style="color: ${this.brandConfig.primary_color};">1. Set Up Your Multi-Client Dashboard</strong><br>
                  <span style="color: #666; font-size: 14px;">Perfect for agencies managing 10+ artists</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                  <strong style="color: ${this.brandConfig.primary_color};">2. Upload Your First Contact List</strong><br>
                  <span style="color: #666; font-size: 14px;">See instant enrichment results</span>
              </div>
              
              <div>
                  <strong style="color: ${this.brandConfig.primary_color};">3. Try White-Label Export</strong><br>
                  <span style="color: #666; font-size: 14px;">Impress your clients with branded reports</span>
              </div>
          </div>
          
          <div class="feature-list">
              <h3>What makes Audio Intel different?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #555;">
                  <li style="margin-bottom: 8px;"><strong>Music Industry Specialisation:</strong> Built specifically for UK music professionals</li>
                  <li style="margin-bottom: 8px;"><strong>Superior ROI:</strong> Save £274/month vs using multiple tools</li>
                  <li style="margin-bottom: 8px;"><strong>Multi-Client Management:</strong> Perfect for PR agencies</li>
                  <li style="margin-bottom: 8px;"><strong>GDPR Compliant:</strong> Fully compliant for UK market</li>
              </ul>
          </div>
          
          <p style="text-align: center; font-style: italic; color: #666; margin: 30px 0;">
              "Audio Intel has transformed how we manage contacts for our 20+ artists. The ROI is incredible."<br>
              <small style="color: #888;">— Sarah Johnson, Founder, London Music PR</small>
          </p>
        `,
        cta_text: 'Set Up Multi-Client Dashboard',
        cta_url: `${this.brandConfig.website_url}/dashboard/setup?utm_source=email&utm_campaign=enterprise_trial_nurture&utm_content=day_0_welcome`,
        secondary_cta_text: 'Book Success Manager Call',
        secondary_cta_url: 'https://calendly.com/audiointel-success/enterprise-onboarding',
      }),
    });

    // Conversion email template
    templates.push({
      name: 'Final Trial Conversion',
      subject: 'Last chance - Keep your Audio Intel advantage',
      type: 'conversion',
      variables: ['first_name', 'trial_end_date', 'enrichments_used'],
      content: this.generateBrandedTemplate('conversion', {
        subject: 'Keep Your Audio Intel Advantage',
        preheader: 'Your trial ends tomorrow - continue your music industry advantage',
        headline: "Don't Lose Your Competitive Edge",
        body: `
          <div class="highlight-box">
              <p style="margin: 0; font-size: 18px; color: ${this.brandConfig.primary_color}; font-weight: 600;">
                  ⏰ {{first_name}}, your Audio Intel Enterprise trial ends in less than 24 hours.
              </p>
          </div>
          
          <p>Over the past 14 days, you've used <strong>{{enrichments_used}} contact enrichments</strong> and experienced the power of specialized music industry intelligence.</p>
          
          <div class="yellow-box">
              <h3 style="margin: 0 0 15px;">Here's what you'll lose tomorrow:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                  <li>2,500 monthly contact enrichments</li>
                  <li>Multi-client dashboard management</li>
                  <li>White-label exports for your clients</li>
                  <li>Priority customer support</li>
                  <li>Advanced analytics and reporting</li>
              </ul>
          </div>
          
          <p>Join 200+ UK music agencies who've made Audio Intel their competitive advantage. At just £150/month, you'll save £274 compared to using multiple tools.</p>
          
          <div style="background: linear-gradient(135deg, #e8f4fd, #fff); padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0; text-align: center; font-size: 18px; color: ${this.brandConfig.primary_color}; font-weight: 600;">
                  🎵 Continue with Enterprise for £150/month
              </p>
          </div>
        `,
        cta_text: 'Continue with Enterprise',
        cta_url: `${this.brandConfig.website_url}/subscribe/enterprise?utm_source=email&utm_campaign=trial_conversion`,
        secondary_cta_text: 'Speak to Success Manager',
        secondary_cta_url: 'https://calendly.com/audiointel-success/trial-conversion',
      }),
    });

    // Winback email template
    templates.push({
      name: 'Winback - We Miss You',
      subject: 'We miss you - Special offer inside (50% off)',
      type: 'winback',
      variables: ['first_name'],
      content: this.generateBrandedTemplate('winback', {
        subject: 'We Miss You at Audio Intel',
        preheader: 'Come back with 50% off your first 3 months',
        headline: 'We Miss You',
        body: `
          <p>Hi {{first_name}},</p>
          
          <p>We noticed you haven't been using Audio Intel lately, and frankly, we miss having you as part of our community of music industry professionals.</p>
          
          <div class="yellow-box">
              <h3 style="text-align: center; color: ${this.brandConfig.primary_color};">
                  🎁 Special Welcome Back Offer
              </h3>
              <p style="text-align: center; font-size: 18px; margin: 0;">
                  <strong>50% off your first 3 months</strong><br>
                  <small style="color: #666;">Just £75/month instead of £150</small>
              </p>
          </div>
          
          <p>Since you left, we've added:</p>
          <ul>
              <li><strong>AI-powered contact scoring</strong> - Know which contacts are most likely to respond</li>
              <li><strong>Automated follow-up sequences</strong> - Never miss a follow-up again</li>
              <li><strong>Enhanced UK music database</strong> - 40% more contacts added</li>
              <li><strong>Advanced analytics dashboard</strong> - Track your ROI in real-time</li>
          </ul>
          
          <div class="highlight-box">
              <p style="margin: 0; font-size: 16px; color: ${this.brandConfig.primary_color};">
                  💌 This offer expires in 7 days and won't be repeated.
              </p>
          </div>
          
          <p>Ready to give us another try?</p>
        `,
        cta_text: 'Claim 50% Off (7 Days Only)',
        cta_url: `${this.brandConfig.website_url}/winback/50-percent-off?utm_source=email&utm_campaign=winback_sequence`,
        secondary_cta_text: 'Tell Us What Went Wrong',
        secondary_cta_url: `${this.brandConfig.website_url}/feedback/winback`,
      }),
    });

    return templates;
  }

  // Apply branding to Kit.com account
  getBrandingConfig() {
    return {
      account_settings: {
        company_name: this.brandConfig.company_name,
        from_name: this.brandConfig.company_name,
        from_email: this.brandConfig.contact_info.email,
        reply_to_email: this.brandConfig.contact_info.email,
        website_url: this.brandConfig.website_url,
        address: this.brandConfig.contact_info.address,
        timezone: 'Europe/London',
      },
      email_settings: {
        primary_color: this.brandConfig.primary_color,
        secondary_color: this.brandConfig.secondary_color,
        font_family: this.brandConfig.font_family,
        logo_url: this.brandConfig.logo_url,
      },
      templates: this.generateEmailTemplates(),
      compliance: {
        gdpr_enabled: true,
        double_optin_required: true,
        unsubscribe_link_required: true,
        privacy_policy_url: `${this.brandConfig.website_url}/privacy`,
        terms_url: `${this.brandConfig.website_url}/terms`,
      },
    };
  }
}

export default AudioIntelBranding;
export type { BrandConfig, EmailTemplate };
