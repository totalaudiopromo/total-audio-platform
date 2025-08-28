# Audio Intel - AI-Powered Music Industry Contact Intelligence

Audio Intel is a comprehensive web application that transforms basic email lists into detailed music industry intelligence using AI-powered contact enrichment. The platform helps artists, labels, and music professionals save 15+ hours per week on contact research by providing detailed insights about playlist curators, radio DJs, music bloggers, and industry professionals.

## 🚀 Features

### Core Functionality

#### 1. **FREE Email Validation** 🆕
- **DNS MX Record Checking** - Verify domains can actually receive emails
- **Disposable Email Detection** - Identify temporary/fake email addresses  
- **Free Email Provider Classification** - Distinguish business vs personal emails
- **Format Validation** - Ensure proper email syntax
- **Confidence Scoring** - High/Medium/Low confidence levels
- **Batch Processing** - Validate entire email lists at once
- **CSV Export** - Download validation results with detailed analysis
- **Cost Savings** - Save £15-50/month on email validation services

#### 2. **AI-Powered Contact Enrichment**
- Upload CSV files with basic contact information (Name, Email)
- AI analyzes each contact and provides detailed intelligence including:
  - Station/Platform information
  - Coverage areas and audience reach
  - Contact preferences and submission guidelines
  - Genre focus and artist types they work with
  - Strategic tips for effective pitching
  - Research confidence levels
- Export enriched data to CSV format
- Real-time processing with progress indicators

#### 3. **Multi-Platform Contact Search**
Search for music industry contacts across 7 major platforms:

- **Reddit**: Music communities, subreddits, moderators
- **Instagram**: Playlist curators, music bloggers, industry professionals
- **Spotify**: Playlist curators, official editors, submission opportunities
- **Discord**: Music industry servers, networking communities
- **Forums**: Professional music forums, industry discussions
- **Music Sites**: Industry blogs, review sites, promotion platforms
- **LinkedIn**: Music industry professionals, companies, networking groups

#### 4. **AI-Powered Music Industry Agents**
Get strategic advice from specialized AI agents:

- **Music Industry Strategist**: Industry positioning, label strategy, networking
- **Music Marketing Mastermind**: Digital marketing, social media, audience growth
- **Growth Hacking Optimizer**: Rapid audience growth, viral marketing
- **Viral Content Automation**: Content creation, distribution, automation
- **Radio Promotion Agent**: Radio promotion, playlist pitching, broadcast strategy
- **Social Media Agent**: Platform strategy, community building, engagement
- **Content Generation Agent**: Content ideation, multi-platform adaptation
- **Analytics Agent**: Performance analysis, KPIs, data-driven decisions

#### 5. **Analytics Dashboard**
- Track enrichment performance
- Monitor search results across platforms
- View success rates and confidence levels
- Platform breakdown analysis
- Recent activity tracking

### Technical Features

#### **Modern UI/UX**
- Beautiful, responsive design with texture overlays
- Smooth animations and transitions
- Mobile-optimized interface
- Accessibility features
- Dark/light mode support

#### **AI Integration**
- Perplexity AI API integration for intelligent search
- Real-time contact enrichment
- Multi-agent AI system for strategic advice
- Fallback data for demo purposes

#### **Performance**
- Fast loading times
- Optimized image assets
- Efficient API calls
- Rate limiting for external APIs

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, custom texture components
- **AI**: Perplexity AI API (Sonar model)
- **UI Components**: Radix UI, Lucide React icons
- **File Processing**: CSV parsing, Excel export
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
audio-intel-live/
├── app/
│   ├── api/
│   │   ├── ai-agent/          # AI agent endpoints
│   │   ├── analytics/         # Analytics tracking
│   │   ├── enrich/           # Contact enrichment
│   │   ├── validate-emails/   # Email validation API
│   │   ├── search/           # Multi-platform search
│   │   ├── checkout/         # Payment processing
│   │   ├── download/         # File downloads
│   │   └── notify/           # Notifications
│   ├── demo/                 # Interactive demo page
│   ├── globals.css           # Global styles
│   └── page.tsx              # Landing page
├── components/
│   ├── EmailValidator.tsx     # Email validation UI component
│   └── ui/                   # Reusable UI components
├── utils/
│   ├── emailValidation.ts     # Email validation utilities
│   └── formatIntelligence.ts # Contact formatting utilities
├── public/
│   └── textures/             # Texture image assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Perplexity AI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd audio-intel-live
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file with:
```env
PERPLEXITY_API_KEY=your_perplexity_api_key
RESEND_API_KEY=your_resend_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🎯 Usage

### Contact Enrichment
1. Navigate to the demo page (`/demo`)
2. Upload a CSV file with Name and Email columns
3. Click "Start Enrichment" to process contacts
4. View detailed intelligence for each contact
5. Export results to CSV

### Platform Search
1. Go to the "Platform Search" tab
2. Enter your search query (e.g., "indie rock playlist curators")
3. Select specific platforms or search all
4. View results with contact information and relevance scores
5. Click "Visit" to open contact pages

### AI Agents
1. Select an AI agent based on your needs
2. Ask specific questions about your music career
3. Receive strategic advice, recommendations, and next steps
4. Use insights to improve your music promotion strategy

## 🔧 API Endpoints

### Contact Enrichment
- `POST /api/enrich` - Enrich contact list with AI intelligence

### Multi-Platform Search
- `POST /api/search` - Search across 7 platforms for music industry contacts

### AI Agents
- `POST /api/ai-agent` - Get strategic advice from specialized AI agents

### Analytics
- `POST /api/analytics` - Track user interactions and events

## 🎨 Design System

The application uses a custom design system with:
- **Texture Overlays**: Paper, grain, and luma textures for visual depth
- **Color Palette**: Blue gradient primary colors with supporting grays
- **Typography**: Bold, readable fonts with proper hierarchy
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and hover effects

## 🔒 Security

- Environment variables for sensitive API keys
- Input validation and sanitization
- Rate limiting for external API calls
- Secure file upload handling
- HTTPS enforcement in production

## 📊 Performance

- Optimized bundle size
- Lazy loading for components
- Efficient API caching
- Image optimization
- Responsive design for all devices

## 🚀 Deployment

The application is ready for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

---

**Audio Intel** - Transforming music industry contact research with AI intelligence.
