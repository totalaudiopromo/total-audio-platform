import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
}

interface ChatRequest {
  message: string;
  userTier: 'free' | 'professional' | 'agency';
  conversationHistory: ChatMessage[];
}

// Knowledge base for common Audio Intel questions
const KNOWLEDGE_BASE = {
  pricing: {
    keywords: ['price', 'cost', 'plan', 'subscription', 'billing', 'payment', 'tier', 'upgrade', 'coffee', 'cheap', 'expensive'],
    response: `Audio Intel pricing (proper honest breakdown):

**FREE BETA - "Try The Real Thing"**
• FREE during beta - No card needed, no tricks
• 100 contact enrichments - Proper campaigns, not just a tease
• All the AI research features - We're not holding anything back
• Email validation included - Stops you looking daft with bounced emails
• Results in 2-3 minutes - Time for a brew whilst it works

**PROFESSIONAL - "Get Ahead of the Queue" (£19.99/mo)**
• 67p/day - what you spend on coffee
• 200 contact enrichments - Scale up without the stress
• Skip the queue - 60-second processing vs 2-3 minute wait
• Professional exports - PDF reports, Excel files, email delivery
• Better analytics - See which campaigns actually work
• Perfect for: Independent artists and small labels who need results yesterday

**AGENCY - "White-Label Everything" (£39.99/mo)**
• Pays for itself if you retain one extra client
• 500 contact enrichments - Handle multiple artists without breaking
• Instant processing - No waiting around for urgent campaigns
• Your branding on everything - Clients think you're the intelligence source
• Perfect for: PR agencies and labels juggling multiple artists`
  },
  
  features: {
    keywords: ['feature', 'what does', 'how does', 'enrichment', 'validation', 'export'],
    response: `Audio Intel's key features (built by working promoters):

• **AI Contact Enrichment**: Transform basic emails into detailed music industry intelligence - genres, submission preferences, coverage areas, recent activity
• **Email Validation**: Professional-grade SMTP testing and spam trap detection - stops you looking daft with bounced emails
• **Multi-Format Exports**: CSV, Excel, PDF with email delivery - proper professional reports your clients will actually want to keep
• **White-Label Options**: Custom branding for agencies - clients think you're the intelligence source
• **Real-Time Processing**: Fast, accurate results using Perplexity AI - no waiting around when you could be pitching`
  },

  contactenrichment: {
    keywords: ['what is contact enrichment', 'contact enrichment', 'enrichment', 'intelligence', 'research'],
    response: `Contact enrichment is transforming basic email lists into actionable intelligence.

Instead of just having john@bbc.co.uk, you get:
• Contact preferences and submission guidelines
• Coverage areas and genre focus  
• Recent playlist additions or show features
• Best times and methods to reach them
• Social media activity and engagement patterns

**Key difference from contact databases:**
- Databases = Generic pre-built lists you buy
- Enrichment = Enhances YOUR existing contacts with specific intelligence

Built specifically for the music industry - generic B2B tools are useless for playlist curators, radio DJs, and music bloggers who all need different approaches.`
  },

  howto: {
    keywords: ['how to', 'tutorial', 'guide', 'upload', 'csv', 'process'],
    response: `Getting started with Audio Intel:

1. **Upload**: Drop your CSV/Excel file with email addresses
2. **Process**: Our AI enriches each contact with industry intelligence  
3. **Review**: Check results with confidence scores and insights
4. **Export**: Download in your preferred format (CSV/Excel/PDF)

Need help with file formatting? We support any CSV format - no headers required!`
  },

  technical: {
    keywords: ['error', 'bug', 'not working', 'problem', 'issue', 'broken'],
    response: `I can help troubleshoot common issues:

• **Upload Problems**: Try CSV format with UTF-8 encoding
• **Enrichment Errors**: Check email format and try smaller batches
• **Export Issues**: Clear browser cache and try again

For technical issues beyond basic troubleshooting, I'll connect you with our development team immediately.`
  },

  contact: {
    keywords: ['contact', 'support', 'help', 'email', 'human', 'speak'],
    response: `I'm Audio, representing the team that built Audio Intel. I'm here to help with any platform questions.

Ways to reach us:
• **Chat with me**: Right here - I have access to all platform knowledge and can help immediately
• **Email support**: info@totalaudiopromo.com for detailed technical issues or billing questions
• **Response times**: Agency users get fastest responses, Professional users get priority, Free beta users get standard support

We're working promoters who built this platform because we needed better tools ourselves. What specific help do you need?`
  },

  beta: {
    keywords: ['beta', 'free', 'trial', 'signup', 'access'],
    response: `Welcome to the Audio Intel Beta! I'm Audio, representing the team that created this platform.

Here's what you get during our free beta:
• **100 contact enrichments monthly** - completely free, no payment required
• **Full platform access** - all AI enrichment and validation features included
• **Beta feedback priority** - your input directly shapes the final product
• **No credit card needed** - we're not collecting payment during beta testing

We built this because we were tired of paying €3-15 per submission to SubmitHub and Groover when artists need direct contact intelligence. Ready to try it? Just upload your contact list and see the difference.`
  }
};

