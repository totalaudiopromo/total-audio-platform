export function getEnv(
  name: string,
  opts?: { requiredInProd?: boolean; default?: string }
): string | null {
  const val = process.env[name];
  if (val && val.length > 0) return val;
  const requiredInProd = opts?.requiredInProd !== false; // default true
  // Don't throw errors during build time - only at runtime
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
  if (process.env.NODE_ENV === 'production' && requiredInProd && !isBuildTime) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return opts?.default ?? null;
}

export function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}

export function booleanEnv(name: string, defaultValue = false): boolean {
  const v = process.env[name];
  if (v == null) return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
}
