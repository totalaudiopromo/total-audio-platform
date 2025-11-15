#!/usr/bin/env ts-node

/**
 * Beta User Setup Script
 *
 * Creates Jeremy's beta account for Total Audio Promo
 * Email: info@streamer.co.uk
 * Password: Streamer2024!BetaAccess (must change on first login)
 * Role: ARTIST
 * Beta Period: 60 days
 * Cost: £0/month
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Try loading from root first, then apps/api
dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.join(__dirname, '../apps/api/.env.local') });
}

// Validate DATABASE_URL format
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not found');
  console.error('   Please ensure DATABASE_URL is set in .env.local or apps/api/.env.local');
  process.exit(1);
}

if (
  !process.env.DATABASE_URL.startsWith('postgresql://') &&
  !process.env.DATABASE_URL.startsWith('postgres://')
) {
  console.error('❌ DATABASE_URL must start with postgresql:// or postgres://');
  console.error('   Current format:', process.env.DATABASE_URL.substring(0, 20) + '...');
  console.error('   Please check your database connection string');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const BETA_USER = {
  email: 'info@streamer.co.uk',
  password: 'Streamer2024!BetaAccess',
  name: 'Streamer',
  role: 'ARTIST' as const,
  betaPeriodDays: 60,
};

async function setupBetaUser() {
  try {
    console.log('🚀 Setting up beta user account...\n');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: BETA_USER.email },
      include: { subscription: true },
    });

    if (existingUser) {
      console.log(`⚠️  User ${BETA_USER.email} already exists.`);
      console.log(`   User ID: ${existingUser.id}`);
      console.log(`   Role: ${existingUser.role}`);

      if (existingUser.subscription) {
        console.log(
          `   Subscription: ${existingUser.subscription.tier} - £${existingUser.subscription.monthlyPrice}/month`
        );
        console.log(`   Status: ${existingUser.subscription.status}`);
        console.log(`   Period End: ${existingUser.subscription.currentPeriodEnd.toISOString()}`);
      } else {
        console.log(`   No subscription found. Creating beta subscription...`);
        await createBetaSubscription(existingUser.id);
      }

      console.log('\n✅ Beta user setup complete!');
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(BETA_USER.password, 10);

    // Create user
    console.log(`📝 Creating user: ${BETA_USER.email}...`);
    const user = await prisma.user.create({
      data: {
        email: BETA_USER.email,
        name: BETA_USER.name,
        passwordHash,
        role: BETA_USER.role,
      },
    });

    console.log(`✅ User created: ${user.id}\n`);

    // Create beta subscription
    await createBetaSubscription(user.id);

    console.log('\n✅ Beta user setup complete!');
    console.log('\n📋 Account Details:');
    console.log(`   Email: ${BETA_USER.email}`);
    console.log(`   Password: ${BETA_USER.password}`);
    console.log(`   Role: ${BETA_USER.role}`);
    console.log(`   Beta Period: ${BETA_USER.betaPeriodDays} days`);
    console.log(`   Cost: £0/month`);
    console.log('\n⚠️  IMPORTANT: User must change password on first login!');
  } catch (error) {
    console.error('❌ Error setting up beta user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createBetaSubscription(userId: string) {
  const currentPeriodEnd = new Date();
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + BETA_USER.betaPeriodDays);

  console.log('💳 Creating beta subscription...');
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      tier: 'ARTIST',
      status: 'ACTIVE',
      monthlyPrice: 0,
      setupFee: 0,
      currentPeriodEnd,
    },
  });

  console.log(`✅ Subscription created:`);
  console.log(`   Tier: ${subscription.tier}`);
  console.log(`   Monthly Price: £${subscription.monthlyPrice}`);
  console.log(`   Status: ${subscription.status}`);
  console.log(`   Period End: ${subscription.currentPeriodEnd.toISOString()}`);
}

// Run the script
if (require.main === module) {
  setupBetaUser()
    .then(() => {
      console.log('\n🎉 Setup complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Setup failed:', error);
      process.exit(1);
    });
}

export { setupBetaUser };
