# 🚀 Social Media Automation Setup Guide

Complete automation system with content verification and duplicate detection.

## 🎯 What You Get

- **Automated posting** to Twitter/X, LinkedIn, BlueSky, Facebook
- **Content verification** before posting
- **Duplicate detection** across all platforms
- **Manual approval workflow** for quality control
- **Zero Twitter API costs** using Puppeteer automation

## ⚡ Quick Start (5 Minutes)

### 1. Environment Setup

```bash
cd apps/command-centre
cp .env.example .env
```

### 2. Configure Platforms (Start with BlueSky - it's free!)

**BlueSky (Recommended - FREE)**

1. Go to BlueSky Settings > App Passwords
2. Create new app password
3. Add to `.env`:

```env
BLUESKY_IDENTIFIER=yourhandle.bsky.social
BLUESKY_APP_PASSWORD=your-app-password
```

### 3. Test the System

```bash
# Test authentication
node scripts/social-automation-verified.js auth

# Dry run (no actual posting)
node scripts/social-automation-verified.js daily --dry-run

# Check available content
node scripts/social-automation-verified.js verify
```

## 🔧 Platform Setup Details

### BlueSky (FREE - Start Here!)

- **Cost**: Free
- **Setup**: 2 minutes
- **Features**: Full API access, scheduling
- **Limits**: Reasonable (no issues for Audio Intel)

### LinkedIn (FREE)

- **Cost**: Free for personal posting
- **Setup**: 5 minutes
- **API**: LinkedIn Developer Portal
- **Perfect for**: Professional Audio Intel content

### Facebook (FREE)

- **Cost**: Free for page posting
- **Setup**: 10 minutes
- **API**: Facebook Graph API
- **Good for**: Broader audience reach

### Twitter/X (Expensive - Using Automation)

- **Cost**: $100/month for basic API
- **Our Solution**: Puppeteer browser automation
- **Setup**: Manual login required
- **Works**: Posts automatically after login

## 📋 Content Verification Features

### Pre-Post Checks

✅ Character limits per platform
✅ Audio Intel branding verification
✅ Hashtag format validation
✅ Professional tone check (LinkedIn)
✅ Engagement optimization (Facebook)

### Duplicate Detection

✅ Content hash tracking
✅ Cross-platform duplicate prevention
✅ Recent post history checking
✅ Intelligent content rotation

### Manual Approval Workflow

✅ Quality control review
✅ Platform-specific warnings
✅ Content preview with verification results
✅ Approval queue management

## 🤖 Automation Commands

### Daily Automation

```bash
# Run daily posting (safe mode with verification)
node scripts/social-automation-verified.js daily

# Test mode (shows what would be posted)
node scripts/social-automation-verified.js daily --dry-run
```

### Content Management

```bash
# Check available templates by category
node scripts/social-automation-verified.js verify case-study
node scripts/social-automation-verified.js verify industry-insight

# View posting history
node scripts/social-automation-verified.js history 20

# Test platform authentication
node scripts/social-automation-verified.js auth
```

### Schedule Automation (Cron)

```bash
# Edit cron jobs
crontab -e

# Add this line for daily 9am posting
0 9 * * * cd /path/to/command-centre && node scripts/social-automation-verified.js daily
```

## 📊 Your Audio Intel Content

Ready-to-post templates include:

- **BBC Radio 1 case study** posts
- **Spotify playlist success** stories
- **"15 hours → 15 minutes"** value propositions
- **Real founder story** content
- **Industry insight** posts
- **Professional credibility** content

## 🔍 Verification Process

Before any post goes live:

1. **Content Analysis**

   - Character count validation
   - Platform-specific optimization
   - Audio Intel branding check

2. **Duplicate Detection**

   - Cross-platform content tracking
   - Hash-based duplicate prevention
   - Recent history verification

3. **Quality Control**

   - Manual approval for sensitive content
   - Warning system for potential issues
   - Detailed verification logs

4. **Safe Posting**
   - Only verified content goes live
   - Full audit trail maintained
   - Easy rollback if needed

## 📈 Expected Results

### Week 1

- 3 verified posts per day across platforms
- Zero duplicate content
- Professional Audio Intel presence

### Week 2-4

- Consistent brand messaging
- Growing engagement
- Customer acquisition support

### Month 1+

- Automated thought leadership
- Industry credibility establishment
- Lead generation pipeline

## 🚨 Safety Features

### Never Posts

❌ Duplicate content
❌ Unverified content
❌ Content exceeding character limits
❌ Content without Audio Intel context

### Always Verifies

✅ Platform-specific requirements
✅ Content quality standards
✅ Brand consistency
✅ Professional tone

## 🛠️ Troubleshooting

### Common Issues

**"Authentication failed"**

- Check API credentials in `.env`
- Verify app passwords are correct
- Test with single platform first

**"Duplicate content detected"**

- Check content history: `node scripts/social-automation-verified.js history`
- Clear history if needed (careful!)
- Add new content templates

**"Character limit exceeded"**

- Content automatically truncated with warning
- Edit templates for platform-specific lengths
- Check hashtag lengths

### Support

- All logs saved to `logs/social-automation.log`
- Content history in `data/content-history.json`
- Verification results logged for debugging

## 🎯 Next Steps

1. **Start with BlueSky** (free, easy setup)
2. **Test with dry runs** until comfortable
3. **Add LinkedIn** for professional reach
4. **Scale to other platforms** as needed
5. **Monitor and optimize** based on engagement

Your Audio Intel content is ready to go live with full verification and quality control!
