# Total Audio Promo - Project Organization

This repository contains a comprehensive music promotion and audio intelligence platform with multiple applications and services.

## 📁 Project Structure

### 🚀 Applications 
All applications are organized in the `apps/` directory:

#### Web Applications (`apps/`)
- **audio-intel/** - Audio intelligence platform (intel.totalaudiopromo.com)
- **web/** - Main landing page (totalaudiopromo.com) 
- **playlist-pulse/** - Playlist management platform (pulse.totalaudiopromo.com)
- **command-centre/** - Internal business dashboard (command.totalaudiopromo.com)

#### Backend Services (`apps/`)
- **api/** - Main backend API and database services

#### Mobile Applications (`apps/`)
- **mobile/** - React Native mobile application

#### Additional Tools (`apps/`)
- **seo-tool/** - SEO optimization tools
- **voice-echo/** - Voice-based content generation

### 🌐 **Deployment Status**

#### Production Domains
- ✅ **intel.totalaudiopromo.com** - Audio Intel (deployed)
- 🚧 **totalaudiopromo.com** - Main landing page (needs custom domain setup)
- 🚧 **pulse.totalaudiopromo.com** - Playlist Pulse (needs deployment)
- 🚧 **command.totalaudiopromo.com** - Command Centre (needs custom domain setup)

#### Vercel Projects
- **audio-intel** - intel.totalaudiopromo.com
- **web** - Main landing page with mobile optimizations
- **command-centre** - Internal dashboard with mobile optimizations

### 📚 Documentation (`docs/`)
- **setup/** - Setup and installation guides
- **architecture/** - System architecture documentation
- **deployment/** - Deployment guides

### ⚙️ Configuration (`config/`)
- Docker compose files
- Environment templates
- TypeScript configurations
- Build configurations

### 🧪 Testing (`tests/`)
- Test files and configurations
- Test results and reports

### 🏗️ Infrastructure (`infrastructure/`)
- **deployment/** - Deployment configurations and scripts

### 📊 Data (`data/`)
- CSV files and data exports
- Sample data and test datasets

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker
- Git

### Development Setup
1. Clone the repository
2. Install all dependencies using the monorepo setup:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start development servers:
   ```bash
   # Start all apps
   npm run dev
   
   # Or start individual apps:
   npm run dev:audio-intel      # Audio Intel platform
   npm run dev:web             # Main landing page
   npm run dev:playlist-pulse  # Playlist Pulse platform
   npm run dev:command-centre  # Command Centre dashboard
   npm run dev:backend         # API backend
   ```

## 🚀 Deployment

### Vercel Deployment Commands
```bash
# Deploy individual apps to production
cd apps/audio-intel && vercel --prod
cd apps/web && vercel --prod  
cd apps/playlist-pulse && vercel --prod
cd apps/command-centre && vercel --prod
```

### Domain Configuration
Each app requires custom domain setup in Vercel dashboard:
- **audio-intel** → intel.totalaudiopromo.com (✅ configured)
- **web** → totalaudiopromo.com (🚧 needs setup)
- **playlist-pulse** → pulse.totalaudiopromo.com (🚧 needs setup)
- **command-centre** → command.totalaudiopromo.com (🚧 needs setup)

### Mobile Optimizations
All apps include comprehensive mobile optimizations:
- Touch-friendly UI (44px minimum touch targets)
- Responsive grid layouts
- Mobile-first CSS with proper media queries
- Optimized typography hierarchy for small screens
- Prevention of horizontal scrolling

### Build and Test Commands
```bash
# Build all apps
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🔧 Development Workflow

### Adding New Features
1. Create feature branch from main
2. Make changes in appropriate project directory
3. Test thoroughly
4. Submit pull request

### Project-Specific Development
- **audio-intel-live**: Audio analysis and intelligence features
- **frontend**: Main web application UI/UX
- **playlist-pulse-live**: Playlist management features
- **backend**: API development and database management
- **mobile-app**: Mobile application development

## 📝 Documentation

- **Setup Guides**: `docs/setup/`
- **Architecture**: `docs/architecture/`
- **Deployment**: `docs/deployment/`

## 🧪 Testing

All test files are located in `tests/` directory:
- Unit tests
- Integration tests
- E2E tests
- Test results and reports

## 🚀 Deployment

Deployment configurations are in `infrastructure/deployment/`:
- Docker configurations
- CI/CD pipelines
- Environment setups

## 📊 Monitoring & Logs

Logs are stored in `logs/` directory:
- Application logs
- Error logs
- Performance metrics

## 🤝 Contributing

1. Follow the project structure
2. Add tests for new features
3. Update documentation
4. Follow coding standards

## 📄 License

[Add your license information here]

---

**Note**: This structure is designed for easy navigation and development. Each project maintains its own dependencies and configurations while sharing common utilities and documentation. 