function findBestResponse(message: string, userTier: string): string {
  const lowercaseMessage = message.toLowerCase();
  
  // Check each knowledge category
  for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
    if (data.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return data.response;
    }
  }

  // Fallback responses from Audio representing the founder's voice
  if (userTier === 'agency') {
    return `I'm Audio, representing the team that built this platform. As an Agency user, you get our fastest support because we understand your client needs.

Here's what we can help with immediately:
• White-label everything - your branding on all exports so clients see your intelligence
• 500 enrichments monthly - handle multiple artists efficiently 
• Instant processing - no waiting for urgent campaign deadlines
• Professional reports that justify your fees to clients

I know the agency challenge - you need verified contacts, not submission platforms charging per pitch. What specific industry intelligence do you need?`;
  }

  if (userTier === 'professional') {
    return `I'm Audio, speaking for the working promoters who built this platform. As a Professional user, you get priority responses because we respect your time.

I can help with:
• Contact enrichment - turning basic emails into campaign-ready intelligence
• Professional exports - reports that look like you did the research yourself
• Skip the queue - 60-second processing vs 2-3 minute wait times
• Real analytics - see what actually works in your campaigns

We built this because we were tired of paying €3-15 per submission to SubmitHub when artists need direct contacts. What do you need help with?`;
  }

  return `I'm Audio, the mascot for the working promoters who created this platform. We built Audio Intel because we understand the real problem - you need verified industry contacts, not another submission platform.

I can help with:
• Understanding contact enrichment (it's intelligence, not just databases)
• Getting started with our free beta - 100 enrichments, no payment required
• How our system finds submission preferences, timing, and contact intel
• Why platforms like Groover and SubmitHub charge per submission when you need direct access

We know the struggle because we've lived it. What can I help you understand about getting better campaign results?`;
}

function generateContextualResponse(message: string, userTier: string, history: ChatMessage[]): string {
  // Look for specific questions about the user's experience
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('not working') || lowercaseMessage.includes('error')) {
    return `I can help troubleshoot that issue! For ${userTier} users, I recommend:

1. **Clear browser cache** and refresh the page
2. **Check file format** - CSV files work best  
3. **Verify email format** in your data
4. **Try a smaller batch** (10-20 contacts) first

If the problem persists, I can escalate this to our development team immediately. Can you describe exactly what happens when you encounter the error?`;
  }

  if (lowercaseMessage.includes('cancel') || lowercaseMessage.includes('refund')) {
    return `I understand you're looking into cancellation options. As a ${userTier} user:

• **Cancel anytime** - No long-term contracts
• **Email us**: info@totalaudiopromo.com for immediate cancellation
• **Refund policy**: Pro-rated refunds available within 30 days

Before you go - is there something specific about Audio Intel that isn't meeting your needs? I'd love to help resolve any issues!`;
  }

  return findBestResponse(message, userTier);
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, userTier = 'free', conversationHistory = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json({
        error: 'Message is required'
      }, { status: 400 });
    }

    // Generate response based on message content and user tier
    const response = generateContextualResponse(message, userTier, conversationHistory);

    // Add slight delay to simulate human-like response time
    const delay = userTier === 'agency' ? 500 : userTier === 'professional' ? 1000 : 2000;
    await new Promise(resolve => setTimeout(resolve, delay));

    return NextResponse.json({
      reply: response,
      userTier,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat support error:', error);
    return NextResponse.json({
      error: 'Failed to process chat message'
    }, { status: 500 });
  }
}