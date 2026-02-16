# Vercel Deployment Guide

This guide covers deploying the Next.js frontend to Vercel.

---

## Prerequisites

- Vercel account (free for hobby, $20/month for Pro)
- GitHub repository access
- Node.js 18+ locally for testing

---

## Initial Setup

### Step 1: Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import `JonSvitna/Dibles-test-` from GitHub
4. Authorize Vercel to access your repository

### Step 2: Configure Project Settings

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `apps/web-next`
- ⚠️ Important: Must point to Next.js app directory (monorepo)

**Build Command**:
```bash
npm run build
```
(Default works, but can customize if needed)

**Output Directory**: `.next`
(Next.js default, leave unchanged)

**Install Command**:
```bash
npm install
```

---

## Environment Variables

### Phase 0-2 (Current)

Set these in Vercel dashboard → Settings → Environment Variables:

```bash
# Demo mode flag (Phase 0-2 only)
NEXT_PUBLIC_DEMO_MODE=true

# API base URL (empty for Phase 0-2, set in Phase 4+)
NEXT_PUBLIC_API_BASE=
```

### Phase 4+ (Backend Connected)

```bash
# Demo mode (set to false for production)
NEXT_PUBLIC_DEMO_MODE=false

# Backend API URL (Railway)
NEXT_PUBLIC_API_BASE=https://your-backend.railway.app

# Analytics (optional, privacy-safe only)
NEXT_PUBLIC_ANALYTICS_ID=
```

### Environment Scopes

- **Production**: Used for main branch deployments
- **Preview**: Used for PR deployments
- **Development**: Used for local `vercel dev`

**Recommendation**: Set `NEXT_PUBLIC_DEMO_MODE=true` for Preview, `false` for Production

---

## Deployment Workflow

### Automatic Deployments

**Production** (main branch):
1. Push to `main` branch on GitHub
2. Vercel automatically deploys
3. URL: `https://your-app.vercel.app`

**Preview** (feature branches):
1. Create pull request
2. Vercel creates preview deployment
3. URL: `https://your-app-git-branch-name.vercel.app`
4. Comment with preview URL appears on PR

### Manual Deployments

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
cd apps/web-next
vercel

# Deploy to production
vercel --prod
```

---

## Build Configuration

### Next.js Config (`next.config.ts`)

**Current** (Phase 0-2):
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
```

**Future** (Phase 4+, with backend):
```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_BASE + '/api/:path*',
      },
    ];
  },
};
```

---

## Performance Optimization

### Image Optimization (Phase 4+)

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    domains: ['your-cdn.com'], // If using external images
    formats: ['image/avif', 'image/webp'],
  },
};
```

### Static Generation

Vercel automatically optimizes Next.js:
- Static pages cached at edge
- API routes serverless (if used)
- Incremental Static Regeneration (ISR) if needed

---

## Custom Domains (Optional)

### Add Custom Domain
1. Vercel dashboard → Project → Settings → Domains
2. Add domain: `assessment.yourschool.org`
3. Configure DNS:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. Vercel issues SSL certificate automatically (Let's Encrypt)

### Domain Configuration Example

**DNS Provider** (e.g., Cloudflare, GoDaddy):
```
Type:  CNAME
Name:  assessment
Value: cname.vercel-dns.com
TTL:   Auto
```

---

## Monitoring & Analytics

### Vercel Analytics (Built-in)

Enable in Vercel dashboard → Analytics:
- **Web Vitals**: Core Web Vitals tracking
- **Audience**: Page views, unique visitors
- **Top Pages**: Most visited pages

**Privacy**: Vercel Analytics is GDPR/CCPA compliant, no cookies

### Custom Analytics (Optional)

For detailed tracking (opt-in only):
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics /> {/* Privacy-safe, no cookies */}
      </body>
    </html>
  );
}
```

---

## Error Handling

### 404 Not Found

Create `app/not-found.tsx`:
```typescript
export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link href="/">Go Home</Link>
    </div>
  );
}
```

### 500 Internal Server Error

Next.js handles automatically, but you can customize:
```typescript
// app/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Common Issues & Fixes

### Issue: "Build failed: Module not found"
**Cause**: Missing dependencies

**Fix**:
```bash
cd apps/web-next
npm install
git add package-lock.json
git commit -m "Update dependencies"
```

### Issue: "Environment variable not defined"
**Cause**: Variable not set in Vercel dashboard

**Fix**:
1. Vercel dashboard → Settings → Environment Variables
2. Add missing variable
3. Redeploy

### Issue: "Root directory not found"
**Cause**: Incorrect root directory in Vercel settings

**Fix**:
1. Vercel dashboard → Settings → General
2. Set Root Directory: `apps/web-next`
3. Redeploy

### Issue: "TypeScript errors during build"
**Cause**: Strict type checking enabled

**Fix** (not recommended, fix types instead):
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⚠️ Not recommended
  },
};
```

---

## Preview Deployments

### PR Workflow
1. Create feature branch: `git checkout -b feature/new-import`
2. Make changes, commit, push
3. Open pull request on GitHub
4. Vercel automatically creates preview deployment
5. Comment appears on PR with preview URL
6. Test preview, merge to main
7. Production deploys automatically

### Preview URLs
- Format: `https://your-app-git-branch-name-org.vercel.app`
- Each commit creates new preview
- Previews deleted after PR is merged/closed

---

## Security Headers

Add in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## Cost Estimation

### Hobby Plan (Free)
- Unlimited projects
- 100GB bandwidth/month
- 100 builds/day
- Automatic SSL
- Good for: Development, testing, small production

### Pro Plan ($20/month)
- All Hobby features
- 1TB bandwidth/month
- Password-protected deployments
- Advanced analytics
- Priority support
- Good for: Production (1+ schools)

### Enterprise (Custom pricing)
- All Pro features
- SAML SSO
- 99.99% SLA
- Dedicated support
- HIPAA/SOC 2 compliance

**Estimated Cost (Phase 0-4)**: $0 (Hobby plan sufficient)  
**Estimated Cost (Phase 5+)**: $20/month (Pro plan recommended)

---

## Rollback Procedure

### Rollback via Dashboard
1. Vercel dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Rollback via CLI
```bash
vercel rollback <deployment-url>
```

### Rollback via Git
```bash
git revert <bad-commit-hash>
git push origin main
# Vercel auto-deploys reverted code
```

---

## Logs & Debugging

### View Logs
1. Vercel dashboard → Project → Logs
2. Filter by: All, Errors, Production, Preview
3. Click on specific deployment for build logs

### Edge Function Logs (Phase 4+)
- Real-time logs for API routes
- Serverless function invocations
- Error stack traces

---

## Best Practices

1. **Environment Variables**: Use Vercel dashboard, never commit secrets
2. **Preview Deployments**: Test every PR before merging
3. **Custom Domains**: Use for production, not previews
4. **Analytics**: Enable for usage insights (privacy-safe)
5. **Rollback Plan**: Know how to rollback quickly
6. **Monitoring**: Set up alerts for build failures
7. **Security Headers**: Enable CSP, X-Frame-Options
8. **Performance**: Monitor Core Web Vitals

---

## Troubleshooting Checklist

- [ ] Root directory set to `apps/web-next`
- [ ] Build command is `npm run build`
- [ ] Environment variables set correctly
- [ ] No TypeScript errors locally
- [ ] No ESLint errors (if strict mode)
- [ ] Dependencies installed (`package-lock.json` committed)
- [ ] Next.js version compatible (14+)
- [ ] Node.js version 18+ in `package.json` engine field

---

**Last Updated**: 2026-02-16  
**Next Review**: After Phase 4 (backend connection)
