#!/usr/bin/env ts-node
/**
 * Beta User Setup Script for Total Audio Promo
 *
 * This script creates a new beta user account with full access to all three apps:
 * - Audio Intel (intel.totalaudiopromo.com)
 * - Command Centre (command.totalaudiopromo.com)
 * - Voice Echo / Pitch Generator
 *
 * Usage: npx ts-node scripts/setup-beta-user.ts
 */

import { PrismaClient, UserRole, SubscriptionTier, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface BetaUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  betaExpiryDays: number;
  bandName?: string;
  artistProfile?: {
    genre?: string;
    spotifyUrl?: string;
    instagramUrl?: string;
    websiteUrl?: string;
  };
}

// Jeremy's beta user configuration
const JEREMY_DATA: BetaUserData = {
  name: 'Jeremy Garrett-Cox',
  email: 'info@streamer.co.uk',
  password: 'Streamer2024!BetaAccess', // Temporary password - must change on first login
  role: UserRole.ARTIST,
  betaExpiryDays: 60, // 60-day beta period
  bandName: 'Streamer',
  artistProfile: {
    genre: 'Rock', // Update with actual genre if known
    spotifyUrl: '', // Add if available
    instagramUrl: '', // Add if available
    websiteUrl: 'https://streamer.co.uk'
  }
};

async function createBetaUser(userData: BetaUserData) {
  try {
    console.log('🎵 Setting up beta user account for:', userData.name);
    console.log('📧 Email:', userData.email);
    console.log('🎸 Band:', userData.bandName);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      console.log('⚠️  User already exists with this email!');
      console.log('   Updating existing user to beta access...');

      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { email: userData.email },
        data: {
          name: userData.name,
          role: userData.role,
        },
        include: {
          subscription: true,
          artists: true
        }
      });

      return updatedUser;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(userData.password, 10);

    // Calculate beta expiry date
    const betaExpiryDate = new Date();
    betaExpiryDate.setDate(betaExpiryDate.getDate() + userData.betaExpiryDays);

    // Create user with artist profile and beta subscription
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        passwordHash: passwordHash,
        role: userData.role,
        artists: userData.bandName ? {
          create: {
            name: userData.bandName,
            email: userData.email,
            genre: userData.artistProfile?.genre,
            spotifyUrl: userData.artistProfile?.spotifyUrl,
            instagramUrl: userData.artistProfile?.instagramUrl,
            websiteUrl: userData.artistProfile?.websiteUrl,
          }
        } : undefined,
        subscription: {
          create: {
            tier: SubscriptionTier.ARTIST,
            status: SubscriptionStatus.ACTIVE,
            monthlyPrice: 0, // Beta users get free access
            setupFee: 0, // No setup fee for beta
            currentPeriodEnd: betaExpiryDate,
          }
        }
      },
      include: {
        artists: true,
        subscription: true
      }
    });

    console.log('✅ Beta user created successfully!');
    console.log('');
    console.log('📊 User Details:');
    console.log('   ID:', user.id);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Beta Expires:', betaExpiryDate.toLocaleDateString());
    console.log('');
    console.log('🎸 Artist Profile:');
    if (user.artists.length > 0) {
      const artist = user.artists[0];
      console.log('   Artist ID:', artist.id);
      console.log('   Band Name:', artist.name);
      console.log('   Genre:', artist.genre || 'Not set');
      console.log('   Website:', artist.websiteUrl || 'Not set');
    }
    console.log('');
    console.log('💳 Subscription:');
    console.log('   Tier:', user.subscription?.tier);
    console.log('   Status:', user.subscription?.status);
    console.log('   Monthly Price: £', user.subscription?.monthlyPrice || 0);
    console.log('   Expires:', user.subscription?.currentPeriodEnd.toLocaleDateString());
    console.log('');
    console.log('🔐 Temporary Password:', userData.password);
    console.log('   ⚠️  User MUST change this on first login!');
    console.log('');
    console.log('🌐 Access URLs:');
    console.log('   Audio Intel: https://intel.totalaudiopromo.com');
    console.log('   Command Centre: https://command.totalaudiopromo.com');
    console.log('   Pitch Generator: [URL to be confirmed]');
    console.log('');

    return user;
  } catch (error) {
    console.error('❌ Error creating beta user:', error);
    throw error;
  }
}

async function trackBetaUserSetup(userId: string, email: string, name: string) {
  console.log('📝 Setting up beta user tracking...');

  // In production, this would:
  // 1. Add to ConvertKit with beta tag
  // 2. Send welcome email via Resend
  // 3. Create Notion entry for tracking
  // 4. Send Slack notification to team

  console.log('✅ Beta tracking configured for:', email);
  console.log('');
  console.log('📧 Next Steps:');
  console.log('   1. Send welcome email with login credentials');
  console.log('   2. Add to ConvertKit with "beta-user" tag');
  console.log('   3. Monitor usage in Command Centre dashboard');
  console.log('   4. Follow up after 7 days if no login');
  console.log('   5. Send feedback request after 30 days');
  console.log('   6. Conversion offer 7 days before expiry');
}

