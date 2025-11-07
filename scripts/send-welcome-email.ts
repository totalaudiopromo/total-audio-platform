#!/usr/bin/env ts-node
/**
 * Send Welcome Email to Beta User
 *
 * This script sends the welcome email to a beta user using Resend API
 *
 * Usage: npx ts-node scripts/send-welcome-email.ts <email>
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface WelcomeEmailData {
  name: string;
  email: string;
  password: string;
  betaExpiryDays: number;
  bandName?: string;
}

async function sendWelcomeEmail(userData: WelcomeEmailData) {
  try {
    console.log('📧 Sending welcome email to:', userData.email);

    const emailContent = {
      from: 'Chris Schofield <chris@totalaudiopromo.com>',
      to: userData.email,
      subject: '🎵 Welcome to Total Audio Promo Beta Access!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Total Audio Promo Beta</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 40px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #f6ab00; margin: 0; font-size: 28px;">
                Welcome to Total Audio Promo Beta! 🎉
              </h1>
            </div>

            <!-- Personal Greeting -->
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Hi ${userData.name.split(' ')[0]},
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              I'm Chris Schofield, founder of Total Audio Promo. I'm personally inviting you to test our three powerful music promotion tools that I've built from 15 years of experience in music PR.
            </p>

            <!-- Audio Intel Section -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f6ab00;">
              <h3 style="color: #2538c7; margin-top: 0;">🎯 Audio Intel</h3>
              <p style="font-size: 14px; margin-bottom: 10px;">
                <strong>URL:</strong> <a href="https://intel.totalaudiopromo.com" style="color: #f6ab00;">intel.totalaudiopromo.com</a>
                <span style="background: #28a745; color: white; padding: 2px 8px; border-radius: 3px; font-size: 11px; margin-left: 8px;">LIVE NOW</span>
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #555;">
                Instantly enrich music industry contacts with AI-powered insights. Get submission guidelines, contact preferences, and pitch-ready intelligence.
              </p>
              <ul style="font-size: 14px; line-height: 1.8; color: #555;">
                <li>✅ Unlimited contact enrichment during beta</li>
                <li>✅ Multi-platform search (Reddit, Instagram, Spotify, etc.)</li>
                <li>✅ CSV/Excel export functionality</li>
                <li>✅ Email validation</li>
              </ul>
            </div>

            <!-- Campaign Tracker Section -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2538c7;">
              <h3 style="color: #2538c7; margin-top: 0;">📊 Campaign Tracker</h3>
              <p style="font-size: 14px; margin-bottom: 10px;">
                <strong>URL:</strong> <a href="https://tracker.totalaudiopromo.com" style="color: #f6ab00;">tracker.totalaudiopromo.com</a>
                <span style="background: #ffc107; color: #333; padding: 2px 8px; border-radius: 3px; font-size: 11px; margin-left: 8px;">COMING SOON</span>
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #555;">
                Manage your music promotion campaigns from start to finish with real-time tracking and analytics.
              </p>
              <ul style="font-size: 14px; line-height: 1.8; color: #555;">
                <li>✅ Campaign creation & management</li>
                <li>✅ Contact tracking & outreach history</li>
                <li>✅ Real-time analytics & ROI tracking</li>
                <li>✅ Progress monitoring</li>
              </ul>
            </div>

            <!-- Pitch Generator Section -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #2538c7; margin-top: 0;">✍️ Pitch Generator</h3>
              <p style="font-size: 14px; margin-bottom: 10px;">
                <strong>URL:</strong> <a href="https://pitch.totalaudiopromo.com" style="color: #f6ab00;">pitch.totalaudiopromo.com</a>
                <span style="background: #ffc107; color: #333; padding: 2px 8px; border-radius: 3px; font-size: 11px; margin-left: 8px;">COMING SOON</span>
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #555;">
                AI-powered pitch writing with your unique voice and style. Create personalized outreach messages in seconds.
              </p>
              <ul style="font-size: 14px; line-height: 1.8; color: #555;">
                <li>✅ Unlimited pitch generation</li>
                <li>✅ Custom voice profiles</li>
                <li>✅ Template library</li>
                <li>✅ Batch pitch creation</li>
              </ul>
            </div>

            <!-- Login Credentials -->
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #856404;">
              <h3 style="color: #856404; margin-top: 0;">🔐 Login Credentials</h3>
              <p style="font-size: 14px; margin: 5px 0;"><strong>Email:</strong> ${userData.email}</p>
              <p style="font-size: 14px; margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">${userData.password}</code></p>
              <p style="font-size: 13px; color: #856404; margin-top: 15px;">
                ⚠️ <strong>Important:</strong> Please change your password immediately after first login!
              </p>
            </div>

            <!-- Beta Period -->
            <h3 style="color: #2538c7; font-size: 20px;">Your Beta Period</h3>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              You have <strong style="color: #f6ab00;">${userData.betaExpiryDays} days of full access</strong> to all features - completely free. No credit card required.
            </p>

            <!-- What We Need -->
            <h3 style="color: #2538c7; font-size: 20px;">What I Need From You</h3>
            <ol style="font-size: 15px; line-height: 1.8; color: #555;">
              <li><strong>Test on real campaigns:</strong> Use your actual ${userData.bandName || 'band'} campaigns - this is where you'll see the real value</li>
              <li><strong>Share honest feedback:</strong> What works? What doesn't? What's missing?</li>
              <li><strong>Tell me your workflow:</strong> How do these tools fit into your promotion process?</li>
            </ol>

            <!-- Getting Started -->
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #155724; margin-top: 0;">🚀 Quick Start Guide</h3>
              <ol style="font-size: 14px; line-height: 1.8; color: #155724; margin: 10px 0;">
                <li>Log in to <a href="https://intel.totalaudiopromo.com" style="color: #155724; text-decoration: underline;">Audio Intel</a> with your credentials</li>
                <li>Upload your contact list (CSV or Excel)</li>
                <li>Let the AI enrich your contacts with submission guidelines</li>
                <li>Once live: Use the Pitch Generator to create personalized outreach</li>
                <li>Once live: Track your campaigns in the Campaign Tracker</li>
              </ol>
              <p style="font-size: 13px; color: #155724; margin-top: 15px;">
                <strong>Pro Tip:</strong> Start with Audio Intel. Upload your Spotify playlist curator list and watch the magic happen. You'll get detailed submission guidelines for each curator in seconds - something that normally takes hours of manual research.
              </p>
            </div>

            <!-- Support -->
            <h3 style="color: #2538c7; font-size: 20px;">Direct Support</h3>
            <p style="font-size: 15px; line-height: 1.6; color: #555;">
              I'm here to help you get the most out of these tools:
            </p>
            <ul style="font-size: 15px; line-height: 1.8; color: #555;">
              <li>📧 Email me directly: <a href="mailto:chris@totalaudiopromo.com" style="color: #f6ab00;">chris@totalaudiopromo.com</a></li>
              <li>💬 Response time: Within 2 hours (usually faster)</li>
              <li>📞 Need a demo? Let's jump on a quick call</li>
            </ul>

            <!-- Closing -->
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 30px;">
              Looking forward to your feedback, ${userData.name.split(' ')[0]}!
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Let's revolutionize music promotion together.
            </p>

            <!-- Signature -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #f6ab00;">
              <p style="font-size: 15px; line-height: 1.4; color: #333; margin: 5px 0;">
                <strong>Chris Schofield</strong><br>
                Founder, Total Audio Promo<br>
                <span style="color: #666;">15 years in music PR | Now building the future</span>
              </p>
            </div>

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
              <p style="font-size: 12px; color: #999; line-height: 1.6;">
                Questions? Reply directly to this email or reach me at chris@totalaudiopromo.com<br>
                Your beta access expires in ${userData.betaExpiryDays} days. We'll send a reminder 7 days before it ends.
              </p>
            </div>

          </div>
        </body>
        </html>
      `
    };

    const result = await resend.emails.send(emailContent);

    console.log('✅ Welcome email sent successfully!');
    console.log('   Email ID:', result.id);
    console.log('   Recipient:', userData.email);

    return result;

  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw error;
  }
}

// If running as script
async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: npx ts-node scripts/send-welcome-email.ts <email>');
    process.exit(1);
  }

  // For Jeremy - you can customize this
  const userData: WelcomeEmailData = {
    name: 'Jeremy Garrett-Cox',
    email: email,
    password: 'Streamer2024!BetaAccess',
    betaExpiryDays: 60,
    bandName: 'Streamer'
  };

  try {
    await sendWelcomeEmail(userData);
    console.log('✅ Welcome email process complete!');
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { sendWelcomeEmail };
