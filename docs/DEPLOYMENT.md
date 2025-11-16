# 🚀 Deployment Guide

Complete guide for deploying the NEP System to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Lovable Cloud Deployment](#lovable-cloud-deployment)
3. [Manual Deployment](#manual-deployment)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Environment Variables](#environment-variables)
6. [Database Migrations](#database-migrations)
7. [Rollback Procedures](#rollback-procedures)

---

## ✅ Prerequisites

### Before Deploying
- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No console errors in development
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Environment variables configured

### Required Accounts
- Lovable account (for Lovable Cloud)
- Supabase project
- Domain registrar (for custom domain)

---

## ☁️ Lovable Cloud Deployment (Recommended)

### First Deployment

1. **Open Lovable Editor**
   - Navigate to your project
   - Ensure all changes are saved

2. **Click "Publish" Button**
   - Desktop: Top right corner
   - Mobile: Bottom right (in Preview mode)

3. **Review Changes**
   - Check list of files being deployed
   - Verify no sensitive data in code

4. **Deploy**
   - Click "Update" to deploy frontend
   - Backend deploys automatically

### Subsequent Deployments

```bash
# Frontend changes require clicking "Update"
# Backend changes (migrations, edge functions) deploy automatically
```

### Deployment Types

#### Frontend Deployment
- **Trigger:** Click "Update" in publish dialog
- **Includes:** React app, assets, static files
- **Time:** ~2-3 minutes
- **CDN:** Cloudflare global CDN

#### Backend Deployment
- **Trigger:** Automatic on save
- **Includes:** Edge functions, migrations
- **Time:** Instant for migrations, ~30s for functions
- **Runtime:** Supabase Edge Runtime

---

## 🔧 Manual Deployment

### Option 1: Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

4. **Configure Environment Variables**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Build**
```bash
npm run build
```

4. **Deploy**
```bash
# Draft deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### Option 3: Custom Server

1. **Build Application**
```bash
npm run build
```

2. **Configure Web Server**

**Nginx Example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/nep-system/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

3. **Upload Files**
```bash
scp -r dist/* user@server:/var/www/nep-system/
```

4. **Restart Server**
```bash
sudo systemctl restart nginx
```

---

## 🌐 Custom Domain Setup

### Lovable Cloud

1. **Navigate to Settings**
   ```
   Project → Settings → Domains
   ```

2. **Add Custom Domain**
   - Enter your domain (e.g., `app.yourdomain.com`)
   - Click "Add Domain"

3. **Configure DNS**
   - Add CNAME record pointing to Lovable:
   ```
   Type: CNAME
   Name: app (or www)
   Value: <your-lovable-subdomain>.lovable.app
   TTL: 3600
   ```

4. **Verify Domain**
   - Wait for DNS propagation (5-60 minutes)
   - Click "Verify" in Lovable settings
   - SSL certificate auto-generated

### External Hosting

#### Cloudflare Setup
1. **Add Site to Cloudflare**
2. **Update DNS Records**
   ```
   Type: A
   Name: @
   Value: <your-server-ip>
   Proxy: Enabled (orange cloud)
   ```

3. **Configure SSL**
   - SSL/TLS → Overview
   - Select "Full (strict)"

4. **Page Rules** (optional)
   ```
   https://yourdomain.com/*
   - Always Use HTTPS
   - Cache Level: Standard
   - Browser Cache TTL: 4 hours
   ```

---

## 🔐 Environment Variables

### Required Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJ...

# Optional: Analytics
VITE_POSTHOG_KEY=phc_...
VITE_SENTRY_DSN=https://...@sentry.io/...
```

### Setting Variables

#### Lovable Cloud
- Variables already configured in Lovable
- Managed in project secrets
- Auto-injected during build

#### Vercel
```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
```

#### Netlify
```bash
netlify env:set VITE_SUPABASE_URL "https://..."
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "eyJ..."
```

#### Custom Server (.env file)
```bash
# Create .env.production
echo "VITE_SUPABASE_URL=https://..." > .env.production
echo "VITE_SUPABASE_PUBLISHABLE_KEY=eyJ..." >> .env.production
```

---

## 🗄️ Database Migrations

### Pre-Deployment Checklist
- [ ] Migration tested locally
- [ ] Rollback plan documented
- [ ] Backup created
- [ ] RLS policies reviewed
- [ ] Performance tested

### Applying Migrations

#### Automatic (Lovable Cloud)
```
Migrations deploy automatically when files change in supabase/migrations/
```

#### Manual (Supabase CLI)
```bash
# Test migration locally
npx supabase db reset

# Apply to production
npx supabase db push --linked
```

### Migration Best Practices

```sql
-- ✅ Good: Safe, reversible migration
-- Add column with default
ALTER TABLE scripts ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'Moderate';

-- Create index concurrently
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scripts_category ON scripts(category);

-- ❌ Bad: Breaking change
-- Drop column without backup
ALTER TABLE scripts DROP COLUMN important_field;
```

### Zero-Downtime Migrations

1. **Add new field** (optional)
2. **Migrate data** (background job)
3. **Update application** (read from new field)
4. **Remove old field** (after verification)

```sql
-- Step 1: Add new column
ALTER TABLE scripts ADD COLUMN new_field TEXT;

-- Step 2: Copy data (can be slow, run in background)
UPDATE scripts SET new_field = old_field WHERE new_field IS NULL;

-- Step 3: Add constraint (after verification)
ALTER TABLE scripts ALTER COLUMN new_field SET NOT NULL;

-- Step 4: Remove old column (after deployment)
-- ALTER TABLE scripts DROP COLUMN old_field;
```

---

## 🔄 Rollback Procedures

### Frontend Rollback

#### Lovable Cloud
1. Open project in Lovable
2. Click "Publish"
3. Click "History"
4. Select previous version
5. Click "Restore & Deploy"

#### Vercel
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

#### Netlify
```bash
# List deployments
netlify deploy:list

# Restore previous deploy
netlify deploy:restore <deploy-id>
```

### Database Rollback

```sql
-- Create rollback migration
-- supabase/migrations/YYYYMMDDHHMMSS_rollback_feature.sql

-- Example: Undo column addition
ALTER TABLE scripts DROP COLUMN IF EXISTS new_column;

-- Example: Restore dropped column (from backup)
ALTER TABLE scripts ADD COLUMN old_column TEXT;
UPDATE scripts SET old_column = backup.old_column
FROM backup_table backup
WHERE scripts.id = backup.id;
```

### Emergency Rollback Checklist
1. [ ] Identify issue
2. [ ] Assess user impact
3. [ ] Create rollback plan
4. [ ] Communicate to team
5. [ ] Execute rollback
6. [ ] Verify functionality
7. [ ] Post-mortem analysis

---

## 📊 Post-Deployment Verification

### Health Checks

```bash
# Check API status
curl https://yourdomain.com/api/health

# Check database connection
npx supabase db ping --linked

# Check edge functions
curl https://your-project.supabase.co/functions/v1/function-name
```

### Monitoring

1. **Check Logs**
   - Lovable: Check Edge Function logs
   - Supabase: Database logs
   - Sentry: Error tracking

2. **Test Critical Flows**
   - [ ] User registration
   - [ ] Login/logout
   - [ ] Script search
   - [ ] Community posts
   - [ ] Admin panel

3. **Performance**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Monitor API response times

---

## 🆘 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### Environment Variables Not Working
```bash
# Verify variables are set
printenv | grep VITE

# Ensure prefix is VITE_
# ✅ VITE_SUPABASE_URL
# ❌ SUPABASE_URL (won't work in Vite)
```

#### 404 on Refresh
Configure server for SPA routing:
```
All routes should serve index.html
```

#### RLS Blocking Queries
```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';

-- Test query as user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'user-id';
SELECT * FROM table_name;
```

---

## 📞 Support

### Emergency Contacts
- **Technical Lead:** tech@nep-system.com
- **DevOps:** devops@nep-system.com
- **Supabase Support:** [Support Portal](https://supabase.com/dashboard/support)

### Resources
- [Lovable Docs](https://docs.lovable.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Project Status Page](#)

---

**Last Updated:** 2024-11-16
