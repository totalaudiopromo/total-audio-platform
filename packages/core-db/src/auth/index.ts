/**
 * Authentication module for TAP API access
 *
 * Supports both:
 * - API key authentication (for external integrations like totalaud.io)
 * - Supabase session authentication (for web app users)
 */

export { validateApiKey, generateApiKey, hashApiKey, hasScope, API_SCOPES } from './api-key';

export type { ApiKeyContext, ApiKeyError, ApiKeyValidationResult, ApiScope } from './api-key';

export { getUserFromRequest, checkScope } from './get-user';

export type { AuthContext, AuthError, AuthMethod, AuthResult, GetUserOptions } from './get-user';
