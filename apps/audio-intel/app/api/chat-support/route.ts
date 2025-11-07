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
    keywords: [
      'price',
      'cost',
      'plan',
      'subscription',
      'billing',
      'payment',
      'tier',
      'upgrade',
      'coffee',
      'cheap',
      'expensive',
      'money',
      'afford',
      'budget',
    ],
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
• Perfect for: PR agencies and labels juggling multiple artists`,
  },

  features: {
    keywords: [
      'feature',
      'what does',
      'how does',
      'enrichment',
      'validation',
      'export',
      'benefit',
      'help',
      'advantage',
      'good for',
      'useful',
      'value',
    ],
    response: `Audio Intel's key features (built by working promoters):

• **AI Contact Enrichment**: Transform basic emails into detailed music industry intelligence - genres, submission preferences, coverage areas, recent activity
• **Email Validation**: Professional-grade SMTP testing and spam trap detection - stops you looking daft with bounced emails
• **Multi-Format Exports**: CSV, Excel, PDF with email delivery - proper professional reports your clients will actually want to keep
• **White-Label Options**: Custom branding for agencies - clients think you're the intelligence source
• **Real-Time Processing**: Fast, accurate results using Perplexity AI - no waiting around when you could be pitching`,
  },

  contactenrichment: {
    keywords: [
      'what is contact enrichment',
      'contact enrichment',
      'enrichment',
      'intelligence',
      'research',
    ],
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

Built specifically for the music industry - generic B2B tools are useless for playlist curators, radio DJs, and music bloggers who all need different approaches.`,
  },

  howto: {
    keywords: ['how to', 'tutorial', 'guide', 'upload', 'csv', 'process'],
    response: `Getting started with Audio Intel:

1. **Upload**: Drop your CSV/Excel file with email addresses
2. **Process**: Our AI enriches each contact with industry intelligence  
3. **Review**: Check results with confidence scores and insights
4. **Export**: Download in your preferred format (CSV/Excel/PDF)

Need help with file formatting? We support any CSV format - no headers required!`,
  },

  technical: {
    keywords: ['error', 'bug', 'not working', 'problem', 'issue', 'broken'],
    response: `I can help troubleshoot common issues:

• **Upload Problems**: Try CSV format with UTF-8 encoding
• **Enrichment Errors**: Check email format and try smaller batches
• **Export Issues**: Clear browser cache and try again

For technical issues beyond basic troubleshooting, I'll connect you with our development team immediately.`,
  },

  contact: {
    keywords: ['contact', 'support', 'help', 'email', 'human', 'speak'],
    response: `I'm Audio, representing the team that built Audio Intel. I'm here to help with any platform questions.

Ways to reach us:
• **Chat with me**: Right here - I have access to all platform knowledge and can help immediately
• **Email support**: info@totalaudiopromo.com for detailed technical issues or billing questions
• **Response times**: Agency users get fastest responses, Professional users get priority, Free beta users get standard support

We're working promoters who built this platform because we needed better tools ourselves. What specific help do you need?`,
  },

  beta: {
    keywords: ['beta', 'free', 'trial', 'signup', 'access'],
    response: `Welcome to the Audio Intel Beta! I'm Audio, representing the team that created this platform.

Here's what you get during our free beta:
• **100 contact enrichments monthly** - completely free, no payment required
• **Full platform access** - all AI enrichment and validation features included
• **Beta feedback priority** - your input directly shapes the final product
• **No credit card needed** - we're not collecting payment during beta testing

We built this because we were tired of paying €3-15 per submission to SubmitHub and Groover when artists need direct contact intelligence. Ready to try it? Just upload your contact list and see the difference.`,
  },

  independent: {
    keywords: [
      'independent',
      'indie',
      'solo',
      'artists',
      'musician',
      'singer',
      'songwriter',
      'band',
      'self-release',
      'diy',
    ],
    response: `Here's how Audio Intel specifically helps independent artists (we're independent ourselves!):

**Instead of paying €3-15 per submission to SubmitHub/Groover:**
• Get direct contact details with submission preferences
• Know exactly when and how each curator prefers to be contacted
• See their recent activity and what they're actually covering

**Real campaign intelligence:**
• Find out which playlists are actually adding new artists vs just featuring majors
• Get radio show submission windows and preferred formats
• Discover blog writers looking for your genre right now

**Professional credibility:**
• Stop sending generic "please listen to my music" emails
• Reference their recent playlists/articles in your pitch
• Know their coverage focus before you waste their time

**Bottom line**: Transform your campaign from spray-and-pray into targeted intelligence. We built this because we were frustrated artists ourselves - tired of submission platforms that don't give you actual contact control.`,
  },

  playlists: {
    keywords: [
      'playlist',
      'spotify',
      'apple music',
      'curator',
      'streaming',
      'playlisting',
      'playlist pitch',
    ],
    response: `Getting on playlists the right way (no more spray-and-pray submissions):

**The Audio Intel approach:**
• **Find active curators** - See who's actually adding new music vs just featuring majors
• **Know their preferences** - Genre focus, submission timing, preferred formats
• **Personal approach** - Reference their recent adds in your pitch
• **Direct contact** - Skip the intermediary platforms that charge per submission

**Instead of SubmitHub's €3-15 per pitch:**
• Get curator contact details with submission guidelines
• See their recent playlist activity and genre preferences  
• Know the best times to reach them for maximum response
• Build ongoing relationships instead of one-off transactions

We've seen artists go from 0% playlist response rates to 15-20% success rates by using proper intelligence instead of generic mass pitching.`,
  },

  radio: {
    keywords: [
      'radio',
      'radio show',
      'dj',
      'airplay',
      'broadcast',
      'fm',
      'college radio',
      'community radio',
    ],
    response: `Radio promotion that actually works (built by people who've done thousands of campaigns):

**Audio Intel for radio campaigns:**
• **Show-specific intelligence** - Submission windows, format preferences, genre focus
• **DJ contact preferences** - Email timing, follow-up protocols, what they actually want to hear
• **Recent playlist analysis** - See what they've been playing to match your pitch timing
• **Regional targeting** - Find stations covering your tour markets or home base

**Real examples of what you'll discover:**
• "This show only accepts submissions on Tuesdays between 2-4pm"
• "DJ prefers 30-second previews, not full tracks"
• "Station focuses on local artists from these specific postcodes"
• "Show has featured 12 new indie artists this month - actively seeking submissions"

Stop sending generic "please play my song" emails. Start sending targeted pitches based on actual intelligence about what each show needs right now.`,
  },

  blogs: {
    keywords: [
      'blog',
      'blogger',
      'music blog',
      'review',
      'premiere',
      'coverage',
      'press',
      'publication',
    ],
    response: `Music blog coverage that leads to real results:

**The intelligence approach to blog outreach:**
• **Writer preferences** - Genre focus, story angles they actually cover, preferred formats
• **Recent coverage patterns** - See what they've featured lately to time your pitch perfectly
• **Submission guidelines** - Specific requirements most artists miss (EPK format, image specs, etc.)
• **Response timing** - Know their editorial calendar and best contact windows

**What you'll discover:**
• "This blogger only covers artists with upcoming shows in Manchester"
• "Writer specializes in female-fronted indie rock from the last 6 months"
• "Publication runs 'New Music Friday' features - best to pitch on Wednesdays"
• "Blog requires 300dpi images and Spotify pre-saves for coverage consideration"

**Real results from our users:**
• 40% increase in blog response rates vs generic pitching
• Better story placement because pitches match editorial focus
• Ongoing relationships instead of one-off coverage requests

Transform from "please review my music" to "I noticed your recent feature on [specific artist] - here's why our new track fits your [specific coverage area]".`,
  },
};

