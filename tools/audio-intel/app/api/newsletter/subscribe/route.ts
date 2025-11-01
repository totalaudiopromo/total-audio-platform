import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const NEWSLETTER_FILE = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');
// SECURITY: Hardcoded API key removed
const CONVERTKIT_API_KEY = process.env.KIT_API_KEY || process.env.CONVERTKIT_API_KEY;
const NEWSLETTER_FORM_ID = '8405293'; // Newsletter form ID
const NEWSLETTER_SEQUENCE_ID = '2453582'; // Newsletter sequence ID

interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  source: string;
  tags: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'homepage' } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Ensure data directory exists
    const dataDir = path.dirname(NEWSLETTER_FILE);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Load existing subscribers
    let subscribers: NewsletterSubscriber[] = [];
    try {
      const existingData = await fs.readFile(NEWSLETTER_FILE, 'utf-8');
      subscribers = JSON.parse(existingData);
    } catch {
      // File doesn't exist yet, start with empty array
    }

    // Check if email already exists
    const existingSubscriber = subscribers.find(
      sub => sub.email.toLowerCase() === email.toLowerCase()
    );
    if (existingSubscriber) {
      // Update existing subscriber
      existingSubscriber.subscribedAt = new Date().toISOString();
      existingSubscriber.source = source;
      if (!existingSubscriber.tags.includes('newsletter')) {
        existingSubscriber.tags.push('newsletter');
      }
    } else {
      // Add new subscriber
      subscribers.push({
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString(),
        source,
        tags: ['newsletter', 'audio-intel'],
      });
    }

    // Save updated subscribers
    await fs.writeFile(NEWSLETTER_FILE, JSON.stringify(subscribers, null, 2));

    // Log subscription for monitoring
    console.log(`Newsletter subscription: ${email} via ${source}`);

    // Subscribe to ConvertKit newsletter sequence
    try {
      // Subscribe directly to ConvertKit subscribers API (bypasses form confirmation emails)
      const formResponse = await fetch(`https://api.convertkit.com/v3/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_secret: process.env.CONVERTKIT_API_SECRET,
          email: email,
          fields: {
            source: source,
            signup_timestamp: new Date().toISOString(),
            form_id: NEWSLETTER_FORM_ID,
          },
          state: 'active', // Skip confirmation step
        }),
      });

      if (formResponse.ok) {
        const subscriptionResult = await formResponse.json();
        console.log(`✅ Newsletter ConvertKit subscription successful for ${email}`);

        // Add newsletter tag
        const subscriberId = subscriptionResult.subscriber?.id;
        if (subscriberId) {
          await fetch(`https://api.convertkit.com/v3/subscribers/${subscriberId}/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_secret: process.env.CONVERTKIT_API_SECRET,
              tag: 'newsletter_subscriber',
            }),
          });
        }

        // Send authentic welcome email
        const welcomeEmailData = {
          api_key: CONVERTKIT_API_KEY,
          subject: 'Quick question about your music marketing',
          content: `<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <p>Hi there,</p>
  
  <p>Thanks for subscribing to the Audio Intel newsletter.</p>
  
  <p>Right, so I don't send traditional newsletters. What you'll get instead is updates when new features drop, behind-scenes looks at building this in public, and music industry insights from real radio promotion campaigns.</p>
  
  <p>The thing is, most music marketing newsletters are either too corporate or too salesy. Mine's just me sharing what's working whilst building tools that I actually use for my own sadact project.</p>
  
  <p>If you get a sec, would appreciate if you could hit reply and let me know:</p>
  <ol style="color: #555;">
    <li>What's your biggest music marketing headache right now?</li>
    <li>Are you indie artist, label, or something else?</li>
  </ol>
  
  <p>I read every single reply and it genuinely shapes what gets built next.</p>
  
  <p>Also, if you signed up for the newsletter but actually wanted beta access to Audio Intel, just reply with "BETA" and I'll sort that immediately.</p>
  
  <p>Cheers,<br>
  Chris</p>
  
  <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
    PS: Building all this with AI-assisted development tools. The productivity gains are honestly mental - shipping features 10x faster than traditional coding.
  </p>

  <div style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
    <img src="https://intel.totalaudiopromo.com/chris-schofield-founder-photo.jpg" alt="Chris Schofield" style="width: 80px; height: 80px; border-radius: 50%; float: left; margin-right: 20px;">
    <div style="overflow: hidden;">
      <p style="margin: 0; font-weight: 600; color: #1a1a1a;">Chris Schofield</p>
      <p style="margin: 5px 0; color: #666; font-size: 14px;">Founder, Audio Intel</p>
      <p style="margin: 0; color: #666; font-size: 14px;">chris@totalaudiopromo.com</p>
    </div>
  </div>
  
</body>
</html>`,
          description: `Newsletter welcome for ${email}`,
          public: false,
          from_name: 'Chris Schofield - Audio Intel',
          from_email: 'chris@totalaudiopromo.com',
          reply_to: 'chris@totalaudiopromo.com',
        };

        // Send welcome email directly to subscriber
        await fetch(`https://api.convertkit.com/v3/subscribers/${subscriberId}/emails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_secret: process.env.CONVERTKIT_API_SECRET,
            subject: welcomeEmailData.subject,
            content: welcomeEmailData.content,
            from_name: welcomeEmailData.from_name,
            from_email: welcomeEmailData.from_email,
            reply_to: welcomeEmailData.reply_to,
          }),
        });

        console.log(`📧 Newsletter welcome email sent to ${email}`);
      } else {
        console.warn(`⚠️ ConvertKit newsletter subscription failed for ${email}`);
      }
    } catch (convertkitError) {
      console.error('ConvertKit newsletter subscription error:', convertkitError);
    }

    // Track user engagement
    await trackUserEngagement('newsletter_signup', { email, source });

    return NextResponse.json({
      success: true,
      message: 'Cheers! Newsletter subscription sorted. Check your email in a mo.',
      subscriberCount: subscribers.length,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Subscription failed. Please try again or contact support.' },
      { status: 500 }
    );
  }
}

async function trackUserEngagement(action: string, data: any) {
  try {
    const engagementFile = path.join(process.cwd(), 'data', 'user-engagement.json');
    const dataDir = path.dirname(engagementFile);

    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    let engagements: any[] = [];
    try {
      const existingData = await fs.readFile(engagementFile, 'utf-8');
      engagements = JSON.parse(existingData);
    } catch {
      // File doesn't exist yet, start with empty array
    }

    engagements.push({
      timestamp: new Date().toISOString(),
      action,
      data,
      userAgent: 'server-side',
      ip: 'server-side',
    });

    // Keep only last 1000 engagements to prevent file from growing too large
    if (engagements.length > 1000) {
      engagements = engagements.slice(-1000);
    }

    await fs.writeFile(engagementFile, JSON.stringify(engagements, null, 2));
  } catch (error) {
    console.error('Failed to track user engagement:', error);
  }
}
