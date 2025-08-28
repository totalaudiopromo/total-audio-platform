# Voice Echo - AI-Powered Content Creation for Musicians

Voice Echo is an AI-powered content creation tool that learns each musician's authentic voice and creates platform-optimized social media posts. It solves the "AI slop" problem by preserving personality while optimizing for engagement across multiple platforms.

## 🎯 Core Concept

Voice Echo learns your authentic voice from your best social media posts, then generates platform-specific content that sounds exactly like you. It's anti-generic-AI - preserving personality while optimizing for engagement.

## ✨ Key Features

### Voice Training
- **Upload Interface**: Upload 10-15 example social media posts via file or text paste
- **Platform Tagging**: Tag which platform each example came from for better optimization
- **AI Analysis**: Claude API integration to analyze writing patterns, tone, style, and personality
- **Voice Profile**: Create comprehensive voice profile for each user

### Content Generation
- **Simple Input**: "What's happening with your music?"
- **Platform Multi-Select**: X, Instagram, Threads, TikTok
- **Content Types**: Discovery, Craft, Proof (music content trinity)
- **Instant Generation**: Platform-optimized posts in your authentic voice

### Platform Optimization
- **X/Twitter**: 280 character limit, thread support, music industry hashtags
- **Instagram**: Visual-first captions, story format, carousel posts, music-focused hashtags
- **Threads**: Instagram-style but text-focused, no hashtags, conversational tone
- **TikTok**: Video captions, trending sounds integration, viral format optimization

### Quality Metrics
- **Authenticity Score**: How well the content matches your voice (95%+ target)
- **Engagement Potential**: Predicted engagement based on platform optimization
- **Character Count**: Platform-specific character limits
- **Edit & Copy**: Easy editing and copying to clipboard

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Node.js/Express API routes
- **AI Integration**: Claude API for voice learning and content generation
- **Database**: Prisma + PostgreSQL (for user profiles and voice data)
- **Billing**: Stripe integration (£19/month)
- **Authentication**: Same system as Audio Intel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   cd apps/voice-echo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Required environment variables:
   ```
   DATABASE_URL=postgresql://...
   CLAUDE_API_KEY=your_claude_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
apps/voice-echo/
├── app/
│   ├── api/
│   │   └── generate-content/
│   │       └── route.ts          # Content generation API
│   ├── voice-training/
│   │   └── page.tsx              # Voice training interface
│   ├── content-generation/
│   │   └── page.tsx              # Content generation dashboard
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   └── ui/                       # Reusable UI components
├── lib/
│   └── utils.ts                  # Utility functions
└── prisma/
    └── schema.prisma             # Database schema
```

## 🎨 Design System

Voice Echo uses the exact same design system as Audio Intel for pixel-perfect consistency:

- **Color Palette**: Blue primary (#2563eb), black shadows, white backgrounds
- **Typography**: Geist font family, bold headings, readable body text
- **Components**: Identical button styles, card layouts, spacing, and shadows
- **Branding**: Total Audio Promo logo and consistent header/footer

## 🔧 API Endpoints

### POST /api/generate-content
Generates platform-optimized content based on user input and voice profile.

**Request Body:**
```json
{
  "musicContext": "Just released my new single",
  "platforms": ["twitter", "instagram", "threads", "tiktok"],
  "contentType": "discovery",
  "voiceProfile": {
    "tone": "excited",
    "style": "casual",
    "personality": "authentic"
  }
}
```

**Response:**
```json
{
  "success": true,
  "content": {
    "twitter": "🔥 Just dropped my new track!...",
    "instagram": "Behind the scenes of my new track...",
    "threads": "Just dropped my new track!...",
    "tiktok": "New track just dropped! 🔥..."
  },
  "scores": {
    "twitter": { "authenticity": 95, "engagement": 88 },
    "instagram": { "authenticity": 92, "engagement": 91 },
    "threads": { "authenticity": 97, "engagement": 85 },
    "tiktok": { "authenticity": 89, "engagement": 94 }
  }
}
```

## 🎵 Platform-Specific Features

### X/Twitter
- 280 character limit optimization
- Thread creation support
- Music industry hashtags (#NewMusic, #UKArtist, #LiveMusic)
- Engagement-focused formatting

### Instagram
- Visual-first caption approach
- Behind-the-scenes storytelling
- Story format optimization
- Music-focused hashtag strategy

### Threads
- Conversational tone preservation
- No hashtag optimization
- Authentic voice emphasis
- Text-focused content

### TikTok
- Short, punchy captions
- Trend awareness integration
- Music discovery optimization
- Viral format considerations

## 💰 Pricing Model

- **£19/month**: Professional plan with 200 content generations
- **£19/month**: Starter plan with 50 content generations
- Same billing system as Audio Intel
- Usage tracking and upgrade prompts

## 🔒 Security & Privacy

- **User Data**: Secure handling of user posts and voice profiles
- **API Keys**: Secure storage and rotation of Claude API credentials
- **Content Protection**: Respect copyright and licensing requirements
- **GDPR Compliance**: Proper data handling for EU users

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
```
DATABASE_URL=postgresql://...
CLAUDE_API_KEY=your_claude_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://voice.totalaudiopromo.com
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run Playwright tests
npm run test:e2e

# Run health checks
npm run health-check
```

## 📈 Analytics & Monitoring

- Google Analytics integration
- Usage tracking per user
- Platform usage analytics
- Content generation metrics
- Voice match accuracy tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Total Audio Promo ecosystem and follows the same licensing terms.

## 🆘 Support

For support, please contact the Total Audio Promo team or create an issue in the repository.

---

**Voice Echo**: Your authentic voice, amplified across every platform. 🎵
