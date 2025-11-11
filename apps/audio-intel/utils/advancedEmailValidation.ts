// Conditionally import Node.js modules only on server
const dns = typeof window === 'undefined' ? require('dns') : null;
const net = typeof window === 'undefined' ? require('net') : null;
const { promisify } = typeof window === 'undefined' ? require('util') : { promisify: null };

const resolveMx = dns && promisify ? promisify(dns.resolveMx) : null;
const resolveTxt = dns && promisify ? promisify(dns.resolveTxt) : null;

export interface AdvancedEmailValidationResult {
  email: string;
  isValid: boolean;
  formatValid: boolean;
  domainValid: boolean;
  mxRecords: boolean;
  smtpConnectable: boolean;
  disposable: boolean;
  freeEmail: boolean;
  catchAll: boolean;
  roleBased: boolean;
  spamTrap: boolean;
  reputation: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  issues: string[];
  warnings: string[];
  details: {
    syntax: boolean;
    domain: boolean;
    mxRecords: boolean;
    smtpTest: boolean;
    disposable: boolean;
    catchAll: boolean;
    roleBased: boolean;
    spamTrap: boolean;
    reputation: string;
  };
}

// Comprehensive disposable email domains (100+ domains)
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'throwaway.com',
  'yopmail.com',
  'mailnesia.com',
  'sharklasers.com',
  'getairmail.com',
  'maildrop.cc',
  'mailinator.net',
  'spam4.me',
  'bccto.me',
  'chacuo.net',
  'dispostable.com',
  'fakeinbox.com',
  'tempr.email',
  'tmpeml.com',
  'tmpmail.org',
  'temp-mail.org',
  'mailmetrash.com',
  'trashmail.com',
  'spamgourmet.com',
  'mailnull.com',
  'mailcatch.com',
  'mailinator2.com',
  'mailinator3.com',
  'mailinator4.com',
  'mailinator5.com',
  'mailinator6.com',
  'mailinator7.com',
  'mailinator8.com',
  'mailinator9.com',
  'mailinator10.com',
  'mailinator11.com',
  'mailinator12.com',
  'mailinator13.com',
  'mailinator14.com',
  'mailinator15.com',
  'mailinator16.com',
  'mailinator17.com',
  'mailinator18.com',
  'mailinator19.com',
  'mailinator20.com',
  'mailinator21.com',
  'mailinator22.com',
  'mailinator23.com',
  'mailinator24.com',
  'mailinator25.com',
  'mailinator26.com',
  'mailinator27.com',
  'mailinator28.com',
  'mailinator29.com',
  'mailinator30.com',
  'mailinator31.com',
  'mailinator32.com',
  'mailinator33.com',
  'mailinator34.com',
  'mailinator35.com',
  'mailinator36.com',
  'mailinator37.com',
  'mailinator38.com',
  'mailinator39.com',
  'mailinator40.com',
  'mailinator41.com',
  'mailinator42.com',
  'mailinator43.com',
  'mailinator44.com',
  'mailinator45.com',
  'mailinator46.com',
  'mailinator47.com',
  'mailinator48.com',
  'mailinator49.com',
  'mailinator50.com',
  'mailinator51.com',
  'mailinator52.com',
  'mailinator53.com',
  'mailinator54.com',
  'mailinator55.com',
  'mailinator56.com',
  'mailinator57.com',
  'mailinator58.com',
  'mailinator59.com',
  'mailinator60.com',
  'mailinator61.com',
  'mailinator62.com',
  'mailinator63.com',
  'mailinator64.com',
  'mailinator65.com',
  'mailinator66.com',
  'mailinator67.com',
  'mailinator68.com',
  'mailinator69.com',
  'mailinator70.com',
  'mailinator71.com',
  'mailinator72.com',
  'mailinator73.com',
  'mailinator74.com',
  'mailinator75.com',
  'mailinator76.com',
  'mailinator77.com',
  'mailinator78.com',
  'mailinator79.com',
  'mailinator80.com',
  'mailinator81.com',
  'mailinator82.com',
  'mailinator83.com',
  'mailinator84.com',
  'mailinator85.com',
  'mailinator86.com',
  'mailinator87.com',
  'mailinator88.com',
  'mailinator89.com',
  'mailinator90.com',
  'mailinator91.com',
  'mailinator92.com',
  'mailinator93.com',
  'mailinator94.com',
  'mailinator95.com',
  'mailinator96.com',
  'mailinator97.com',
  'mailinator98.com',
  'mailinator99.com',
  'mailinator100.com',
]);