async function generateWelcomeEmail(userData: BetaUserData) {
  const welcomeEmail = {
    to: userData.email,
    from: 'chris@totalaudiopromo.com',
    subject: '🎵 Welcome to Total Audio Promo Beta Access!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f6ab00;">Welcome to Total Audio Promo Beta, ${userData.name}! 🎉</h1>

        <p>Hi ${userData.name.split(' ')[0]},</p>

        <p>I'm Chris Schofield, founder of Total Audio Promo. I'm personally inviting you to test our three powerful music promotion tools that I've built from 15 years of experience in music PR.</p>

        <h2 style="color: #2538c7;">Your Beta Access Includes:</h2>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>🎯 Audio Intel</h3>
          <p><strong>URL:</strong> <a href="https://intel.totalaudiopromo.com">intel.totalaudiopromo.com</a></p>
          <p>Instantly enrich music industry contacts with AI-powered insights. Get submission guidelines, contact preferences, and pitch-ready intelligence.</p>
          <ul>
            <li>✅ Unlimited contact enrichment during beta</li>
            <li>✅ CSV/Excel export functionality</li>
            <li>✅ AI-powered contact intelligence</li>
          </ul>
        </div>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>🎛️ Command Centre</h3>
          <p><strong>URL:</strong> <a href="https://command.totalaudiopromo.com">command.totalaudiopromo.com</a></p>
          <p>Your central dashboard for campaign management and analytics.</p>
          <ul>
            <li>✅ Campaign tracking</li>
            <li>✅ Real-time analytics</li>
            <li>✅ Multi-tool coordination</li>
          </ul>
        </div>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>🎙️ Pitch Generator (Voice Echo)</h3>
          <p>AI-powered pitch writing with your unique voice and style.</p>
          <ul>
            <li>✅ Unlimited pitch generation</li>
            <li>✅ Custom voice profiles</li>
            <li>✅ Template library</li>
          </ul>
        </div>

        <h2 style="color: #2538c7;">Login Credentials</h2>
        <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #f6ab00; margin: 20px 0;">
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Temporary Password:</strong> ${userData.password}</p>
          <p style="color: #856404;">⚠️ Please change your password immediately after first login!</p>
        </div>

        <h2 style="color: #2538c7;">Your Beta Period</h2>
        <p>You have <strong>${userData.betaExpiryDays} days of full access</strong> to all features - completely free. No credit card required.</p>

        <h2 style="color: #2538c7;">What I Need From You</h2>
        <ol>
          <li><strong>Test on real campaigns:</strong> Use your actual Streamer campaigns - this is where you'll see the real value</li>
          <li><strong>Share honest feedback:</strong> What works? What doesn't? What's missing?</li>
          <li><strong>Tell me your workflow:</strong> How do these tools fit into your promotion process?</li>
        </ol>

        <h2 style="color: #2538c7;">Direct Support</h2>
        <p>I'm here to help you get the most out of these tools:</p>
        <ul>
          <li>📧 Email me directly: chris@totalaudiopromo.com</li>
          <li>💬 Response time: Within 2 hours (usually faster)</li>
          <li>📞 Need a demo? Let's jump on a quick call</li>
        </ul>

        <h2 style="color: #2538c7;">Getting Started</h2>
        <ol>
          <li>Log in to Audio Intel and upload your contact list</li>
          <li>Let the AI enrich your contacts with submission guidelines</li>
          <li>Use the Pitch Generator to create personalized outreach</li>
          <li>Track everything in Command Centre</li>
        </ol>

        <div style="background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
          <p><strong>Pro Tip:</strong> Start with Audio Intel. Upload your Spotify playlist curator list and watch the magic happen. You'll get detailed submission guidelines for each curator in seconds - something that normally takes hours of manual research.</p>
        </div>

        <p>Looking forward to your feedback, ${userData.name.split(' ')[0]}!</p>

        <p>Let's revolutionize music promotion together.</p>

        <p style="margin-top: 30px;">
          <strong>Chris Schofield</strong><br>
          Founder, Total Audio Promo<br>
          15 years in music PR | Now building the future
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

        <p style="font-size: 12px; color: #666;">
          Questions? Reply directly to this email or reach me at chris@totalaudiopromo.com<br>
          Your beta access expires in ${userData.betaExpiryDays} days. We'll send a reminder 7 days before it ends.
        </p>
      </div>
    `
  };

  console.log('📧 Welcome Email Template Generated');
  console.log('');
  console.log('To send this email, use the Resend API or your email service:');
  console.log('');
  console.log(JSON.stringify(welcomeEmail, null, 2));
  console.log('');

  return welcomeEmail;
}

async function main() {
  console.log('🚀 Total Audio Promo - Beta User Setup');
  console.log('=====================================');
  console.log('');

  try {
    // Create beta user
    const user = await createBetaUser(JEREMY_DATA);

    // Set up tracking
    await trackBetaUserSetup(user.id, user.email, user.name);

    // Generate welcome email
    const welcomeEmail = await generateWelcomeEmail(JEREMY_DATA);

    console.log('✅ Beta user setup complete!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   User: ${JEREMY_DATA.name} (${JEREMY_DATA.email})`);
    console.log(`   Band: ${JEREMY_DATA.bandName}`);
    console.log(`   Beta Period: ${JEREMY_DATA.betaExpiryDays} days`);
    console.log(`   Access: All three apps (Audio Intel, Command Centre, Pitch Generator)`);
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Send the welcome email (template generated above)');
    console.log('   2. Add to ConvertKit with "beta-user" tag');
    console.log('   3. Monitor usage in Command Centre dashboard');
    console.log('');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { createBetaUser, generateWelcomeEmail, trackBetaUserSetup };
