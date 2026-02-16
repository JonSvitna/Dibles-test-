# Railway Deployment Guide

This guide covers deploying the backend to Railway (Phase 4+).

---

## Prerequisites

- Railway account (free for hobby, $5/month for Starter)
- GitHub repository access
- PostgreSQL database (Railway provides)

---

## Monorepo Configuration

Railway needs special configuration for monorepos.

### 1. Create `railway.json` (Root of Repository)

**File**: `/railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "cd apps/web-next && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd apps/web-next && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Why RAILPACK**:
- Default builder (Nixpacks) fails with monorepos
- RAILPACK handles monorepos correctly
- More reliable for Node.js projects

---

## Backend Setup (Phase 4+)

### Directory Structure
```
/apps/backend
  /src
    server.ts
    routes/
    db/
  package.json
  tsconfig.json
  .env.example
```

### Environment Variables (Railway)

Set these in Railway dashboard:

```bash
# Database (Railway provides automatically)
DATABASE_URL=postgresql://user:password@host:port/db

# Node environment
NODE_ENV=production

# Port (Railway provides automatically)
PORT=3000

# API secrets
API_KEY_SECRET=your-secret-key-here

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app.vercel.app
```

---

## Deployment Steps

### Step 1: Connect GitHub Repository
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your repository
5. Select `JonSvitna/Dibles-test-` repository

### Step 2: Configure Project
1. Railway detects `railway.json` automatically
2. Set Root Directory: Leave as `/` (monorepo root)
3. Railway will use `railway.json` for build/start commands

### Step 3: Add PostgreSQL Database
1. In Railway dashboard, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway automatically sets `DATABASE_URL` environment variable
4. Copy connection string for local development

### Step 4: Deploy
1. Railway automatically deploys on push to `main` branch
2. Watch build logs in Railway dashboard
3. If build fails, check logs for errors

### Step 5: Verify Deployment
1. Railway provides a URL: `https://your-app.railway.app`
2. Test health endpoint: `curl https://your-app.railway.app/api/health`
3. Expected response: `{"status":"ok"}`

---

## Common Errors & Fixes

### Error: "Builder not found"
**Problem**: Railway using wrong builder

**Fix**: Ensure `railway.json` exists at repository root with `"builder": "RAILPACK"`

### Error: "Module not found"
**Problem**: Dependencies not installed

**Fix**: 
```json
"buildCommand": "cd apps/web-next && npm install && npm run build"
```

### Error: "Port already in use"
**Problem**: Wrong PORT variable

**Fix**: Use `process.env.PORT` in server code:
```typescript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Error: "Database connection failed"
**Problem**: DATABASE_URL not set or incorrect

**Fix**:
1. Check Railway dashboard → Variables → DATABASE_URL
2. Ensure PostgreSQL database is added to project
3. Use connection pooling (Prisma handles this)

### Error: "Build timeout"
**Problem**: Build taking >10 minutes

**Fix**:
1. Optimize build: remove unused dependencies
2. Use build cache (Railway does this automatically)
3. Upgrade Railway plan (more resources)

---

## Build Commands Reference

### For Frontend (Next.js) on Railway
```json
{
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "cd apps/web-next && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd apps/web-next && npm start"
  }
}
```

### For Backend (Node.js/Express) on Railway
```json
{
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "cd apps/backend && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd apps/backend && npm start"
  }
}
```

---

## Database Migrations (Prisma)

### Initial Migration
```bash
cd apps/backend
npx prisma migrate deploy
```

### Automatic Migrations on Deploy
Add to `buildCommand`:
```json
"buildCommand": "cd apps/backend && npm install && npx prisma migrate deploy && npm run build"
```

---

## Monitoring & Logs

### View Logs
1. Railway dashboard → Your project → Logs
2. Filter by: All, Build, Deploy, Runtime
3. Download logs for debugging

### Set Up Alerts
1. Railway dashboard → Settings → Notifications
2. Add Slack or email notifications for:
   - Deployment failures
   - High memory usage
   - Errors in logs

---

## Scaling (Phase 5+)

### Vertical Scaling
1. Railway dashboard → Settings → Resources
2. Increase memory (default: 512MB)
3. Increase CPU (default: shared)

### Horizontal Scaling
- Railway supports horizontal scaling on Pro plan
- Load balancer included
- Configure replicas in dashboard

### Database Scaling
1. Railway dashboard → PostgreSQL → Settings
2. Upgrade to larger plan (more storage, connections)
3. Consider connection pooling (PgBouncer)

---

## Backup & Disaster Recovery

### Database Backups
1. Railway provides automatic daily backups (Pro plan)
2. Manual backups:
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```
3. Store backups in S3 or similar

### Restore from Backup
```bash
psql $DATABASE_URL < backup.sql
```

### Rollback Deployment
1. Railway dashboard → Deployments
2. Select previous deployment
3. Click "Redeploy"

---

## Cost Estimation

### Hobby Plan (Free)
- 500 hours/month execution time
- 512MB memory
- 1GB storage
- Shared CPU
- Good for: Development, testing

### Starter Plan ($5/month per service)
- Unlimited execution time
- 512MB memory (upgradable)
- 1GB storage (upgradable)
- Shared CPU (upgradable)
- Good for: Small production (1-3 schools)

### Pro Plan ($20/month per service)
- Unlimited execution time
- 8GB memory
- 100GB storage
- Dedicated CPU
- Horizontal scaling
- Priority support
- Good for: Production (district-level)

**Estimated Monthly Cost (Phase 4)**:
- Backend service: $5
- PostgreSQL: $5
- Total: ~$10-15/month

**Estimated Monthly Cost (Phase 5)**:
- Backend service (Pro): $20
- PostgreSQL (Pro): $20
- Total: ~$40-50/month

---

## Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **API Keys**: Rotate regularly, use strong random strings
3. **Database**: Use connection pooling, limit connections
4. **CORS**: Whitelist only frontend URL
5. **Rate Limiting**: Implement in Express middleware
6. **Logging**: Don't log sensitive data (student names, IDs)

---

## Troubleshooting Checklist

- [ ] `railway.json` exists at repository root
- [ ] Builder is set to `RAILPACK`
- [ ] Build command includes `npm install`
- [ ] Start command uses correct directory
- [ ] `PORT` environment variable used in code
- [ ] `DATABASE_URL` set by Railway (PostgreSQL added)
- [ ] CORS allows frontend URL
- [ ] Health endpoint responds
- [ ] Logs show no errors

---

**Last Updated**: 2026-02-16  
**Next Review**: After Phase 4 backend deployment