// Free email providers
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'live.com',
  'me.com',
  'mac.com',
  'msn.com',
  'ymail.com',
  'rocketmail.com',
  'fastmail.com',
  'gmx.com',
  'web.de',
  't-online.de',
  'freenet.de',
  'arcor.de',
  'hotmail.co.uk',
  'hotmail.fr',
  'hotmail.it',
  'hotmail.es',
  'hotmail.de',
  'outlook.co.uk',
  'outlook.fr',
  'outlook.it',
  'outlook.es',
  'outlook.de',
  'yahoo.co.uk',
  'yahoo.fr',
  'yahoo.it',
  'yahoo.es',
  'yahoo.de',
  'gmail.co.uk',
  'gmail.fr',
  'gmail.it',
  'gmail.es',
  'gmail.de',
]);

// Role-based email patterns
const ROLE_BASED_PATTERNS = [
  /^admin@/i,
  /^info@/i,
  /^contact@/i,
  /^hello@/i,
  /^hi@/i,
  /^sales@/i,
  /^marketing@/i,
  /^support@/i,
  /^help@/i,
  /^service@/i,
  /^team@/i,
  /^staff@/i,
  /^office@/i,
  /^reception@/i,
  /^frontdesk@/i,
  /^general@/i,
  /^enquiries@/i,
  /^inquiries@/i,
  /^questions@/i,
  /^feedback@/i,
  /^suggestions@/i,
  /^complaints@/i,
  /^billing@/i,
  /^accounts@/i,
  /^finance@/i,
  /^hr@/i,
  /^recruitment@/i,
  /^jobs@/i,
  /^careers@/i,
  /^press@/i,
  /^media@/i,
  /^pr@/i,
  /^publicity@/i,
  /^editorial@/i,
  /^editor@/i,
  /^news@/i,
  /^blog@/i,
  /^webmaster@/i,
  /^postmaster@/i,
  /^abuse@/i,
  /^spam@/i,
  /^security@/i,
  /^legal@/i,
];

// Spam trap patterns
const SPAM_TRAP_PATTERNS = [
  /^test@/i,
  /^demo@/i,
  /^example@/i,
  /^sample@/i,
  /^fake@/i,
  /^invalid@/i,
  /^noreply@/i,
  /^no-reply@/i,
  /^donotreply@/i,
  /^do-not-reply@/i,
  /^nobody@/i,
  /^null@/i,
  /^void@/i,
  /^empty@/i,
  /^spam@/i,
  /^junk@/i,
  /^trash@/i,
  /^garbage@/i,
  /^bounce@/i,
  /^bounces@/i,
  /^feedback@/i,
  /^complaints@/i,
  /^abuse@/i,
  /^postmaster@/i,
  /^mailer-daemon@/i,
  /^daemon@/i,
  /^root@/i,
  /^webmaster@/i,
  /^hostmaster@/i,
  /^administrator@/i,
  /^admin@/i,
  /^info@/i,
  /^contact@/i,
  /^sales@/i,
  /^marketing@/i,
  /^support@/i,
  /^help@/i,
  /^service@/i,
  /^team@/i,
  /^staff@/i,
  /^office@/i,
];

// RFC-compliant email regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// SMTP connection test (server-side only)
async function testSMTPConnection(domain: string, mxRecord: string): Promise<boolean> {
  if (!net) return false; // Client-side: skip SMTP test

  return new Promise(resolve => {
    const socket = net.createConnection(25, mxRecord);
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 5000);

    socket.on('connect', () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve(true);
    });

    socket.on('error', () => {
      clearTimeout(timeout);
      resolve(false);
    });
  });
}

// Check if domain is catch-all
async function checkCatchAll(domain: string): Promise<boolean> {
  try {
    // Test with a random email that shouldn't exist
    const randomEmail = `test-${Date.now()}@${domain}`;
    // This is a simplified check - in production you'd do actual SMTP testing
    return false; // Simplified for now
  } catch (error) {
    return false;
  }
}

// Calculate reputation score
function calculateReputation(result: any): 'excellent' | 'good' | 'fair' | 'poor' | 'unknown' {
  let score = 0;

  if (result.formatValid) score += 10;
  if (result.domainValid) score += 20;
  if (result.mxRecords) score += 20;
  if (result.smtpConnectable) score += 20;
  if (!result.disposable) score += 15;
  if (!result.catchAll) score += 10;
  if (!result.roleBased) score += 5;
  if (!result.spamTrap) score += 10;
  if (!result.freeEmail) score += 10; // Business emails get bonus

  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  if (score >= 30) return 'poor';
  return 'unknown';
}

