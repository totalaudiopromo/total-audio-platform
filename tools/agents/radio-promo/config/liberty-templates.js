#!/usr/bin/env node

/**
 * Liberty Music PR Templates Configuration
 * 
 * Professional press release templates and content styles
 * Based on Liberty Music PR's proven successful formats
 * Maintains consistent brand voice and industry credibility
 */

class LibertyTemplates {
  constructor() {
    this.version = '1.0.0';
    
    // Liberty brand voice characteristics
    this.brandVoice = {
      tone: 'Professional yet approachable',
      style: 'British music industry credible',
      language: 'UK English with industry terminology',
      personality: 'Confident, knowledgeable, results-driven'
    };
    
    // Core press release templates
    this.pressReleaseTemplates = {
      // Main Liberty template - proven successful format
      liberty_standard: {
        name: 'Liberty Standard Release',
        description: 'Chris Schofield\'s proven press release format',
        template: `FOR IMMEDIATE RELEASE

{pressReleaseHeadline}

{subheadline}

{dateline} - {openingParagraph}

{artistQuote}

{backgroundParagraph}

{industryContext}

{callToAction}

{boilerplate}

###

CONTACT:
Chris Schofield
Liberty Music PR
Email: chris@libertymusicpr.com  
Phone: {phoneNumber}
Web: https://libertymusicpr.com

ABOUT LIBERTY MUSIC PR:
Liberty Music PR is a boutique music publicity agency specialising in radio promotion, digital marketing, and industry relations. Founded by industry veteran Chris Schofield, Liberty has secured coverage for artists across BBC Radio, commercial stations, and specialist music media throughout the UK and Europe.

{releaseNotes}`,
        
        variables: [
          'pressReleaseHeadline',
          'subheadline', 
          'dateline',
          'openingParagraph',
          'artistQuote',
          'backgroundParagraph',
          'industryContext',
          'callToAction',
          'boilerplate',
          'phoneNumber',
          'releaseNotes'
        ]
      },
      
      // Genre-specific variations
      electronic_focused: {
        name: 'Electronic Music Release',
        description: 'Optimised for electronic/dance music artists',
        template: `FOR IMMEDIATE RELEASE

{artistName} Unleashes Electrifying New {genre} Track "{trackTitle}"

UK-based {artistName} delivers cutting-edge electronic soundscape set to dominate dance floors and streaming platforms

{dateline} - Rising electronic music producer {artistName} has released their latest track "{trackTitle}", a masterfully crafted piece of {genre} that showcases the artist's evolving sonic palette and technical prowess.

The track, available now on all major streaming platforms, demonstrates {artistName}'s ability to blend contemporary electronic production with innovative sound design, creating an immersive listening experience that appeals to both underground connoisseurs and mainstream audiences.

"{trackTitle} represents my journey into more experimental territories whilst maintaining the accessibility that connects with listeners," explains {artistName}. "I wanted to create something that would work equally well in intimate club settings and large festival environments."

{industryContext}

With electronic music continuing its global dominance, "{trackTitle}" positions {artistName} at the forefront of the UK's thriving electronic scene. The release follows successful support from specialist radio shows and electronic music platforms across Europe.

{callToAction}

###

CONTACT:
Chris Schofield  
Liberty Music PR
Specialist Electronic Music Promotion
Email: chris@libertymusicpr.com
Web: https://libertymusicpr.com`
      },
      
      indie_focused: {
        name: 'Independent Music Release',
        description: 'Crafted for indie/alternative artists',
        template: `FOR IMMEDIATE RELEASE

{artistName} Shares Heartfelt New Single "{trackTitle}"

Authentic {genre} offering showcases {artistName}'s distinctive songwriting and emotional depth

{dateline} - Independent artist {artistName} has unveiled their compelling new single "{trackTitle}", a beautifully crafted {genre} track that highlights the songwriter's keen eye for detail and ability to capture genuine emotion in their music.

The release demonstrates {artistName}'s commitment to authentic artistry, featuring intimate production that allows the song's lyrical content and melodic sensibilities to take centre stage.

"This song came from a very personal place," shares {artistName}. "I wanted to create something that felt honest and connected with people on a real level, rather than following trends or commercial formulas."

{industryContext}

In an era where independent music continues to find new audiences through grassroots support and specialist radio, "{trackTitle}" represents the kind of authentic artistry that resonates with listeners seeking genuine musical experiences.

The track has already garnered support from BBC Introducing and is set for promotion across community radio stations and independent music platforms.

{callToAction}

###

CONTACT:
Chris Schofield
Liberty Music PR  
Independent Artist Specialist
Email: chris@libertymusicpr.com
Web: https://libertymusicpr.com`
      },
      
      // Rush/urgent release template
      breaking_news: {
        name: 'Breaking News Release',
        description: 'For urgent announcements and time-sensitive releases',
        template: `FOR IMMEDIATE RELEASE - URGENT

BREAKING: {artistName} Drops Surprise {genre} Single "{trackTitle}"

{subheadline}

{dateline} - In an unexpected move, {artistName} has released "{trackTitle}", a surprise {genre} track that's already generating significant industry buzz within hours of its release.

{openingParagraph}

"Sometimes you just have to trust your instincts and release music when it feels right," explains {artistName}. "This track demanded immediate attention, and I didn't want to wait."

{industryContext}

Available now on all streaming platforms, "{trackTitle}" is expected to receive immediate radio support and playlist additions.

URGENT CONTACT:
Chris Schofield
Liberty Music PR
Mobile: {mobileNumber}
Email: chris@libertymusicpr.com

###`
      }
    };
    
    // Email pitch templates for different station types
    this.emailTemplates = {
      commercial_radio: {
        name: 'Commercial Radio Pitch',
        subject: 'New {genre} from {artistName} - "{trackTitle}" - Radio Ready',
        template: `Hi {djName},

Hope you're well! I wanted to share an exciting new {genre} track that I think would be perfect for {stationName}.

{artistName} - "{trackTitle}"
Genre: {genre}
Duration: {trackDuration}
Release Date: {releaseDate}

{trackDescription}

Key highlights:
• {keyPoint1}
• {keyPoint2}  
• {keyPoint3}

The track is fully radio ready with clean edits available. I've attached the full track and radio edit for your consideration.

Would love to hear your thoughts, and happy to provide any additional information you might need.

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com
{phoneNumber}

P.S. {personalNote}`
      },
      
      specialist_show: {
        name: 'Specialist Show Pitch',
        subject: '{genre} specialist - {artistName} "{trackTitle}" - Exclusive for {showName}',
        template: `Hello {presenterName},

I've been following {showName} and really appreciate your support for {genre} music. I have an exclusive track that I think you'd be interested in.

{artistName} - "{trackTitle}"

This is a brilliant example of contemporary {genre} with {uniqueSellingPoint}. The production quality is exceptional, and it's already generating interest from other specialist shows across the UK.

{artistBackground}

I'd love to offer this as an exclusive first play for {showName} if you're interested. The full track is attached, along with artist bio and high-res images.

Looking forward to hearing from you.

Chris Schofield
Liberty Music PR
Specialist Music Promotion
chris@libertymusicpr.com

"Supporting specialist music since {yearEstablished}"`
      },
      
      bbc_introducing: {
        name: 'BBC Introducing Submission',
        subject: 'BBC Introducing Submission - {artistName} "{trackTitle}" - {location}',
        template: `Dear BBC Introducing Team,

I'd like to submit a track for consideration on BBC Introducing.

ARTIST: {artistName}
TRACK: "{trackTitle}"
GENRE: {genre}
LOCATION: {artistLocation}
CONTACT: {artistEmail}

ABOUT THE ARTIST:
{artistBio}

ABOUT THE TRACK:
{trackDescription}

PREVIOUS SUPPORT:
{previousSupport}

The artist is available for interviews and live sessions. All promotional materials and high-quality audio files are available upon request.

Thank you for your continued support of new music.

Best wishes,
Chris Schofield
Liberty Music PR
On behalf of {artistName}
chris@libertymusicpr.com`
      },
      
      follow_up: {
        name: 'Follow-up Email',
        subject: 'Following up - {artistName} "{trackTitle}" for {stationName}',
        template: `Hi {djName},

Just wanted to follow up on the {artistName} track "{trackTitle}" I sent over {daysSinceLastContact} days ago.

{updateInformation}

I understand you receive lots of music, but I genuinely think this would be a great fit for {stationName} and your audience would really connect with it.

{additionalIncentive}

Happy to provide any additional information or alternative versions if helpful.

Thanks for your time and continued support for new music.

Best,
Chris
Liberty Music PR
chris@libertymusicpr.com`
      }
    };
    
    // Content generation prompts for different contexts
    this.contentPrompts = {
      headline_generation: `Create a compelling press release headline for {artistName}'s new {genre} track "{trackTitle}". 

Style: Professional music industry standard
Tone: Confident and engaging
Length: 8-12 words
Focus: Artist achievement and track appeal

Examples of good headlines:
- "Artist Name Delivers Stunning New Genre Anthem 'Track Title'"  
- "Rising Star Artist Name Unleashes Powerful Genre Track"
- "Artist Name Returns with Captivating New Single 'Track Title'"

Generate 5 headline options:`,
      
      opening_paragraph: `Write an engaging opening paragraph for a press release about {artistName}'s new {genre} track "{trackTitle}".

Requirements:
- 2-3 sentences maximum
- Include artist name, track title, genre
- Highlight what makes this release special
- Professional music industry tone
- UK English spelling and style

Context: {additionalContext}

Opening paragraph:`,
      
      artist_quote: `Generate an authentic artist quote for {artistName} about their new track "{trackTitle}".

Style: 
- Natural and conversational
- Shows artistic vision and process
- 1-2 sentences
- Avoids clichés
- Sounds genuine, not corporate

Genre context: {genre}
Track theme: {trackTheme}

Artist quote:`,
      
      social_media_post: `Create a social media post for {artistName}'s new release "{trackTitle}".

Platform: {platform}
Character limit: {characterLimit}
Tone: Engaging and authentic
Include: Relevant hashtags and call-to-action

Genre: {genre}
Key message: {keyMessage}

Post:`,
      
      bio_paragraph: `Write a professional artist bio paragraph for {artistName}.

Style: Third person, present tense
Length: 3-4 sentences
Focus: Musical style, achievements, distinctive qualities
Tone: Credible and engaging

Genre: {genre}
Key achievements: {achievements}
Distinctive elements: {uniqueQualities}

Bio paragraph:`
    };
    
    // Industry-specific terminology and phrases
    this.industryLanguage = {
      positive_descriptors: [
        'compelling', 'captivating', 'stunning', 'masterful', 'authentic',
        'innovative', 'distinctive', 'powerful', 'mesmerising', 'exceptional',
        'brilliant', 'accomplished', 'sophisticated', 'dynamic', 'engaging'
      ],
      
      genre_descriptors: {
        electronic: ['cutting-edge', 'immersive', 'innovative', 'hypnotic', 'experimental'],
        indie: ['authentic', 'heartfelt', 'genuine', 'intimate', 'honest'],
        pop: ['infectious', 'memorable', 'polished', 'accessible', 'uplifting'],
        rock: ['powerful', 'driving', 'anthemic', 'energetic', 'raw'],
        folk: ['storytelling', 'emotive', 'acoustic', 'traditional', 'timeless'],
        hip_hop: ['innovative', 'rhythmic', 'conscious', 'dynamic', 'contemporary'],
        classical: ['sophisticated', 'orchestral', 'elegant', 'refined', 'virtuosic']
      },
      
      industry_phrases: [
        'garnering significant industry attention',
        'building a dedicated following',
        'receiving specialist radio support', 
        'connecting with audiences across',
        'demonstrating artistic growth',
        'pushing creative boundaries',
        'establishing themselves as',
        'continuing their musical journey'
      ],
      
      call_to_actions: [
        'Available now on all major streaming platforms',
        'Stream and download across all digital platforms',
        'Get the track on your preferred streaming service',
        'Listen now wherever you get your music',
        'Available for immediate radio play and playlist inclusion'
      ]
    };
    
    // Template customisation options
    this.customisationOptions = {
      urgency_levels: {
        standard: 'Normal release cycle timing',
        priority: 'Expedited review requested',
        urgent: 'Time-sensitive - immediate attention needed',
        exclusive: 'Exclusive first listen opportunity'
      },
      
      target_demographics: {
        mainstream: 'Broad commercial appeal',
        specialist: 'Genre-focused audience',
        underground: 'Alternative/underground scene',
        crossover: 'Multi-demographic appeal'
      },
      
      campaign_angles: {
        debut: 'Emerging artist introduction',
        comeback: 'Artist return after hiatus',
        evolution: 'Artistic development showcase', 
        collaboration: 'Featured collaboration highlight',
        concept: 'Thematic/conceptual release',
        seasonal: 'Timely/seasonal relevance'
      }
    };
  }

