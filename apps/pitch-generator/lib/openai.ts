import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface VoiceProfile {
  voice_background?: string;
  voice_style?: string;
  voice_typical_opener?: string;
  voice_approach?: string;
  voice_differentiator?: string;
  voice_achievements?: string;
  voice_context_notes?: string;
}

interface GeneratePitchParams {
  contactName: string;
  contactOutlet?: string;
  contactRole?: string;
  contactGenreTags?: string[];
  lastContact?: string;
  contactNotes?: string;
  preferredTone?: string;
  artistName: string;
  trackTitle: string;
  genre: string;
  releaseDate?: string;
  keyHook: string;
  trackLink?: string;
  tone: 'casual' | 'professional' | 'enthusiastic';
  template?: string;
  voiceProfile?: VoiceProfile | null;
}

export async function generatePitch(params: GeneratePitchParams) {
  const {
    contactName,
    contactOutlet,
    contactRole,
    contactGenreTags,
    lastContact,
    contactNotes,
    preferredTone,
    artistName,
    trackTitle,
    genre,
    releaseDate,
    keyHook,
    trackLink,
    tone,
    template,
    voiceProfile,
  } = params;

  // Build context string
  let contextString = '';
  if (lastContact) {
    contextString += `- Last interaction: ${new Date(lastContact).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    })}\n`;
  }
  if (contactGenreTags && contactGenreTags.length > 0) {
    contextString += `- Contact's genre preferences: ${contactGenreTags.join(', ')}\n`;
  }
  if (contactNotes) {
    contextString += `- Notes: ${contactNotes}\n`;
  }
  if (preferredTone) {
    contextString += `- Contact's preferred style: ${preferredTone}\n`;
  }

  const prompt = `You are a music PR professional writing a pitch email to ${contactName}${
    contactOutlet ? ` at ${contactOutlet}` : ''
  }${contactRole ? ` (${contactRole})` : ''}.

CONTEXT ABOUT CONTACT:
${contextString || 'No additional context available.'}

${
  voiceProfile &&
  (voiceProfile.voice_background ||
    voiceProfile.voice_style ||
    voiceProfile.voice_typical_opener ||
    voiceProfile.voice_approach)
    ? `VOICE PROFILE (Match this writing style):
${voiceProfile.voice_background ? `- Background: ${voiceProfile.voice_background}\n` : ''}${
        voiceProfile.voice_style ? `- Writing Style: ${voiceProfile.voice_style}\n` : ''
      }${
        voiceProfile.voice_typical_opener
          ? `- Typical Opener: ${voiceProfile.voice_typical_opener}\n`
          : ''
      }${voiceProfile.voice_approach ? `- Approach: ${voiceProfile.voice_approach}\n` : ''}${
        voiceProfile.voice_differentiator
          ? `- What Makes Me Different: ${voiceProfile.voice_differentiator}\n`
          : ''
      }${
        voiceProfile.voice_achievements
          ? `- Key Achievements to Reference: ${voiceProfile.voice_achievements}\n`
          : ''
      }${
        voiceProfile.voice_context_notes
          ? `- Context Notes: ${voiceProfile.voice_context_notes}\n`
          : ''
      }
IMPORTANT: Write in this person's natural voice while maintaining professionalism and the UK music industry tone.

`
    : ''
}ARTIST INFORMATION:
- Artist: ${artistName}
- Track: "${trackTitle}"
- Genre: ${genre}
- Key Hook: ${keyHook}
${
  releaseDate
    ? `- Release Date: ${new Date(releaseDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`
    : ''
}
${trackLink ? `- Track Link: ${trackLink}` : ''}

TONE REQUESTED: ${tone}

${template ? `TEMPLATE STRUCTURE TO FOLLOW:\n${template}\n\n` : ''}

CRITICAL GENRE/STYLE MATCHING RULES:
- The "Key Hook" description contains important stylistic and era context
- If the Key Hook references specific genres, time periods, or scenes (e.g., "UK garage boom of 1999", "Detroit techno", "Bristol sound"), your musical comparisons MUST align with that context
- NEVER compare to artists from completely different genres or eras
- If the Key Hook mentions a specific year/era, reference artists or sounds from that same period
- If the Key Hook describes a specific scene/genre (e.g., UK garage, drum & bass, house), ONLY reference artists from that genre
- When in doubt about making artist comparisons, describe the sound directly rather than risk an inappropriate comparison

WRITING RULES:
1. Write in a ${tone} tone that sounds natural and human
2. Keep the pitch body under 150 words
3. Reference the contact's outlet or show naturally if relevant
4. Include the key hook prominently in the first 50 words
5. Sound conversational, not robotic or overly formal
6. NO buzzwords, hype language, or marketing speak
7. Use contractions (don't, can't, I'm) to sound natural
8. End with a clear, simple call-to-action
9. If there was a last contact date, acknowledge it naturally ("Hope you've been well since...")
10. Match the contact's genre preferences in your language
11. PAY ATTENTION to the Key Hook's genre/era context - use it to inform all musical references
12. If making artist comparisons, ensure they match the genre/era described in the Key Hook

Generate:
1. ONE pitch email body (just the body text, no subject line)
2. Format as plain text email
3. Use natural paragraph breaks
4. Include the track link at the end if provided

Return ONLY the pitch body text, nothing else.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    temperature: 0.8,
    system:
      'You are an expert music PR professional who writes personalized, natural-sounding pitch emails that get responses. You avoid corporate speak and write like a real person.',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const pitchBody = response.content[0].type === 'text' ? response.content[0].text.trim() : '';

  // Generate 3 subject line variations
  const subjectPrompt = `Generate 3 different subject line options for this music pitch email. The pitch is for:
- Artist: ${artistName}
- Track: "${trackTitle}"
- Genre: ${genre}
- Contact: ${contactName} at ${contactOutlet || 'their outlet'}

RULES for subject lines:
1. Keep each under 50 characters
2. Make them feel personal, not spam-like
3. Avoid excessive punctuation or caps
4. Be direct and clear about what it is
5. One should reference the outlet/show
6. One should be track-focused
7. One should create curiosity
8. NO emoji spam (max 1 emoji per line)
9. Sound like a real person, not marketing

Format: Return exactly 3 subject lines, one per line, numbered 1-3.`;

  const subjectResponse = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 256,
    temperature: 0.7,
    system: 'You write effective email subject lines that sound personal and get opened.',
    messages: [
      {
        role: 'user',
        content: subjectPrompt,
      },
    ],
  });

  const subjectLines =
    subjectResponse.content[0].type === 'text' ? subjectResponse.content[0].text.trim() : '';

  // Parse subject lines
  const lines = subjectLines.split('\n').filter(line => line.trim());
  const subjects = {
    option1: lines[0]?.replace(/^[123]\.\s*/, '').trim() || `New ${genre} from ${artistName}`,
    option2: lines[1]?.replace(/^[123]\.\s*/, '').trim() || `${trackTitle} - ${artistName}`,
    option3:
      lines[2]?.replace(/^[123]\.\s*/, '').trim() || `Track for ${contactOutlet || 'your show'}`,
  };

  // Determine suggested send time based on contact data
  let suggestedSendTime = 'Tuesday or Wednesday, 10:00 AM';
  if (contactNotes) {
    if (contactNotes.toLowerCase().includes('monday')) suggestedSendTime = 'Monday, 10:00 AM';
    if (contactNotes.toLowerCase().includes('tuesday')) suggestedSendTime = 'Tuesday, 10:00 AM';
    if (contactNotes.toLowerCase().includes('wednesday')) suggestedSendTime = 'Wednesday, 10:00 AM';
    if (contactNotes.toLowerCase().includes('thursday')) suggestedSendTime = 'Thursday, 10:00 AM';
    if (contactNotes.toLowerCase().includes('friday')) suggestedSendTime = 'Friday, 10:00 AM';
  }

  return {
    pitchBody,
    subjectLines: subjects,
    suggestedSendTime,
  };
}
