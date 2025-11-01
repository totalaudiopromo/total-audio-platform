import { NextRequest, NextResponse } from 'next/server';
import { getBetaUserStatus } from '@/utils/betaAccessControl';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // In a real app, you'd fetch this from a database
    // For now, we'll use a simple approach with localStorage/cookies
    // or integrate with ConvertKit to get signup timestamp

    // Mock implementation - in production, fetch from ConvertKit or database
    const mockSignupDate = new Date();
    mockSignupDate.setDate(mockSignupDate.getDate() - 7); // 7 days ago for testing

    const status = getBetaUserStatus(email, mockSignupDate.toISOString());

    return NextResponse.json({
      success: true,
      betaStatus: status,
    });
  } catch (error) {
    console.error('Beta status API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to check beta status',
      },
      { status: 500 }
    );
  }
}

// Get beta user status by email
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  try {
    // Mock data - in production, fetch from ConvertKit API or database
    const mockSignupDate = new Date();
    mockSignupDate.setDate(mockSignupDate.getDate() - 7); // 7 days ago

    const status = getBetaUserStatus(email, mockSignupDate.toISOString());

    return NextResponse.json({
      success: true,
      betaStatus: status,
    });
  } catch (error) {
    console.error('Beta status check error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve beta status',
      },
      { status: 500 }
    );
  }
}
