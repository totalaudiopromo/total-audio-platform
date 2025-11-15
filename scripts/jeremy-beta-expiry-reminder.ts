#!/usr/bin/env ts-node

/**
 * Beta Expiry Reminder Script
 *
 * Sends email reminder when Jeremy's beta period is ending.
 * Can be run manually or scheduled via cron.
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const JEREMY_EMAIL = 'info@streamer.co.uk';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'chris@totalaudiopromo.com';

const REMINDER_DAYS = [30, 14, 7, 3, 1]; // Days before expiry to send reminders

function generateExpiryEmailHtml(daysRemaining: number, periodEnd: Date) {
  const isExpired = daysRemaining <= 0;
  const urgencyColor = daysRemaining <= 7 ? '#dc2626' : '#f59e0b';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beta Period ${isExpired ? 'Expired' : 'Ending Soon'}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">
      ${isExpired ? '⏰ Beta Period Expired' : '⏰ Beta Period Ending Soon'}
    </h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi Jeremy,</p>
    
    ${
      isExpired
        ? `
    <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
      <h2 style="margin-top: 0; color: #dc2626;">🚨 Your Beta Period Has Expired</h2>
      <p style="margin: 0;">Your beta access ended on ${periodEnd.toLocaleDateString()}.</p>
    </div>
    `
        : `
    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${urgencyColor};">
      <h2 style="margin-top: 0; color: ${urgencyColor};">Beta Period Ending Soon</h2>
      <p style="margin: 0; font-size: 18px; font-weight: 600;">
        ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining
      </p>
      <p style="margin: 10px 0 0 0; color: #6b7280;">
        Your beta access ends on ${periodEnd.toLocaleDateString()}
      </p>
    </div>
    `
    }

    <h2 style="color: #333; margin-top: 30px;">What Happens Next?</h2>
    
    <p>Your beta access includes:</p>
    <ul style="color: #555;">
      <li>Full access to Audio Intel features</li>
      <li>500 free enrichments</li>
      <li>All premium features unlocked</li>
    </ul>

    <p style="margin-top: 20px;">
      <strong>To continue using Audio Intel after beta:</strong>
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <h3 style="margin-top: 0; color: #3b82f6;">Beta Tester Discount</h3>
      <p style="margin: 0;">
        As a beta tester, you get <strong>50% off</strong> for your first year:
      </p>
      <p style="margin: 10px 0; font-size: 24px; font-weight: 600; color: #3b82f6;">
        £9.99/month (normally £19.99/month)
      </p>
      <a href="https://intel.totalaudiopromo.com/pricing" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 10px;">
        Upgrade Now →
      </a>
    </div>

    <p style="margin-top: 30px;">
      Questions? Just reply to this email - I personally respond to every message.
    </p>

    <p style="margin-top: 20px;">
      Cheers,<br>
      <strong>Chris</strong><br>
      Founder, Total Audio Promo
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
      Total Audio Promo | Music Industry Tools Platform<br>
      This is an automated reminder about your beta access.
    </p>
  </div>
</body>
</html>
  `.trim();
}

async function checkAndSendReminder() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Load Supabase credentials
    dotenv.config({ path: '.env.local' });
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      dotenv.config({ path: path.join(__dirname, '../apps/audio-intel/.env.local') });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL) {
      throw new Error('Supabase URL not found');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY || '');

    console.log('🔔 Checking beta expiry status...\n');

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', JEREMY_EMAIL)
      .single();

    if (userError || !user) {
      console.log('⚠️  User not found in Supabase');
      return;
    }

    // Calculate beta period from created_at (60 days)
    const createdAt = new Date(user.created_at);
    const periodEnd = new Date(createdAt);
    periodEnd.setDate(periodEnd.getDate() + 60); // 60-day beta period

    const now = new Date();
    const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    console.log(`Beta Period End: ${periodEnd.toISOString().split('T')[0]}`);
    console.log(`Days Remaining: ${daysRemaining}`);

    // Check if we should send a reminder
    const shouldRemind = REMINDER_DAYS.includes(daysRemaining) || daysRemaining <= 0;

    if (!shouldRemind) {
      console.log(
        `\n✅ No reminder needed (next reminder at ${Math.min(...REMINDER_DAYS.filter(d => d > daysRemaining))} days)`
      );
      await prisma.$disconnect();
      return;
    }

    console.log(`\n📧 Sending expiry reminder email...`);

    const { data, error } = await resend.emails.send({
      from: 'Total Audio Promo <noreply@totalaudiopromo.com>',
      to: JEREMY_EMAIL,
      cc: ADMIN_EMAIL,
      subject:
        daysRemaining <= 0
          ? '⏰ Your Audio Intel Beta Period Has Expired'
          : `⏰ Audio Intel Beta Ending Soon - ${daysRemaining} Days Left`,
      html: generateExpiryEmailHtml(daysRemaining, periodEnd),
    });

    if (error) {
      throw error;
    }

    console.log('✅ Reminder email sent!');
    console.log(`   Email ID: ${data?.id}`);
    console.log(`   Recipient: ${JEREMY_EMAIL}`);
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

if (require.main === module) {
  checkAndSendReminder()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Failed:', error);
      process.exit(1);
    });
}

export { checkAndSendReminder };
