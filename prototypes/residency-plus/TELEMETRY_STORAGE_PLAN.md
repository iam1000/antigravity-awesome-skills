# G2 Telemetry Storage Plan
_ResidencySolutions (Prototype: residency-plus)_

## Objective
The official SoundCloud wrapper (`sc-official-search.js`, `sc-official-resolve.js`) currently generates structured JSON analytics events as defined in `TELEMETRY_SPEC.md`. Right now, these are merely printed to `stdout` and swallowed by ephemeral Netlify Function logs.

This document evaluates practical options for persisting and analyzing that sanitized telemetry data, concluding with a recommended next step that respects the `LOW-RESOURCE MODE` and strict privacy requirements of the project.

---

## Storage & Forwarding Options Evaluated

### 1. Netlify Runtime Logs (Current Baseline)
- **Mechanism:** `console.log(JSON.stringify(event))`
- **Setup Complexity:** None (already exists).
- **Security Risk:** Zero. Kept entirely within the Netlify infrastructure perimeter.
- **Cost/Ops Burden:** Free on existing tiers, but terrible for retention. Netlify function logs roll over quickly and are not easily queryable over time.
- **Usefulness for Production Debugging:** Low. Good for live tailing, useless for historical latency tracking or usage metrics.

### 2. External Aggregation Sink (e.g., Datadog, Axiom, Better Stack)
- **Mechanism:** HTTP POST the structured JSON payload asynchronously to an external ingest URL.
- **Setup Complexity:** Low/Medium. Requires setting up an external account and registering an ingest token in Netlify environment variables.
- **Security Risk:** Medium. Data leaves the perimeter. Strict adherence to `TELEMETRY_SPEC.md` (no PII, no secrets) is mandatory.
- **Cost/Ops Burden:** Low/Medium. Many providers offer generous free tiers (e.g., Axiom is 0.5TB/mo free). Maintenance is minimal once configured.
- **Usefulness for Production Debugging:** High. Out-of-the-box dashboards, alerting, and fast querying across time series.

### 3. Lightweight Database (e.g., Supabase / PostgreSQL / SQLite cloud)
- **Mechanism:** Insert event rows via a database client or standard HTTP API (like Supabase PostgREST).
- **Setup Complexity:** Medium/High. Requires managing a schema, handling connection pooling in serverless environments, and migrating tracking tables.
- **Security Risk:** Medium. Introduces database credentials into the serverless environment.
- **Cost/Ops Burden:** High. Schema maintenance, index bloat, and connection management overhead in stateless functions.
- **Usefulness for Production Debugging:** Medium. Data is stored, but building dashboards/charts requires custom SQL or external visualization tools (like Metabase).

### 4. Custom Internal Collector (G1 API)
- **Mechanism:** Forward telemetry from G2 Netlify functions to a custom endpoint hosted alongside the G1 core.
- **Setup Complexity:** Very High. Requires exposing the G1 local network to the internet securely or building a dedicated receiver service.
- **Security Risk:** High. Opens a potential attack vector into the core operator network.
- **Cost/Ops Burden:** High. Building and maintaining a custom ingestion pipeline.
- **Usefulness for Production Debugging:** High, but reinvents the wheel.

---

## Implementation: External Aggregation Sink (**Axiom**)

For ResidencySolutions G2, integrating a lightweight external log drain via Axiom's HTTP ingestion endpoint is implemented and active.

**Why this fits now:**
1. **Low Resource / No Vendor Lock-in:** We do not use heavy proprietary SDKs. We use the native Node `fetch()` API asynchronously in the Netlify function to fire-and-forget the JSON payload directly to Axiom's `v1/datasets/:id/ingest` endpoint.
2. **Adheres to Specs:** The data shaping logic already exists in `sc-auth-lib.js`. We simply pipe the sanitized JSON out alongside `console.log`. Privacy is structurally guaranteed by the `TELEMETRY_SPEC.md` contract.
3. **High Utility, Low Ops:** We get world-class querying and graphing without maintaining a database schema or connection pool in Serverless land.
4. **Clean Fallback:** If the `fetch` fails or times out, we catch the error silently so the user's SoundCloud search is never interrupted by telemetry failures.

---

## Hard Rules for Implementation
The ingestion pipeline in `sc-auth-lib.js` enforces:
- **No Heavy SDKs**: Uses standard `fetch()` wrapped in a `try/catch`. 
- **Sanitization First**: The payload generated strictly aligns with the shape dictated by `TELEMETRY_SPEC.md`. 
- **No Blocking**: Telemetry never adds critical-path latency or blocks a 200 OK response to the client.
- **Token Management**: The API ingest keys (`AXIOM_API_TOKEN`) must be stored strictly within Netlify environment variables and never logged or exposed.
