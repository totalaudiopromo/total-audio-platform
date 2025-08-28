import { NextResponse } from 'next/server';

interface BetaSignup {
  name: string;
  email: string;
  role: 'independent-artist' | 'pr-agency' | 'label' | 'other';
  interests: string[];
  referralSource: string;
  currentTools: string;
  goals: string;
  timestamp: string;
}

// In production, this would save to your database
// For now, we'll log and store in memory/Notion
export async function POST(request: Request) {
  try {
    const signupData: BetaSignup = await request.json();
    
    // Add timestamp
    const betaUser = {
      ...signupData,
      timestamp: new Date().toISOString(),
      status: 'pending',
      id: `beta-${Date.now()}`
    };
    
    console.log('🎉 New beta signup:', {
      name: betaUser.name,
      email: betaUser.email,
      role: betaUser.role,
      interests: betaUser.interests.length
    });
    
    // In production, you would:
    // 1. Save to database
    // 2. Send welcome email
    // 3. Add to ConvertKit/Mailchimp
    // 4. Create user account
    // 5. Send Slack/Discord notification
    
    // For now, simulate successful signup
    const welcomeEmail = {
      to: betaUser.email,
      subject: '🚀 Welcome to Total Audio Promo Beta!',
      content: `
        Hi ${betaUser.name}!
        
        Thanks for joining our beta program! Here's what happens next:
        
        🎵 AUDIO INTEL BETA ACCESS:
        → Visit: http://localhost:3001
        → Start enriching contacts immediately
        → 100 contact enrichments per month
        → 200 email validations per month
        → 10 CSV exports per month
        
        🎛️ COMMAND CENTRE:
        → Visit: http://localhost:3000
        → Monitor your progress
        → Real-time beta analytics
        
        🤝 DIRECT SUPPORT:
        → Email: info@totalaudiopromo.com
        → We respond within 2 hours
        → Your feedback shapes the product
        
        Ready to transform your music promotion?
        
        Best,
        The Total Audio Promo Team
      `
    };
    
    // Simulate email sending
    console.log('📧 Welcome email queued:', welcomeEmail.subject);
    
    // Add to beta tracking
    try {
      await fetch('http://localhost:3000/api/beta-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: betaUser.id,
          email: betaUser.email,
          name: betaUser.name,
          app: 'beta-signup',
          action: 'signup_completed',
          timestamp: betaUser.timestamp,
          metadata: {
            role: betaUser.role,
            interests: betaUser.interests,
            currentTools: betaUser.currentTools
          }
        }),
      });
    } catch (trackingError) {
      console.error('Beta tracking error:', trackingError);
    }
    
    // In production, save to Notion for tracking
    const notionData = {
      Name: betaUser.name,
      Email: betaUser.email,
      Role: betaUser.role,
      Interests: betaUser.interests.join(', '),
      'Current Tools': betaUser.currentTools,
      Goals: betaUser.goals,
      'Signup Date': betaUser.timestamp,
      Status: 'Active Beta User'
    };
    
    console.log('📊 Beta user data ready for Notion:', {
      email: notionData.Email,
      role: notionData.Role,
      interests: notionData.Interests.split(', ').length
    });
    
    return NextResponse.json({
      success: true,
      message: 'Welcome to the beta!',
      userId: betaUser.id,
      accessLinks: {
        audioIntel: 'http://localhost:3001',
        commandCentre: 'http://localhost:3000'
      },
      betaLimits: {
        contactEnrichments: 100,
        emailValidations: 200,
        csvExports: 10,
        period: 'monthly'
      },
      welcomeEmail: {
        sent: true,
        to: betaUser.email
      }
    });
    
  } catch (error) {
    console.error('❌ Beta signup error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Signup failed. Please try again.',
      details: error.message
    }, { status: 500 });
  }
}

// GET endpoint to list beta signups (for admin)
export async function GET() {
  try {
    // In production, this would fetch from your database
    // For now, return sample data
    
    const betaSignups = [
      {
        id: 'beta-001',
        name: 'Sarah Mitchell',
        email: 'sarah@independentartist.com',
        role: 'independent-artist',
        interests: ['contact-enrichment', 'playlist-discovery'],
        signupDate: '2025-08-10T10:30:00Z',
        status: 'active'
      },
      {
        id: 'beta-002', 
        name: 'Mike Thompson',
        email: 'mike@musicpr.co.uk',
        role: 'pr-agency',
        interests: ['multi-client-tools', 'api-integrations'],
        signupDate: '2025-08-12T14:15:00Z',
        status: 'active'
      }
    ];
    
    return NextResponse.json({
      totalSignups: betaSignups.length,
      signups: betaSignups,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching beta signups:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch beta signups',
      totalSignups: 0,
      signups: []
    }, { status: 500 });
  }
}