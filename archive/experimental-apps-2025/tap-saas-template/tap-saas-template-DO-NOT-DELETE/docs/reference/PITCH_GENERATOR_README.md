# Pitch Generator

**AI-powered pitch writing that actually sounds like you**

Generate personalized, professional music PR pitches in seconds by combining AI writing with your contact data and proven templates from 500+ successful campaigns.

---

## 🎯 Product Overview

**URL:** pitch.totalaudiopromo.com  
**Tagline:** Write 50 personalized pitches in 20 minutes

### Core Value Proposition

Stop spending 5+ hours writing pitches. Let Pitch Generator write personalized emails that get responses by using your contact data, campaign history, and industry best practices—all in your authentic voice.

---

## ✨ Features

### MVP Features (Implemented)

1. **Smart Pitch Generation**
   - Contact selection from database
   - Artist & track information input
   - Genre-specific customization
   - AI-powered personalization using GPT-4
   - 3 subject line variations per pitch
   - Suggested send times based on contact data

2. **Intel Integration**
   - Contact database with rich metadata
   - Genre tags and preferences
   - Contact notes and history
   - Response rate tracking
   - Preferred tone settings

3. **Template Library**
   - 5 genre-specific templates pre-loaded:
     - Indie/Alternative (BBC 6 Music style)
     - Electronic/Dance (Specialist shows)
     - Folk/Singer-Songwriter (Story-driven)
     - Hip-Hop/Urban (Direct & confident)
     - Rock/Punk (Energetic & tour-focused)
   - Usage tracking and success metrics

4. **Pitch Library**
   - Complete pitch history
   - Search and filtering
   - Status tracking (draft, sent, replied, success, no_reply)
   - One-click copy to clipboard
   - Edit and regenerate capabilities

5. **Dashboard**
   - Key metrics (total pitches, sent, replies, response rate)
   - Recent pitch activity
   - Quick actions

6. **Contact Management**
   - Add/edit/delete contacts
   - Rich contact profiles (role, outlet, genres, notes)
   - Preferred tone settings
   - Email addresses

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 + React 19
- **Styling:** Tailwind CSS with custom TAP design system
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4
- **Authentication:** NextAuth.js
- **Payments:** Stripe (template ready)
- **Icons:** Lucide React

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── pitch/
│   │       └── generate/          # AI pitch generation endpoint
│   ├── dashboard/                 # Main dashboard
│   ├── pitch/
│   │   ├── generate/             # Pitch creation form
│   │   ├── review/[id]/          # View/edit generated pitch
│   │   ├── history/              # All pitches with filters
│   │   ├── contacts/             # Contact management
│   │   ├── templates/            # Template library
│   │   └── batch/                # Batch mode (coming soon)
│   └── page.tsx                  # Landing page
├── components/
│   ├── AuthProvider.tsx
│   ├── SiteHeader.tsx
│   └── SiteFooter.tsx
├── lib/
│   ├── supabase.ts              # Supabase client & types
│   └── openai.ts                # AI generation logic
└── supabase/
    └── schema.sql               # Database schema
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Stripe (optional for MVP)
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### 3. Database Setup

Run the SQL schema in your Supabase project:

```bash
# Copy the contents of supabase/schema.sql
# Run it in your Supabase SQL editor
```

This creates:

- `contacts` table
- `pitches` table
- `pitch_templates` table (with 5 pre-loaded templates)
- `pitch_performance` table
- `user_pitch_settings` table
- Necessary indexes and triggers

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🎨 Design System

### Brand Colors

```css
--brand-iris: #4c5cf6 /* Primary - Electric Blue */ --brand-magenta: #c954f7
  /* Secondary - Magenta */ --brand-amber: #ffc857 /* Accent - Amber/Gold */ --success: #3dd68c
  /* Success green */ --warning: #f6bd60 /* Warning orange */ --danger: #f25f5c /* Error red */;
```

### Components

- **glass-panel:** Frosted glass effect with backdrop blur
- **cta-button:** Gradient button (iris → magenta)
- **subtle-button:** Outlined ghost button
- **badge-postcraft:** Small uppercase label

### Typography

- **Headers:** Playfair Display (display font)
- **Body:** Inter (sans-serif)

---

## 📊 Database Schema

### Contacts

```sql
- id (UUID)
- user_id (UUID)
- name (VARCHAR)
- role (VARCHAR)
- outlet (VARCHAR)
- email (VARCHAR)
- genre_tags (TEXT[])
- last_contact (TIMESTAMP)
- response_rate (DECIMAL)
- notes (TEXT)
- preferred_tone (VARCHAR)
```

### Pitches

```sql
- id (UUID)
- user_id (UUID)
- contact_id (UUID)
- artist_name (VARCHAR)
- track_title (VARCHAR)
- genre (VARCHAR)
- release_date (DATE)
- key_hook (TEXT)
- pitch_body (TEXT)
- subject_line (VARCHAR)
- subject_line_options (JSONB)
- status (VARCHAR)
- sent_at (TIMESTAMP)
```

### Templates

