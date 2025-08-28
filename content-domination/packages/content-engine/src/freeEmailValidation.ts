import axios from 'axios';
import dns from 'dns';
import { promisify } from 'util';

// 🆓 FREE Premium Email Validation System
// Built specifically for independent artists and music professionals
// Zero cost, maximum value, professional results

const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);

export interface FreeEmailValidationResult {
  email: string;
  isValid: boolean;
  score: number; // 0-100
  confidence: 'High' | 'Medium' | 'Low';
  details: {
    format: boolean;
    domain: boolean;
    mxRecords: boolean;
    smtpCheck: boolean;
    disposable: boolean;
    role: 'personal' | 'role' | 'disposable' | 'unknown';
    provider: string;
    domainAge: number;
    spamScore: number;
  };
  recommendations: string[];
  lastChecked: string;
  sources: string[];
}

export interface ValidationSource {
  name: string;
  url: string;
  free: boolean;
  rateLimit: string;
  accuracy: number;
}

class FreePremiumEmailValidation {
  private validationSources: ValidationSource[] = [
    {
      name: 'Email Validator Net',
      url: 'https://api.email-validator.net/api/verify',
      free: true,
      rateLimit: '1000/day',
      accuracy: 95
    },
    {
      name: 'Kickbox Disposable Check',
      url: 'https://open.kickbox.com/v1/disposable',
      free: true,
      rateLimit: '1000/day',
      accuracy: 90
    },
    {
      name: 'Domains DB',
      url: 'https://api.domainsdb.info/v1/domains/search',
      free: true,
      rateLimit: '1000/day',
      accuracy: 85
    },
    {
      name: 'DNS MX Records',
      url: 'n/a',
      free: true,
      rateLimit: 'unlimited',
      accuracy: 80
    }
  ];

  private disposableDomains = new Set([
    // Common disposable email domains
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
    'throwaway.email', 'yopmail.com', 'temp-mail.org', 'sharklasers.com',
    'getairmail.com', 'mailnesia.com', 'mintemail.com', 'spam4.me',
    'bccto.me', 'chacuo.net', 'dispostable.com', 'fakeinbox.com',
    'maildrop.cc', 'mailinator.net', 'mailmetrash.com', 'mailnesia.com',
    'mohmal.com', 'my10minutemail.com', 'nwytg.net', 'sharklasers.com',
    'spam4.me', 'tempmailaddress.com', 'tmpeml.com', 'trashmail.net'
  ]);

  private roleBasedPatterns = {
    role: [
      /^admin@/i, /^info@/i, /^hello@/i, /^contact@/i, /^hello@/i,
      /^support@/i, /^help@/i, /^sales@/i, /^marketing@/i, /^pr@/i,
      /^media@/i, /^press@/i, /^booking@/i, /^management@/i,
      /^radio@/i, /^playlist@/i, /^submissions@/i, /^demo@/i
    ],
    personal: [
      /^[a-z]+\.[a-z]+@/i, /^[a-z]+[0-9]+@/i, /^[a-z]+_[a-z]+@/i
    ]
  };

  constructor() {
    // No API keys needed - completely free!
  }

