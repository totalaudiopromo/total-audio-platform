# CodeRabbit Setup Guide

## 🚀 Quick Start (Recommended)

### Option 1: GitHub App Installation (Easiest)
1. Visit: https://github.com/apps/coderabbit
2. Click "Install" for your repository: `totalaudiopromo/total-audio-promo`
3. Configure permissions (needs access to pull requests and code)
4. Done! CodeRabbit will automatically review your PRs

### Option 2: Self-Hosted Installation

## 📋 Prerequisites

1. **GitHub App Setup**:
   - Go to https://github.com/settings/apps
   - Click "New GitHub App"
   - Fill in the details:
     - App name: `CodeRabbit-YourName`
     - Homepage URL: `https://your-domain.com`
     - Webhook URL: `https://your-domain.com/webhook`
     - Webhook secret: Generate a random string
   - Set permissions:
     - Repository permissions: Read access to code, metadata, pull requests
     - Subscribe to events: Pull requests, Push
   - Install the app on your repository

2. **API Keys**:
   - OpenAI API key: https://platform.openai.com/api-keys
   - Anthropic API key: https://console.anthropic.com/

## 🔧 Installation Steps

### 1. Clone and Setup
```bash
# Navigate to your project
cd /Users/chrisschofield/total-audio-promo

# Copy environment template
cp coderabbit.env.template .env.coderabbit

# Edit the environment file with your actual values
nano .env.coderabbit
```

### 2. Configure Environment Variables
Edit `.env.coderabbit` with your actual values:

```bash
# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# AI API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Database (using SQLite for simplicity)
DATABASE_URL=sqlite:///./coderabbit.db
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_random_secret_key
```

### 3. Start CodeRabbit
```bash
# Start the services
docker-compose -f docker-compose.coderabbit.yml --env-file .env.coderabbit up -d

# Check if it's running
docker ps
```

### 4. Configure Webhook
- Go to your GitHub App settings
- Update the webhook URL to: `https://your-domain.com/webhook`
- Or use ngrok for local development:
  ```bash
  ngrok http 3001
  ```

## 🧪 Testing

1. **Create a test PR**:
   ```bash
   git checkout -b test-coderabbit
   echo "# Test PR for CodeRabbit" > test.md
   git add test.md
   git commit -m "Test PR for CodeRabbit"
   git push origin test-coderabbit
   ```

2. **Create a Pull Request** on GitHub

3. **Check CodeRabbit** should automatically comment on your PR

## 🔍 Troubleshooting

### Check Logs
```bash
docker-compose -f docker-compose.coderabbit.yml logs -f coderabbit
```

### Common Issues
1. **Webhook not receiving events**: Check webhook URL and secret
2. **Permission denied**: Ensure GitHub App has correct permissions
3. **API rate limits**: Check your OpenAI/Anthropic API usage

### Reset Everything
```bash
docker-compose -f docker-compose.coderabbit.yml down -v
docker-compose -f docker-compose.coderabbit.yml up -d
```

## 📚 Additional Resources

- [CodeRabbit Documentation](https://docs.coderabbit.ai/)
- [GitHub App Development Guide](https://docs.github.com/en/apps/creating-github-apps)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🎯 Next Steps

1. Configure CodeRabbit rules in your repository
2. Set up custom review templates
3. Integrate with your CI/CD pipeline
4. Monitor review quality and performance 