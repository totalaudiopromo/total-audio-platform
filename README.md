# Total Audio Promo - Project Organization

This repository contains a comprehensive music promotion and audio intelligence platform with multiple applications and services.

## 📁 Project Structure

### 🚀 Projects
All applications and services are organized in the `projects/` directory:

#### Web Applications (`projects/web-apps/`)
- **audio-intel-live/** - Audio intelligence and analysis platform
- **frontend/** - Main web application frontend
- **playlist-pulse-live/** - Playlist management and analytics platform

#### Mobile Applications (`projects/mobile-apps/`)
- **mobile-app/** - React Native mobile application

#### Backend Services (`projects/backend-services/`)
- **backend/** - Main backend API and services

#### AI Agents (`projects/ai-agents/`)
- **agents/** - AI agent implementations
- **ai-agents/** - AI agent configurations and strategies
- **ai-agents-private/** - Private AI agent configurations

#### Tools (`projects/tools/`)
- **sadact_workflow_tools/** - Audio workflow automation tools
- **scripts/** - Utility scripts
- **shared/** - Shared components and utilities
- **src/** - Source code utilities

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
2. Install dependencies for each project:
   ```bash
   # Web applications
   cd projects/web-apps/audio-intel-live && npm install
   cd ../frontend && npm install
   cd ../playlist-pulse-live && npm install
   
   # Backend services
   cd ../../backend-services/backend && npm install
   
   # Mobile app
   cd ../../mobile-apps/mobile-app && npm install
   ```

3. Set up environment variables:
   ```bash
   cp config/coderabbit.env.template config/.env
   # Edit .env with your configuration
   ```

4. Start development servers:
   ```bash
   # Start backend
   cd projects/backend-services/backend && npm run dev
   
   # Start web applications
   cd ../../web-apps/audio-intel-live && npm run dev
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