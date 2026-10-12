# System Specification (`system.md`)

## Project: Vikas Dhavande Personal Portfolio & Systems Platform
**Target Framework:** Next.js 14+ (App Router)  
**Backend:** Appwrite Cloud (Singapore Region)  
**Document Version:** 2.0.0  

---

## 1. System Requirements & Runtime Environment

| Component | Minimum Version | Recommended Version | Details |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 18.17.0` | `20.x LTS` or `22.x LTS` | Requires ES Modules & modern crypto support |
| **Package Manager** | `npm >= 9.x` / `pnpm >= 8.x` | `npm 10+` | Uses lockfile v3 |
| **Operating System** | Linux, macOS, Windows 10/11 | Linux / macOS / WSL2 | Fully cross-platform build target |
| **Backend Service** | Appwrite Cloud | Singapore Region (`sgp`) | Project ID: `6accb26e001f6cc8b769` |

---

## 2. Dependencies & Architectural Stack

### 2.1 Production Dependencies
- **`next` (`^14.2.x`):** Core framework (App Router, Server Components, Route Handlers, Image Optimization).
- **`react` & `react-dom` (`^18.3.x`):** UI rendering engine.
- **`node-appwrite` / `appwrite`:** Official Appwrite SDK for database and storage operations.
- **`@aws-sdk/client-s3`:** Optional AWS SDK client for direct S3-compatible SigV4 operations against Appwrite Storage.
- **`clsx` & `tailwind-merge`:** Utility functions for dynamic className merging (`cn`).
- **`lucide-react`:** Accessible SVG icon primitives.
- **`next-themes`:** Hydration-safe theme switcher (Light / Dark / System).
- **`react-aria-components`:** W3C-compliant accessible base primitives.

### 2.2 Development Dependencies
- **`typescript` (`^5.x`):** Strict static typing.
- **`tailwindcss` (`^3.4.x`):** Utility-first styling with OKLCH CSS variable mapping.
- **`postcss` & `autoprefixer`:** CSS transformation and vendor prefix pipeline.
- **`tailwindcss-animate`:** Animation utilities for micro-interactions.
- **`eslint` & `eslint-config-next`:** Code quality and accessibility linting.

---

## 3. Appwrite Backend Specification

```text
Host Endpoint:              https://sgp.cloud.appwrite.io/v1
S3 Storage Endpoint:        https://sgp.cloud.appwrite.io/v1/s3
Region:                     sgp (Singapore)
Project ID:                 6accb26e001f6cc8b769
Access Key (S3):            6accb26e001f6cc8b769
Secret Key (S3):            [Appwrite API Key with Storage Scopes]
Storage Scopes Required:    buckets.read, buckets.write, files.read, files.write
MCP Server URL:             https://mcp.appwrite.io
Skills Command:             npx skills add appwrite/skills
```

---

## 4. Environment Variables Configuration

Create a `.env.local` file for local development (never commit to git):

```bash
# Appwrite Public Configuration (Safe for Client)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=6accb26e001f6cc8b769
NEXT_PUBLIC_APPWRITE_S3_ENDPOINT=https://sgp.cloud.appwrite.io/v1/s3
NEXT_PUBLIC_APPWRITE_MEDIA_BUCKET=media

# Appwrite Private Server Configuration (Server-Side Only)
APPWRITE_API_KEY=your_secret_api_key_here
APPWRITE_DATABASE_ID=portfolio_db
APPWRITE_COLLECTION_INQUIRIES=inquiries

# Application Configuration
NEXT_PUBLIC_SITE_URL=https://vikasdhavande.com
NODE_ENV=development
```

---

## 5. Storage Integration Methods (S3-Compatible)

Appwrite Storage can be connected using standard tools:

### AWS CLI Configuration:
```ini
[default]
aws_access_key_id = 6accb26e001f6cc8b769
aws_secret_access_key = <your_appwrite_api_key>
```
Command:
```bash
aws --endpoint-url https://sgp.cloud.appwrite.io/v1/s3 s3 ls
```

### rclone Configuration:
```ini
[appwrite]
type = s3
provider = Other
env_auth = false
access_key_id = 6accb26e001f6cc8b769
secret_access_key = <your_appwrite_api_key>
endpoint = https://sgp.cloud.appwrite.io/v1/s3
region = sgp
```

---

## 6. Build & Compilation Targets

```mermaid
flowchart LR
    Source[TypeScript + TSX + CSS] --> SWC[Next.js SWC Compiler]
    Source --> PostCSS[PostCSS + Tailwind Engine]
    
    SWC --> ServerChunks[Server Component Chunks (.next/server)]
    SWC --> ClientBundles[Client JS Chunks (.next/static/chunks)]
    PostCSS --> CompiledCSS[Optimized CSS Bundle (.next/static/css)]
    
    ServerChunks & ClientBundles & CompiledCSS --> BuildOutputs[Production Artifacts]
```

- **Build Performance Target:** Production compilation `< 45s` on CI/CD runners.
- **Bundle Budget:** First Load JS `< 85 KB` (gzipped).