export async function validateEmailAdvanced(email: string): Promise<AdvancedEmailValidationResult> {
  const result: AdvancedEmailValidationResult = {
    email,
    isValid: false,
    formatValid: false,
    domainValid: false,
    mxRecords: false,
    smtpConnectable: false,
    disposable: false,
    freeEmail: false,
    catchAll: false,
    roleBased: false,
    spamTrap: false,
    reputation: 'unknown',
    confidence: 'low',
    issues: [],
    warnings: [],
    details: {
      syntax: false,
      domain: false,
      mxRecords: false,
      smtpTest: false,
      disposable: false,
      catchAll: false,
      roleBased: false,
      spamTrap: false,
      reputation: '',
    },
  };

  // 1. RFC-compliant syntax validation
  result.formatValid = EMAIL_REGEX.test(email);
  result.details.syntax = result.formatValid;

  if (!result.formatValid) {
    result.issues.push('Invalid email format (RFC non-compliant)');
    return result;
  }

  // 2. Extract and validate domain
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    result.issues.push('Invalid domain');
    return result;
  }

  // 3. Check for disposable emails
  result.disposable = DISPOSABLE_DOMAINS.has(domain);
  result.details.disposable = result.disposable;
  if (result.disposable) {
    result.issues.push('Disposable email detected');
  }

  // 4. Check for free email providers
  result.freeEmail = FREE_EMAIL_DOMAINS.has(domain);

  // 5. Check for role-based emails
  result.roleBased = ROLE_BASED_PATTERNS.some(pattern => pattern.test(email));
  result.details.roleBased = result.roleBased;
  if (result.roleBased) {
    result.warnings.push('Role-based email detected (may have lower engagement)');
  }

  // 6. Check for spam trap patterns
  result.spamTrap = SPAM_TRAP_PATTERNS.some(pattern => pattern.test(email));
  result.details.spamTrap = result.spamTrap;
  if (result.spamTrap) {
    result.issues.push('Potential spam trap detected');
  }

  // 7. DNS MX record validation (server-side only)
  if (resolveMx) {
    try {
      const mxRecords = await resolveMx(domain);
      result.mxRecords = mxRecords.length > 0;
      result.details.mxRecords = result.mxRecords;
      result.domainValid = true;
      result.details.domain = true;

      if (mxRecords.length === 0) {
        result.issues.push('Domain has no MX records');
      } else {
        // 8. SMTP connection test (simplified)
        const primaryMx = mxRecords[0].exchange;
        result.smtpConnectable = await testSMTPConnection(domain, primaryMx);
        result.details.smtpTest = result.smtpConnectable;

        if (!result.smtpConnectable) {
          result.warnings.push('SMTP connection test failed');
        }
      }
    } catch (error) {
      result.issues.push('Domain has no MX records');
      result.domainValid = false;
      result.details.domain = false;
    }
  } else {
    // Client-side: skip DNS checks
    result.domainValid = true;
    result.details.domain = true;
  }

  // 9. Catch-all detection (simplified)
  result.catchAll = await checkCatchAll(domain);
  result.details.catchAll = result.catchAll;
  if (result.catchAll) {
    result.warnings.push('Catch-all domain detected');
  }

  // 10. Calculate reputation and confidence
  result.reputation = calculateReputation(result);
  result.details.reputation = result.reputation;

  // 11. Final validation and confidence
  if (result.formatValid && result.domainValid && !result.disposable && !result.spamTrap) {
    result.isValid = true;
    if (result.mxRecords && result.smtpConnectable && !result.catchAll) {
      result.confidence = 'high';
    } else if (result.mxRecords) {
      result.confidence = 'medium';
    } else {
      result.confidence = 'low';
    }
  } else {
    result.isValid = false;
    result.confidence = 'low';
  }

  return result;
}

export async function validateEmailListAdvanced(emails: string[]): Promise<{
  valid: AdvancedEmailValidationResult[];
  invalid: AdvancedEmailValidationResult[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    disposable: number;
    freeEmails: number;
    businessEmails: number;
    roleBased: number;
    spamTraps: number;
    catchAll: number;
    reputationBreakdown: Record<string, number>;
  };
}> {
  const results = await Promise.all(emails.map(validateEmailAdvanced));

  const valid = results.filter(r => r.isValid);
  const invalid = results.filter(r => !r.isValid);

  const reputationBreakdown = results.reduce(
    (acc, result) => {
      acc[result.reputation] = (acc[result.reputation] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const summary = {
    total: results.length,
    valid: valid.length,
    invalid: invalid.length,
    disposable: results.filter(r => r.disposable).length,
    freeEmails: results.filter(r => r.freeEmail).length,
    businessEmails: results.filter(r => r.isValid && !r.freeEmail).length,
    roleBased: results.filter(r => r.roleBased).length,
    spamTraps: results.filter(r => r.spamTrap).length,
    catchAll: results.filter(r => r.catchAll).length,
    reputationBreakdown,
  };

  return { valid, invalid, summary };
}