function findBestResponse(message: string, userTier: string): string {
  const lowercaseMessage = message.toLowerCase();

  // Score-based matching for better flexibility
  let bestMatch = { category: '', score: 0, response: '' };

  for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
    let score = 0;

    // Direct keyword matches (highest priority)
    for (const keyword of data.keywords) {
      if (lowercaseMessage.includes(keyword)) {
        score += keyword.length; // Longer matches get higher scores
      }
    }

    // Context-based scoring for related terms
    if (
      category === 'independent' &&
      lowercaseMessage.includes('how') &&
      (lowercaseMessage.includes('benefit') || lowercaseMessage.includes('help'))
    ) {
      score += 10;
    }

    if (
      category === 'features' &&
      lowercaseMessage.includes('what') &&
      (lowercaseMessage.includes('do') || lowercaseMessage.includes('does'))
    ) {
      score += 8;
    }

    if (score > bestMatch.score) {
      bestMatch = { category, score, response: data.response };
    }
  }

  // Return best match if score is high enough
  if (bestMatch.score >= 3) {
    return bestMatch.response;
  }

  // Smart fallback responses with variety
  const fallbackResponses = getFallbackResponses(userTier, lowercaseMessage);
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
}

function getFallbackResponses(userTier: string, message: string): string[] {
  const baseResponses = [];

  if (userTier === 'agency') {
    baseResponses.push(
      `I'm Audio, representing the team behind this platform. As an Agency user, you get our fastest support.

Your question about "${message.substring(
        0,
        50
      )}..." - I want to make sure I give you the right information for your client needs.

I can help with:
• White-label intelligence reports - your branding on everything
• Multi-artist campaign management - 500 enrichments monthly
• Professional export formats that justify your agency fees
• Instant processing for urgent client deadlines

What specific aspect of Audio Intel would be most valuable for your agency?`,

      `Hey! I'm Audio, built by working promoters who understand the agency challenge.

Your question touches on something important for agency operations. Let me help you understand how Audio Intel solves real problems:

• **Client retention**: Professional reports that show your value
• **Time efficiency**: Instant processing vs waiting around
• **Revenue justification**: Replace expensive per-submission costs
• **White-label everything**: Clients think you're the intelligence source

Which part of your agency workflow are you looking to improve?`
    );
  } else if (userTier === 'professional') {
    baseResponses.push(
      `I'm Audio, speaking for the working promoters who built this platform. Your Professional status means you get priority responses.

About your question on "${message.substring(
        0,
        50
      )}..." - I want to give you actionable information, not just generic answers.

As a Professional user, you get:
• 60-second processing vs 2-3 minute waits
• 200 monthly enrichments - perfect for serious campaigns
• Professional exports that look like you did the research yourself
• Analytics that show what actually works

What specific campaign challenge can I help you solve?`,

      `Hey there! I'm Audio, representing the team that created this platform for working promoters like ourselves.

Your question about "${message.substring(
        0,
        50
      )}..." - I understand you're looking for real solutions, not marketing fluff.

Here's what matters for Professional users:
• Skip the queue - faster processing for active campaigns
• Professional credibility - reports clients actually want to keep
• Real analytics - see which contacts convert to coverage
• Built by promoters who understand your daily challenges

What would help your campaigns succeed right now?`
    );
  } else {
    baseResponses.push(
      `I'm Audio, the mascot for the working promoters who created this platform because we lived the struggle ourselves.

Your question about "${message.substring(
        0,
        50
      )}..." - I want to help you understand how Audio Intel solves real problems, not create more of them.

Here's what I can explain:
• How contact enrichment beats buying generic databases
• Why our free beta gives you 100 enrichments with no tricks
• How to stop paying €3-15 per submission to SubmitHub/Groover
• Real examples of how independent artists use our intelligence

What specific part of music promotion are you trying to improve?`,

      `Hey! I'm Audio, representing the team behind this platform. We built this because we were frustrated independent artists and promoters ourselves.

Your question touches on something important: "${message.substring(0, 50)}..."

I know the challenges because we've lived them:
• Wasting money on submission platforms that don't work
• Sending generic emails that get ignored
• Not knowing who's actually accepting submissions
• Feeling like the industry is designed against independent artists

Let me help you understand how Audio Intel changes that game. What's your biggest campaign challenge right now?`
    );
  }

  return baseResponses;
}

function generateContextualResponse(
  message: string,
  userTier: string,
  history: ChatMessage[]
): string {
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
      return NextResponse.json(
        {
          error: 'Message is required',
        },
        { status: 400 }
      );
    }

    // Generate response based on message content and user tier
    const response = generateContextualResponse(message, userTier, conversationHistory);

    // Add slight delay to simulate human-like response time
    const delay = userTier === 'agency' ? 500 : userTier === 'professional' ? 1000 : 2000;
    await new Promise(resolve => setTimeout(resolve, delay));

    return NextResponse.json({
      reply: response,
      userTier,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat support error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
      },
      { status: 500 }
    );
  }
}
