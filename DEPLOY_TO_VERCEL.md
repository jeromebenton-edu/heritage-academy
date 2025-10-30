# 🚀 Deploy Heritage Academy to Vercel

Complete guide for deploying Heritage Academy to Vercel in under 10 minutes.

## Prerequisites

- GitHub account
- Vercel account (free tier works perfectly)
- Git installed locally

## 🎯 Quick Deploy (5 Minutes)

### Step 1: Push to GitHub

```bash
cd /home/jerome/projects/teach/4906/capstone2/heritage_academy

# Initialize git
git init
git add .
git commit -m "Initial commit: Heritage Academy educational platform"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/heritage-academy.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. Vercel will auto-detect Next.js ✅

### Step 3: Configure Environment Variables

In Vercel dashboard, add these environment variables:

**Required:**
```env
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-app.vercel.app
```

**Optional (add later):**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 4: Add Vercel Postgres Database

1. In your Vercel project, go to **Storage** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose **Free Tier** (250MB, 10k rows, 60 hours compute)
5. Click **"Create"**

Vercel automatically adds these variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Step 5: Initialize Database

Run this SQL in Vercel Postgres dashboard:

```sql
-- Copy contents from lib/db/schema.sql
-- Or use Vercel's SQL editor
```

Or via command line:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration
vercel env pull .env.local
npm run db:setup
```

### Step 6: Deploy!

Click **"Deploy"** in Vercel

Your app will be live at: `https://your-app.vercel.app`

---

## 📊 Add Optional Features

### Vercel Blob Storage (For Images)

1. Go to **Storage** → **Create Database** → **Blob**
2. Choose **Free Tier** (100GB bandwidth/month)
3. Add environment variable automatically provided:
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
```

### Vercel KV (Redis Cache)

1. Go to **Storage** → **Create Database** → **KV**
2. Choose **Free Tier** (256MB, 10k commands/day)
3. Variables added automatically:
```env
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=xxx
```

---

## 🔧 Local Development with Vercel

### Setup

```bash
# Install dependencies
npm install

# Pull environment variables from Vercel
vercel env pull .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Database Management

```bash
# Connect to Vercel Postgres locally
vercel postgres connect

# Run SQL queries
SELECT * FROM users;

# Exit
\q
```

---

## 🎨 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as shown
4. Vercel automatically handles SSL/HTTPS

---

## 📈 Monitoring & Analytics

### Built-in Vercel Analytics

1. Go to **Analytics** tab
2. View pageviews, unique visitors, top pages
3. Free on all plans

### Enable Speed Insights

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## 🔒 Environment Variables Reference

### Production Variables

```env
# Authentication
NEXTAUTH_SECRET=<generate-random-string>
NEXTAUTH_URL=https://your-app.vercel.app

# Database (Auto-added by Vercel)
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...

# Blob Storage (Optional)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx

# KV Cache (Optional)
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=xxx

# OAuth (Optional)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GITHUB_ID=xxx
GITHUB_SECRET=xxx

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🚀 Deployment Workflow

### Automatic Deployments

Every push to `main` triggers a production deployment:

```bash
git add .
git commit -m "Add new feature"
git push origin main
```

### Preview Deployments

Every PR gets a unique preview URL:

```bash
git checkout -b feature/new-lesson
# Make changes
git push origin feature/new-lesson
# Create PR on GitHub
# Vercel creates preview: https://heritage-academy-git-feature-xxx.vercel.app
```

### Rollback

In Vercel dashboard:
1. Go to **Deployments**
2. Find previous working deployment
3. Click **"Promote to Production"**

---

## 📊 Database Seeding

### Seed Initial Data

Create `scripts/seed.ts`:

```typescript
import { sql } from '@vercel/postgres'

async function seed() {
  // Insert default achievements
  await sql`
    INSERT INTO achievements (code, name, description, points, category)
    VALUES
      ('first_lesson', 'First Steps', 'Complete first lesson', 50, 'milestone'),
      ('ten_lessons', 'Dedicated', 'Complete 10 lessons', 200, 'milestone')
    ON CONFLICT (code) DO NOTHING
  `

  console.log('✅ Database seeded')
}

seed().catch(console.error)
```

Run:
```bash
npx tsx scripts/seed.ts
```

---

## 🐛 Troubleshooting

### Build Fails

**Error: Environment variables not found**
- Solution: Add all required env vars in Vercel dashboard

**Error: Database connection failed**
- Solution: Ensure Postgres database is created and linked

### Runtime Errors

**Error: 404 on API routes**
- Check route file structure in `app/api/`
- Ensure proper export format

**Error: Database query timeout**
- Check connection pooling settings
- Use `POSTGRES_PRISMA_URL` for Prisma

### Performance Issues

**Slow page loads**
- Enable Edge Runtime where possible
- Use `generateStaticParams` for static routes
- Enable ISR (Incremental Static Regeneration)

```typescript
// app/lessons/[slug]/page.tsx
export const revalidate = 3600 // Revalidate every hour
```

---

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database schema initialized
- [ ] Sample data seeded
- [ ] Error tracking configured (Sentry)
- [ ] Analytics enabled
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS working
- [ ] Test all user flows
- [ ] Check mobile responsiveness
- [ ] Verify email notifications (if enabled)
- [ ] Review security headers
- [ ] Test authentication flows
- [ ] Verify database backups

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Postgres Guide](https://vercel.com/docs/storage/vercel-postgres)
- [NextAuth.js with Vercel](https://next-auth.js.org/deployment)

---

## 💰 Vercel Pricing (As of 2024)

### Free Tier (Hobby)
- Unlimited deployments
- 100GB bandwidth
- Serverless function executions
- **Postgres**: 256MB storage, 60 hours compute/month
- **Blob**: 100GB bandwidth/month
- **KV**: 256MB, 10k commands/day
- Perfect for educational projects!

### Pro Tier ($20/month)
- Everything in Free
- **Postgres**: 512MB storage, 100 hours compute
- Commercial use allowed
- Team collaboration

---

## 🎉 You're Live!

Your Heritage Academy is now deployed!

**Next Steps:**
1. Test all features
2. Share with students
3. Monitor analytics
4. Iterate and improve

**Your app:** `https://your-app.vercel.app`

**Need help?**
- [Vercel Support](https://vercel.com/support)
- [Community Discord](https://vercel.com/discord)

---

**Happy Teaching! 📚🏛️**
