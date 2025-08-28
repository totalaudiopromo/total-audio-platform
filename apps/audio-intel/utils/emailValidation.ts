import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  formatValid: boolean;
  domainValid: boolean;
  mxRecords: boolean;
  disposable: boolean;
  freeEmail: boolean;
  confidence: 'high' | 'medium' | 'low';
  issues: string[];
}

// Common disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.com',
  'throwaway.com', 'yopmail.com', 'mailnesia.com', 'sharklasers.com',
  'getairmail.com', 'maildrop.cc', 'mailinator.net', 'spam4.me',
  'bccto.me', 'chacuo.net', 'dispostable.com', 'fakeinbox.com'
]);

// Common free email providers
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'protonmail.com', 'mail.com', 'live.com', 'me.com',
  'mac.com', 'msn.com', 'ymail.com', 'rocketmail.com', 'fastmail.com'
]);

export async function validateEmail(email: string): Promise<EmailValidationResult> {
  const result: EmailValidationResult = {
    email,
    isValid: false,
    formatValid: false,
    domainValid: false,
    mxRecords: false,
    disposable: false,
    freeEmail: false,
    confidence: 'low',
    issues: []
  };

  // 1. Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  result.formatValid = emailRegex.test(email);
  
  if (!result.formatValid) {
    result.issues.push('Invalid email format');
    return result;
  }

  // 2. Extract domain
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    result.issues.push('Invalid domain');
    return result;
  }

  // 3. Check for disposable emails
  result.disposable = DISPOSABLE_DOMAINS.has(domain);
  if (result.disposable) {
    result.issues.push('Disposable email detected');
  }

  // 4. Check for free email providers
  result.freeEmail = FREE_EMAIL_DOMAINS.has(domain);

  // 5. DNS MX record validation
  try {
    const mxRecords = await resolveMx(domain);
    result.mxRecords = mxRecords.length > 0;
    result.domainValid = true;
  } catch (error) {
    result.issues.push('Domain has no MX records');
    result.domainValid = false;
  }

  // 6. Calculate confidence and validity
  if (result.formatValid && result.domainValid && !result.disposable) {
    result.isValid = true;
    result.confidence = result.mxRecords ? 'high' : 'medium';
  } else {
    result.isValid = false;
    result.confidence = 'low';
  }

  return result;
}

export async function validateEmailList(emails: string[]): Promise<{
  valid: EmailValidationResult[];
  invalid: EmailValidationResult[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    disposable: number;
    freeEmails: number;
    businessEmails: number;
  };
}> {
  const results = await Promise.all(emails.map(validateEmail));
  
  const valid = results.filter(r => r.isValid);
  const invalid = results.filter(r => !r.isValid);
  
  const summary = {
    total: results.length,
    valid: valid.length,
    invalid: invalid.length,
    disposable: results.filter(r => r.disposable).length,
    freeEmails: results.filter(r => r.freeEmail).length,
    businessEmails: results.filter(r => r.isValid && !r.freeEmail).length
  };

  return { valid, invalid, summary };
}

// Batch validation with progress callback
export async function validateEmailBatch(
  emails: string[], 
  batchSize: number = 10,
  onProgress?: (processed: number, total: number) => void
): Promise<EmailValidationResult[]> {
  const results: EmailValidationResult[] = [];
  
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(validateEmail));
    results.push(...batchResults);
    
    if (onProgress) {
      onProgress(Math.min(i + batchSize, emails.length), emails.length);
    }
  }
  
  return results;
} 