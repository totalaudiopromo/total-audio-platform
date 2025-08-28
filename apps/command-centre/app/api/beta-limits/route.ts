import { NextResponse } from 'next/server';

interface BetaLimits {
  contactEnrichmentLimit: number;
  emailValidationLimit: number;
  exportLimit: number;
  apiCallsLimit: number;
  timePeriod: 'monthly' | 'weekly' | 'total';
}

interface BetaUsage {
  userId: string;
  email: string;
  contactsEnriched: number;
  emailsValidated: number;
  exportsGenerated: number;
  apiCallsMade: number;
  lastReset: string;
  limitReached: boolean;
}

// Beta tier limits - generous but controlled
const BETA_LIMITS: BetaLimits = {
  contactEnrichmentLimit: 100, // 100 contacts per month (worth ~£20)
  emailValidationLimit: 200,   // 200 emails per month  
  exportLimit: 10,             // 10 CSV exports per month
  apiCallsLimit: 500,          // 500 API calls per month
  timePeriod: 'monthly'
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    
    if (!userEmail) {
      return NextResponse.json({
        limits: BETA_LIMITS,
        usage: null,
        message: 'Provide email to check specific usage'
      });
    }
    
    // In production, fetch from database
    // For now, simulate user usage
    const currentUsage: BetaUsage = {
      userId: `beta-user-${userEmail}`,
      email: userEmail,
      contactsEnriched: 15, // Start with low usage
      emailsValidated: 25,
      exportsGenerated: 2,
      apiCallsMade: 45,
      lastReset: new Date().toISOString(),
      limitReached: false
    };
    
    // Check if any limits are reached
    const limitChecks = {
      contactsAtLimit: currentUsage.contactsEnriched >= BETA_LIMITS.contactEnrichmentLimit,
      emailsAtLimit: currentUsage.emailsValidated >= BETA_LIMITS.emailValidationLimit,
      exportsAtLimit: currentUsage.exportsGenerated >= BETA_LIMITS.exportLimit,
      apiAtLimit: currentUsage.apiCallsMade >= BETA_LIMITS.apiCallsLimit
    };
    
    currentUsage.limitReached = Object.values(limitChecks).some(Boolean);
    
    console.log('📊 Beta limits check:', {
      email: userEmail,
      contactsUsed: `${currentUsage.contactsEnriched}/${BETA_LIMITS.contactEnrichmentLimit}`,
      limitReached: currentUsage.limitReached
    });
    
    return NextResponse.json({
      limits: BETA_LIMITS,
      usage: currentUsage,
      remaining: {
        contacts: BETA_LIMITS.contactEnrichmentLimit - currentUsage.contactsEnriched,
        emails: BETA_LIMITS.emailValidationLimit - currentUsage.emailsValidated,
        exports: BETA_LIMITS.exportLimit - currentUsage.exportsGenerated,
        apiCalls: BETA_LIMITS.apiCallsLimit - currentUsage.apiCallsMade
      },
      limitChecks,
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    });
    
  } catch (error) {
    console.error('❌ Beta limits error:', error);
    
    return NextResponse.json({
      error: 'Failed to check beta limits',
      limits: BETA_LIMITS,
      usage: null
    }, { status: 500 });
  }
}

// POST endpoint to track beta usage
export async function POST(request: Request) {
  try {
    const usageData = await request.json();
    const { email, action, amount = 1 } = usageData;
    
    if (!email || !action) {
      return NextResponse.json({
        error: 'Email and action required'
      }, { status: 400 });
    }
    
    // Get current usage
    const currentUsageResponse = await GET(new Request(`${request.url}?email=${email}`));
    const currentData = await currentUsageResponse.json();
    
    if (!currentData.usage) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }
    
    const usage = currentData.usage;
    
    // Update usage based on action
    switch (action) {
      case 'contact_enrichment':
        usage.contactsEnriched += amount;
        break;
      case 'email_validation':
        usage.emailsValidated += amount;
        break;
      case 'export_csv':
        usage.exportsGenerated += amount;
        break;
      case 'api_call':
        usage.apiCallsMade += amount;
        break;
      default:
        return NextResponse.json({
          error: 'Invalid action type'
        }, { status: 400 });
    }
    
    // Check if limits exceeded
    const limitExceeded = {
      contacts: usage.contactsEnriched > BETA_LIMITS.contactEnrichmentLimit,
      emails: usage.emailsValidated > BETA_LIMITS.emailValidationLimit,
      exports: usage.exportsGenerated > BETA_LIMITS.exportLimit,
      apiCalls: usage.apiCallsMade > BETA_LIMITS.apiCallsLimit
    };
    
    const anyLimitExceeded = Object.values(limitExceeded).some(Boolean);
    
    if (anyLimitExceeded) {
      console.log('🚫 Beta limit exceeded:', {
        email,
        action,
        limitExceeded
      });
      
      return NextResponse.json({
        success: false,
        limitExceeded: true,
        message: 'Beta limit reached. Upgrade to continue.',
        limits: BETA_LIMITS,
        usage,
        upgradeUrl: 'mailto:hello@totalaudiopromo.com?subject=Beta%20Upgrade%20Request'
      }, { status: 429 });
    }
    
    console.log('✅ Beta usage tracked:', {
      email,
      action,
      amount,
      newUsage: usage[action.replace('_', 's').replace('ment', 'ed')]
    });
    
    // In production, save to database
    
    return NextResponse.json({
      success: true,
      message: 'Usage tracked successfully',
      usage,
      remaining: {
        contacts: BETA_LIMITS.contactEnrichmentLimit - usage.contactsEnriched,
        emails: BETA_LIMITS.emailValidationLimit - usage.emailsValidated,
        exports: BETA_LIMITS.exportLimit - usage.exportsGenerated,
        apiCalls: BETA_LIMITS.apiCallsLimit - usage.apiCallsMade
      }
    });
    
  } catch (error) {
    console.error('❌ Error tracking beta usage:', error);
    
    return NextResponse.json({
      error: 'Failed to track usage',
      success: false
    }, { status: 500 });
  }
}