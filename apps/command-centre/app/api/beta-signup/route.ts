import { NextRequest, NextResponse } from 'next/server';

interface BetaSignupData {
  name: string;
  email: string;
  role: 'independent-artist' | 'pr-agency' | 'label' | 'other';
  interests: string[];
  referralSource: string;
  currentTools: string;
  goals: string;
  company?: string;
  website?: string;
}

// In-memory storage for demo (in production, this would use a database)
const betaSignups: (BetaSignupData & { id: string; signupDate: string; status: 'pending' | 'approved' | 'rejected' })[] = [];

export async function POST(request: NextRequest) {
  try {
    const signupData: BetaSignupData = await request.json();

    // Validate required fields
    const required = ['name', 'email', 'role', 'referralSource', 'goals'];
    const missing = required.filter(field => !signupData[field as keyof BetaSignupData]);
    
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingSignup = betaSignups.find(signup => signup.email === signupData.email);
    if (existingSignup) {
      return NextResponse.json(
        { error: 'This email is already registered for beta access' },
        { status: 409 }
      );
    }

    // Create new beta signup
    const newSignup = {
      id: `beta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...signupData,
      signupDate: new Date().toISOString(),
      status: 'pending' as const
    };

    betaSignups.push(newSignup);

    // Log the signup
    console.log(`[${new Date().toISOString()}] New beta signup:`, {
      id: newSignup.id,
      email: newSignup.email,
      role: newSignup.role,
      source: newSignup.referralSource
    });

    return NextResponse.json({
      success: true,
      signupId: newSignup.id,
      message: 'Beta signup successful! You will receive an email with next steps.',
      data: {
        id: newSignup.id,
        email: newSignup.email,
        status: newSignup.status,
        signupDate: newSignup.signupDate
      }
    });

  } catch (error) {
    console.error('Beta signup error:', error);
    return NextResponse.json(
      { error: 'Failed to process beta signup' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let filteredSignups = betaSignups;
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filteredSignups = betaSignups.filter(signup => signup.status === status);
    }

    // Sort by signup date (newest first)
    filteredSignups.sort((a, b) => new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime());

    return NextResponse.json({
      success: true,
      signups: filteredSignups,
      total: filteredSignups.length,
      stats: {
        pending: betaSignups.filter(s => s.status === 'pending').length,
        approved: betaSignups.filter(s => s.status === 'approved').length,
        rejected: betaSignups.filter(s => s.status === 'rejected').length,
        total: betaSignups.length
      }
    });

  } catch (error) {
    console.error('Failed to fetch beta signups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beta signups' },
      { status: 500 }
    );
  }
}