#!/usr/bin/env ts-node

/**
 * Welcome Email Script
 *
 * Sends welcome email to beta users using Resend API
 * Updated for VoiceGuard™ branding and full app suite (Intel, Pitch, Tracker)
 */

import { Resend } from 'resend';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

const BETA_USER_EMAIL = process.argv[2] || 'info@streamer.co.uk';

const APP_URLS = {
  'Audio Intel': 'https://intel.totalaudiopromo.com',
  'Campaign Tracker': 'https://tracker.totalaudiopromo.com',
  'Pitch Generator': 'https://pitch.totalaudiopromo.com',
};

function generateWelcomeEmailHtml(email: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Total Audio Promo Beta</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <!-- Header with Postcraft design -->
  <div style="background: #3AA9BE; padding: 30px; text-align: center; border: 4px solid #000; box-shadow: 8px 8px 0px 0px rgba(0,0,0,1); margin-bottom: 0;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; text-shadow: 4px 4px 0px rgba(0,0,0,0.3);">🎵 Welcome to Total Audio Promo!</h1>
  </div>

  <div style="background: white; padding: 30px; border: 4px solid #000; border-top: none; box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);">
    <p style="font-size: 16px; margin-bottom: 20px;">Right, so...</p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      You've been granted <strong>beta access</strong> to the Total Audio Promo platform!
      We've built this after 5+ years doing radio promotion — these are the tools we actually use.
    </p>

    <div style="background: #fef3c7; padding: 20px; margin: 20px 0; border: 3px solid #000; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);">
      <h2 style="margin-top: 0; color: #000; font-weight: 900;">🔐 Your Login Details</h2>
      <p style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
      <p style="margin-bottom: 10px;"><strong>Password:</strong> Streamer2024!BetaAccess</p>
      <p style="color: #dc2626; font-size: 14px; margin-top: 15px; font-weight: 600;">
        ⚠️ <strong>Important:</strong> Please change your password on first login for security.
      </p>
    </div>

    <h2 style="color: #000; margin-top: 30px; font-weight: 900;">🚀 Your Complete Toolkit</h2>

    <div style="margin: 20px 0;">
      <!-- Audio Intel -->
      <div style="background: #e0f2f1; padding: 15px; margin-bottom: 15px; border: 3px solid #000; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);">
        <h3 style="margin: 0 0 10px 0; color: #000; font-weight: 900;">✅ Audio Intel</h3>
        <p style="margin: 0 0 10px 0; color: #1f2937; font-weight: 600;">15 hours → 15 minutes contact research</p>
        <p style="margin: 0 0 15px 0; color: #4b5563; font-size: 14px;">Claude-powered enrichment • 100% success rate • BBC/Spotify contacts</p>
        <a href="${APP_URLS['Audio Intel']}" style="display: inline-block; background: #3AA9BE; color: white; padding: 10px 20px; text-decoration: none; font-weight: 900; border: 3px solid #000; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); transition: transform 0.2s;">
          Launch Audio Intel →
        </a>
      </div>

      <!-- Pitch Generator -->
      <div style="background: #fef3c7; padding: 15px; margin-bottom: 15px; border: 3px solid #000; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);">
        <h3 style="margin: 0 0 10px 0; color: #000; font-weight: 900;">✅ Pitch Generator</h3>
        <p style="margin: 0 0 10px 0; color: #1f2937; font-weight: 600;">VoiceGuard™ powered personalised pitches</p>
        <p style="margin: 0 0 15px 0; color: #4b5563; font-size: 14px;">UK spelling enforcement • Corporate speak detection • Bulk generation</p>
        <a href="${APP_URLS['Pitch Generator']}" style="display: inline-block; background: #F59E0B; color: white; padding: 10px 20px; text-decoration: none; font-weight: 900; border: 3px solid #000; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); transition: transform 0.2s;">
          Launch Pitch Generator →
        </a>
      </div>

      <!-- Campaign Tracker -->
      <div style="background: #dcfce7; padding: 15px; margin-bottom: 15px; border: 3px solid #000; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);">
        <h3 style="margin: 0 0 10px 0; color: #000; font-weight: 900;">✅ Campaign Tracker</h3>
        <p style="margin: 0 0 10px 0; color: #1f2937; font-weight: 600;">CRM-style campaign management</p>
        <p style="margin: 0 0 15px 0; color: #4b5563; font-size: 14px;">Response tracking • Follow-up automation • Gmail/Airtable sync</p>
        <a href="${APP_URLS['Campaign Tracker']}" style="display: inline-block; background: #14B8A6; color: white; padding: 10px 20px; text-decoration: none; font-weight: 900; border: 3px solid #000; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); transition: transform 0.2s;">
          Launch Campaign Tracker →
        </a>
      </div>
    </div>

    <div style="background: #e0f2f1; padding: 20px; margin: 20px 0; border: 3px solid #000; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);">
      <h3 style="margin-top: 0; color: #000; font-weight: 900;">📋 Beta Access Details</h3>
      <ul style="margin: 0; padding-left: 20px; color: #1f2937; font-weight: 600;">
        <li><strong>Duration:</strong> 60 days</li>
        <li><strong>Cost:</strong> £0/month (free beta)</li>
        <li><strong>Single Sign-On:</strong> Your credentials work across all 3 apps</li>
        <li><strong>Role:</strong> ARTIST</li>
      </ul>
    </div>

    <p style="font-size: 16px; margin-top: 30px;">
      We'd love to hear your feedback! If you have any questions, issues, or suggestions,
      just reply to this email or reach out directly.
    </p>

    <p style="font-size: 16px; margin-top: 20px;">
      Happy promoting! 🎶<br>
      <strong>The Total Audio Promo Team</strong>
    </p>

    <hr style="border: none; border-top: 3px solid #000; margin: 30px 0;">

    <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0; font-weight: 600;">
      Total Audio Promo | UK Music Industry Tools<br>
      Built by radio promoters, for radio promoters
    </p>
  </div>
</body>
</html>
  `.trim();
}

async function sendWelcomeEmail() {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    console.log(`📧 Sending welcome email to ${BETA_USER_EMAIL}...\n`);

    const { data, error } = await resend.emails.send({
      from: 'Total Audio Promo <noreply@totalaudiopromo.com>',
      to: BETA_USER_EMAIL,
      subject: '🎵 Welcome to Total Audio Promo Beta Access!',
      html: generateWelcomeEmailHtml(BETA_USER_EMAIL),
    });

    if (error) {
      throw error;
    }

    console.log('✅ Welcome email sent successfully!');
    console.log(`   Email ID: ${data?.id}`);
    console.log(`   Recipient: ${BETA_USER_EMAIL}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  sendWelcomeEmail()
    .then(() => {
      console.log('\n🎉 Email sent!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Failed to send email:', error);
      process.exit(1);
    });
}

export { sendWelcomeEmail, generateWelcomeEmailHtml };