  /**
   * 🆓 FREE Premium Email Validation
   * Returns professional-grade validation results
   */
  async validateEmail(email: string): Promise<FreeEmailValidationResult> {
    const startTime = Date.now();
    const sources: string[] = [];
    const recommendations: string[] = [];

    try {
      console.log(`🔍 Validating email: ${email}`);

      // 1. Basic format validation (instant)
      const formatValid = this.validateEmailFormat(email);
      if (!formatValid) {
        return this.createInvalidResult(email, 'Invalid email format', sources);
      }

      // 2. Domain extraction
      const domain = email.split('@')[1];
      if (!domain) {
        return this.createInvalidResult(email, 'Invalid domain', sources);
      }

      // 3. Parallel validation using multiple free sources
      const [
        mxCheck,
        disposableCheck,
        externalValidation,
        domainInfo
      ] = await Promise.allSettled([
        this.checkMXRecords(domain),
        this.checkDisposableDomain(domain),
        this.externalEmailValidation(email),
        this.getDomainInfo(domain)
      ]);

      // 4. Aggregate results intelligently
      const results = this.aggregateValidationResults({
        email,
        formatValid,
        mxCheck: mxCheck.status === 'fulfilled' ? mxCheck.value : false,
        disposableCheck: disposableCheck.status === 'fulfilled' ? disposableCheck.value : false,
        externalValidation: externalValidation.status === 'fulfilled' ? externalValidation.value : null,
        domainInfo: domainInfo.status === 'fulfilled' ? domainInfo.value : null
      });

      // 5. Calculate confidence and score
      const score = this.calculateValidationScore(results);
      const confidence = this.determineConfidence(score);

      // 6. Generate recommendations
      if (results.isValid) {
        recommendations.push('✅ Email appears valid and deliverable');
        if (results.mxCheck) recommendations.push('✅ Domain has proper mail servers');
        if (!results.disposableCheck) recommendations.push('✅ Not a disposable email service');
      } else {
        if (!results.mxCheck) recommendations.push('❌ Domain lacks proper mail servers');
        if (results.disposableCheck) recommendations.push('❌ Appears to be a disposable email');
        recommendations.push('💡 Consider using a professional email address');
      }

      // 7. Add music industry specific recommendations
      if (this.isMusicIndustryDomain(domain)) {
        recommendations.push('🎵 Music industry domain detected - high priority contact!');
      }

      const result: FreeEmailValidationResult = {
        email,
        isValid: results.isValid,
        score,
        confidence,
        details: {
          format: results.formatValid,
          domain: results.domainValid,
          mxRecords: results.mxCheck,
          smtpCheck: results.smtpCheck,
          disposable: results.disposableCheck,
          role: this.determineEmailRole(email),
          provider: domain,
          domainAge: results.domainAge || 0,
          spamScore: this.calculateSpamScore(results)
        },
        recommendations,
        lastChecked: new Date().toISOString(),
        sources: sources.length > 0 ? sources : ['local_validation']
      };

      const duration = Date.now() - startTime;
      console.log(`✅ Email validated in ${duration}ms - Score: ${score}/100 - Confidence: ${confidence}`);

      return result;

    } catch (error) {
      console.error('❌ Email validation failed:', error);
      return this.createInvalidResult(email, 'Validation failed', sources, error);
    }
  }