  /**
   * Generate press release from campaign data
   */
  generatePressRelease(campaignData, templateName = 'liberty_standard', options = {}) {
    const template = this.pressReleaseTemplates[templateName];
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }
    
    // Build context for content generation
    const context = {
      artistName: campaignData.artistName || 'Unknown Artist',
      trackTitle: campaignData.trackTitle || 'Untitled Track',
      genre: campaignData.genre || 'Music',
      releaseDate: campaignData.releaseDate || new Date().toDateString(),
      ...options
    };
    
    // Generate dynamic content elements
    const generatedContent = this.generateContentElements(context, templateName);
    
    // Merge with provided context
    const fullContext = { ...context, ...generatedContent };
    
    // Replace template variables
    let pressRelease = template.template;
    
    Object.entries(fullContext).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      pressRelease = pressRelease.replace(regex, value);
    });
    
    // Clean up any unreplaced variables
    pressRelease = pressRelease.replace(/{[^}]+}/g, '[TO BE COMPLETED]');
    
    return {
      content: pressRelease,
      template: templateName,
      generatedAt: new Date().toISOString(),
      wordCount: pressRelease.split(/\s+/).length,
      context: fullContext
    };
  }

  /**
   * Generate dynamic content elements
   */
  generateContentElements(context, templateName) {
    const generated = {};
    
    // Generate headline
    generated.pressReleaseHeadline = this.generateHeadline(context);
    
    // Generate subheadline
    generated.subheadline = this.generateSubheadline(context);
    
    // Generate dateline
    generated.dateline = this.generateDateline();
    
    // Generate opening paragraph
    generated.openingParagraph = this.generateOpeningParagraph(context);
    
    // Generate artist quote
    generated.artistQuote = this.generateArtistQuote(context);
    
    // Generate background paragraph
    generated.backgroundParagraph = this.generateBackgroundParagraph(context);
    
    // Generate industry context
    generated.industryContext = this.generateIndustryContext(context);
    
    // Generate call to action
    generated.callToAction = this.generateCallToAction(context);
    
    // Generate boilerplate
    generated.boilerplate = this.generateBoilerplate(context);
    
    // Add standard contact info
    generated.phoneNumber = '+44 (0)7XXX XXXXXX';
    generated.releaseNotes = 'High-resolution images and additional promotional materials available upon request.';
    
    return generated;
  }

  /**
   * Generate compelling headline
   */
  generateHeadline(context) {
    const { artistName, trackTitle, genre } = context;
    
    const templates = [
      `${artistName} Delivers Stunning New ${genre} Anthem "${trackTitle}"`,
      `Rising Star ${artistName} Unleashes Powerful New Single "${trackTitle}"`,
      `${artistName} Returns with Captivating ${genre} Track "${trackTitle}"`,
      `Breakthrough Artist ${artistName} Shares Compelling New Release "${trackTitle}"`,
      `${artistName} Drops Game-Changing ${genre} Single "${trackTitle}"`
    ];
    
    // Select based on context or randomly
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate subheadline
   */
  generateSubheadline(context) {
    const { artistName, genre } = context;
    
    const descriptors = this.industryLanguage.genre_descriptors[genre.toLowerCase()] || 
                       this.industryLanguage.positive_descriptors;
    
    const randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
    
    return `${randomDescriptor.charAt(0).toUpperCase()}${randomDescriptor.slice(1)} new release showcases ${artistName}'s evolving artistry and distinctive sound`;
  }

  /**
   * Generate dateline
   */
  generateDateline() {
    const locations = ['London, UK', 'Manchester, UK', 'Birmingham, UK', 'Bristol, UK', 'Glasgow, UK'];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const date = new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    return `${randomLocation}, ${date}`;
  }

  /**
   * Generate opening paragraph
   */
  generateOpeningParagraph(context) {
    const { artistName, trackTitle, genre } = context;
    
    const descriptors = this.industryLanguage.positive_descriptors;
    const randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
    
    return `${artistName} has released their latest ${genre} track "${trackTitle}", a ${randomDescriptor} piece that demonstrates the artist's continued evolution and commitment to creating authentic, engaging music that resonates with listeners.`;
  }

  /**
   * Generate artist quote
   */
  generateArtistQuote(context) {
    const { trackTitle, artistName } = context;
    
    const quotes = [
      `"${trackTitle} represents everything I've been working towards as an artist. It's honest, it's authentic, and it connects with people on a real level," says ${artistName}.`,
      `"This track came from a very personal place," explains ${artistName}. "I wanted to create something that felt genuine and spoke to the experiences we all share."`,
      `"${trackTitle} is about pushing boundaries while staying true to who I am as an artist," reflects ${artistName}. "It's the most honest music I've ever made."`,
      `"I'm incredibly excited to share this with everyone," says ${artistName}. "It represents a new chapter in my music and I think people will really connect with it."`
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  /**
   * Generate background paragraph
   */
  generateBackgroundParagraph(context) {
    const { artistName, genre } = context;
    
    const phrases = this.industryLanguage.industry_phrases;
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    return `Known for their distinctive approach to ${genre.toLowerCase()}, ${artistName} has been ${randomPhrase} with their unique blend of authentic songwriting and innovative production techniques.`;
  }

  /**
   * Generate industry context
   */
  generateIndustryContext(context) {
    const { genre } = context;
    
    const contexts = {
      electronic: 'With electronic music continuing its global dominance and UK producers at the forefront of innovation, this release positions the artist within the thriving British electronic scene.',
      indie: 'In an era where independent music continues to find new audiences through grassroots support and specialist radio, this track represents authentic artistry that resonates with listeners.',
      pop: 'As the UK music scene continues to produce globally successful pop artists, this release demonstrates the quality and creativity emerging from British musicians.',
      rock: 'Building on the UK\'s rich rock heritage while bringing contemporary sensibilities, this track showcases the continued vitality of British rock music.'
    };
    
    return contexts[genre.toLowerCase()] || 
           'The track demonstrates the continued strength and diversity of the UK music scene, with artists creating compelling music that connects with audiences both domestically and internationally.';
  }

  /**
   * Generate call to action
   */
  generateCallToAction(context) {
    const actions = this.industryLanguage.call_to_actions;
    return actions[Math.floor(Math.random() * actions.length)];
  }

  /**
   * Generate boilerplate
   */
  generateBoilerplate(context) {
    return `The track is available for immediate radio play and playlist consideration. High-quality audio files, artist images, and additional promotional materials are available upon request.`;
  }

  /**
   * Generate email pitch
   */
  generateEmailPitch(campaignData, templateName = 'commercial_radio', options = {}) {
    const template = this.emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }
    
    const context = {
      artistName: campaignData.artistName || 'Unknown Artist',
      trackTitle: campaignData.trackTitle || 'Untitled Track',
      genre: campaignData.genre || 'Music',
      djName: options.djName || '[DJ NAME]',
      stationName: options.stationName || '[STATION NAME]',
      personalNote: options.personalNote || 'Hope this finds you well!',
      ...options
    };
    
    // Replace template variables
    let subject = template.subject;
    let content = template.template;
    
    Object.entries(context).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      subject = subject.replace(regex, value);
      content = content.replace(regex, value);
    });
    
    return {
      subject: subject,
      content: content,
      template: templateName,
      generatedAt: new Date().toISOString(),
      context: context
    };
  }

  /**
   * Get template by name
   */
  getTemplate(templateName, type = 'pressRelease') {
    const templates = type === 'pressRelease' ? 
                     this.pressReleaseTemplates : 
                     this.emailTemplates;
    
    return templates[templateName];
  }

  /**
   * List available templates
   */
  listTemplates(type = 'all') {
    const templates = {};
    
    if (type === 'all' || type === 'pressRelease') {
      templates.pressRelease = Object.keys(this.pressReleaseTemplates);
    }
    
    if (type === 'all' || type === 'email') {
      templates.email = Object.keys(this.emailTemplates);
    }
    
    return templates;
  }

  /**
   * Validate campaign data for template generation
   */
  validateCampaignData(campaignData, templateName) {
    const template = this.pressReleaseTemplates[templateName] || 
                     this.emailTemplates[templateName];
    
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }
    
    const required = ['artistName', 'trackTitle', 'genre'];
    const missing = required.filter(field => !campaignData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Get brand voice guidelines
   */
  getBrandVoice() {
    return { ...this.brandVoice };
  }

  /**
   * Get industry language resources
   */
  getIndustryLanguage() {
    return { ...this.industryLanguage };
  }
}

module.exports = LibertyTemplates;