```sql
- id (UUID)
- genre (VARCHAR)
- name (VARCHAR)
- template_body (TEXT)
- opening_lines (JSONB)
- closing_ctas (JSONB)
- is_system (BOOLEAN)
- success_rate (DECIMAL)
```

---

## 🔌 API Routes

### POST `/api/pitch/generate`

Generates a new pitch using AI.

**Request:**

```json
{
  "contactId": "uuid",
  "contact": {
    /* contact object */
  },
  "artistName": "Artist Name",
  "trackTitle": "Track Title",
  "genre": "indie",
  "releaseDate": "2024-12-01",
  "keyHook": "What makes this special...",
  "trackLink": "https://spotify.com/...",
  "tone": "professional"
}
```

**Response:**

```json
{
  "success": true,
  "pitchId": "uuid",
  "pitch": {
    /* full pitch object */
  }
}
```

---

## 🎯 User Flows

### Single Pitch Generation

1. User navigates to `/pitch/generate`
2. Selects contact from dropdown (or adds new)
3. Fills in artist/track details
4. Adds key hook (what makes it special)
5. Selects tone (casual/professional/enthusiastic)
6. Clicks "Generate Pitch"
7. AI generates pitch in ~3-5 seconds
8. Review page shows:
   - 3 subject line options
   - Editable pitch body
   - Suggested send time
9. User can:
   - Copy to clipboard
   - Edit and save
   - Mark as sent
   - Regenerate

---

## 💰 Pricing Strategy

### Standalone Pricing

- **Free:** 3 pitches/month
- **Solo:** £15/month - Unlimited pitches
- **Pro:** £25/month - Batch mode + analytics

### Bundle Pricing

- **Intel + Pitch:** £29/month (save £5)
- **Professional Bundle:** £49/month (all tools)

---

## 📈 Success Metrics

### Product KPIs

- Pitches generated per user/month: Target 15+
- Generation time: Target <30 seconds
- Save rate: Target >80%
- Regeneration rate: Target <20%

### Business KPIs

- Free → Paid conversion: Target 15%
- Standalone → Bundle: Target 40%
- Monthly churn: Target <5%

---

## 🚧 Roadmap

### Phase 2 (Post-MVP)

- [ ] Batch generation mode (generate for 20+ contacts)
- [ ] Voice note input for key hook
- [ ] A/B testing (generate 2 versions)
- [ ] Email integration (send directly from platform)
- [ ] Smart follow-ups (auto-generate after 7 days)

### Phase 3 (Month 4-6)

- [ ] Team collaboration features
- [ ] White-label for agencies
- [ ] Multi-language support
- [ ] Press release generator
- [ ] Integration with Tracker app

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sign up / Sign in flow
- [ ] Add new contact
- [ ] Generate pitch with contact
- [ ] Review all 3 subject lines
- [ ] Edit pitch body
- [ ] Copy to clipboard
- [ ] Mark pitch as sent
- [ ] View pitch history
- [ ] Search/filter pitches
- [ ] Update pitch status
- [ ] View templates library
- [ ] Mobile responsiveness

### AI Quality Testing

- [ ] Pitch sounds natural (not robotic)
- [ ] Includes contact's outlet/show
- [ ] References last contact if available
- [ ] Matches selected tone
- [ ] Under 150 words
- [ ] Subject lines under 50 chars
- [ ] Genre-appropriate language

---

## 🐛 Troubleshooting

### AI Generation Fails

- Check OpenAI API key is set
- Verify API credits available
- Check network connection
- Review error logs

### Database Connection Issues

- Verify Supabase URL and keys
- Check project is not paused
- Ensure schema is deployed
- Check RLS policies if needed

### Empty Contact List

- Ensure user_id matches between tables
- Check contacts table has data
- Verify auth session exists

---

## 📝 Development Notes

### User ID Handling

Currently using `session.user.email` as `user_id` for demo purposes. In production, implement proper user ID management through NextAuth callbacks.

### Template System

Templates use placeholders like `{{contact_name}}` that get replaced by the AI during generation. The AI interprets these as instructions rather than literal replacement.

### Contact Data

The app includes a simple contact management system. For production, consider:

- Importing from Audio Intel database
- API integration with Intel
- Bulk import from CSV
- Email validation

### Cost Management

- Average cost per pitch: ~$0.015 (GPT-4)
- Consider caching common patterns
- Implement rate limiting for free tier
- Monitor usage per user

---

## 🎓 Best Practices

### Writing Key Hooks

Good examples:

- "Intimate indie-folk about finding home after years of touring"
- "High-energy punk with 90s nostalgia and modern production"
- "Story-driven folk that sounds like Laura Marling meets Phoebe Bridgers"

Bad examples:

- "Good song"
- "You'll love this"
- "Best track ever"

### Contact Notes

Include useful context:

- Best days/times to contact
- Recent interactions
- Personal preferences
- Similar artists they've supported

---

## 📜 License

MIT License - Part of Total Audio Promo ecosystem

---

## 🤝 Support

For questions or issues:

- GitHub Issues
- Email: support@totalaudiopromo.com
- Documentation: docs.totalaudiopromo.com

---

Built with ❤️ by the Total Audio Promo team