  /**
   * Validate email format using regex
   */
  private validateEmailFormat(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  /**
   * Check MX records using DNS (completely free)
   */
  private async checkMXRecords(domain: string): Promise<boolean> {
    try {
      const mxRecords = await resolveMx(domain);
      return mxRecords.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if domain is disposable (using local database + free API)
   */
  private async checkDisposableDomain(domain: string): Promise<boolean> {
    // Check local database first (instant)
    if (this.disposableDomains.has(domain)) {
      return true;
    }

    // Check free API as backup
    try {
      const response = await axios.get(`https://open.kickbox.com/v1/disposable/${domain}`, {
        timeout: 3000
      });
      return (response.data as any).disposable || false;
    } catch (error) {
      // If API fails, rely on local database
      return false;
    }
  }

  /**
   * External email validation using free API
   */
  private async externalEmailValidation(email: string): Promise<any> {
    try {
      const response = await axios.get(`https://api.email-validator.net/api/verify?Email=${email}`, {
        timeout: 5000
      });
      
      return {
        formatCheck: (response.data as any).formatCheck,
        smtpCheck: (response.data as any).smtpCheck,
        score: (response.data as any).score
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get domain information using free APIs
   */
  private async getDomainInfo(domain: string): Promise<any> {
    try {
      const response = await axios.get(`https://api.domainsdb.info/v1/domains/search?domain=${domain}`, {
        timeout: 5000
      });
      
      const data = response.data as any;
      if (data.domains && data.domains.length > 0) {
        const domainInfo = data.domains[0];
        return {
          age: this.calculateDomainAge(domainInfo.create_date),
          country: domainInfo.country,
          valid: true
        };
      }
      
      return { age: 0, valid: true };
    } catch (error) {
      return { age: 0, valid: true };
    }
  }

  /**
   * Aggregate validation results from multiple sources
   */
  private aggregateValidationResults(data: any): any {
    const {
      email,
      formatValid,
      mxCheck,
      disposableCheck,
      externalValidation,
      domainInfo
    } = data;

    const domain = email.split('@')[1];
    
    // Determine validity based on multiple factors
    const isValid = formatValid && 
                   mxCheck && 
                   !disposableCheck && 
                   domainInfo?.valid;

    // Calculate domain age
    const domainAge = domainInfo?.age || 0;

    // Determine SMTP check result
    const smtpCheck = externalValidation?.smtpCheck || false;

    return {
      isValid,
      formatValid,
      domainValid: domainInfo?.valid || false,
      mxCheck,
      smtpCheck,
      disposableCheck,
      domainAge
    };
  }

  /**
   * Calculate validation score (0-100)
   */
  private calculateValidationScore(results: any): number {
    let score = 0;

    // Format validation (20 points)
    if (results.formatValid) score += 20;

    // Domain validation (20 points)
    if (results.domainValid) score += 20;

    // MX records (25 points)
    if (results.mxCheck) score += 25;

    // SMTP check (20 points)
    if (results.smtpCheck) score += 20;

    // Not disposable (15 points)
    if (!results.disposableCheck) score += 15;

    // Domain age bonus (up to 10 points)
    if (results.domainAge > 5) score += 10;
    else if (results.domainAge > 2) score += 5;

    return Math.min(100, score);
  }

  /**
   * Determine confidence level based on score
   */
  private determineConfidence(score: number): 'High' | 'Medium' | 'Low' {
    if (score >= 80) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
  }

  /**
   * Determine email role based on patterns
   */
  private determineEmailRole(email: string): 'personal' | 'role' | 'disposable' | 'unknown' {
    if (this.disposableDomains.has(email.split('@')[1])) {
      return 'disposable';
    }

    for (const pattern of this.roleBasedPatterns.role) {
      if (pattern.test(email)) return 'role';
    }

    for (const pattern of this.roleBasedPatterns.personal) {
      if (pattern.test(email)) return 'personal';
    }

    return 'unknown';
  }

  /**
   * Calculate spam score based on various factors
   */
  private calculateSpamScore(results: any): number {
    let spamScore = 0;

    if (results.disposableCheck) spamScore += 50;
    if (results.domainAge < 1) spamScore += 30;
    if (results.role === 'role') spamScore -= 10;
    if (results.mxCheck) spamScore -= 20;

    return Math.max(0, Math.min(100, spamScore));
  }

  /**
   * Check if domain is music industry related
   */
  private isMusicIndustryDomain(domain: string): boolean {
    const musicKeywords = [
      'radio', 'station', 'playlist', 'music', 'artist', 'band',
      'label', 'promo', 'pr', 'media', 'press', 'booking',
      'management', 'agency', 'promotion', 'marketing'
    ];

    return musicKeywords.some(keyword => 
      domain.toLowerCase().includes(keyword)
    );
  }

  /**
   * Calculate domain age from creation date
   */
  private calculateDomainAge(createDate: string): number {
    if (!createDate) return 0;
    
    try {
      const created = new Date(createDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - created.getTime());
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
      return Math.floor(diffYears);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Create invalid result for failed validations
   */
  private createInvalidResult(email: string, reason: string, sources: string[], error?: any): FreeEmailValidationResult {
    return {
      email,
      isValid: false,
      score: 0,
      confidence: 'Low',
      details: {
        format: false,
        domain: false,
        mxRecords: false,
        smtpCheck: false,
        disposable: true,
        role: 'unknown',
        provider: email.split('@')[1] || 'unknown',
        domainAge: 0,
        spamScore: 100
      },
      recommendations: [`❌ ${reason}`],
      lastChecked: new Date().toISOString(),
      sources
    };
  }

  /**
   * Get validation sources info (for transparency)
   */
  getValidationSources(): ValidationSource[] {
    return this.validationSources;
  }

  /**
   * Batch validate multiple emails (for premium users)
   */
  async validateBatch(emails: string[]): Promise<FreeEmailValidationResult[]> {
    console.log(`🚀 Batch validating ${emails.length} emails...`);
    
    const results: FreeEmailValidationResult[] = [];
    
    // Process in batches of 10 to respect rate limits
    const batchSize = 10;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(email => this.validateEmail(email))
      );
      results.push(...batchResults);
      
      // Small delay between batches to be respectful
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`✅ Batch validation complete: ${results.length} emails processed`);
    return results;
  }
}

export default FreePremiumEmailValidation;
