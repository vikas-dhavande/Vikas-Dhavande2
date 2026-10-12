# Security Architecture & Policies (`Security.md`)

## Project: Vikas Dhavande Personal Portfolio & Systems Platform
- **Lead / Owner:** Vikas Dhavande
- **Backend:** Appwrite Cloud (Singapore Region)
- **Security Standard:** Production Grade / OWASP Top 10 Aligned
- **Document Version:** 2.0.0

---

## 1. Security Model Overview

The portfolio system operates with defense-in-depth across the Next.js edge runtime and the Appwrite Cloud backend.

```mermaid
graph TD
    User([End User / Bot]) --> EdgeWAF[Edge CDN WAF & DDoS Filters]
    EdgeWAF --> SecurityHeaders[Strict HTTP Security Headers & CSP]
    SecurityHeaders --> AppRouter[Next.js App Router (RSC)]
    
    subgraph Frontend Isolation [Frontend Isolation Boundary]
        AppRouter --> PublicVars[Public Environment Vars (NEXT_PUBLIC_*)]
        AppRouter --> RouteHandler[Next.js API Route Handlers]
    end

    subgraph Appwrite Cloud Security [Appwrite Cloud (Singapore - sgp)]
        RouteHandler -->|Server-to-Server Only| AppwriteAPI[Appwrite API Endpoint]
        RouteHandler -->|SigV4 Signed| S3Storage[Appwrite S3 Storage]
        AppwriteAPI --> ScopedKey[API Key Scopes: buckets.*, files.*]
    end

    PublicVars -.->|No Secrets Leaked| User
```

---

## 2. Appwrite Credentials & Access Control

### 2.1 Scope Minimization Principle
The secret Appwrite API key is granted strictly the minimal scopes necessary for operation:
- `buckets.read`
- `buckets.write`
- `files.read`
- `files.write`

No administrative permissions (e.g., `users.write`, `projects.write`) are granted.

### 2.2 S3 SigV4 Request Authentication
All interactions with `https://sgp.cloud.appwrite.io/v1/s3` from automated pipelines utilize AWS Signature Version 4 (SigV4). This guarantees:
- Request integrity: Headers and payload are hashed.
- Replay prevention: Timestamp verification within 15-minute validity windows.
- Secret protection: The API secret key is never sent over the wire in plain text.

### 2.3 Credential Boundary
- **Client Bundles:** Expose strictly `NEXT_PUBLIC_APPWRITE_PROJECT_ID` (`6accb26e001f6cc8b769`) and public endpoint URLs.
- **Server Runtime:** `APPWRITE_API_KEY` is loaded exclusively within Next.js Route Handlers (`src/app/api/*`) and Server Components during server-side execution. It is never included in the browser bundle.

---

## 3. HTTP Security Headers & Content Security Policy (CSP)

Configured via `next.config.mjs`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://sgp.cloud.appwrite.io;
      font-src 'self' data:;
      connect-src 'self' https://sgp.cloud.appwrite.io https://mcp.appwrite.io;
      frame-ancestors 'none';
      form-action 'self';
      base-uri 'self';
    `.replace(/\s{2,}/g, ' ').trim(),
  },
];
```

---

## 4. Input Validation & Spam Prevention

1. **Schema Validation:** Inquiries submitted to the `/api/contact` endpoint are strictly validated using a schema validator (Zod) verifying email format, string lengths, and character encoding.
2. **Rate Limiting:** IP-based sliding window rate limiting prevents contact form abuse.
3. **Outgoing Link Protection:** All external links (e.g., to LinkedIn, GitHub) enforce `target="_blank"` and `rel="noopener noreferrer"` to prevent reverse tabnabbing.

---

## 5. Security Incident Management

- **Security Point of Contact:** `vikasdhavande.dev@gmail.com`
- **Triage Commitment:** Initial review within 24 hours of notification.
- **Remediation SLA:** Vulnerability patches deployed within 48 to 72 hours.
