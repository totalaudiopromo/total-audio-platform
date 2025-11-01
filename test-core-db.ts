// Test that all core-db exports are accessible
import { isAdmin, ownsResource, getSubscriptionTier } from '@total-audio/core-db';
import { createClient } from '@total-audio/core-db/client';
import { createServerClient, createAdminClient } from '@total-audio/core-db/server';
import { updateSession } from '@total-audio/core-db/middleware';
import type { Database, Json } from '@total-audio/core-db/types';

console.log('✅ All core-db imports successful');
