#!/bin/bash

# Documentation Cleanup and Organization Script
# Automatically organizes documentation into proper directories

set -e

echo "🧹 Starting documentation cleanup..."

# Define directories
DOCS_DIR="docs"
ARCHIVE_DIR="docs/archive"
DEPLOYMENT_DIR="docs/deployment"
DEVELOPMENT_DIR="docs/development"

# Create directories if they don't exist
mkdir -p "$ARCHIVE_DIR" "$DEPLOYMENT_DIR" "$DEVELOPMENT_DIR"

# Archive old/outdated documentation
echo "📦 Archiving outdated documentation..."

OLD_DOCS=(
    "MVP_AUDIT_REPORT.md"
    "MVP_SHIPPING_CHECKLIST.md"
    "V1_DEPLOYMENT_SUMMARY.md"
    "QUICKSTART.md"
    "QUICK_START.md"
    "TEMPLATE_USAGE.md"
    "VOICE_PROFILE_FIX_REQUIRED.md"
    "VOICE_PROFILE_UPGRADE_PLAN.md"
    "DESIGN_SYSTEM.md"
    "DEMO_GUIDE.md"
)

for doc in "${OLD_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  → Archiving $doc"
        mv "$doc" "$ARCHIVE_DIR/"
    fi
done

# Move deployment documentation
echo "🚀 Organizing deployment documentation..."

DEPLOYMENT_DOCS=(
    "DEPLOYMENT_GUIDE.md"
    "VERCEL_DEPLOYMENT_CHECKLIST.md"
    "STRIPE_SETUP.md"
)

for doc in "${DEPLOYMENT_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  → Moving $doc to deployment/"
        mv "$doc" "$DEPLOYMENT_DIR/"
    fi
done

# Move development documentation
echo "🛠️  Organizing development documentation..."

DEVELOPMENT_DOCS=(
    "CROSS_BROWSER_TESTING.md"
    "TESTING_CHECKLIST.md"
    "NEWSLETTER_INTEGRATION.md"
)

for doc in "${DEVELOPMENT_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  → Moving $doc to development/"
        mv "$doc" "$DEVELOPMENT_DIR/"
    fi
done

# Keep in root (active, current documentation)
echo "📄 Keeping current documentation in root:"
echo "  ✓ README.md"
echo "  ✓ PRIORITY_AUDIT_REPORT.md"

# Create comprehensive README in docs folder
cat > "$DOCS_DIR/README.md" << 'EOF'
# Pitch Generator Documentation

## Current Documentation (Root Level)

- **README.md** - Project overview and getting started
- **PRIORITY_AUDIT_REPORT.md** - Latest audit findings and completed work

## Active Documentation

### Deployment
- [Deployment Guide](deployment/DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [Vercel Checklist](deployment/VERCEL_DEPLOYMENT_CHECKLIST.md) - Vercel-specific setup
- [Stripe Setup](deployment/STRIPE_SETUP.md) - Payment integration guide

### Development
- [Cross-Browser Testing](development/CROSS_BROWSER_TESTING.md) - Browser compatibility testing
- [Testing Checklist](development/TESTING_CHECKLIST.md) - QA procedures
- [Newsletter Integration](development/NEWSLETTER_INTEGRATION.md) - Newsletter system docs

### Archived
Historical documentation preserved in `archive/` directory.

---

**Last Updated:** October 2025
**Maintained By:** Total Audio Promo team
EOF

echo ""
echo "✅ Documentation cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  - Archived: ${#OLD_DOCS[@]} outdated files"
echo "  - Deployment docs: ${#DEPLOYMENT_DOCS[@]} files"
echo "  - Development docs: ${#DEVELOPMENT_DOCS[@]} files"
echo "  - Root docs: 2 files (README.md, PRIORITY_AUDIT_REPORT.md)"
echo ""
echo "📁 New structure:"
echo "  pitch-generator/"
echo "  ├── README.md"
echo "  ├── PRIORITY_AUDIT_REPORT.md"
echo "  └── docs/"
echo "      ├── README.md"
echo "      ├── archive/      (old docs)"
echo "      ├── deployment/   (deploy guides)"
echo "      └── development/  (dev guides)"
echo ""
