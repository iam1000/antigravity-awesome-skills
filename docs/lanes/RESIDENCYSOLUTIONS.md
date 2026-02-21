# ResidencySolutions Lane
_Last updated: 2026-02-18 09:15 EST_

## Overview
ResidencySolutions has TWO subcomponents:

### G1: Backend / Product Entitlements Core (NO UI)
- **Status:** UI frozen. Focus on centralizing entitlements logic.
- **Hard rule:** No UI changes. Run `scripts/guard-no-ui.ps1` if present.
- **Path:** TBD (check if local repo exists)

### G2: RESIDENCY+ SoundCloud Digger Prototype
- **Live site:** [residencysolutions.netlify.app](https://residencysolutions.netlify.app)
- **Source (original):** `G:\DOWNLOADS5\reidchunes`
- **Source (repo copy):** `prototypes/residency-plus/` in this repo
- **Stack:** Static HTML + Netlify Functions (ES module format)
- **What it does:** SoundCloud crate-digging tool with genre filters, shuffle, stations, auto-dig, saved crate, and history. Uses SoundCloud v2 API via serverless proxy.

---

## How to Run Locally

### Prerequisites
```powershell
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Verify
netlify --version
```

### Local Dev
```powershell
cd "c:\Users\sean\antigravity-awesome-skills\prototypes\residency-plus"

# Option A: Set env var inline + run offline
$env:SOUNDCLOUD_CLIENT_ID="YOUR_CLIENT_ID"
netlify dev --offline --dir "." --functions "netlify/functions" --port 8888

# Option B: Use .env file (gitignored)
# Create prototypes/residency-plus/.env with:
#   SOUNDCLOUD_CLIENT_ID=<your-client-id>
netlify dev --offline --dir "." --functions "netlify/functions" --port 8888
```

- **PowerShell note:** `curl` is an alias for `Invoke-WebRequest`; use `curl.exe -i` to see correct headers and non-2xx response bodies.
- **Expected when missing/placeholder:** Functions return 400 JSON with a missing env var message; UI shows a banner; no request spam.

App will be available at `http://localhost:8888`.

### Deploying to Netlify
```bash
# From prototype directory
netlify deploy --prod
```

Set `SOUNDCLOUD_CLIENT_ID` in: Netlify Dashboard → Site Settings → Environment Variables.

---

## Endpoints (Netlify Functions)

| Function | Path | Params | Purpose |
|----------|------|--------|---------|
| `sc-search` | `/.netlify/functions/sc-search` | `q` (required), `kind` (tracks\|playlists), `limit`, `offset` | Search SoundCloud |
| `sc-resolve` | `/.netlify/functions/sc-resolve` | `url` (required, full SC URL) | Resolve SC URL to API object |
| `sc-related` | `/.netlify/functions/sc-related` | `url` (required), `limit`, `offset` | Get related tracks (v2→v1 fallback) |

All functions return 400 JSON with a helpful message if `SOUNDCLOUD_CLIENT_ID` is missing or set to placeholder "YOUR_CLIENT_ID".

---

## Security Notes
- **Never hardcode `SOUNDCLOUD_CLIENT_ID` in frontend code.** It stays server-side in Netlify env vars.
- Functions proxy all SoundCloud API calls so the client ID never reaches the browser.
- `.env` file must be gitignored.

---

## File Inventory (`prototypes/residency-plus/`)

```
prototypes/residency-plus/
├── index.html              # Full RESIDENCY+ app (1951 lines)
├── netlify.toml            # Build config (publish=".", functions="netlify/functions")
└── netlify/
    └── functions/
        ├── sc-search.js    # Search proxy
        ├── sc-resolve.js   # URL resolve proxy
        └── sc-related.js   # Related tracks proxy (v2→v1 fallback)
```
## Local Runbook (RESIDENCY+ prototype)

### Prereqs
- Node.js installed
- Netlify CLI installed (recommended)

Install Netlify CLI:
```bash
npm i -g netlify-cli
