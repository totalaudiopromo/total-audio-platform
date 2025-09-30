import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const BETA_SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'beta-subscribers.json');
const USER_ENGAGEMENT_FILE = path.join(process.cwd(), 'data', 'user-engagement.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, first_name, form_id, tags = [], fields = {} } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // SECURITY: Hardcoded API key removed
    const CONVERTKIT_API_KEY = process.env.KIT_API_KEY || process.env.CONVERTKIT_API_KEY;
    const formId = form_id || '8440957';

    console.log(`🔄 Processing beta signup for ${email}...`);

    // Subscribe to ConvertKit form
    const formResponse = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: email,
        first_name: first_name || '',
        fields: {
          ...fields,
          signup_timestamp: new Date().toISOString(),
        }
      })
    });

    if (!formResponse.ok) {
      const errorText = await formResponse.text();
      console.error(`❌ ConvertKit subscription failed for ${email}:`, errorText);
      return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
    }

    const subscriptionResult = await formResponse.json();
    const subscriberId = subscriptionResult.subscription?.subscriber?.id;
    console.log(`✅ Successfully subscribed ${email} to ConvertKit (ID: ${subscriberId})`);

    // Add tags if provided
    if (tags.length > 0 && subscriberId) {
      for (const tag of tags) {
        try {
          const tagResponse = await fetch(`https://api.convertkit.com/v3/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: CONVERTKIT_API_KEY,
              tag: { name: tag },
              email: email
            })
          });

          if (tagResponse.ok) {
            console.log(`🏷️ Tagged ${email} with: ${tag}`);
          }
        } catch (tagError) {
          console.warn(`⚠️ Error tagging ${email} with ${tag}:`, tagError);
        }
      }
    }

    // Send a clean, branded welcome email immediately
    try {
      console.log(`📧 Sending branded welcome email to ${email}...`);

      // Send immediate welcome email using broadcasts API
      const welcomeEmailData = {
        api_key: CONVERTKIT_API_KEY,
        subject: "Your Audio Intel beta access is sorted",
        content: `<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
    <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 10px 0;">Welcome to Audio Intel</h1>
    <p style="color: #666; margin: 0;">The AI-powered music PR platform that's going to save you 15+ hours per week and increase your campaign success rates.</p>
  </div>

  <p>Hi ${first_name || 'there'},</p>
  
  <p>Right, so your Audio Intel beta access is sorted.</p>
  
  <p>Been building this for months whilst running my own radio campaigns for sadact, and the amount of manual work in music promotion is properly mental. Contact research alone was eating 15+ hours weekly.</p>
  
  <p>Here's what you get during beta:</p>
  <ul style="color: #555;">
    <li>Full access to all Audio Intel features</li>
    <li>Upload and analyse unlimited contact lists</li> 
    <li>Test with real music industry data</li>
    <li>Direct support from me (I read every email)</li>
    <li>No time limits or payment required during beta</li>
  </ul>
  
  <p>The thing is, I spent over two grand on marketing tools last year. Every single one was broken for musicians. Generic CRMs that don't understand radio contacts. Email platforms charging enterprise prices for basic features. Analytics that track vanity metrics instead of what actually matters.</p>
  
  <p><strong>Start testing right now:</strong><br>
  <a href="https://intel.totalaudiopromo.com/upload" style="color: #2538c7;">intel.totalaudiopromo.com/upload</a></p>
  
  <p>Upload any CSV contact list and watch it transform into proper industry intelligence. Takes about 30 seconds per contact to enrich with actual useful data.</p>
  
  <p><strong>Beta pricing when you're ready:</strong><br>
  £9.99/month forever as a founding beta user<br>
  <span style="color: #666; font-size: 14px;">(50% off retail, locked in for life because you're helping test this properly)</span></p>
  
  <p>Quick favour - if you get a sec to test the upload feature, would appreciate any feedback. Building this in public and your input genuinely shapes what gets built next.</p>
  
  <p>Questions? Just reply to this email. I personally respond to every single one.</p>
  
  <p>Cheers,<br>
  Chris</p>
  
  <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
    PS: Building this with Cursor and Claude Code if you're into that sort of thing. The AI-assisted development workflow has been game-changing for shipping features fast.
  </p>

  <div style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
    <img src="https://intel.totalaudiopromo.com/chris-schofield-founder-photo.jpg" alt="Chris Schofield" style="width: 80px; height: 80px; border-radius: 50%; float: left; margin-right: 20px;">
    <div style="overflow: hidden;">
      <p style="margin: 0; font-weight: 600; color: #1a1a1a;">Chris Schofield</p>
      <p style="margin: 5px 0; color: #666; font-size: 14px;">Founder, Audio Intel</p>
      <p style="margin: 0; color: #666; font-size: 14px;">Building tools for musicians, by a musician</p>
    </div>
  </div>
  
</body>
</html>`,
        description: `Authentic beta welcome for ${email}`,
        public: false,
        from_name: "Chris Schofield - Audio Intel",
        from_email: "chris@totalaudiopromo.com",
        reply_to: "chris@totalaudiopromo.com"
      };

      // Send the welcome email as a broadcast
      const welcomeResponse = await fetch('https://api.convertkit.com/v3/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(welcomeEmailData)
      });

      if (welcomeResponse.ok) {
        const welcomeResult = await welcomeResponse.json();
        console.log(`✅ Welcome email sent immediately to ${email} (Broadcast ID: ${welcomeResult.broadcast?.id})`);
      } else {
        console.warn(`⚠️ Welcome email failed for ${email}:`, await welcomeResponse.text());
      }
    } catch (emailError) {
      console.warn('Welcome email error:', emailError);
    }
    
    const emailSent = true;

    // Save beta signup locally for backup and analytics
    await saveBetaSubscriberLocally({
      email,
      first_name: first_name || '',
      subscriber_id: subscriberId,
      form_id: formId,
      tags,
      fields,
      subscribed_at: new Date().toISOString(),
      source: fields.signup_source || 'beta_form'
    });

    // Track engagement event
    await trackUserEngagement('beta_signup', {
      email,
      first_name: first_name || '',
      subscriber_id: subscriberId,
      source: fields.signup_source || 'beta_form',
      tags
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Beta signup successful! Check your email for welcome message.',
      subscriber_id: subscriberId,
      form_id: formId,
      tags_applied: tags,
      branded_email_sent: emailSent
    });

  } catch (error) {
    console.error('❌ ConvertKit API error:', error);
    return NextResponse.json({ 
      error: 'Signup failed: ' + (error instanceof Error ? (error instanceof Error ? error.message : 'Unknown error') : 'Unknown error') 
    }, { status: 500 });
  }
}

async function saveBetaSubscriberLocally(subscriber: any) {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(BETA_SUBSCRIBERS_FILE);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Load existing beta subscribers
    let subscribers: any[] = [];
    try {
      const existingData = await fs.readFile(BETA_SUBSCRIBERS_FILE, 'utf-8');
      subscribers = JSON.parse(existingData);
    } catch {
      // File doesn't exist yet, start with empty array
    }

    // Check if email already exists, update if so
    const existingIndex = subscribers.findIndex(sub => sub.email.toLowerCase() === subscriber.email.toLowerCase());
    if (existingIndex !== -1) {
      // Update existing subscriber
      subscribers[existingIndex] = {
        ...subscribers[existingIndex],
        ...subscriber,
        updated_at: new Date().toISOString()
      };
      console.log(`📝 Updated existing beta subscriber: ${subscriber.email}`);
    } else {
      // Add new subscriber
      subscribers.push(subscriber);
      console.log(`📝 Saved new beta subscriber locally: ${subscriber.email}`);
    }

    // Save updated subscribers
    await fs.writeFile(BETA_SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));

  } catch (error) {
    console.error('Failed to save beta subscriber locally:', error);
  }
}

async function trackUserEngagement(action: string, data: any) {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(USER_ENGAGEMENT_FILE);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    let engagements: any[] = [];
    try {
      const existingData = await fs.readFile(USER_ENGAGEMENT_FILE, 'utf-8');
      engagements = JSON.parse(existingData);
    } catch {
      // File doesn't exist yet, start with empty array
    }

    engagements.push({
      timestamp: new Date().toISOString(),
      action,
      data,
      userAgent: 'server-side',
      ip: 'server-side'
    });

    // Keep only last 1000 engagements to prevent file from growing too large
    if (engagements.length > 1000) {
      engagements = engagements.slice(-1000);
    }

    await fs.writeFile(USER_ENGAGEMENT_FILE, JSON.stringify(engagements, null, 2));
    console.log(`📊 Tracked engagement: ${action} for ${data.email || 'unknown'}`);

  } catch (error) {
    console.error('Failed to track user engagement:', error);
  }
}