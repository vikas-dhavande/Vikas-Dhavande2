# Deployment & Operations Guide (`Deployment.md`)

## Project: Vikas Dhavande Personal Portfolio & Systems Platform
- **Lead / Owner:** Vikas Dhavande
- **Positioning:** Senior Full Stack & AI Systems Engineer
- **Target Hosting:** Vercel Global Edge Network / Cloudflare
- **Backend Infrastructure:** Appwrite Cloud (Singapore Region)
- **Document Version:** 1.0.0

---

## 1. Deployment Architecture Overview

The portfolio is deployed using continuous deployment (GitOps) where every push to `main` triggers an automated build, validation pipeline, and zero-downtime edge distribution.

```mermaid
graph LR
    Dev[Developer / Git Push] --> Repo[GitHub Repository: vikas-dhavande]
    Repo --> Actions[GitHub Actions CI Quality Gates]
    
    Actions -->|Pass| Vercel[Vercel Edge Platform]
    Actions -->|Fail| Alert[Notification & PR Block]
    
    subgraph Edge Deployment [Global Edge Deployment]
        Vercel --> Build[Next.js Production Build]
        Build --> EdgeCache[Global CDN Edge Cache]
    end

    subgraph Appwrite Cloud Backend [Appwrite Cloud (Singapore)]
        AppwriteEndpoint[API Endpoint: https://sgp.cloud.appwrite.io/v1]
        AppwriteS3[S3 Storage: https://sgp.cloud.appwrite.io/v1/s3]
    end

    EdgeCache <--> AppwriteEndpoint
    EdgeCache <--> AppwriteS3
```

---

## 2. Environment Variables Provisioning

Before deploying to production, configure the following environment variables in the hosting provider dashboard:

| Variable Name | Environment | Example / Value | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Production | `https://sgp.cloud.appwrite.io/v1` | Public Appwrite API URL |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID`| Production | `6accb26e001f6cc8b769` | Appwrite Project ID |
| `NEXT_PUBLIC_APPWRITE_S3_ENDPOINT`| Production | `https://sgp.cloud.appwrite.io/v1/s3` | S3-compatible storage endpoint |
| `NEXT_PUBLIC_APPWRITE_MEDIA_BUCKET`| Production | `media` | Bucket name for project screenshots |
| `APPWRITE_API_KEY` | Production (Secret) | `[API Key with storage scopes]` | Secret key for server-side actions |
| `NEXT_PUBLIC_SITE_URL` | Production | `https://vikasdhavande.com` | Production canonical URL |

---

## 3. Vercel Deployment Workflow

### 3.1 Initial Setup via Vercel CLI
```bash
# 1. Install or run Vercel CLI
npx vercel login

# 2. Link repository to Vercel project
npx vercel link

# 3. Pull environment variables locally if needed
npx vercel env pull .env.local

# 4. Deploy preview build
npx vercel

# 5. Deploy to production
npx vercel --prod
```

### 3.2 Git-Integrated Automatic Deployments
1. Connect `https://github.com/vikas-dhavande/Vikas-Dhavande` in the Vercel Dashboard.
2. Set Framework Preset: **Next.js**.
3. Build Command: `next build` (or `npm run build`).
4. Output Directory: `.next`.
5. Install Command: `npm install`.

---

## 4. Appwrite Cloud Infrastructure Setup

### 4.1 Storage Bucket Creation
1. Log in to [Appwrite Cloud Console](https://cloud.appwrite.io/).
2. Select Project `6accb26e001f6cc8b769` (Singapore region).
3. Under **Storage**, create bucket:
   - Bucket ID: `media`
   - Permissions: Read access for `Any` (public images), write access restricted to API Key.
4. Upload resume PDF and project images.

### 4.2 S3-Compatible Pipeline Access
To sync files via AWS CLI or rclone:
```bash
# Set AWS environment variables
export AWS_ACCESS_KEY_ID="6accb26e001f6cc8b769"
export AWS_SECRET_ACCESS_KEY="<your_appwrite_api_key>"
export AWS_DEFAULT_REGION="sgp"

# Upload project media
aws --endpoint-url https://sgp.cloud.appwrite.io/v1/s3 s3 cp ./public/images/ s3://media/ --recursive
```

---

## 5. Automated CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: CI & Deployment Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    name: Lint, Type Check & Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Type Check
        run: npx tsc --noEmit

      - name: Linting Check
        run: npm run lint

      - name: Production Build Test
        run: npm run build
        env:
          NEXT_PUBLIC_APPWRITE_ENDPOINT: ${{ secrets.NEXT_PUBLIC_APPWRITE_ENDPOINT }}
          NEXT_PUBLIC_APPWRITE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_APPWRITE_PROJECT_ID }}
          NEXT_PUBLIC_APPWRITE_S3_ENDPOINT: ${{ secrets.NEXT_PUBLIC_APPWRITE_S3_ENDPOINT }}
```

---

## 6. Custom Domain & DNS Configuration

| Type | Name / Host | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (apex) | `76.76.21.21` (Vercel IP) | Auto / 3600 |
| **CNAME**| `www` | `cname.vercel-dns.com.` | Auto / 3600 |

Once DNS propagates, Vercel automatically issues an SSL certificate via Let's Encrypt with auto-renewal.

---

## 7. Post-Deployment Verification (Smoke Tests)

Immediately following a production release:
1. **HTTP Status:** Verify `https://vikasdhavande.com` returns `200 OK` with `< 1s` TTFB.
2. **Theme Toggle:** Ensure theme switcher persists between page refreshes.
3. **Appwrite Storage Check:** Verify image assets and resume links load without CORS or 403 errors.
4. **Console Audit:** Confirm zero uncaught exceptions in browser dev tools.
