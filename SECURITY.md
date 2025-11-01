# Security Guide - Quick Reference

## ✅ Security Commands

Run these from the **root directory** of the project:

```bash
# Full security check (audit + scan)
npm run security:check

# Check for vulnerable dependencies
npm run security:audit

# Scan for exposed secrets
npm run security:scan
```

## 🛡️ What's Protected

### Git-Secrets (Pre-commit Hooks)

- Automatically scans commits for API keys before they're committed
- Blocks: AWS keys, Google API keys (AIza...), Stripe keys (sk-/pk-)
- Configured in: `.git/hooks/pre-commit`

### NPM Audit

- Checks for vulnerable dependencies in package.json
- Moderate+ severity issues are flagged
- Use `npm audit fix` for safe fixes
- Use `npm audit fix --force` for breaking changes (review first!)

## 🚨 Current Vulnerabilities

Your project has some dependency vulnerabilities (normal for active projects):

- **Next.js**: Critical vulnerabilities - update to latest version
- **axios**: High severity - consider updating
- **xlsx**: No fix available yet - monitor for updates

### To Fix Dependencies:

```bash
# Safe fixes only
npm audit fix

# Review and fix all (may cause breaking changes)
npm audit fix --force
```

## 🔐 Best Practices

1. **Before Committing**: Run `npm run security:scan`
2. **Weekly**: Run `npm run security:check`
3. **Never Commit**:
   - `.env` files (except `.env.example`)
   - API keys, tokens, passwords
   - `*credentials.json` files
   - Private keys (`.pem`, `.p12`, `.pfx`)

4. **Always Use**: Environment variables for secrets
   - Local: `.env.local` (gitignored)
   - Production: Vercel Dashboard → Environment Variables

## 📋 If Security Check Fails

1. **Git-Secrets Error**: You tried to commit a secret
   - Remove the secret from your files
   - Add to `.env.local` instead
   - Use environment variable in code

2. **NPM Audit Error**: Vulnerable dependencies found
   - Review the vulnerabilities
   - Update dependencies when safe
   - Monitor for patches if no fix available

## 🎯 Remember

- Security is ongoing, not one-time
- Run checks before important commits
- Keep dependencies updated
- Never commit real API keys

---

**Last Updated**: January 2025  
**Security Status**: Protected ✅
