// ============================================================================
// BENCHMARKS API ROUTE
// GET: Fetch industry benchmark data
// Supports both API key and session authentication
// ============================================================================

import { createServerClient } from '@total-audio/core-db/server';
import {
  getUserFromRequest,
  successResponse,
  internalError,
  unauthorized,
  withCors,
  corsOptionsResponse,
} from '@total-audio/core-db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Handle CORS preflight
export async function OPTIONS(request: Request) {
  return corsOptionsResponse(request.headers.get('origin'));
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin');

  // Authenticate (supports both API key and session)
  const auth = await getUserFromRequest(request, {
    requiredScope: 'tracker:read',
    allowAnonymous: false,
  });

  if (!auth.success) {
    return withCors(unauthorized(auth.error.message), origin);
  }

  const supabase = await createServerClient(cookies());

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const genre = searchParams.get('genre');

  let query = supabase.from('benchmarks').select('*');

  if (platform) {
    query = query.eq('platform', platform);
  }

  if (genre) {
    query = query.eq('genre', genre);
  }

  const { data, error } = await query;

  if (error) {
    return withCors(internalError(error.message), origin);
  }

  // If requesting specific platform + genre, return single benchmark
  if (platform && genre && data && data.length > 0) {
    return withCors(successResponse(data[0]), origin);
  }

  return withCors(successResponse(data || []), origin);
}
