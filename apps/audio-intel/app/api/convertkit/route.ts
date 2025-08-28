import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, first_name, form_id, tags = [], fields = {} } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const CONVERTKIT_API_KEY = process.env.KIT_API_KEY || process.env.CONVERTKIT_API_KEY || '5wx6QPvhunue-d760yZHIg';
    const formId = form_id || '8440957'; // Default to enterprise trial form

    console.log(`Subscribing ${email} to ConvertKit form ${formId} with tags:`, tags);

    // Subscribe to ConvertKit form
    const convertkitResponse = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    if (!convertkitResponse.ok) {
      const errorText = await convertkitResponse.text();
      console.error(`ConvertKit subscription failed for ${email}:`, errorText);
      return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
    }

    const result = await convertkitResponse.json();
    console.log(`Successfully subscribed ${email} to ConvertKit`, result);

    // Add tags if provided
    if (tags.length > 0 && result.subscription?.subscriber?.id) {
      const subscriberId = result.subscription.subscriber.id;
      
      for (const tag of tags) {
        try {
          const tagResponse = await fetch(`https://api.convertkit.com/v3/tags`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_key: CONVERTKIT_API_KEY,
              tag: {
                name: tag,
                email: email
              }
            })
          });
          
          if (tagResponse.ok) {
            console.log(`Successfully tagged ${email} with: ${tag}`);
          } else {
            console.warn(`Failed to tag ${email} with: ${tag}`);
          }
        } catch (tagError) {
          console.warn(`Error tagging ${email} with ${tag}:`, tagError);
        }
      }
    }

    // Subscribe to beta email sequence (ID: 2453581)
    try {
      const sequenceResponse = await fetch(`https://api.convertkit.com/v3/courses/2453581/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email: email
        })
      });
      
      if (sequenceResponse.ok) {
        console.log(`Successfully subscribed ${email} to beta sequence 2453581`);
      } else {
        console.warn(`Failed to subscribe ${email} to beta sequence`);
      }
    } catch (sequenceError) {
      console.warn('Error subscribing to sequence:', sequenceError);
    }

    // Send immediate welcome email using the broadcast we created
    try {
      console.log(`Sending welcome email to ${email}...`);
      
      const welcomeEmailContent = `Hi ${first_name || 'there'}!

Welcome to Audio Intel beta! 🎉

You now have FREE access to test everything. No payment required.

🆓 YOUR FREE BETA ACCESS:
• Complete access to all Audio Intel features  
• Test with real campaigns and contact lists
• Direct access to me for questions/feedback

🎁 LIFETIME DISCOUNT WHEN READY:
• Lock in £9.99/month FOREVER (50% off £19.99 retail)
• Only available to beta testers like you
• No pressure - test everything first

⚡ GET STARTED:
intel.totalaudiopromo.com/upload

Questions? Just reply to this email.

Chris Schofield
Founder, Audio Intel
🎵 Working radio promoter building tools for real campaigns`;

      const emailResponse = await fetch('https://api.convertkit.com/v3/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          subject: "🎉 Welcome to Audio Intel Beta - Free Access!",
          content: welcomeEmailContent,
          description: `Beta welcome for ${email}`,
          public: false,
          send_at: new Date().toISOString(),
          email_address: email
        })
      });
      
      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        console.log(`✅ Welcome email sent to ${email} (Broadcast ID: ${emailResult.broadcast?.id})`);
      } else {
        console.warn(`⚠️ Welcome email failed for ${email}`);
      }
    } catch (emailError) {
      console.warn('Welcome email error:', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to beta access - welcome email sent!',
      subscriber_id: result.subscription?.subscriber?.id 
    });

  } catch (error) {
    console.error('ConvertKit API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process subscription' 
    }, { status: 500 });
  }
}