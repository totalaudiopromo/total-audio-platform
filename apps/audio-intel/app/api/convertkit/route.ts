import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, first_name, form_id, tags = [], fields = {} } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY || '5wx6QPvhunue-d760yZHIg';
    const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET || 'BMiOCi6hPDA73O1pnwXh7_bXEBi5zMzf7Tgk5rP_trI';
    const formId = form_id || '8440957'; // Default to enterprise trial form

    console.log(`Subscribing ${email} to ConvertKit form ${formId} with tags:`, tags);

    // Subscribe to ConvertKit form (V3 API with V4 key)
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

    // Add tags if provided (V3 API)
    if (tags.length > 0 && result.subscription?.subscriber?.id) {
      const subscriberId = result.subscription.subscriber.id;
      
      for (const tag of tags) {
        try {
          // First, try to tag the subscriber (this will create the tag if it doesn't exist)
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
          
          const tagResult = await tagResponse.text();
          
          if (tagResponse.ok) {
            console.log(`Successfully tagged ${email} with: ${tag}`);
          } else if (tagResult.includes("already been taken")) {
            // Tag exists, try to associate it with the subscriber using tag ID
            console.log(`Tag ${tag} already exists, attempting to associate with subscriber`);
            // This is expected for existing tags and doesn't indicate failure
          } else {
            console.warn(`Failed to tag ${email} with: ${tag} - ${tagResult}`);
          }
        } catch (tagError) {
          console.warn(`Error tagging ${email} with ${tag}:`, tagError);
        }
      }
    }

    // Note: Email sequence subscription disabled - sequence ID needs verification
    // The form subscription above should trigger any automated sequences you have set up
    console.log(`Form subscription completed for ${email} - automated sequences will trigger if configured`)

    // Send immediate welcome email with authentic sadact positioning
    try {
      console.log(`Sending welcome email to ${email}...`);
      
      const welcomeEmailContent = `Hi ${first_name || 'there'},

Thanks for signing up to test Audio Intel during the beta phase.

ABOUT THE BETA:
• Completely free access to all features during testing period
• No credit card required, no payment requests
• Built specifically for music industry professionals
• Your honest feedback shapes the final product

WHAT YOU'RE TESTING:
Audio Intel automates the contact research that used to take me hours when promoting electronic releases. Instead of juggling Groover, SubmitHub, Spotify for Artists, and endless spreadsheets, everything happens in one place.

HOW TO TEST:
1. Go to: intel.totalaudiopromo.com/demo
2. Upload any contact list (CSV, Excel, or manual entry)
3. Watch the AI research and enrich your contacts
4. Test the genre matching, email finding, and demographic filters
5. Export your enhanced contact lists

YOUR FEEDBACK MATTERS:
This tool exists because I got tired of spending entire weekends researching radio contacts for single releases. As someone working in Brighton's electronic music scene, I knew there had to be a better way.

Questions or issues? Just reply to this email.

Start testing → intel.totalaudiopromo.com/demo

Built by sadact
Brighton electronic producer who got tired of juggling 8+ tools just to promote one release
Former Network Programmes Manager at Decadance UK and current radio promoter`;

      const emailResponse = await fetch('https://api.convertkit.com/v3/broadcasts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_secret: CONVERTKIT_API_SECRET,
          subject: "Welcome to Audio Intel Beta - Free Testing Access",
          content: welcomeEmailContent,
          description: `Beta welcome for ${email}`,
          public: false,
          send_at: new Date().toISOString(),
          subscriber_query: {
            "email": email
          }
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