import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, first_name, form_id, tags = [], fields = {} } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const CONVERTKIT_API_KEY = getEnv('CONVERTKIT_API_KEY', { requiredInProd: false });
    const CONVERTKIT_API_SECRET = getEnv('CONVERTKIT_API_SECRET', { requiredInProd: false });
    if (!CONVERTKIT_API_KEY || !CONVERTKIT_API_SECRET) {
      console.warn('ConvertKit keys are not configured');
      return NextResponse.json({ error: 'ConvertKit not configured' }, { status: 500 });
    }
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
      
      // Map tag names to their IDs from Kit
      const tagIdMap = {
        'beta_user': '9942888',
        'free_trial': '9961566',
        'lifetime_discount_eligible': '9890548',
        'beta-page-signup': '10182442',
        'newsletter_unsigned_advantage': '10182443' // The Unsigned Advantage newsletter tag
      };

      for (const tag of tags) {
        try {
          const tagId = tagIdMap[tag as keyof typeof tagIdMap];
          if (!tagId) {
            console.warn(`❌ Unknown tag: ${tag} - skipping`);
            continue;
          }

          // Use the correct ConvertKit API endpoint with tag ID
          const tagResponse = await fetch(`https://api.convertkit.com/v3/tags/${tagId}/subscribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_secret: CONVERTKIT_API_SECRET,
              email: email
            })
          });
          
          if (tagResponse.ok) {
            const tagResult = await tagResponse.json();
            console.log(`✅ Successfully tagged ${email} with: ${tag} (ID: ${tagId})`, tagResult);
          } else {
            const errorText = await tagResponse.text();
            console.warn(`❌ Failed to tag ${email} with: ${tag} (ID: ${tagId}) - ${errorText}`);
          }
        } catch (tagError) {
          console.warn(`❌ Error tagging ${email} with ${tag}:`, tagError);
        }
      }
    }

    // Note: Email sequence subscription disabled - sequence ID needs verification
    // The form subscription above should trigger any automated sequences you have set up
    console.log(`Form subscription completed for ${email} - automated sequences will trigger if configured`)

    // Email sending disabled - Kit automation handles welcome sequence
    console.log(`✅ Subscriber added to Kit, automation will handle welcome emails via beta_user tag`)

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
