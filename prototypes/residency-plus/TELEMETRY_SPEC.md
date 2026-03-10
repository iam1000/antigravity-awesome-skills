# RESIDENCY+ Telemetry Specification (G2)
_Last updated: 2026-03-10_

## Purpose
Define a lightweight, secure telemetry and analytics specification for the official SoundCloud wrapper endpoints (`sc-official-search` and `sc-official-resolve`).

## 1. Tracked Events

| Event Name | Trigger |
|:---|:---|
| `sc_search_request` | Incoming request to `sc-official-search` |
| `sc_search_success` | Successful 200 return from `sc-official-search` |
| `sc_search_error` | Error handled in `sc-official-search` (e.g. 400, 502) |
| `sc_resolve_request` | Incoming request to `sc-official-resolve` |
| `sc_resolve_success` | Successful 200 return from `sc-official-resolve` |
| `sc_resolve_error` | Error handled in `sc-official-resolve` (e.g. 400, 502) |
| `rate_limit_block` | Request blocked by our internal origin rate limiter (429) |
| `origin_forbidden` | Request blocked by origin allowlist (403) |
| `upstream_429` | Upstream SoundCloud API responds with 429 rate limit |

## 2. Required Payload Fields

All telemetry events must output a structured JSON object containing:

- `event` (string) — The event name (from above).
- `timestamp` (string) — ISO-8601 UTC timestamp.
- `endpoint` (string) — e.g. `sc-official-search` or `sc-official-resolve`.
- `status_code` (number) — The HTTP status returned to the client (200, 400, 403, 429, 502).
- `origin` (string\|null) — Origin of the incoming request.
- `duration_ms` (number) — Wall-clock execution time of the function (optional for error early aborts).
- `query_length` (number\|null) — The character length of the search query (for searches). Raw user query strings are **NOT logged**.
- `upstream_status` (number\|null) — The HTTP status returned by SoundCloud API (if the call progressed that far).

## 3. Privacy & Security Rules (HARD RULES)

In order to comply with user privacy and minimize security risk, the following logging rules are strictly enforced:

1. **No Secrets:** Never log `SOUNDCLOUD_CLIENT_ID`, `SOUNDCLOUD_CLIENT_SECRET`, or the fetched `access_token`.
2. **No Auth Headers:** Never log the `Authorization` header contents sent to upstream.
3. **No Raw PII / Queries:** Do not log raw search queries entered by the user. Log the `query_length` instead to indicate activity.
4. **No Raw URLs:** Do not log raw user-entered URLs for resolution unless they are statically matched `https://soundcloud.com` safe references. For safety, just log the requested domain or length if needed.
5. **IP Addresses:** Keep IP logging minimal and privacy-conscious; the Netlify environment handles core network logging. We track `origin` for analytics.

## 4. Scaffold Usage

The implementation relies on a minimal server-side structured logger in `sc-auth-lib.js`. It outputs `[TELEMETRY] {...JSON...}` to stdout (which streams to Netlify Function Logs). External SDKs are deferred until specifically adopted in the roadmap.
