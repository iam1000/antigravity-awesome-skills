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

   # Search endpoint -> should return 400 JSON with error message
   curl.exe -i "http://localhost:8888/.netlify/functions/sc-search?q=test&kind=tracks"

   # Resolve endpoint -> should return 400 JSON with error message
   curl.exe -i "http://localhost:8888/.netlify/functions/sc-resolve?url=https://soundcloud.com/"
   ```
   **Expected Behavior:** All endpoints return 400 Bad Request JSON specifying that the `SOUNDCLOUD_CLIENT_ID` is missing, except `sc-health` which returns `200 OK` with `{"ok":false,"message":"Missing or placeholder SOUNDCLOUD_CLIENT_ID"}`.

3. **Verify UI Guard**
   - Open `http://localhost:8888`
   - You should see a red banner at the top.
   - The browser network tab should NOT flood with repeated failed searches.