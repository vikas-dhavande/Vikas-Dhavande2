# Appwrite Backend & Storage Integration Rule

## 1. Appwrite Cloud Configuration
- **Regional Host Format:** `https://<region>.cloud.appwrite.io/v1` (Default for this project: `https://sgp.cloud.appwrite.io/v1` - Singapore).
- **S3-Compatible Storage Endpoint:** `https://<region>.cloud.appwrite.io/v1/s3` (e.g., `https://sgp.cloud.appwrite.io/v1/s3`).
- **Project ID (S3 Access Key):** `6accb26e001f6cc8b769`.
- **Secret Key (S3 Secret):** Appwrite API key scoped strictly to:
  - `buckets.read`
  - `buckets.write`
  - `files.read`
  - `files.write`

## 2. Tooling & MCP Integration
- **MCP Server Registration:**
  ```json
  {
    "mcpServers": {
      "appwrite": {
        "url": "https://mcp.appwrite.io"
      }
    }
  }
  ```
- **Appwrite Skills CLI:** Run `npx skills add appwrite/skills` to fetch official Appwrite tool skills.

## 3. Security Invariants
- Never expose `APPWRITE_API_KEY` in client-side bundles. Only `NEXT_PUBLIC_APPWRITE_PROJECT_ID` and `NEXT_PUBLIC_APPWRITE_ENDPOINT` may be public.
- When configuring OAuth, whitelist `/auth/callback` in the Appwrite Console.
- Enforce Document-Level Security for user-submitted content (`comments`, `reactions`).
