import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';
import { newsletterTemplates } from '@/utils/newsletterTemplates';
import { newsletterResearch } from '@/utils/newsletterContentStrategy';

export async function POST(req: NextRequest) {
  try {
    const { type, to, subject, data } = await req.json();

    if (!to || !type) {
      return NextResponse.json({ error: 'Email and type are required' }, { status: 400 });
    }

    // Get the appropriate template
    let template;
    let emailSubject = subject;

    switch (type) {
      case 'welcome':
        template = newsletterTemplates.welcome;
        emailSubject = emailSubject || 'Welcome to The Unsigned Advantage! 🎵';
        break;
      case 'weekly':
        template = newsletterTemplates.weekly;
        emailSubject = emailSubject || `The Unsigned Advantage - Issue ${data?.issueNumber || 1}`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
    }

    // Generate HTML content
    const html = template(data || {});

    // Send email via your preferred service (ConvertKit, SendGrid, etc.)
    const emailResponse = await sendEmailViaConvertKit(to, emailSubject, html);

    if (emailResponse.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Newsletter sent successfully',
        emailId: emailResponse.emailId 
      });
    } else {
      throw new Error(emailResponse.error || 'Failed to send email');
    }

  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Generate and send weekly newsletter to all subscribers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const weekNumber = parseInt(searchParams.get('week') || '1');
    const testMode = searchParams.get('test') === 'true';

    // Generate content for this week
    const content = await newsletterResearch.generateWeeklyContent(weekNumber);

    if (testMode) {
      // Return preview without sending
      const html = newsletterTemplates.weekly(content);
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Get all newsletter subscribers from ConvertKit
    const subscribers = await getNewsletterSubscribers();
    
    if (subscribers.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No subscribers found',
        sent: 0 
      });
    }

    // Send to all subscribers
    const results = await Promise.allSettled(
      subscribers.map(subscriber => 
        sendEmailViaConvertKit(
          subscriber.email, 
          `The Unsigned Advantage - Issue ${content.issueNumber}`,
          newsletterTemplates.weekly({ ...content, firstName: subscriber.firstName })
        )
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${successful} subscribers`,
      sent: successful,
      failed: failed,
      content: content
    });

  } catch (error) {
    console.error('Newsletter generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate newsletter', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Send email via ConvertKit
async function sendEmailViaConvertKit(to: string, subject: string, html: string) {
  const CONVERTKIT_API_KEY = getEnv('CONVERTKIT_API_KEY', { requiredInProd: false });
  
  if (!CONVERTKIT_API_KEY) {
    console.warn('ConvertKit API key not configured');
    return { success: false, error: 'ConvertKit not configured' };
  }

  try {
    // Use ConvertKit's broadcast API to send emails
    const response = await fetch('https://api.convertkit.com/v3/broadcasts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        subject: subject,
        content: html,
        email_address: to,
        // You might want to use a different approach for individual emails
        // This is a simplified version
      })
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, emailId: result.broadcast?.id };
    } else {
      const errorText = await response.text();
      console.error('ConvertKit email send failed:', errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error('ConvertKit email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get newsletter subscribers from ConvertKit
async function getNewsletterSubscribers() {
  const CONVERTKIT_API_KEY = getEnv('CONVERTKIT_API_KEY', { requiredInProd: false });
  const CONVERTKIT_API_SECRET = getEnv('CONVERTKIT_API_SECRET', { requiredInProd: false });
  
  if (!CONVERTKIT_API_KEY || !CONVERTKIT_API_SECRET) {
    console.warn('ConvertKit credentials not configured');
    return [];
  }

  try {
    // Get subscribers with the newsletter tag
    const response = await fetch(`https://api.convertkit.com/v3/tags/10182443/subscribers?api_secret=${CONVERTKIT_API_SECRET}`);
    
    if (response.ok) {
      const result = await response.json();
      return result.subscribers?.map((sub: any) => ({
        email: sub.email_address,
        firstName: sub.first_name || '',
        id: sub.id
      })) || [];
    } else {
      console.error('Failed to fetch newsletter subscribers:', await response.text());
      return [];
    }
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
}
