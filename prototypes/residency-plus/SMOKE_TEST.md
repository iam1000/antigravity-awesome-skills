# Smoke Test (RESIDENCY+)

To verify that the server is running correctly and correctly handles missing client IDs without spamming requests:

1. **Start the dev server**
   ```powershell
   cd prototypes/residency-plus
   $env:SOUNDCLOUD_CLIENT_ID="YOUR_CLIENT_ID"
   netlify dev --offline --dir "." --functions "netlify/functions" --port 8888
   ```

2. **Verify endpoints with curl.exe**
   *(Note: Use `curl.exe -i` to see 400 response bodies in PowerShell, because `curl` alone is an alias to Invoke-WebRequest)*

   ```powershell
   # Health check -> should return 200 with ok: false
   curl.exe -i "http://localhost:8888/.netlify/functions/sc-health"
   ```
   **Expected Behavior:** `sc-health` returns `200 OK` with `{"ok":false,"message":"Missing or placeholder SOUNDCLOUD_CLIENT_ID"}`.

3. **Verify UI Guard**
   - Open `http://localhost:8888`
   - You should see a red banner at the top.
   - The browser network tab should NOT flood with repeated failed searches.

---

## Official OAuth Wrapper Smoke Tests (new — 2026-03-10)

These tests require **real credentials** in `.env` (`SOUNDCLOUD_CLIENT_ID`, `SOUNDCLOUD_CLIENT_SECRET`, `ALLOWED_ORIGINS`).

### Start the dev server (with real creds)
```powershell
cd 'C:\Users\sean\antigravity-awesome-skills\prototypes\residency-plus'
# .env must have real credentials
netlify dev --dir "." --functions "netlify/functions" --port 8888
```

### Endpoint Tests (run in a second terminal)
```powershell
# 1. Valid search — expect 200 JSON { collection: [...] }
curl.exe -i "http://localhost:8888/.netlify/functions/sc-official-search?q=ambient&limit=3"

# 2. Missing q — expect 400 JSON { error: "Missing required param: q" }
curl.exe -i "http://localhost:8888/.netlify/functions/sc-official-search"

# 3. Disallowed origin — expect 403 JSON { error: "Origin not permitted." }
curl.exe -i -H "Origin: http://evil.example.com" "http://localhost:8888/.netlify/functions/sc-official-search?q=ambient"

# 4. Valid resolve — expect 200 JSON shaped resource object
curl.exe -i "http://localhost:8888/.netlify/functions/sc-official-resolve?url=https://soundcloud.com/forss/flickermood"

# 5. Missing url — expect 400 JSON { error: "Missing required param: url" }
curl.exe -i "http://localhost:8888/.netlify/functions/sc-official-resolve"

# 6. Invalid url prefix — expect 400 JSON { error: "param 'url' must begin with..." }
curl.exe -i "http://localhost:8888/.netlify/functions/sc-official-resolve?url=http://example.com"
```

### Rate Limit Test (optional — 31 rapid requests)
```powershell
1..31 | ForEach-Object { curl.exe -s -o NUL -w "%{http_code} " "http://localhost:8888/.netlify/functions/sc-official-search?q=test$_" }
# Last request(s) should return 429
```

> **Security check:** confirm no `access_token`, `Authorization`, `client_id`, or `client_secret` appears in any response body or server log output.

---

## Telemetry Debugging (2026-03-10)

The wrapper functions use a lightweight, structured telemetry logger (`sc-auth-lib.js` -> `logTelemetry()`). 

**Where to see telemetry:**
1. **Local (Stdout):** in the terminal running `netlify dev` (as `Request from ::1: GET /.netlify/functions...` followed by `{"_telemetry":true,...}`).
2. **Netlify (Stdout):** inside the Netlify UI under **Site → Logs → Functions** for ephemeral debugging.
3. **Axiom (External Ingestion):** If `AXIOM_API_TOKEN`, `AXIOM_DATASET`, and `AXIOM_DOMAIN` are provided in `.env` (or Netlify vars), structured analytics will instantly forward to the Axiom dashboard (e.g. `https://app.axiom.co/datasets`).

> **Note:** Axiom forwarding is non-blocking and optional. If variables are missing, rendering naturally skips forwarding without failing the client request. 

**What to check for:**
- **Successes:** search for `"event":"sc_search_success"` or `"event":"sc_resolve_success"` showing `status_code: 200` and `duration_ms`.
- **Blocked Origins:** search for `"event":"origin_forbidden"` showing `status_code: 403` and the rejected origin.
- **Rate Limit Hits:** search for `"event":"rate_limit_block"` (internal limit, 429) or `"event":"upstream_429"` (SoundCloud limits).
- **Security:** Ensure raw user queries DO NOT appear in the JSON (you should only see `query_length`). Raw URLs in resolve requests should only be logged if they were structurally valid/safe (`https://soundcloud.com/...`), though currently the code does not log the raw URL at all for privacy.