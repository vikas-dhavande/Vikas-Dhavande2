# AI Agent Operating Manual (`agent.md`)

## Project Context
- **Name:** Vikas Dhavande Personal Portfolio & Systems Platform
- **Owner:** Vikas Dhavande
- **Professional Positioning:** Senior Full Stack & AI Systems Engineer
- **Profiles:** [LinkedIn: vikas-dhavande](https://www.linkedin.com/in/vikas-dhavande/) | [GitHub: @vikas-dhavande](https://github.com/vikas-dhavande)
- **Primary Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui (Preset `b0`, Base `aria`), Appwrite Cloud (Singapore Region).

---

## 1. Agent Persona & Working Philosophy

When an AI Agent operates on this repository, it acts as a senior principal frontend and systems engineer:
1. **Surgical Precision:** Modify only files relevant to the active task. Avoid unnecessary refactoring or style churning.
2. **Design System Adherence:** Always utilize standard tokens and components from shadcn/ui and Tailwind CSS. Use the configured OKLCH CSS variables for colors, borders, and backgrounds.
3. **Accessibility First:** Utilize Aria-base primitives. Ensure correct semantic HTML, ARIA attributes (`aria-label`, `aria-expanded`, `aria-current`), and keyboard accessibility.
4. **Dual Theme Strictness:** Every UI component must render seamlessly in both Light and Dark modes using semantic utility classes (`bg-background`, `text-foreground`, `border-border`, `bg-muted`, `text-muted-foreground`).
5. **Backend Governance:** All backend operations must respect Appwrite Cloud security scopes, SigV4 signing, and environment variable isolation.

---

## 2. Appwrite Backend Integration & Credentials

### 2.1 Project Configuration
- **Project ID:** `6accb26e001f6cc8b769`
- **Region:** `sgp` (Singapore)
- **API Endpoint:** `https://sgp.cloud.appwrite.io/v1`
- **S3-Compatible Storage Endpoint:** `https://sgp.cloud.appwrite.io/v1/s3`

### 2.2 S3-Compatible Access
Connect Appwrite Storage to rclone, AWS CLI, and custom pipelines with a project-scoped HTTPS endpoint and SigV4 signing.
- **Access Key:** `6accb26e001f6cc8b769` (Project ID)
- **Secret Key:** Appwrite API Key scoped with:
  - `buckets.read`
  - `buckets.write`
  - `files.read`
  - `files.write`

### 2.3 MCP Server Configuration
The repository supports Model Context Protocol (MCP) integration with Appwrite:
```json
{
  "mcpServers": {
    "appwrite": {
      "url": "https://mcp.appwrite.io"
    }
  }
}
```

### 2.4 Official Appwrite Skills CLI
To install and update official agent skills:
```bash
npx skills add appwrite/skills
```

---

## 3. Directory Layout & Key Locations

```text
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with ThemeProvider, fonts, metadata
│   │   ├── page.tsx           # Main portfolio view (Hero, Projects, Experience, Skills, Contact)
│   │   ├── globals.css        # Tailwind directives, OKLCH root & dark theme tokens
│   │   ├── api/               # Serverless Route Handlers (contact submission, health check)
│   │   ├── opengraph-image.tsx# Dynamic OpenGraph image generator
│   │   ├── sitemap.ts         # Automated sitemap generator
│   │   └── robots.ts          # Search engine crawl rules
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitive components (button, card, dialog, badge, etc.)
│   │   ├── sections/          # Portfolio sections (Hero, Projects, Experience, Skills, Contact)
│   │   ├── theme-toggle.tsx   # Dual-mode theme switcher component
│   │   └── navbar.tsx         # Responsive navigation header
│   ├── data/
│   │   └── portfolio.ts       # Structured fallback data for Vikas Dhavande
│   ├── lib/
│   │   ├── appwrite.ts        # Appwrite Client & Server SDK initializer
│   │   ├── s3.ts              # Appwrite S3 SigV4 storage client
│   │   └── utils.ts           # Class merging helper (cn)
├── public/                    # Static fallback assets (avatars, icons)
├── PRD.md                     # Product Requirements Document
├── agent.md                   # This AI Agent Operating Manual
├── Architecture.md            # System Architecture & Component Diagram
├── system.md                  # System & Dependency Specifications
├── design.md                  # Design System, Tokens & Aesthetics
├── Security.md                # Security Posture & Protection Policies
├── Testing.md                 # QA, Linting & Testing Framework
└── Deployment.md              # Production Build & Deployment Pipelines
```

---

## 4. Theme & Styling Standards

The project uses the **b0** OKLCH color token specification:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}
```

---

## 5. Agent Guardrails & Guidelines

1. **No Sensitive Key Exposure:** Never log or render Appwrite API secret keys in client-side bundles. Only `NEXT_PUBLIC_APPWRITE_PROJECT_ID` and `NEXT_PUBLIC_APPWRITE_ENDPOINT` may be exposed client-side.
2. **Graceful Fallbacks:** If the Appwrite service or network is unavailable, the application must gracefully render fallback static content from `src/data/portfolio.ts` without throwing unhandled exceptions.
3. **Strict Typing:** All Appwrite collection documents must have corresponding TypeScript interfaces.
4. **Accessibility First:** Always verify keyboard focus rings and screen reader attributes on interactive elements.
